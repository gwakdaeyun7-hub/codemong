"use client"

import { useEffect } from "react"

// 루트 레이아웃 자체가 깨졌을 때의 최종 폴백. layout 을 대체하므로 <html>/<body> 를 직접 렌더한다.
// layout 의 Tailwind/폰트 변수가 적용되지 않을 수 있어 최소한의 인라인 스타일로 CodeMong 톤만 맞춘다.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 1rem",
            backgroundColor: "#fafafa",
            fontFamily:
              "system-ui, -apple-system, 'Segoe UI', Roboto, 'Apple SD Gothic Neo', sans-serif",
            color: "#18181b",
          }}
        >
          <section
            style={{
              maxWidth: "28rem",
              width: "100%",
              boxSizing: "border-box",
              textAlign: "center",
              backgroundColor: "#ffffff",
              borderRadius: "1rem",
              padding: "3rem 1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
              잠시 문제가 생겼어요
            </h1>
            <p
              style={{
                marginTop: "0.5rem",
                fontSize: "0.875rem",
                lineHeight: 1.6,
                color: "#71717a",
              }}
            >
              예상치 못한 오류가 발생했어요. 다시 시도해 주세요.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                marginTop: "1.5rem",
                height: "2.5rem",
                padding: "0 1.25rem",
                borderRadius: "9999px",
                border: "none",
                backgroundColor: "#7c3aed",
                color: "#ffffff",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              다시 시도
            </button>
          </section>
        </main>
      </body>
    </html>
  )
}
