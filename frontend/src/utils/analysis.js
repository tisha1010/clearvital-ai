export function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function meterWidthClass(value, high) {
  if (!Number.isFinite(value) || !Number.isFinite(high) || high <= 0) {
    return "w-[8%]";
  }

  const ratio = Math.max(0.08, Math.min(value / (high * 1.35), 1));

  if (ratio <= 0.12) return "w-[12%]";
  if (ratio <= 0.18) return "w-[18%]";
  if (ratio <= 0.24) return "w-[24%]";
  if (ratio <= 0.30) return "w-[30%]";
  if (ratio <= 0.36) return "w-[36%]";
  if (ratio <= 0.42) return "w-[42%]";
  if (ratio <= 0.48) return "w-[48%]";
  if (ratio <= 0.54) return "w-[54%]";
  if (ratio <= 0.60) return "w-[60%]";
  if (ratio <= 0.66) return "w-[66%]";
  if (ratio <= 0.72) return "w-[72%]";
  if (ratio <= 0.78) return "w-[78%]";
  if (ratio <= 0.84) return "w-[84%]";
  if (ratio <= 0.90) return "w-[90%]";
  return "w-full";
}
