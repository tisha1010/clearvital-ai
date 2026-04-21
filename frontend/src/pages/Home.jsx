import { Link } from "react-router-dom";
import Button from "../components/Button";
import GlassCard from "../components/GlassCard";

const features = [
  {
    title: "Dynamic AI explanations",
    text: "Get clearer summaries for saved report values instead of static text baked into the frontend.",
  },
  {
    title: "Account-based history",
    text: "Keep login, logout, and recent saved analyses tied to the correct user profile in MongoDB.",
  },
  {
    title: "Live health chat",
    text: "Ask follow-up questions about markers, trends, and recent reports inside the same workspace.",
  },
];

function Home() {
  return (
    <div className="space-y-6">
      <GlassCard className="overflow-hidden p-8 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_320px] lg:items-end">
          <div>
            <div className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs font-medium text-sky-700 dark:text-sky-200">
              Medical report workspace
            </div>
            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-6xl">
              Understand reports faster with cleaner analysis and real AI guidance.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
              Analyze lab markers, save the result to your account, and ask follow-up questions in one simple health dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to="/analyze">
                Open Analyzer
              </Button>
              <Button as={Link} to="/history" variant="secondary">
                Open History
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 dark:border-white/10 dark:bg-slate-950/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">Core flow</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                Analyze, save, ask
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 dark:border-white/10 dark:bg-slate-950/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">Saved history</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                Latest 10 reports
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 dark:border-white/10 dark:bg-slate-950/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">Theme</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
                Light and dark
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <GlassCard key={feature.title} className="p-6">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              {feature.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              {feature.text}
            </p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

export default Home;
