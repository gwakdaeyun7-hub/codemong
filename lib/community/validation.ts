// 게시글/댓글/신고 입력 검증.

import type { ReportReason } from "./types";

export type FieldErrors = Record<string, string>;

export function validatePostTitle(value: string): string | null {
  const v = value.trim();
  if (!v) return "제목을 입력해주세요.";
  if (v.length < 2) return "제목은 2자 이상이어야 합니다.";
  if (v.length > 80) return "제목은 80자 이하여야 합니다.";
  return null;
}

export function validatePostBody(value: string): string | null {
  const v = value.trim();
  if (!v) return "내용을 입력해주세요.";
  if (v.length > 5000) return "내용은 5000자 이하여야 합니다.";
  return null;
}

export function validateCommentBody(value: string): string | null {
  const v = value.trim();
  if (!v) return "댓글 내용을 입력해주세요.";
  if (v.length > 1000) return "댓글은 1000자 이하여야 합니다.";
  return null;
}

const VALID_REASONS: ReadonlySet<ReportReason> = new Set<ReportReason>([
  "spam",
  "abuse",
  "off-topic",
  "other",
]);

export function validateReportReason(value: string): ReportReason | null {
  return VALID_REASONS.has(value as ReportReason) ? (value as ReportReason) : null;
}

export function validateReportDetail(reason: ReportReason, detail: string): string | null {
  // reason 이 "other" 인 경우 detail 필수.
  if (reason === "other") {
    const v = detail.trim();
    if (!v) return "기타 사유는 직접 입력해주세요.";
    if (v.length > 200) return "사유는 200자 이하여야 합니다.";
  }
  return null;
}

// "<courseId>/<lessonId>" 형태인지 빠르게 검증 (XSS 방지 + 정규화)
const LESSON_REF_RE = /^[a-z0-9-]+\/[a-z0-9-]+$/i;

export function validateLessonRef(value: string): string | null {
  if (!value) return "lesson 정보가 없습니다.";
  if (!LESSON_REF_RE.test(value)) return "lesson 식별자 형식이 올바르지 않습니다.";
  return null;
}
