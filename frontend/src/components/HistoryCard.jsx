import GlassCard from "./GlassCard";
import StatusBadge from "./StatusBadge";

function HistoryCard({ marker, value, unit, status, severity, date, explanation }) {
  return (
    <GlassCard className="group p-5 transition duration-200 hover:-translate-y-1 hover:border-sky-400/20 hover:shadow-[0_18px_45px_rgba(59,130,246,0.08)] dark:hover:bg-white/[0.05]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-500">
            {date}
          </p>
          <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">{marker}</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
            {value} {unit}
          </p>
        </div>
        <StatusBadge severity={severity}>{status}</StatusBadge>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">{explanation}</p>
    </GlassCard>
  );
}

export default HistoryCard;
