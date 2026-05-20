import Link from "next/link";

import { cn } from "@/lib/utils";
import { communityIcons } from "./icon-map";

const TABS = [
  { value: "all", label: "전체", icon: communityIcons.messageSquare },
  { value: "question", label: "Q&A", icon: communityIcons.helpCircle },
  { value: "free", label: "자유", icon: communityIcons.penSquare },
] as const;

export function CategoryTabs({ active }: { active: "all" | "question" | "free" }) {
  return (
    <nav
      aria-label="커뮤니티 카테고리"
      className="flex gap-1 overflow-x-auto"
    >
      {TABS.map((tab) => {
        const isActive = tab.value === active;
        const href =
          tab.value === "all" ? "/community" : `/community?category=${tab.value}`;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.value}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition",
              isActive
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50",
            )}
          >
            <Icon className="size-4" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
