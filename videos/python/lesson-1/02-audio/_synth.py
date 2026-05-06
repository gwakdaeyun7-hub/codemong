"""
Per-scene Edge TTS synthesis + concat + loudnorm for CodeMong Python Lesson 1.

Produces:
  voiceover.mp3      — final concatenated, loudness-normalized voiceover
  timestamps.json    — [{ sceneId, startMs, endMs, narrationText }] aligned to final mp3
  _scenes/scene-XX.mp3  — per-scene synthesized clips (kept for re-run / inspection)

Pipeline:
  1. For each scene, synth narration via edge-tts (ko-KR-HyunsuMultilingualNeural, +10%).
  2. Append 350ms silence tail to each clip (natural breath, prevents abrupt cuts on concat).
  3. Concat all clips via ffmpeg concat demuxer (re-encode mp3 q=2 for safe concat).
  4. Apply loudnorm I=-16 LRA=11 TP=-1.5 to produce final voiceover.mp3.
  5. ffprobe each per-scene clip (with tail silence) to compute exact ms boundaries,
     then rescale boundaries to match the final loudnormed mp3 duration so endMs of
     last scene == final duration (drift ~0).
"""

import asyncio
import json
import os
import re
import subprocess
import sys
from pathlib import Path

import edge_tts

# ---------- paths ----------
ROOT = Path(__file__).resolve().parents[4]  # …/codemong  (02-audio → lesson-1 → python → videos → codemong)
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


# ---------- script parsing ----------
def parse_voiceover_block(md: str) -> list[dict]:
    """Extract scene-XX → narration text from the voiceover_to_record block."""
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
            # strip parenthetical stage directions like "(1.5초 정적)" so TTS doesn't read them.
            text = re.sub(r"\([^)]*정적[^)]*\)", " ", text)
            text = re.sub(r"\s+", " ", text).strip()
            scenes.append({"sceneId": scene_id, "narrationText": text})
    if not scenes:
        raise RuntimeError("no scenes parsed from voiceover_to_record block")
    return scenes


# ---------- synth ----------
async def synth_one(text: str, out_path: Path) -> None:
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(str(out_path))


def append_silence(in_path: Path, out_path: Path, silence_ms: int) -> None:
    """Append silence_ms of silence to in_path; write to out_path."""
    silence_seconds = silence_ms / 1000.0
    cmd = [
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
    subprocess.run(cmd, check=True, capture_output=True)


def probe_duration_ms(path: Path) -> int:
    cmd = [
        str(FFPROBE),
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        str(path),
    ]
    out = subprocess.run(cmd, check=True, capture_output=True, text=True).stdout.strip()
    return round(float(out) * 1000)


def concat_clips(clip_paths: list[Path], out_path: Path) -> None:
    list_file = SCENES_DIR / "_concat.txt"
    list_file.write_text(
        "\n".join(f"file '{p.as_posix()}'" for p in clip_paths),
        encoding="utf-8",
    )
    cmd = [
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
    subprocess.run(cmd, check=True, capture_output=True)


def loudnorm(in_path: Path, out_path: Path) -> None:
    cmd = [
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
    subprocess.run(cmd, check=True, capture_output=True)


async def main() -> None:
    md = SCRIPT_PATH.read_text(encoding="utf-8")
    scenes = parse_voiceover_block(md)
    print(f"[synth] parsed {len(scenes)} scenes from {SCRIPT_PATH.name}")

    # 1. synth + tail silence per scene
    final_clips: list[Path] = []
    scene_durations_ms: list[int] = []
    for s in scenes:
        raw = SCENES_DIR / f"{s['sceneId']}.raw.mp3"
        clip = SCENES_DIR / f"{s['sceneId']}.mp3"
        await synth_one(s["narrationText"], raw)
        append_silence(raw, clip, TAIL_SILENCE_MS)
        raw.unlink(missing_ok=True)
        d = probe_duration_ms(clip)
        scene_durations_ms.append(d)
        final_clips.append(clip)
        print(f"  {s['sceneId']}: {d/1000:.2f}s")

    # 2. concat
    concat_path = LESSON_DIR / "_concat.mp3"
    concat_clips(final_clips, concat_path)
    concat_dur = probe_duration_ms(concat_path)
    print(f"[concat] {concat_dur/1000:.2f}s")

    # 3. loudnorm → final voiceover
    final_path = LESSON_DIR / "voiceover.mp3"
    loudnorm(concat_path, final_path)
    final_dur = probe_duration_ms(final_path)
    print(f"[loudnorm] {final_dur/1000:.2f}s  (Δ vs concat: {final_dur - concat_dur}ms)")
    concat_path.unlink(missing_ok=True)

    # 4. timestamps — rescale per-scene cumulative boundaries to match final mp3 duration
    sum_ms = sum(scene_durations_ms)
    scale = final_dur / sum_ms if sum_ms else 1.0
    timestamps = []
    cursor = 0
    for i, s in enumerate(scenes):
        start = cursor
        if i == len(scenes) - 1:
            end = final_dur  # last scene: pin to exact final duration
        else:
            end = round((sum(scene_durations_ms[: i + 1])) * scale)
        timestamps.append(
            {
                "sceneId": s["sceneId"],
                "startMs": start,
                "endMs": end,
                "narrationText": s["narrationText"],
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
