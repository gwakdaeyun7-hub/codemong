"""
Build captions.srt from timestamps.json.

Strategy (v2 — merges short chunks for Korean readability):
  - Each scene's narrationText is split into clause-sized chunks via . , ! ? boundaries.
  - Long clauses (>SOFT_MAX_CHARS) are force-split on 어절 boundaries near TARGET.
  - SHORT trailing chunks (<MERGE_THRESHOLD chars) are merged backwards into the
    previous chunk if the result fits within HARD_MAX*2. This avoids "갑니다."-only
    captions that flicker for 600ms.
  - Each chunk is allocated time proportional to char length within its scene.
  - Two-line wrap: max 14 chars per line, hard ceiling 16, prefers whitespace
    nearest the middle.
  - Time clamping: caption duration ∈ [1.0s, 6.0s].

Korean mobile subtitle readability is the goal — avg 14 chars per line, 2 lines max.
"""

import json
import re
from pathlib import Path

LESSON_DIR = Path(__file__).resolve().parent
TIMESTAMPS = LESSON_DIR / "timestamps.json"
SRT_OUT = LESSON_DIR / "captions.srt"

SOFT_MAX_CHARS = 26
TARGET = 22
MAX_PER_LINE = 14
HARD_MAX = 16
MERGE_THRESHOLD = 10  # chunks shorter than this get merged backward
MIN_CAPTION_MS = 1000
MAX_CAPTION_MS = 6000

CLAUSE_DELIMITERS = re.compile(r"([.,!?])")


def split_into_clauses(text: str) -> list[str]:
    parts = CLAUSE_DELIMITERS.split(text)
    chunks: list[str] = []
    buf = ""
    for p in parts:
        if not p:
            continue
        if CLAUSE_DELIMITERS.fullmatch(p):
            buf += p
            chunks.append(buf.strip())
            buf = ""
        else:
            buf += p
    if buf.strip():
        chunks.append(buf.strip())
    return chunks


def force_split(text: str, target: int) -> list[str]:
    if len(text) <= SOFT_MAX_CHARS:
        return [text]
    pieces: list[str] = []
    remaining = text.strip()
    while len(remaining) > SOFT_MAX_CHARS:
        cut = -1
        for i in range(min(target + 4, len(remaining)), max(target - 6, 0), -1):
            if i < len(remaining) and remaining[i] == " ":
                cut = i
                break
        if cut == -1:
            cut = target
        pieces.append(remaining[:cut].strip())
        remaining = remaining[cut:].strip()
    if remaining:
        pieces.append(remaining)
    return pieces


def merge_short_chunks(chunks: list[str], max_total: int) -> list[str]:
    """
    Merge a short chunk into its neighbor (preferring backward merge into prev)
    when the chunk is shorter than MERGE_THRESHOLD and the merged length stays
    within max_total.
    """
    out = list(chunks)
    changed = True
    while changed:
        changed = False
        for i, c in enumerate(out):
            if len(c) >= MERGE_THRESHOLD:
                continue
            # try backward merge first
            if i > 0:
                merged = out[i - 1] + " " + c
                if len(merged) <= max_total:
                    out[i - 1] = merged
                    out.pop(i)
                    changed = True
                    break
            # else forward merge
            if i < len(out) - 1:
                merged = c + " " + out[i + 1]
                if len(merged) <= max_total:
                    out[i + 1] = merged
                    out.pop(i)
                    changed = True
                    break
    return out


def chunk_narration(text: str) -> list[str]:
    raw: list[str] = []
    for clause in split_into_clauses(text):
        if len(clause) <= SOFT_MAX_CHARS:
            raw.append(clause)
        else:
            raw.extend(force_split(clause, TARGET))
    raw = [c.strip() for c in raw if c.strip()]
    # merge: allow combined chunks up to HARD_MAX*2 = 32 chars (fits 2 lines × 14~16)
    return merge_short_chunks(raw, max_total=HARD_MAX * 2)


