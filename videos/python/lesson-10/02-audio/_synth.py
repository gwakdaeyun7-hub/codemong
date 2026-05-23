"""
Per-scene Edge TTS synthesis + concat + loudnorm for CodeMong Python Lesson 10.

Lesson 10 ("모듈 & 랜덤 — import / random 활용", 11 scenes, target 182s).

Inherits the lesson-7/8 baseline pipeline (inline "(N초 정적)" silence handling +
subClips JSON field for R-004/R-016 Active Recall reveal sync).
This script is logically identical to videos/python/lesson-{7,8,9}/02-audio/_synth.py;
only paths and the docstring lesson reference change. Lesson 10 has ONE scene
with an active-recall silence beat — scene-08 ("(1.8초 정적)" before the answer
reveal "정답입니다. 눈 등호 랜덤 점 랜드인트 괄호 1 콤마 6 괄호.") — and the
regex+split flow handles 0/1/2/3+ markers per scene without modification.

Pronunciation dict 2nd-pass result (this round): 0 new entries needed.
Script-writer added 7 entries during script-write phase (`choice`, `datetime`,
`from`, `import`, `math`, `randint`, `random` → 초이스/데이트타임/프롬/임포트/
매스/랜드인트/랜덤), and pre-substituted every English token in the
voiceover_to_record block. 2nd-pass grep over voiceover_to_record block confirmed
zero English tokens in narration bodies (only the "scene" line identifier itself).
Pronunciation dictionary now at 66 entries (per pronunciation.json line count;
the script-writer's "70 → 77" comment reflects the alphabetically-sorted JSON).

Identifier pronunciation policy (lesson-3+): variables that *are* spoken get a
dict entry; variables that are visual-only do not. Lesson 10 *speaks* `눈` as a
한국어 한 글자 변수 (TTS standard pronunciation — no dict entry needed,
mirroring lesson-8's `좌표`/`수강과목` and lesson-9's `이름`/`나이` policy).
Other identifiers (`random`, `randint`, `choice`) are dict-mapped because they
are *English* function/module names spoken in narration.

Produces:
  voiceover.mp3            — final concatenated, loudness-normalized voiceover
  timestamps.json          — [{ sceneId, startMs, endMs, narrationText, subClips? }]
                             aligned to final mp3; subClips populated for
                             scene-08 (a0/s1/a2 — question, 1.8s silence, answer).
  _scenes/scene-XX.mp3     — per-scene clip with tail silence appended (kept for inspection)
  _scenes/scene-XX.aN.mp3  — intermediate text halves (kept for re-run / inspection)
  _scenes/scene-XX.sN.mp3  — intermediate silence clips (kept for inspection)

Pipeline:
  1. Parse voiceover_to_record block. For each scene:
       - if narration contains "(N초 정적)": split on the marker, synth each half,
         build a silence clip of duration N*1000 ms, concat halves+silence, append 350ms tail.
       - else: synth narration, append 350ms tail silence.
     Sub-clip paths and durations are tracked per scene for the subClips JSON.
  2. ffprobe each per-scene clip to record its exact ms duration.
  3. Concat all clips (concat demuxer, re-encode mp3 q=2).
  4. Loudnorm I=-16 LRA=11 TP=-1.5 → final voiceover.mp3.
  5. Build timestamps.json with cumulative boundaries rescaled to match the final mp3 duration
     (drift ~0). The narrationText preserved in timestamps strips the "(N초 정적)" marker
     so downstream wire pipelines never see a stage direction; the actual silence
     is baked into the audio at the correct offset. For scenes with inline silence,
     a `subClips` map { a0: {durationMs}, s1: {durationMs}, a2: {durationMs}, ... }
     is added so the composer can verify R-004/R-016 reveal sync — for lesson-10
     this exposes scene-08 question/silence/answer split (~9s question + 1.8s pause
     + ~3s answer reveal, target scene total 14s).
"""

import asyncio
import json
import re
import subprocess
import sys
from pathlib import Path

import edge_tts

# ---------- paths ----------
ROOT = Path(__file__).resolve().parents[4]  # …/codemong  (02-audio → lesson-10 → python → videos → codemong)
LESSON_DIR = Path(__file__).resolve().parent  # …/02-audio
SCENES_DIR = LESSON_DIR / "_scenes"
SCENES_DIR.mkdir(exist_ok=True)
SCRIPT_PATH = LESSON_DIR.parent / "01-script.md"

FFMPEG = (
    ROOT
    / "node_modules"
    / ".pnpm"
    / "@remotion+compositor-win32-x64-msvc@4.0.456"
    / "node_modules"
    / "@remotion"
    / "compositor-win32-x64-msvc"
    / "ffmpeg.exe"
)
FFPROBE = FFMPEG.with_name("ffprobe.exe")

# ---------- config ----------
VOICE = "ko-KR-HyunsuMultilingualNeural"
RATE = "+10%"
TAIL_SILENCE_MS = 350  # natural breath after each scene
LOUDNORM_FILTER = "loudnorm=I=-16:LRA=11:TP=-1.5"

