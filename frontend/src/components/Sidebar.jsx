import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Overview" },
  { to: "/analyze", label: "Analyze" },
  { to: "/history", label: "History" },
  { to: "/login", label: "Access" },
];

function Sidebar() {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-28 rounded-[28px] border border-slate-200/80 bg-white/70 p-4 shadow-[0_20px_60px_rgba(148,163,184,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[0_20px_60px_rgba(2,8,23,0.3)]">
        <p className="px-3 pb-3 text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-500">
          Workspace
        </p>
        <nav className="space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-2xl px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-gradient-to-r from-sky-500/15 to-indigo-500/15 text-slate-950 dark:text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
