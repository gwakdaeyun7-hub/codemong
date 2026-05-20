import { authIcons } from "./icon-map";

/**
 * 폼 상단에 표시할 에러/성공 배너.
 * Server Action 의 ActionState 결과를 그대로 받아 분기.
 */
export function FormFeedback({
  state,
}: {
  state:
    | { ok: true; message?: string }
    | { ok: false; error: string }
    | null;
}) {
  if (!state) return null;
  const Icon = state.ok ? authIcons.check : authIcons.alert;
  const tone = state.ok
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-rose-200 bg-rose-50 text-rose-700";
  const message = state.ok ? state.message ?? "처리되었습니다." : state.error;

  return (
    <div
      role={state.ok ? "status" : "alert"}
      className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm ${tone}`}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-xs text-rose-600" role="alert">
      {message}
    </p>
  );
}