# Matches markers like "(1.5초 정적)" / "(1.8초 정적)" / "(2초 정적)" inside narration.
# Captures the duration so we can synthesize the exact silence width.
SILENCE_MARKER = re.compile(r"\(\s*([0-9]*\.?[0-9]+)\s*초\s*정적\s*\)")


# ---------- script parsing ----------
def parse_voiceover_block(md: str) -> list[dict]:
    """Extract scene-XX → narration text from the voiceover_to_record block.

    The narrationText is kept verbatim (with "(N초 정적)" markers preserved) so the
    synth step can split on markers. We strip markers only when we record narrationText
    in timestamps.json.
    """
    block_match = re.search(
        r"### voiceover_to_record.*?```\s*\n(.*?)\n```",
        md,
        flags=re.DOTALL,
    )
    if not block_match:
        raise RuntimeError("voiceover_to_record block not found in 01-script.md")
    block = block_match.group(1)
    scenes = []
    for line in block.splitlines():
        line = line.strip()
        if not line:
            continue
        m = re.match(r"^(scene-\d+)\s*:\s*(.+)$", line)
        if m:
            scene_id, text = m.group(1), m.group(2).strip()
            text = re.sub(r"\s+", " ", text).strip()
            scenes.append({"sceneId": scene_id, "narrationText": text})
    if not scenes:
        raise RuntimeError("no scenes parsed from voiceover_to_record block")
    return scenes


def strip_silence_marker(text: str) -> str:
    """Remove "(N초 정적)" markers and collapse the resulting whitespace."""
    return re.sub(r"\s+", " ", SILENCE_MARKER.sub(" ", text)).strip()


# ---------- ffmpeg helpers ----------
def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True, capture_output=True)


def append_silence(in_path: Path, out_path: Path, silence_ms: int) -> None:
    """Append silence_ms of silence to in_path; write to out_path (mp3 q=2)."""
    silence_seconds = silence_ms / 1000.0
    run(
        [
            str(FFMPEG),
            "-y",
            "-i",
            str(in_path),
            "-af",
            f"apad=pad_dur={silence_seconds}",
            "-c:a",
            "libmp3lame",
            "-q:a",
            "2",
            str(out_path),
        ]
    )


def make_silence_clip(out_path: Path, ms: int) -> None:
    """Generate a stereo 44.1kHz silent mp3 clip of the given duration (q=2)."""
    seconds = ms / 1000.0
    run(
        [
            str(FFMPEG),
            "-y",
            "-f",
            "lavfi",
            "-i",
            f"anullsrc=channel_layout=stereo:sample_rate=44100",
            "-t",
            f"{seconds}",
            "-c:a",
            "libmp3lame",
            "-q:a",
            "2",
            str(out_path),
        ]
    )


