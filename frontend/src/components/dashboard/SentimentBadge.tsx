export function SentimentBadge({ label, score }: { label: string; score?: number }) {
  const colors =
    label === "positive"
      ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/40"
      : label === "negative"
      ? "bg-rose-500/20 text-rose-200 border-rose-400/40"
      : "bg-slate-700/40 text-slate-200 border-slate-600/40";

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border ${colors}`}>
      <span className="h-2 w-2 rounded-full bg-current" />
      {label}
      {score !== undefined && <span className="text-slate-400">({score.toFixed(2)})</span>}
    </span>
  );
}
