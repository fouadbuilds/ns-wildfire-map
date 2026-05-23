import type { LocationWithRisk } from "../types";

interface Props {
  location: LocationWithRisk;
  selected: boolean;
  onSelect: (id: string) => void;
  minutes?: number | null;
}

export default function RiskCard({
  location,
  selected,
  onSelect,
  minutes,
}: Props) {
  if (location.loading) {
    return (
      <div className="px-4 py-3 border-b border-black/5 animate-pulse">
        <div className="h-3.5 bg-black/10 rounded w-1/2 mb-2" />
        <div className="h-2.5 bg-black/5 rounded w-1/3" />
      </div>
    );
  }

  if (!location.risk) {
    return (
      <div className="px-4 py-3 border-b border-black/5">
        <p className="text-xs text-gray-300">{location.name}</p>
      </div>
    );
  }

  const { risk } = location;

  return (
    <div
      onClick={() => onSelect(location.id)}
      className={`px-4 py-3 border-b border-black/5 cursor-pointer transition-all duration-150
        ${selected ? "bg-orange-50 border-l-2 border-l-orange-400" : "hover:bg-black/5"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {location.name}
          </p>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
            {location.region}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{ backgroundColor: `${risk.color}20`, color: risk.color }}
          >
            {risk.level}
          </span>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-gray-400 w-6 text-right">
              {risk.score}
            </span>
            {minutes ? (
              <span
                className={`text-[10px] font-semibold ${minutes <= 30 ? "text-orange-600" : "text-gray-400"}`}
              >
                ~{minutes}m
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-2 w-full bg-black/5 rounded-full h-0.5">
        <div
          className="h-0.5 rounded-full transition-all duration-700"
          style={{ width: `${risk.score}%`, backgroundColor: risk.color }}
        />
      </div>
    </div>
  );
}
