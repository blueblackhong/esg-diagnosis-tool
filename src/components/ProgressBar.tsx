"use client";

interface ProgressBarProps {
  answered: number;
  total: number;
}

function getBarColor(pct: number): string {
  if (pct >= 100) return "#3b82f6";  // blue-500
  if (pct > 70) return "#22c55e";    // green-500
  if (pct > 50) return "#eab308";    // yellow-500
  if (pct > 20) return "#f97316";    // orange-500
  return "#ef4444";                   // red-500
}

export default function ProgressBar({ answered, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
  const color = getBarColor(pct);

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-medium whitespace-nowrap" style={{ color }}>
        {pct}% ({answered}/{total})
      </span>
    </div>
  );
}
