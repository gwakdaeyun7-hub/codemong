// auth 폴더 lucide 아이콘 화이트리스트.
// 새 아이콘 추가는 반드시 이 맵을 거치게 한다 (트리쉐이킹 보호 + 일관성).
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";

export const authIcons = {
  alert: AlertCircle,
  arrowRight: ArrowRight,
  check: CheckCircle2,
  eye: Eye,
  eyeOff: EyeOff,
  loader: Loader2,
  lock: Lock,
  mail: Mail,
  user: User,
};

export type AuthIconName = keyof typeof authIcons;
