"use client";

const AREA_COLORS: Record<string, string> = {
  "환경": "bg-green-500",
  "사회": "bg-blue-500",
  "거버넌스": "bg-purple-500",
};

interface AreaTabsProps {
  areas: string[];
  activeArea: string;
  onSelect: (area: string) => void;
  areaCounts: Record<string, { answered: number; total: number }>;
}

export default function AreaTabs({ areas, activeArea, onSelect, areaCounts }: AreaTabsProps) {
  return (
    <div className="flex gap-2">
      {areas.map((area) => {
        const isActive = area === activeArea;
        const counts = areaCounts[area];
        return (
          <button
            key={area}
            onClick={() => onSelect(area)}
            className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
              isActive
                ? `${AREA_COLORS[area]} text-white shadow-md`
                : `bg-white text-gray-600 border border-gray-200 hover:border-gray-300`
            }`}
          >
            {area}
            {counts && (
              <span className={`ml-2 text-xs ${isActive ? "text-white/80" : "text-gray-400"}`}>
                {counts.answered}/{counts.total}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
