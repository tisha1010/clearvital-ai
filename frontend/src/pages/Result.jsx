import { Link } from "react-router-dom";
import Button from "../components/Button";
import GlassCard from "../components/GlassCard";

function Result() {
  return (
    <GlassCard className="p-8 md:p-10">
      <div className="max-w-3xl">
        <div className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-sky-700 dark:text-sky-200">
          Result View
        </div>
        <h1 className="mt-6 text-4xl font-semibold text-slate-900 dark:text-white md:text-5xl">
          The main analyzer now handles the core result experience.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-500 dark:text-slate-400">
          This route is ready for a future expanded result page with charts, rich summaries, and clinician questions.
        </p>
        <Button as={Link} to="/analyze" className="mt-8">
          Go to Analyzer
        </Button>
      </div>
    </GlassCard>
  );
}

export default Result;
