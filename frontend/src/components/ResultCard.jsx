import GlassCard from "./GlassCard";
import StatusBadge from "./StatusBadge";

function ResultCard({
  markerLabel,
  value,
  unit,
  status,
  severity,
  meterWidthClass,
  explanation,
  referenceRange,
  note,
  source,
}) {
  return (
    <GlassCard className="p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{markerLabel}</p>
            <div className="mt-3 flex items-end gap-3">
              <p className="text-5xl font-semibold text-slate-900 dark:text-white">{value}</p>
              <p className="pb-2 text-sm text-slate-500 dark:text-slate-400">{unit}</p>
            </div>
          </div>
          <StatusBadge severity={severity}>{status}</StatusBadge>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-slate-500 dark:text-slate-500">
            <span>Low</span>
            <span>Normal band</span>
            <span>High</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-white/8">
            <div
              className={`h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-amber-300 ${meterWidthClass}`}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-white/8 dark:bg-slate-950/80 xl:col-span-2">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-500">
              Explanation
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{explanation}</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-white/8 dark:bg-slate-950/80">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Reference Range
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{referenceRange}</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-white/8 dark:bg-slate-950/80">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Source
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{source}</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-white/8 dark:bg-slate-950/80 md:col-span-2 xl:col-span-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Notes
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{note}</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default ResultCard;
