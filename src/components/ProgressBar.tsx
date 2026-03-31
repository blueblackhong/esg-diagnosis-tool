"use client";

interface ProgressBarProps {
  answered: number;
  total: number;
}

export default function ProgressBar({ answered, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
        {pct}% ({answered}/{total})
      </span>
    </div>
  );
}
