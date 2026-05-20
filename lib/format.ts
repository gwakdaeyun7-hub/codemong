// 작은 포맷 헬퍼.
// 별도 의존성 없이 native Intl + 산술만 사용.

// "방금 전 / N분 전 / N시간 전 / N일 전" 같은 한국어 상대 시간.
export function timeAgoKo(date: Date | string): string {
  const target = typeof date === "string" ? new Date(date) : date;
  const sec = Math.max(0, Math.floor((Date.now() - target.getTime()) / 1000));
  if (sec < 60) return "방금 전";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}일 전`;
  // 일주일 이후는 YYYY.MM.DD
  return target
    .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    .replace(/\.\s/g, ".")
    .replace(/\.$/, "");
}

// 정수 큰 수에 천단위 콤마 (좋아요/조회수)
export function fmtCount(n: number): string {
  return n.toLocaleString("ko-KR");
}
