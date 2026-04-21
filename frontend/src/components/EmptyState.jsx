import GlassCard from "./GlassCard";

function EmptyState({ title, description, icon = "+" }) {
  return (
    <GlassCard className="p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-2xl text-slate-500 dark:bg-white/5 dark:text-slate-300">
        {icon}
      </div>
      <h2 className="mt-6 text-2xl font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </GlassCard>
  );
}

export default EmptyState;
