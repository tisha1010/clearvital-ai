function Button({
  children,
  variant = "primary",
  className = "",
  as: Component = "button",
  ...props
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white shadow-[0_14px_34px_rgba(59,130,246,0.24)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(59,130,246,0.3)]",
    secondary:
      "border border-slate-200/80 bg-white/85 text-slate-700 shadow-sm hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10",
    ghost:
      "border border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/6 dark:hover:text-white",
  };

  const baseClassName =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/20 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <Component className={`${baseClassName} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Component>
  );
}

export default Button;
