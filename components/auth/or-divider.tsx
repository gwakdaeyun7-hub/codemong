export function OrDivider({ label = "또는" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-xs text-zinc-400">
      <span aria-hidden className="h-px flex-1 bg-zinc-200" />
      {label}
      <span aria-hidden className="h-px flex-1 bg-zinc-200" />
    </div>
  );
}
