import type { LocationWithRisk } from "../types";

interface Props {
  locations: LocationWithRisk[];
  onSelect?: (id: string) => void;
  onShowRoute?: (id: string) => void;
}

export default function AlertBanner({
  locations,
  onSelect,
  onShowRoute,
}: Props) {
  const loaded = locations.filter((l) => l.risk !== null);
  const extreme = loaded.filter(
    (l) => l.risk!.level === "Extreme" || l.risk!.level === "Very High",
  );
  const high = loaded.filter((l) => l.risk!.level === "High");

  if (extreme.length > 0) {
    const first = extreme[0];
    return (
      <div className="bg-red-600 px-5 py-3 flex items-center gap-3 shrink-0">
        <span className="animate-pulse">🔴</span>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white text-sm">
              Critical Fire Conditions
            </span>
            <span className="text-red-100 text-xs ml-2">
              {extreme.map((l) => l.name).join(", ")} — Take action now
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => onShowRoute?.(first.id)}
              className="bg-white text-red-600 px-3 py-1 rounded-md font-semibold text-sm shadow-sm hover:opacity-95"
            >
              Evacuation Plan
            </button>
            <a
              href="tel:911"
              className="bg-white text-red-600 px-3 py-1 rounded-md font-semibold text-sm shadow-sm hover:opacity-95"
            >
              Call 911
            </a>
            <button
              onClick={() => onSelect?.(first.id)}
              className="bg-white/20 text-white px-3 py-1 rounded-md font-semibold text-sm border border-white/30 hover:bg-white/10"
            >
              Shelter Info
            </button>
          </div>
        </div>
        <span className="text-red-200 text-[10px] uppercase tracking-widest shrink-0">
          {new Date().toLocaleTimeString("en-CA", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    );
  }

  if (high.length > 0) {
    return (
      <div className="bg-orange-500 px-5 py-2.5 flex items-center gap-3 shrink-0">
        <span>🟠</span>
        <div className="flex-1">
          <span className="font-bold text-white text-sm">
            Watch Conditions Active
          </span>
          <span className="text-orange-100 text-xs ml-2">
            {high.map((l) => l.name).join(", ")} at High risk — Stay alert
          </span>
        </div>
        <span className="text-orange-200 text-[10px] uppercase tracking-widest shrink-0">
          {new Date().toLocaleTimeString("en-CA", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border-b border-green-100 px-5 py-2 flex items-center gap-3 shrink-0">
      <span>🟢</span>
      <p className="text-green-700 text-xs font-medium">
        All Clear — No critical fire conditions in Nova Scotia right now
      </p>
      <span className="ml-auto text-green-400 text-[10px] uppercase tracking-widest">
        {new Date().toLocaleTimeString("en-CA", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
}
