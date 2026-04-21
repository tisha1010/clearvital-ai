import { useMemo, useState } from "react";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import GlassCard from "../components/GlassCard";
import ResultCard from "../components/ResultCard";
import Skeleton from "../components/Skeleton";
import TextField from "../components/TextField";
import { markers } from "../data/markers";
import { analyzeReport } from "../lib/api";
import { meterWidthClass } from "../utils/analysis";

function Analyze() {
  const [markerKey, setMarkerKey] = useState("hemoglobin");
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedMarker =
    markers.find((marker) => marker.key === markerKey) || markers[0];
  const numericValue = Number(value);

  const canAnalyze = Number.isFinite(numericValue) && numericValue > 0;
  const meterClass = useMemo(
    () => meterWidthClass(numericValue, selectedMarker.high),
    [numericValue, selectedMarker.high]
  );

  async function handleAnalyze() {
    if (!canAnalyze || isLoading) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await analyzeReport({
        markerKey,
        value: numericValue,
      });

      setResult(response);
    } catch (requestError) {
      setResult(null);
      setError(
        requestError.response?.data?.error ||
          "Unable to analyze this marker right now."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleMarkerChange(event) {
    setMarkerKey(event.target.value);
    setError("");
    setResult(null);
  }

  function handleValueChange(event) {
    setValue(event.target.value);
    setError("");
    setResult(null);
  }

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <div className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs font-medium text-sky-700 dark:text-sky-200">
          Report analysis
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">
          Run a real analysis and save the result
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
          Choose a marker, enter the measured value, and get a saved interpretation generated through the backend.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <GlassCard className="p-6">
          <div className="space-y-5">
            <label className="block">
              <span className="mb-3 block text-sm font-medium text-slate-800 dark:text-slate-100">
                Marker
              </span>
              <select
                value={markerKey}
                onChange={handleMarkerChange}
                className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(56,189,248,0.12)] dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-100"
              >
                {markers.map((marker) => (
                  <option key={marker.key} value={marker.key}>
                    {marker.label}
                  </option>
                ))}
              </select>
            </label>

            <TextField
              label="Measured value"
              value={value}
              onChange={handleValueChange}
              placeholder={selectedMarker.placeholder}
              helper={`Reference: ${selectedMarker.low} - ${selectedMarker.high} ${selectedMarker.unit}`}
            />

            <div className="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/70">
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Unit</span>
                <span>{selectedMarker.unit}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Normal band</span>
                <span>
                  {selectedMarker.low} - {selectedMarker.high}
                </span>
              </div>
            </div>

            <Button onClick={handleAnalyze} disabled={!canAnalyze || isLoading} className="w-full">
              {isLoading ? "Analyzing..." : "Analyze and Save"}
            </Button>

            {error ? (
              <div className="rounded-2xl border border-rose-300/60 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-100">
                {error}
              </div>
            ) : null}
          </div>
        </GlassCard>

        <div>
          {isLoading ? (
            <GlassCard className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-40 rounded-full" />
                <Skeleton className="h-20 rounded-2xl" />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <Skeleton className="h-36 rounded-2xl xl:col-span-2" />
                  <Skeleton className="h-36 rounded-2xl" />
                  <Skeleton className="h-36 rounded-2xl" />
                </div>
              </div>
            </GlassCard>
          ) : result ? (
            <ResultCard
              markerLabel={result.marker || selectedMarker.label}
              value={result.value ?? numericValue}
              unit={result.unit || selectedMarker.unit}
              status={result.status}
              severity={result.severity}
              meterWidthClass={meterClass}
              explanation={result.explanation}
              referenceRange={result.referenceRange}
              note={result.note}
              source={result.source}
            />
          ) : (
            <EmptyState
              icon="A"
              title="No analysis yet"
              description="Enter a marker value and run analysis to get a saved result from the backend."
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Analyze;
