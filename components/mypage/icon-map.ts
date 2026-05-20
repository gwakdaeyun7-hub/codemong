// mypage 폴더 lucide 아이콘 화이트리스트.
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  Flame,
  Heart,
  LogOut,
  Mail,
  MessageSquare,
  PenSquare,
  Settings,
  Sparkles,
  Target,
  User,
} from "lucide-react";

export const mypageIcons = {
  alert: AlertCircle,
  warning: AlertTriangle,
  award: Award,
  book: BookOpen,
  calendar: Calendar,
  chevronRight: ChevronRight,
  flame: Flame,
  heart: Heart,
  logOut: LogOut,
  mail: Mail,
  messageSquare: MessageSquare,
  penSquare: PenSquare,
  settings: Settings,
  sparkles: Sparkles,
  target: Target,
  user: User,
};

export type MypageIconName = keyof typeof mypageIcons;
