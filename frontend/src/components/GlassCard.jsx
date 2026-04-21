function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-[28px] border border-slate-200/80 bg-white/78 shadow-[0_12px_40px_rgba(148,163,184,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 dark:shadow-[0_16px_50px_rgba(2,8,23,0.28)] ${className}`}
    >
      {children}
    </div>
  );
}

export default GlassCard;
