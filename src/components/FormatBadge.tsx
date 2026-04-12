const formatColors: Record<string, string> = {
  MP4:   "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-400",
  MP3:   "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-400",
  WEBM:  "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950/40 dark:border-orange-800 dark:text-orange-400",
  "720p":"bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400",
  "1080p":"bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-400",
  "4K":  "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400",
};

const FormatBadge = ({ label }: { label: string }) => {
  const color = formatColors[label] || "bg-secondary border-border text-secondary-foreground";
  return (
    <span className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-transform hover:scale-105 ${color}`}>
      {label}
    </span>
  );
};

export default FormatBadge;
