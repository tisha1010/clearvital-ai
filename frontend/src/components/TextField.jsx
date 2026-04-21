function TextField({ label, helper, className = "", ...props }) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-3 block text-sm font-medium text-slate-800 dark:text-slate-100">{label}</span>
      ) : null}
      <input
        className={`w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.12)] dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder:text-slate-500 ${className}`}
        {...props}
      />
      {helper ? <span className="mt-2 block text-xs text-slate-500 dark:text-slate-400">{helper}</span> : null}
    </label>
  );
}

export default TextField;
