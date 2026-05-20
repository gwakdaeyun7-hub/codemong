// 커뮤니티/댓글/좋아요 공통 타입.
// Prisma 모델을 직접 노출하지 않고, view-friendly 형태로 변환해서 클라이언트에 넘긴다.

export type PostCategory = "question" | "free";

export type CommentNode = {
  id: string;
  body: string;
  authorId: string;
  authorNickname: string;
  authorAvatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  likeCount: number;
  likedByMe: boolean;
  isMine: boolean;
  parentId: string | null;
  replies: CommentNode[]; // 답글은 1-depth 까지만 채워짐 (그 이상은 항상 빈 배열)
};

export type PostListItem = {
  id: string;
  category: PostCategory;
  title: string;
  excerpt: string; // body 앞부분 미리보기 (목록용)
  authorId: string;
  authorNickname: string;
  authorAvatarUrl: string | null;
  createdAt: Date;
  resolved: boolean;
  likeCount: number;
  commentCount: number;
};

export type PostDetail = Omit<PostListItem, "excerpt"> & {
  body: string;
  updatedAt: Date;
  likedByMe: boolean;
  isMine: boolean;
};

// 마이페이지 — 좋아요한 강의/글 결과 항목
export type LikedLessonItem = {
  lessonRef: string;
  courseId: string;
  lessonId: string;
  title: string; // lesson-plan 에서 매칭한 title (없으면 lessonRef 그대로)
  likedAt: Date;
};

export type LikedPostItem = PostListItem & {
  likedAt: Date;
};

// 신고 reason 라벨
export const REPORT_REASONS = [
  { value: "spam", label: "스팸/광고" },
  { value: "abuse", label: "욕설/비방" },
  { value: "off-topic", label: "주제와 무관함" },
  { value: "other", label: "기타" },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]["value"];
