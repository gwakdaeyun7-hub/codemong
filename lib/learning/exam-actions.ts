"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import { dateKeyToUtcDate, kstTodayKey } from "./exam-queries";

// 시험 일정 등록/삭제 — 학습 캘린더 D-Day 카드에서 호출한다.
// 날짜는 "YYYY-MM-DD"(KST 기준) 문자열로 받아 @db.Date(UTC 자정)로 저장한다.

export type ExamActionResult = { ok: true } | { ok: false; error: string };

const TITLE_MAX = 40;
const MAX_EXAMS = 10; // 사용자당 등록 상한 (지난 시험 포함)
const MAX_YEARS_AHEAD = 2;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function createExamAction(title: string, date: string): Promise<ExamActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요해요" };

  const name = (title ?? "").trim();
  if (!name) return { ok: false, error: "시험 이름을 입력해 주세요." };
  if (name.length > TITLE_MAX)
    return { ok: false, error: `시험 이름은 ${TITLE_MAX}자까지 쓸 수 있어요.` };

  if (!DATE_RE.test(date ?? "")) return { ok: false, error: "시험 날짜를 선택해 주세요." };
  const examDate = dateKeyToUtcDate(date);
  if (Number.isNaN(examDate.getTime())) return { ok: false, error: "시험 날짜를 선택해 주세요." };

  const todayKey = kstTodayKey();
  if (date < todayKey) return { ok: false, error: "지난 날짜는 등록할 수 없어요." };
  const limitYear = Number(todayKey.slice(0, 4)) + MAX_YEARS_AHEAD;
  if (Number(date.slice(0, 4)) > limitYear) {
    return { ok: false, error: "너무 먼 날짜예요. 2년 이내로 정해 주세요." };
  }

  const count = await prisma.examSchedule.count({ where: { userId: user.id } });
  if (count >= MAX_EXAMS) {
    return {
      ok: false,
      error: `시험은 ${MAX_EXAMS}개까지 등록할 수 있어요. 지난 일정을 지워 주세요.`,
    };
  }

  await prisma.examSchedule.create({
    data: { userId: user.id, title: name, examDate },
  });

  revalidatePath("/mypage/calendar");
  return { ok: true };
}

export async function deleteExamAction(id: string): Promise<ExamActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요해요" };
  if (!id) return { ok: false, error: "시험 정보가 없어요" };

  // 본인 것만 삭제 (deleteMany 로 소유자 조건을 함께 건다)
  const result = await prisma.examSchedule.deleteMany({ where: { id, userId: user.id } });
  if (result.count === 0) return { ok: false, error: "이미 삭제된 일정이에요." };

  revalidatePath("/mypage/calendar");
  return { ok: true };
}
