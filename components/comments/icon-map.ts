// comments 폴더 lucide 아이콘 화이트리스트.
import {
  AlertCircle,
  Check,
  Flag,
  Heart,
  Loader2,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  Pencil,
  Reply,
  Trash2,
  X,
} from "lucide-react";

export const commentsIcons = {
  alert: AlertCircle,
  check: Check,
  flag: Flag,
  heart: Heart,
  loader: Loader2,
  messageCircle: MessageCircle,
  messageSquare: MessageSquare,
  more: MoreVertical,
  pencil: Pencil,
  reply: Reply,
  trash: Trash2,
  x: X,
};

export type CommentsIconName = keyof typeof commentsIcons;
