const variants = {
  critical:
    "border border-rose-300/60 bg-rose-50 text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/15 dark:text-rose-200",
  warning:
    "border border-amber-300/60 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/15 dark:text-amber-200",
  good:
    "border border-emerald-300/60 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/15 dark:text-emerald-200",
  elevated:
    "border border-sky-300/60 bg-sky-50 text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/15 dark:text-sky-200",
  neutral:
    "border border-slate-200/80 bg-slate-100 text-slate-600 dark:border-white/10 dark:bg-white/8 dark:text-slate-300",
};

function StatusBadge({ children, severity = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-medium ${variants[severity] || variants.neutral} ${className}`}
    >
      {children}
    </span>
  );
}

export default StatusBadge;
