import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Container from "./Container";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Analyze", to: "/analyze" },
  { label: "History", to: "/history" },
];

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleLogout() {
    await logout();
    setIsMenuOpen(false);
    navigate("/");
  }

  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 md:px-6 xl:px-8">
      <Container className="xl:max-w-6xl">
        <nav className="flex items-center justify-between rounded-[24px] border border-slate-200/80 bg-white/80 px-4 py-3 shadow-[0_10px_30px_rgba(148,163,184,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_12px_35px_rgba(2,8,23,0.28)]">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-semibold text-white">
              MR
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">
                MedExplain AI
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Health report clarity
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-2 text-sm transition ${
                    isActive
                      ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/6 dark:hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((current) => !current)}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-2 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/8"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-semibold text-white">
                    {initial}
                  </div>
                  <span className="hidden text-sm font-medium text-slate-900 dark:text-white sm:block">
                    {user.name}
                  </span>
                </button>

                {isMenuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+12px)] w-64 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-[0_18px_48px_rgba(148,163,184,0.22)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/95 dark:shadow-[0_18px_48px_rgba(2,8,23,0.32)]">
                    <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-white/10">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-semibold text-white">
                        {initial}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-4 w-full rounded-2xl border border-rose-300/60 bg-rose-50 px-4 py-3 text-left text-sm font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-100 dark:hover:bg-rose-500/15"
                    >
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
}

export default Navbar;