def probe_duration_ms(path: Path) -> int:
    out = subprocess.run(
        [
            str(FFPROBE),
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()
    return round(float(out) * 1000)


def concat_clips(clip_paths: list[Path], out_path: Path, list_file: Path) -> None:
    list_file.write_text(
        "\n".join(f"file '{p.as_posix()}'" for p in clip_paths),
        encoding="utf-8",
    )
    run(
        [
            str(FFMPEG),
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(list_file),
            "-c:a",
            "libmp3lame",
            "-q:a",
            "2",
            str(out_path),
        ]
    )


def loudnorm(in_path: Path, out_path: Path) -> None:
    run(
        [
            str(FFMPEG),
            "-y",
            "-i",
            str(in_path),
            "-af",
            LOUDNORM_FILTER,
            "-c:a",
            "libmp3lame",
            "-q:a",
            "2",
            str(out_path),
        ]
    )


# ---------- TTS ----------
async def synth_one(text: str, out_path: Path) -> None:
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(str(out_path))


async def build_scene_clip(scene_id: str, narration: str) -> tuple[Path, dict | None]:
    """Synthesize one scene into _scenes/<scene_id>.mp3 (with tail silence appended).

    If narration contains "(N초 정적)" markers, splits the text on each marker, synthesizes
    each chunk separately, and concatenates [chunk_1, silence_N, chunk_2, silence_M, ...]
    before appending the standard tail silence.

    Returns (final_path, sub_clips_meta) where sub_clips_meta is None if no inline silence,
    else a dict { "a0": {"durationMs": int}, "s1": {"durationMs": int}, "a2": {...}, ... }
    using interleaved a/s naming (a = audio chunk, s = silence).
    """
    final_path = SCENES_DIR / f"{scene_id}.mp3"

    silence_matches = list(SILENCE_MARKER.finditer(narration))

    if not silence_matches:
        raw = SCENES_DIR / f"{scene_id}.raw.mp3"
        await synth_one(narration, raw)
        append_silence(raw, final_path, TAIL_SILENCE_MS)
        raw.unlink(missing_ok=True)
        return final_path, None

    # Split narration into alternating [text_chunk, silence_ms, text_chunk, silence_ms, ...].
    parts: list[Path] = []
    sub_clips: dict[str, dict] = {}
    cursor = 0
    chunk_idx = 0  # advances for both audio (aN) and silence (sN) so naming stays unique
    for m in silence_matches:
        text_chunk = narration[cursor : m.start()].strip()
        silence_seconds = float(m.group(1))
        if text_chunk:
            chunk_path = SCENES_DIR / f"{scene_id}.a{chunk_idx}.mp3"
            await synth_one(text_chunk, chunk_path)
            parts.append(chunk_path)
            sub_clips[f"a{chunk_idx}"] = {"durationMs": probe_duration_ms(chunk_path)}
            chunk_idx += 1
        silence_path = SCENES_DIR / f"{scene_id}.s{chunk_idx}.mp3"
        silence_ms = round(silence_seconds * 1000)
        make_silence_clip(silence_path, silence_ms)
        parts.append(silence_path)
        sub_clips[f"s{chunk_idx}"] = {"durationMs": silence_ms}
        chunk_idx += 1
        cursor = m.end()
    tail_text = narration[cursor:].strip()
    if tail_text:
        chunk_path = SCENES_DIR / f"{scene_id}.a{chunk_idx}.mp3"
        await synth_one(tail_text, chunk_path)
        parts.append(chunk_path)
        sub_clips[f"a{chunk_idx}"] = {"durationMs": probe_duration_ms(chunk_path)}

    # Concat the parts into a single per-scene clip *before* tail silence,
    # then append the 350ms breath tail.
    pre_tail = SCENES_DIR / f"{scene_id}.pretail.mp3"
    list_file = SCENES_DIR / f"_concat_{scene_id}.txt"
    concat_clips(parts, pre_tail, list_file)
    list_file.unlink(missing_ok=True)
    append_silence(pre_tail, final_path, TAIL_SILENCE_MS)
    pre_tail.unlink(missing_ok=True)
    return final_path, sub_clips


# ---------- main ----------
async def main() -> None:
    md = SCRIPT_PATH.read_text(encoding="utf-8")
    scenes = parse_voiceover_block(md)
    print(f"[synth] parsed {len(scenes)} scenes from {SCRIPT_PATH.name}")

    final_clips: list[Path] = []
    scene_durations_ms: list[int] = []
    scene_sub_clips: list[dict | None] = []
    for s in scenes:
        clip, sub_clips = await build_scene_clip(s["sceneId"], s["narrationText"])
        d = probe_duration_ms(clip)
        scene_durations_ms.append(d)
        final_clips.append(clip)
        scene_sub_clips.append(sub_clips)
        marker_note = "  [+silence]" if sub_clips else ""
        print(f"  {s['sceneId']}: {d/1000:.2f}s{marker_note}")

    # 2. concat all scene clips
    concat_path = LESSON_DIR / "_concat.mp3"
    concat_clips(final_clips, concat_path, SCENES_DIR / "_concat.txt")
    concat_dur = probe_duration_ms(concat_path)
    print(f"[concat] {concat_dur/1000:.2f}s")

    # 3. loudnorm → final voiceover
    final_path = LESSON_DIR / "voiceover.mp3"
    loudnorm(concat_path, final_path)
    final_dur = probe_duration_ms(final_path)
    print(f"[loudnorm] {final_dur/1000:.2f}s  (Δ vs concat: {final_dur - concat_dur}ms)")
    concat_path.unlink(missing_ok=True)

    # 4. timestamps — rescale per-scene cumulative boundaries to match final mp3 duration.
    # narrationText recorded here strips the "(N초 정적)" markers (downstream pipelines
    # treat narrationText as caption-like text, so the marker would be noise).
    # subClips, when present, expose the inline silence sub-clip durations so the
    # composer can sync R-004/R-016 reveal frames against actual audio offsets.
    sum_ms = sum(scene_durations_ms)
    scale = final_dur / sum_ms if sum_ms else 1.0
    timestamps = []
    cursor = 0
    for i, s in enumerate(scenes):
        start = cursor
        if i == len(scenes) - 1:
            end = final_dur
        else:
            end = round((sum(scene_durations_ms[: i + 1])) * scale)
        entry = {
            "sceneId": s["sceneId"],
            "startMs": start,
            "endMs": end,
            "narrationText": strip_silence_marker(s["narrationText"]),
        }
        if scene_sub_clips[i]:
            entry["subClips"] = scene_sub_clips[i]
        timestamps.append(entry)
        cursor = end

    (LESSON_DIR / "timestamps.json").write_text(
        json.dumps(timestamps, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"[timestamps] written. last endMs = {timestamps[-1]['endMs']}, final mp3 = {final_dur}")
    print(f"[done] {final_path}")


if __name__ == "__main__":
    if not FFMPEG.exists():
        sys.exit(f"ffmpeg not found at {FFMPEG}")
    asyncio.run(main())
