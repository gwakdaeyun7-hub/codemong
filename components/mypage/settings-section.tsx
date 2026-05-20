import type { ReactNode } from "react";

/**
 * 설정 페이지 섹션 카드 공통 wrapper.
 * 제목 / 설명 / 자식 컴포넌트(폼)를 동일 톤으로 묶음.
 */
export function SettingsSection({
  title,
  description,
  tone = "default",
  children,
}: {
  title: string;
  description?: string;
  tone?: "default" | "danger";
  children: ReactNode;
}) {
  const border =
    tone === "danger" ? "border-rose-200" : "border-zinc-200";
  return (
    <section
      className={`rounded-2xl border ${border} bg-white p-6 shadow-sm`}
    >
      <div className="mb-4">
        <h2 className={`text-base font-bold ${tone === "danger" ? "text-rose-700" : "text-zinc-900"}`}>
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-xs text-zinc-500">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
