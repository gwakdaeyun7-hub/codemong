"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";

import type { FieldErrors } from "./validation";
import {
  validateCommentBody,
  validateLessonRef,
  validateReportDetail,
  validateReportReason,
} from "./validation";

export type ActionState =
  | { ok: true; data?: { commentId?: string } }
  | { ok: false; error: string; fieldErrors?: FieldErrors }
  | null;

function revalidateForLesson(lessonRef: string) {
  const [c, l] = lessonRef.split("/");
  if (c && l) revalidatePath(`/courses/${c}/lessons/${l}`);
}

// ─── 강의 댓글 생성 (답글 포함) ─────────────────────────────
export async function createLessonCommentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const lessonRef = String(formData.get("lessonRef") ?? "");
  const body = String(formData.get("body") ?? "");
  const parentIdRaw = String(formData.get("parentId") ?? "").trim();
  const parentId = parentIdRaw || null;

  const fieldErrors: FieldErrors = {};
  const refErr = validateLessonRef(lessonRef);
  if (refErr) fieldErrors.lessonRef = refErr;
  const bodyErr = validateCommentBody(body);
  if (bodyErr) fieldErrors.body = bodyErr;
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "입력값을 확인해주세요.", fieldErrors };
  }

  // 답글의 답글 차단 (1-depth)
  if (parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: parentId } });
    if (!parent) return { ok: false, error: "대상 댓글을 찾을 수 없습니다." };
    if (parent.parentId)
      return { ok: false, error: "답글에는 답글을 달 수 없습니다." };
    if (parent.lessonRef !== lessonRef)
      return { ok: false, error: "대상 댓글이 일치하지 않습니다." };
  }

  const comment = await prisma.comment.create({
    data: {
      authorId: user.id,
      authorNickname: user.nickname,
      authorAvatarUrl: user.avatarUrl,
      lessonRef,
      body: body.trim(),
      parentId,
    },
  });

  revalidateForLesson(lessonRef);
  return { ok: true, data: { commentId: comment.id } };
}

// ─── 게시글 댓글 생성 (답글 포함) ──────────────────────────
export async function createPostCommentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const postId = String(formData.get("postId") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const parentIdRaw = String(formData.get("parentId") ?? "").trim();
  const parentId = parentIdRaw || null;

  if (!postId) return { ok: false, error: "대상 게시글이 없습니다." };

  const fieldErrors: FieldErrors = {};
  const bodyErr = validateCommentBody(body);
  if (bodyErr) fieldErrors.body = bodyErr;
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "입력값을 확인해주세요.", fieldErrors };
  }

  // 게시글이 살아있는지 확인
  const post = await prisma.post.findFirst({
    where: { id: postId, deletedAt: null },
  });
  if (!post) return { ok: false, error: "게시글을 찾을 수 없습니다." };

  if (parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: parentId } });
    if (!parent) return { ok: false, error: "대상 댓글을 찾을 수 없습니다." };
    if (parent.parentId)
      return { ok: false, error: "답글에는 답글을 달 수 없습니다." };
    if (parent.postId !== postId)
      return { ok: false, error: "대상 댓글이 일치하지 않습니다." };
  }

  await prisma.$transaction([
    prisma.comment.create({
      data: {
        authorId: user.id,
        authorNickname: user.nickname,
        authorAvatarUrl: user.avatarUrl,
        postId,
        body: body.trim(),
        parentId,
      },
    }),
    prisma.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    }),
  ]);

  revalidatePath(`/community/${postId}`);
  revalidatePath(`/community`);
  return { ok: true };
}

// ─── 댓글 수정 ─────────────────────────────────────────────
export async function updateCommentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const commentId = String(formData.get("commentId") ?? "");
  const body = String(formData.get("body") ?? "");

  const bodyErr = validateCommentBody(body);
  if (bodyErr)
    return { ok: false, error: "입력값을 확인해주세요.", fieldErrors: { body: bodyErr } };

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment || comment.deletedAt)
    return { ok: false, error: "댓글을 찾을 수 없습니다." };
  if (comment.authorId !== user.id)
    return { ok: false, error: "본인 댓글만 수정할 수 있습니다." };

  await prisma.comment.update({
    where: { id: commentId },
    data: { body: body.trim() },
  });

  if (comment.lessonRef) revalidateForLesson(comment.lessonRef);
  if (comment.postId) revalidatePath(`/community/${comment.postId}`);

  return { ok: true };
}

// ─── 댓글 삭제 (soft) ──────────────────────────────────────
export async function deleteCommentAction(commentId: string): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment || comment.deletedAt)
    return { ok: false, error: "댓글을 찾을 수 없습니다." };
  if (comment.authorId !== user.id)
    return { ok: false, error: "본인 댓글만 삭제할 수 있습니다." };

  if (comment.postId) {
    await prisma.$transaction([
      prisma.comment.update({
        where: { id: commentId },
        data: { deletedAt: new Date() },
      }),
      prisma.post.update({
        where: { id: comment.postId },
        data: { commentCount: { decrement: 1 } },
      }),
    ]);
    revalidatePath(`/community/${comment.postId}`);
  } else {
    await prisma.comment.update({
      where: { id: commentId },
      data: { deletedAt: new Date() },
    });
    if (comment.lessonRef) revalidateForLesson(comment.lessonRef);
  }

  return { ok: true };
}

// ─── 댓글 신고 ─────────────────────────────────────────────
export async function reportCommentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const commentId = String(formData.get("commentId") ?? "");
  const reason = validateReportReason(String(formData.get("reason") ?? ""));
  if (!reason) return { ok: false, error: "신고 사유를 선택해주세요." };

  const detail = String(formData.get("detail") ?? "");
  const detailErr = validateReportDetail(reason, detail);
  if (detailErr)
    return { ok: false, error: "입력값을 확인해주세요.", fieldErrors: { detail: detailErr } };

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment || comment.deletedAt)
    return { ok: false, error: "댓글을 찾을 수 없습니다." };
  if (comment.authorId === user.id)
    return { ok: false, error: "본인의 댓글은 신고할 수 없습니다." };

  try {
    await prisma.commentReport.create({
      data: {
        commentId,
        reporterId: user.id,
        reason,
        detail: reason === "other" ? detail.trim() : null,
      },
    });
  } catch (e: unknown) {
    // unique 위배 = 이미 신고했음
    if (typeof e === "object" && e !== null && "code" in e && (e as { code: string }).code === "P2002") {
      return { ok: false, error: "이미 신고하신 댓글입니다." };
    }
    throw e;
  }

  return { ok: true };
}
