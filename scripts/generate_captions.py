"""
강의 영상 자막(WebVTT) 생성 — 고정밀 타이밍 판.
실행: py scripts/generate_captions.py  [lesson 번호들…  예: py scripts/generate_captions.py 10 11]

원리
  1. videos/python/lesson-N/02-audio/timestamps.json 의 씬 경계(startMs/endMs)는
     영상 조립에 쓴 값 그대로라 정확하다 (_synth.py 가 최종 mp3 에 rescale).
  2. 씬 내레이션을 원본과 같은 파라미터(edge-tts, Hyunsu, +10%)로 재합성하면서
     WordBoundary 이벤트를 수집 → 문장 첫 단어의 예상 시각을 얻고, 씬 구간에 비례 사상.
     (재합성 결과는 씬별 caption-timings.json 에 캐시 — 내레이션이 같으면 재합성 생략)
  3. 정밀 보정: 02-audio/_scenes/<sceneId>.mp3 (원본 씬 클립) 이 있으면 ffmpeg
     silencedetect 로 원본 음성의 쉼 구간을 찾아, 각 문장 시작을 가장 가까운
     "무음이 끝나는 지점"에 스냅한다 — 긴 씬에서 TTS 엔진의 쉼 길이가 그때와
     달라진 드리프트(관측 ~10%)를 원본 오디오 기준으로 제거. 재합성 길이가 원본과
     2% 넘게 다르면 경고도 출력.
  4. 텍스트 변환 2층:
     · 강별 caption-rewrites.json — 코드 낭독 구절 → 실제 코드 표기 (큐레이션, 순서 적용)
     · 전역 RULES — 발음형 표기 → 표준 표기 (videos/_assets/pronunciation.json 역방향)
     타이밍은 항상 "발화 원문" 기준으로 계산한 뒤 표시 텍스트만 바꾼다.

출력: public/captions/python-lesson-N.vtt
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
VOICE = "ko-KR-HyunsuMultilingualNeural"
RATE = "+10%"
TAIL_SILENCE_MS = 350  # _synth.py 가 씬 뒤에 붙인 무음
LESSONS = [int(a) for a in sys.argv[1:]] or list(range(1, 13))

FFPROBE = (
    ROOT
    / "node_modules"
    / ".pnpm"
    / "@remotion+compositor-win32-x64-msvc@4.0.456"
    / "node_modules"
    / "@remotion"
    / "compositor-win32-x64-msvc"
    / "ffprobe.exe"
)

# ── 전역 표기 복원 규칙 ────────────────────────────────────────
# 앞이 한글/영문/숫자면 치환하지 않는다 ("포인트"의 "인트" 방지).
# strict=True 는 뒤가 공백/문장부호일 때만 (조사 결합이 없는 단독 낭독 토큰).
RULES: list[tuple[str, str] | tuple[str, str, bool]] = [
    ("파이썬 쓰리 더블 대시 버전", "python3 --version"),
    ("파이썬 더블 대시 버전", "python --version"),
    ("애드 파이썬 투 패스", "'Add Python to PATH'"),
    ("파이썬 닷 오알지", "python.org"),
    ("헬로, 파이썬", "Hello, Python"),
    ("헬로 월드", "Hello World"),
    ("비에스 코드", "VS Code"),
    ("에프 스트링", "f-string"),
    ("인덱스 에러", "IndexError"),
    ("네임 에러", "NameError"),
    ("타입 에러", "TypeError"),
    ("키 에러", "KeyError"),
    ("무낍니다", "묶입니다"),
    ("트레이스백", "Traceback"),
    ("에이아이", "AI"),
    ("맥오에스", "macOS"),
    ("엘리프", "elif"),
    ("임포트", "import"),
    ("프린트", "print"),
    ("레인지", "range"),
    ("브레이크", "break"),
    ("컨티뉴", "continue"),
    ("랜드인트", "randint"),
    ("데이트타임", "datetime"),
    ("어펜드", "append"),
    ("초이스", "choice"),
    ("리절트", "result"),
    ("스코어즈", "scores"),
    ("인풋", "input"),
    ("리턴", "return"),
    ("데프", "def"),
    ("이프", "if"),
    ("엘스", "else"),
    ("와일", "while"),
    ("인트", "int"),
    ("폴스", "False"),
    ("트루", "True"),
    ("플롯", "float"),
    ("랜덤", "random"),
    ("프롬", "from"),
    ("포", "for", True),
    ("델", "del", True),
    ("에프", "f", True),
]


def apply_global_rules(text: str) -> str:
    out = text
    for rule in RULES:
        ko, std = rule[0], rule[1]
        strict = len(rule) > 2 and rule[2]
        tail = r"(?=[\s,.!?)]|$)" if strict else ""
        out = re.sub(rf"(?<![가-힣A-Za-z0-9]){re.escape(ko)}{tail}", std, out)
    return out


# ── 문장 분리 (짧은 문장은 이웃과 병합 — 자막 깜빡임 방지) ─────
def split_sentences(text: str) -> list[str]:
    parts = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]
    merged: list[str] = []
    for s in parts:
        if merged and (len(merged[-1]) < 10 or len(s) < 10):
            merged[-1] = f"{merged[-1]} {s}"
        else:
            merged.append(s)
    return merged


def word_chars(s: str) -> str:
    """비교용 — 한글/영문/숫자만 남긴다 (WordBoundary 텍스트와 원문 대조가 구두점에 흔들리지 않게)."""
    return re.sub(r"[^0-9A-Za-z가-힣]", "", s)


# ── 재합성 + WordBoundary 수집 ────────────────────────────────
async def synth_with_boundaries(text: str) -> tuple[bytes, list[dict]]:
    audio = bytearray()
    words: list[dict] = []
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE, boundary="WordBoundary")
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio.extend(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            words.append({"offsetMs": chunk["offset"] / 10_000, "text": chunk["text"]})
    return bytes(audio), words


def probe_ms(path: Path) -> float:
    out = subprocess.run(
        [str(FFPROBE), "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        check=True, capture_output=True, text=True,
    ).stdout.strip()
    return float(out) * 1000


FFMPEG = FFPROBE.with_name("ffmpeg.exe")


def detect_silences(path: Path) -> list[tuple[float, float]]:
    """원본 씬 클립의 무음 구간 [(startMs, endMs)...] — 문장 사이 쉼 탐지."""
    proc = subprocess.run(
        [str(FFMPEG), "-i", str(path), "-af", "silencedetect=noise=-35dB:d=0.12",
         "-f", "null", "-"],
        capture_output=True, text=True,
    )
    log = proc.stderr
    starts = [float(m) * 1000 for m in re.findall(r"silence_start:\s*([\d.]+)", log)]
    ends = [float(m) * 1000 for m in re.findall(r"silence_end:\s*([\d.]+)", log)]
    return list(zip(starts, ends))


def snap_to_silences(
    pred: list[float], silences: list[tuple[float, float]], clip_ms: float
) -> list[float]:
    """재합성 기반 예상 문장 시각(pred, 클립 좌표)을 원본 무음이 끝나는 지점에 스냅.

    문장 시작은 실제 음성에서 쉼 직후에 오므로, 각 예상 시각에서 1초 이내의
    가장 가까운 silence_end 를 채택한다 (하나의 쉼은 한 문장에만 배정).
    첫 문장과 후보가 없는 문장은 예상 시각을 그대로 쓴다.
    """
    # 클립 끝의 tail 무음(350ms 부근)은 후보에서 제외
    candidates = [e for _, e in silences if 150 < e < clip_ms - 450]
    used: set[float] = set()
    out = [max(0.0, pred[0])] if pred else []
    for p in pred[1:]:
        best = None
        for c in candidates:
            if c in used:
                continue
            if abs(c - p) < 1000 and (best is None or abs(c - p) < abs(best - p)):
                best = c
        pick = best if best is not None else p
        if best is not None:
            used.add(best)
        out.append(max(pick, out[-1] + 200))  # 단조 증가 보장
    return out


def audio_duration_ms(audio: bytes) -> float:
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as f:
        f.write(audio)
        tmp = Path(f.name)
    try:
        return probe_ms(tmp)
    finally:
        tmp.unlink(missing_ok=True)


async def scene_timing(scene: dict, cache: dict, sem: asyncio.Semaphore) -> dict:
    """씬 하나의 재합성 타이밍 (캐시 히트 시 재합성 생략)."""
    key = hashlib.sha1(scene["narrationText"].encode()).hexdigest()[:16]
    hit = cache.get(scene["sceneId"])
    if hit and hit.get("hash") == key:
        return hit
    async with sem:
        for attempt in range(3):
            try:
                audio, words = await synth_with_boundaries(scene["narrationText"])
                break
            except Exception as e:  # noqa: BLE001 — 네트워크 일시 오류 재시도
                if attempt == 2:
                    raise
                print(f"    {scene['sceneId']}: 재시도 ({e})")
                await asyncio.sleep(2)
    return {"hash": key, "resynthMs": audio_duration_ms(audio), "words": words}


# ── 문장 시각 계산 ────────────────────────────────────────────
def sentence_starts(narration: str, sentences: list[str], words: list[dict]) -> list[float]:
    """각 문장의 첫 단어 offset(ms). WordBoundary 누적 문자 위치로 대응시킨다."""
    starts_chars = []  # 문장별 시작 문자 인덱스 (word_chars 기준)
    pos = 0
    for s in sentences:
        starts_chars.append(pos)
        pos += len(word_chars(s))
    offsets: list[float | None] = [None] * len(sentences)
    wpos = 0
    si = 0
    for w in words:
        while si < len(sentences) and wpos >= starts_chars[si]:
            offsets[si] = w["offsetMs"]
            si += 1
        wpos += len(word_chars(w["text"]))
    # 남은 문장(경계 불일치 등)은 직전 값에서 이어붙임 — 실제로는 발생하지 않아야 정상
    prev = 0.0
    out: list[float] = []
    for o in offsets:
        prev = prev if o is None else o
        out.append(prev)
    return out


def vtt_time(ms: float) -> str:
    ms = max(0, round(ms))
    h, rem = divmod(ms, 3_600_000)
    m, rem = divmod(rem, 60_000)
    s, milli = divmod(rem, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}.{milli:03d}"


def load_rewrites(lesson_dir: Path) -> list[tuple[str, str]]:
    p = lesson_dir / "caption-rewrites.json"
    if not p.exists():
        return []
    return [tuple(pair) for pair in json.loads(p.read_text(encoding="utf-8"))]


def render_text(sentence: str, rewrites: list[tuple[str, str]]) -> str:
    out = sentence
    for src, dst in rewrites:
        out = out.replace(src, dst)
    out = apply_global_rules(out)
    # 코드로 끝나는 문장의 낭독용 마침표 제거 — `as f:.` / `randint(1, 6).` 방지
    return re.sub(r'([)\]:"])\.$', r"\1", out)


async def build_lesson(n: int) -> None:
    lesson_dir = ROOT / "videos" / "python" / f"lesson-{n}" / "02-audio"
    ts_path = lesson_dir / "timestamps.json"
    if not ts_path.exists():
        print(f"lesson-{n}: timestamps.json 없음 — 건너뜀")
        return
    scenes = json.loads(ts_path.read_text(encoding="utf-8"))
    cache_path = lesson_dir / "caption-timings.json"
    cache = json.loads(cache_path.read_text(encoding="utf-8")) if cache_path.exists() else {}
    rewrites = load_rewrites(lesson_dir)

    sem = asyncio.Semaphore(4)
    timings = await asyncio.gather(*(scene_timing(s, cache, sem) for s in scenes))
    cache_path.write_text(
        json.dumps({s["sceneId"]: t for s, t in zip(scenes, timings)}, ensure_ascii=False, indent=1),
        encoding="utf-8",
    )

    cues = []
    warn = 0
    snapped = total_inner = 0
    for scene, timing in zip(scenes, timings):
        span = scene["endMs"] - scene["startMs"]
        resynth_total = timing["resynthMs"] + TAIL_SILENCE_MS
        sentences = split_sentences(scene["narrationText"])
        word_starts = sentence_starts(scene["narrationText"], sentences, timing["words"])

        clip = lesson_dir / "_scenes" / f"{scene['sceneId']}.mp3"
        if clip.exists():
            # 원본 클립 기준 정밀 보정 — 재합성 예상 시각을 클립 좌표로 옮긴 뒤
            # 실제 쉼(무음 끝)에 스냅. 최종 좌표는 클립→씬 구간 비례 (loudnorm 보정 ≈1.0).
            clip_ms = probe_ms(clip)
            drift = abs(clip_ms - resynth_total) / clip_ms
            if drift > 0.02:
                warn += 1
                print(f"  드리프트 {scene['sceneId']}: 원본 {clip_ms:.0f}ms vs 재합성 {resynth_total:.0f}ms ({drift:.1%}) — 무음 스냅으로 보정")
            pred_clip = [o * (clip_ms / resynth_total) for o in word_starts]
            starts_clip = snap_to_silences(pred_clip, detect_silences(clip), clip_ms)
            snapped += sum(1 for p, s in zip(pred_clip[1:], starts_clip[1:]) if s != p)
            total_inner += max(0, len(sentences) - 1)
            starts_abs = [scene["startMs"] + s * (span / clip_ms) for s in starts_clip]
        else:
            scale = span / resynth_total
            starts_abs = [scene["startMs"] + o * scale for o in word_starts]

        for i, sentence in enumerate(sentences):
            start = starts_abs[i]
            end = scene["endMs"] if i == len(sentences) - 1 else starts_abs[i + 1]
            cues.append((start, end, render_text(sentence, rewrites)))

    # 자체 정합성 검사 — 시간 역전/음수 길이 금지
    for i, (a, b, _) in enumerate(cues):
        assert b > a, f"cue {i}: 길이 0 이하"
        if i:
            assert a >= cues[i - 1][0], f"cue {i}: 시간 역전"

    out = ROOT / "public" / "captions" / f"python-lesson-{n}.vtt"
    out.parent.mkdir(parents=True, exist_ok=True)
    body = "\n\n".join(f"{vtt_time(a)} --> {vtt_time(b)}\n{t}" for a, b, t in cues)
    out.write_text(f"WEBVTT\n\n{body}\n", encoding="utf-8", newline="\n")
    print(
        f"lesson-{n}: 씬 {len(scenes)}개 → 자막 {len(cues)}개, "
        f"무음 스냅 {snapped}/{total_inner}, 드리프트 {warn}건, 재작성 규칙 {len(rewrites)}개"
    )


async def main() -> None:
    if not FFPROBE.exists():
        sys.exit(f"ffprobe 없음: {FFPROBE}")
    for n in LESSONS:
        await build_lesson(n)


if __name__ == "__main__":
    asyncio.run(main())
