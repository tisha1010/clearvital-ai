import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import GlassCard from "../components/GlassCard";
import HistoryCard from "../components/HistoryCard";
import Skeleton from "../components/Skeleton";
import { fetchReports } from "../lib/api";
import { formatDate } from "../utils/analysis";

function History() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadReports() {
      try {
        const data = await fetchReports();
        if (isMounted) {
          setReports(data);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.error ||
              "Unable to load report history right now."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReports();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs font-medium text-sky-700 dark:text-sky-200">
            History
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">
            Your recent saved reports
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
            Review the latest 10 saved analyses linked to the current account.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-500 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-400">
          Latest 10 records
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, index) => (
            <GlassCard key={index} className="p-5">
              <div className="space-y-4">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-6 w-40 rounded-full" />
                <Skeleton className="h-20 rounded-2xl" />
              </div>
            </GlassCard>
          ))}
        </div>
      ) : null}

      {!isLoading && error ? (
        <GlassCard className="p-6">
          <div className="rounded-2xl border border-rose-300/60 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-100">
            {error}
          </div>
        </GlassCard>
      ) : null}

      {!isLoading && !error && reports.length === 0 ? (
        <EmptyState
          icon="+"
          title="No saved reports yet"
          description="Run an analysis first and it will show up here as part of your recent report history."
        />
      ) : null}

      {!isLoading && !error && reports.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <HistoryCard
              key={report._id}
              marker={report.marker}
              value={report.value}
              unit={report.unit}
              status={report.status}
              severity={report.severity}
              date={formatDate(report.createdAt)}
              explanation={report.explanation}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default History;
