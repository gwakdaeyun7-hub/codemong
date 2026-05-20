// community 폴더 lucide 아이콘 화이트리스트.
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Flag,
  HelpCircle,
  Loader2,
  MessageSquare,
  Pencil,
  PenSquare,
  Plus,
  Trash2,
} from "lucide-react";

export const communityIcons = {
  alert: AlertCircle,
  arrowLeft: ArrowLeft,
  check: CheckCircle2,
  chevronRight: ChevronRight,
  flag: Flag,
  helpCircle: HelpCircle,
  loader: Loader2,
  messageSquare: MessageSquare,
  pencil: Pencil,
  penSquare: PenSquare,
  plus: Plus,
  trash: Trash2,
};

export type CommunityIconName = keyof typeof communityIcons;
