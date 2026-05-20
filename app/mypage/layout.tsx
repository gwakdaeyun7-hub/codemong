import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { TopNav } from "@/components/top-nav";
import { MypageSidebar } from "@/components/mypage/mypage-sidebar";
import { getCurrentUser } from "@/lib/auth/get-user";

export default async function MypageLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 미들웨어가 막아주긴 하지만 layout에서도 한 번 더 검사 (이중 안전망 + 타입 좁히기).
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/mypage");
  }

  return (
    <>
      <TopNav active="mypage" />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
          <MypageSidebar />
          <div>{children}</div>
        </div>
      </main>
    </>
  );
}