def split_to_two_lines(text: str) -> str:
    if len(text) <= MAX_PER_LINE:
        return text
    mid = len(text) // 2
    best = -1
    best_dist = 10**9
    for i, ch in enumerate(text):
        if ch == " ":
            left_len = i
            right_len = len(text) - i - 1
            if left_len <= HARD_MAX and right_len <= HARD_MAX:
                dist = abs(i - mid)
                if dist < best_dist:
                    best_dist = dist
                    best = i
    if best == -1:
        return text[:MAX_PER_LINE].rstrip() + "\n" + text[MAX_PER_LINE:].lstrip()
    return text[:best] + "\n" + text[best + 1 :]


def ms_to_srt_time(ms: int) -> str:
    h = ms // 3_600_000
    rem = ms % 3_600_000
    m = rem // 60_000
    rem = rem % 60_000
    s = rem // 1000
    msec = rem % 1000
    return f"{h:02d}:{m:02d}:{s:02d},{msec:03d}"


def main() -> None:
    timestamps = json.loads(TIMESTAMPS.read_text(encoding="utf-8"))
    captions = []

    for scene in timestamps:
        scene_start = scene["startMs"]
        scene_end = scene["endMs"]
        scene_dur = scene_end - scene_start
        chunks = chunk_narration(scene["narrationText"])
        if not chunks:
            continue
        total_chars = sum(len(c) for c in chunks)
        local_cursor = scene_start
        for i, chunk in enumerate(chunks):
            if i == len(chunks) - 1:
                seg_end = scene_end
            else:
                share = len(chunk) / total_chars if total_chars else 0
                seg_end = local_cursor + max(MIN_CAPTION_MS, round(scene_dur * share))
            seg_start = local_cursor
            seg_dur = seg_end - seg_start
            if seg_dur < MIN_CAPTION_MS and i < len(chunks) - 1:
                seg_end = min(seg_start + MIN_CAPTION_MS, scene_end)
            if seg_end - seg_start > MAX_CAPTION_MS:
                seg_end = seg_start + MAX_CAPTION_MS
            seg_text = split_to_two_lines(chunk)
            captions.append({"start": seg_start, "end": seg_end, "text": seg_text})
            local_cursor = seg_end

    # final pass: clamp absolute min duration (rare edge: scene-final too short)
    for i in range(len(captions)):
        dur = captions[i]["end"] - captions[i]["start"]
        if dur < MIN_CAPTION_MS:
            # extend into next caption start if possible
            if i + 1 < len(captions):
                room = captions[i + 1]["start"] - captions[i]["start"]
                captions[i]["end"] = captions[i]["start"] + min(MIN_CAPTION_MS, room)
            else:
                captions[i]["end"] = captions[i]["start"] + MIN_CAPTION_MS

    out_lines = []
    for idx, cap in enumerate(captions, start=1):
        out_lines.append(str(idx))
        out_lines.append(f"{ms_to_srt_time(cap['start'])} --> {ms_to_srt_time(cap['end'])}")
        out_lines.append(cap["text"])
        out_lines.append("")
    SRT_OUT.write_text("\n".join(out_lines), encoding="utf-8")

    line_lengths = []
    for cap in captions:
        for line in cap["text"].split("\n"):
            line_lengths.append(len(line))
    durs = [(c["end"] - c["start"]) / 1000 for c in captions]
    print(f"[srt] wrote {len(captions)} captions to {SRT_OUT.name}")
    print(f"      line length: max={max(line_lengths)} avg={sum(line_lengths)/len(line_lengths):.1f}")
    print(f"      duration:    min={min(durs):.2f}s max={max(durs):.2f}s avg={sum(durs)/len(durs):.2f}s")
    short = [d for d in durs if d < 1.0]
    if short:
        print(f"      WARN: {len(short)} captions <1.0s")


if __name__ == "__main__":
    main()
