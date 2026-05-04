import asyncio
import edge_tts

TEXT = "안녕하세요. 코드몽입니다. 파이썬으로 변수를 만들어 보겠습니다. HTML과 CSS 도 곧 다룰 거예요."
VOICE = "ko-KR-InJoonNeural"
RATE = "+10%"
OUT = "videos/_assets/voice-sample-injoon.mp3"


async def main() -> None:
    communicate = edge_tts.Communicate(TEXT, VOICE, rate=RATE)
    await communicate.save(OUT)


if __name__ == "__main__":
    asyncio.run(main())
