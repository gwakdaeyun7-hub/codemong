"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";

import type { FieldErrors } from "./validation";
import {
  validatePostBody,
  validatePostTitle,
  validateReportDetail,
  validateReportReason,
} from "./validation";
import type { PostCategory } from "./types";

export type ActionState =
  | { ok: true; data?: { postId?: string } }
  | { ok: false; error: string; fieldErrors?: FieldErrors }
  | null;

function asCategory(value: string): PostCategory | null {
  return value === "question" || value === "free" ? value : null;
}

// ─── 게시글 작성 ─────────────────────────────────────────────
export async function createPostAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const category = asCategory(String(formData.get("category") ?? ""));
  const title = String(formData.get("title") ?? "");
  const body = String(formData.get("body") ?? "");

  if (!category) return { ok: false, error: "카테고리를 선택해주세요." };

  const fieldErrors: FieldErrors = {};
  const titleErr = validatePostTitle(title);
  if (titleErr) fieldErrors.title = titleErr;
  const bodyErr = validatePostBody(body);
  if (bodyErr) fieldErrors.body = bodyErr;
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "입력값을 확인해주세요.", fieldErrors };
  }

  const post = await prisma.post.create({
    data: {
      authorId: user.id,
      authorNickname: user.nickname,
      authorAvatarUrl: user.avatarUrl,
      category,
      title: title.trim(),
      body: body.trim(),
    },
  });

  revalidatePath("/community");
  redirect(`/community/${post.id}`);
}

// ─── 게시글 수정 ─────────────────────────────────────────────
export async function updatePostAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const postId = String(formData.get("postId") ?? "");
  const title = String(formData.get("title") ?? "");
  const body = String(formData.get("body") ?? "");

  const fieldErrors: FieldErrors = {};
  const titleErr = validatePostTitle(title);
  if (titleErr) fieldErrors.title = titleErr;
  const bodyErr = validatePostBody(body);
  if (bodyErr) fieldErrors.body = bodyErr;
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "입력값을 확인해주세요.", fieldErrors };
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.deletedAt)
    return { ok: false, error: "게시글을 찾을 수 없습니다." };
  if (post.authorId !== user.id)
    return { ok: false, error: "본인 글만 수정할 수 있습니다." };

  await prisma.post.update({
    where: { id: postId },
    data: { title: title.trim(), body: body.trim() },
  });

  revalidatePath("/community");
  revalidatePath(`/community/${postId}`);
  redirect(`/community/${postId}`);
}

// ─── 게시글 삭제 (soft) ──────────────────────────────────────
export async function deletePostAction(postId: string): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.deletedAt)
    return { ok: false, error: "게시글을 찾을 수 없습니다." };
  if (post.authorId !== user.id)
    return { ok: false, error: "본인 글만 삭제할 수 있습니다." };

  await prisma.post.update({
    where: { id: postId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/community");
  return { ok: true };
}

// ─── Q&A 해결 토글 (작성자만) ─────────────────────────────
export async function toggleResolvedAction(postId: string): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.deletedAt)
    return { ok: false, error: "게시글을 찾을 수 없습니다." };
  if (post.authorId !== user.id)
    return { ok: false, error: "본인 글만 해결 표시할 수 있습니다." };
  if (post.category !== "question")
    return { ok: false, error: "Q&A 카테고리만 해결 표시할 수 있습니다." };

  await prisma.post.update({
    where: { id: postId },
    data: { resolved: !post.resolved },
  });

  revalidatePath("/community");
  revalidatePath(`/community/${postId}`);
  return { ok: true };
}

// ─── 게시글 신고 ─────────────────────────────────────────────
export async function reportPostAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const postId = String(formData.get("postId") ?? "");
  const reason = validateReportReason(String(formData.get("reason") ?? ""));
  if (!reason) return { ok: false, error: "신고 사유를 선택해주세요." };

  const detail = String(formData.get("detail") ?? "");
  const detailErr = validateReportDetail(reason, detail);
  if (detailErr)
    return { ok: false, error: "입력값을 확인해주세요.", fieldErrors: { detail: detailErr } };

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.deletedAt)
    return { ok: false, error: "게시글을 찾을 수 없습니다." };
  if (post.authorId === user.id)
    return { ok: false, error: "본인의 글은 신고할 수 없습니다." };

  try {
    await prisma.postReport.create({
      data: {
        postId,
        reporterId: user.id,
        reason,
        detail: reason === "other" ? detail.trim() : null,
      },
    });
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "code" in e && (e as { code: string }).code === "P2002") {
      return { ok: false, error: "이미 신고하신 글입니다." };
    }
    throw e;
  }

  return { ok: true };
}
