"""
Per-scene Edge TTS synthesis + concat + loudnorm for CodeMong Python Lesson 6.

Lesson 6 ("반복문 — for / while / break / continue", 12 scenes, target 180s).

Inherits the lesson-5 baseline pipeline (inline "(N초 정적)" silence handling).
This script is identical in logic to videos/python/lesson-5/02-audio/_synth.py;
only paths and the docstring lesson reference change. Lesson 6 has ONE scene
with an active-recall silence beat — scene-06 ("(1.8초 정적)") — and the
regex+split flow handles 0/1/2/3+ markers per scene without modification.

Pronunciation dict 2nd-pass result (this round): 0 new entries needed.
Dictionary already at 42 entries (script-writer added `if`/`iteration`/`loop`/
`infinite loop` in the previous round). 2nd-pass grep over voiceover_to_record
block confirmed no English chars — script-writer pre-substituted every token:
  - for / while / break / continue → 포 / 와일 / 브레이크 / 컨티뉴
  - range / print / input          → 레인지 / 프린트 / 인풋
  - total / password / if          → 토탈 / 패스워드 / 이프
  - 0..2, 1..10, 11, 1234, 0000... → all spoken as 한자식 numerals (TTS native)
Loop counter `i` is intentionally never spoken as "아이" — narration uses
한국어 "이" instead (carried over from lesson-3 `is_student` / lesson-5
`is_login`/`is_admin` policy: variables that *are* spoken get a dict entry,
variables that are visual-only do not).

Produces:
  voiceover.mp3            — final concatenated, loudness-normalized voiceover
  timestamps.json          — [{ sceneId, startMs, endMs, narrationText }] aligned to final mp3
  _scenes/scene-XX.mp3     — per-scene clip with tail silence appended (kept for inspection)
  _scenes/scene-XX.aN.mp3  — intermediate halves (only for scenes with inline silence — kept for re-run)

Pipeline:
  1. Parse voiceover_to_record block. For each scene:
       - if narration contains "(N초 정적)": split on the marker, synth each half,
         build a silence clip of duration N*1000 ms, concat halves+silence, append 350ms tail.
       - else: synth narration, append 350ms tail silence.
  2. ffprobe each per-scene clip to record its exact ms duration.
  3. Concat all clips (concat demuxer, re-encode mp3 q=2).
  4. Loudnorm I=-16 LRA=11 TP=-1.5 → final voiceover.mp3.
  5. Build timestamps.json with cumulative boundaries rescaled to match the final mp3 duration
     (drift ~0). The narrationText preserved in timestamps strips the "(N초 정적)" marker
     so downstream wire pipelines never see a stage direction; the actual silence
     is baked into the audio at the correct offset.
"""

import asyncio
import json
import re
import subprocess
import sys
from pathlib import Path

import edge_tts

# ---------- paths ----------
ROOT = Path(__file__).resolve().parents[4]  # …/codemong  (02-audio → lesson-6 → python → videos → codemong)
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

# Matches markers like "(1.5초 정적)" / "(1.8초 정적)" / "(0.8초 정적)" inside narration.
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


async def build_scene_clip(scene_id: str, narration: str) -> Path:
    """Synthesize one scene into _scenes/<scene_id>.mp3 (with tail silence appended).

    If narration contains "(N초 정적)" markers, splits the text on each marker, synthesizes
    each chunk separately, and concatenates [chunk_1, silence_N, chunk_2, silence_M, ...]
    before appending the standard tail silence. Otherwise behaves like lesson-1.
    """
    final_path = SCENES_DIR / f"{scene_id}.mp3"

    silence_matches = list(SILENCE_MARKER.finditer(narration))

    if not silence_matches:
        raw = SCENES_DIR / f"{scene_id}.raw.mp3"
        await synth_one(narration, raw)
        append_silence(raw, final_path, TAIL_SILENCE_MS)
        raw.unlink(missing_ok=True)
        return final_path

    # Split narration into alternating [text_chunk, silence_ms, text_chunk, silence_ms, ...].
    parts: list[Path] = []
    cursor = 0
    chunk_idx = 0
    for m in silence_matches:
        text_chunk = narration[cursor : m.start()].strip()
        silence_seconds = float(m.group(1))
        if text_chunk:
            chunk_path = SCENES_DIR / f"{scene_id}.a{chunk_idx}.mp3"
            await synth_one(text_chunk, chunk_path)
            parts.append(chunk_path)
            chunk_idx += 1
        silence_path = SCENES_DIR / f"{scene_id}.s{chunk_idx}.mp3"
        make_silence_clip(silence_path, round(silence_seconds * 1000))
        parts.append(silence_path)
        chunk_idx += 1
        cursor = m.end()
    tail_text = narration[cursor:].strip()
    if tail_text:
        chunk_path = SCENES_DIR / f"{scene_id}.a{chunk_idx}.mp3"
        await synth_one(tail_text, chunk_path)
        parts.append(chunk_path)

    # Concat the parts into a single per-scene clip *before* tail silence,
    # then append the 350ms breath tail.
    pre_tail = SCENES_DIR / f"{scene_id}.pretail.mp3"
    list_file = SCENES_DIR / f"_concat_{scene_id}.txt"
    concat_clips(parts, pre_tail, list_file)
    list_file.unlink(missing_ok=True)
    append_silence(pre_tail, final_path, TAIL_SILENCE_MS)
    pre_tail.unlink(missing_ok=True)
    return final_path


# ---------- main ----------
async def main() -> None:
    md = SCRIPT_PATH.read_text(encoding="utf-8")
    scenes = parse_voiceover_block(md)
    print(f"[synth] parsed {len(scenes)} scenes from {SCRIPT_PATH.name}")

    final_clips: list[Path] = []
    scene_durations_ms: list[int] = []
    for s in scenes:
        clip = await build_scene_clip(s["sceneId"], s["narrationText"])
        d = probe_duration_ms(clip)
        scene_durations_ms.append(d)
        final_clips.append(clip)
        marker_note = "  [+silence]" if SILENCE_MARKER.search(s["narrationText"]) else ""
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
        timestamps.append(
            {
                "sceneId": s["sceneId"],
                "startMs": start,
                "endMs": end,
                "narrationText": strip_silence_marker(s["narrationText"]),
            }
        )
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
