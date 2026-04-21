import { useState } from "react";
import { Navigate } from "react-router-dom";
import Button from "../components/Button";
import GlassCard from "../components/GlassCard";
import TextField from "../components/TextField";
import { useAuth } from "../context/AuthContext";

const benefits = [
  "Real account stored in MongoDB",
  "Login and logout events saved",
  "History linked to the right user",
];

function Login() {
  const { isAuthenticated, isChecking, login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isChecking && isAuthenticated) {
    return <Navigate to="/history" replace />;
  }

  function updateField(field) {
    return (event) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const response =
        mode === "login" ? await login(form) : await register(form);
      setMessage(response.message);
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          "Unable to complete the request right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_minmax(0,420px)]">
      <GlassCard className="p-8 md:p-10">
        <div className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs font-medium text-sky-700 dark:text-sky-200">
          Account access
        </div>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">
          Keep saved reports connected to the right account
        </h1>
        <p className="mt-4 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300">
          Sign in to save analyses, track history, and keep your report activity tied to one profile.
        </p>

        <div className="mt-8 grid gap-3">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="rounded-3xl border border-slate-200/80 bg-white/80 px-4 py-4 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-300"
            >
              {benefit}
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-8">
        <div className="inline-flex rounded-full border border-slate-200/80 bg-slate-100/90 p-1 dark:border-white/10 dark:bg-white/5">
          {["login", "register"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`rounded-2xl px-5 py-2.5 text-sm transition ${
                mode === item
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {item === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {mode === "register" ? (
            <TextField
              label="Full name"
              value={form.name}
              onChange={updateField("name")}
              placeholder="Your name"
            />
          ) : null}

          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={updateField("email")}
            placeholder="you@example.com"
          />

          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={updateField("password")}
            placeholder="Minimum 6 characters"
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create account"}
          </Button>
        </form>

        {message ? (
          <div className="mt-5 rounded-2xl border border-emerald-300/60 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-100">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mt-5 rounded-2xl border border-rose-300/60 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-100">
            {error}
          </div>
        ) : null}
      </GlassCard>
    </div>
  );
}

export default Login;
