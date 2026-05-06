"""
TTS voice 샘플 합성 — voice/rate 결정 시 비교용.

사용법: voice 변경 시 VARIANTS 에 비교할 voice/rate 추가하고
        py videos/_assets/_synth_sample.py 실행.
출력은 videos/_assets/voice-test/ 하위.
"""

import asyncio
from pathlib import Path
import edge_tts

TEXT = (
    "안녕하세요. 파이썬 기초 1강을 시작합니다. "
    "오늘은 파이썬을 시작하기 위한 환경을 갖추는 시간입니다."
)

OUT_DIR = Path("videos/_assets/voice-test")

VARIANTS = [
    ("ko-KR-HyunsuMultilingualNeural", "+10%"),
]


def slug(voice: str, rate: str) -> str:
    v = voice.replace("ko-KR-", "").replace("Neural", "").lower()
    r = rate.replace("+", "p").replace("-", "m").replace("%", "")
    return f"{v}-{r}"


async def synth(voice: str, rate: str) -> Path:
    out = OUT_DIR / f"{slug(voice, rate)}.mp3"
    out.parent.mkdir(parents=True, exist_ok=True)
    communicate = edge_tts.Communicate(TEXT, voice, rate=rate)
    await communicate.save(str(out))
    return out


async def main() -> None:
    results = await asyncio.gather(*[synth(v, r) for v, r in VARIANTS])
    for path in results:
        print(path)


if __name__ == "__main__":
    asyncio.run(main())
