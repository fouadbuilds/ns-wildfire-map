import { useEffect, useMemo, useState } from "react";
import type { ForecastDay, LocationWithRisk } from "../types";
import { assessRisk } from "../utils/riskScore";
import TimeSlider from "./TimeSlider";

interface Props {
  location: LocationWithRisk | null;
  locations: LocationWithRisk[];
  onClose: () => void;
  onSelect: (id: string) => void;
  forecast: ForecastDay[];
  selectedDay: number;
  onDayChange: (day: number) => void;
}

const advisories: Record<string, string> = {
  Extreme:
    "Evacuate immediately if ordered. Avoid all outdoor activity. Follow emergency alerts closely.",
  "Very High":
    "Avoid all outdoor burning. Stay alert to emergency notifications. Prepare go-bag.",
  High: "No campfires or outdoor burning. Monitor local fire updates closely.",
  Moderate:
    "Exercise caution with any open flame outdoors. Conditions can change quickly.",
  Low: "Conditions are currently safe. Stay aware of forecast changes.",
};

export const evacuationInfo: Record<
  string,
  { route: string; shelter: string; time: number }
> = {
  tantallon: {
    route: "Hwy 103 East → Halifax",
    shelter: "Mainland Common Recreation Centre",
    time: 25,
  },
  "hammonds-plains": {
    route: "Hwy 14 East → Halifax",
    shelter: "Sackville Sports Stadium",
    time: 30,
  },
  shelburne: {
    route: "Hwy 103 North → Bridgewater",
    shelter: "Bridgewater Curling Club",
    time: 55,
  },
  barrington: {
    route: "Hwy 309 North → Shelburne",
    shelter: "Shelburne County Arena",
    time: 40,
  },
  inverness: {
    route: "Hwy 105 East → Sydney",
    shelter: "Cape Breton University",
    time: 90,
  },
  baddeck: {
    route: "Hwy 105 East → Sydney",
    shelter: "Cape Breton University",
    time: 60,
  },
  springhill: {
    route: "Hwy 104 West → Amherst",
    shelter: "Amherst Stadium",
    time: 25,
  },
};

export const defaultEvac = {
  route: "Follow Trans-Canada Hwy to nearest urban centre",
  shelter: "Nearest municipal arena or community centre",
  time: 45,
};

function NSummary({
  locations,
  onSelect,
}: {
  locations: LocationWithRisk[];
  onSelect: (id: string) => void;
}) {
  const loaded = locations.filter((l) => l.risk !== null);
  const highRisk = loaded.filter((l) => l.risk!.score >= 60);
  const sorted = [...loaded]
    .sort((a, b) => b.risk!.score - a.risk!.score)
    .slice(0, 5);

  const counts = {
    Extreme: loaded.filter((l) => l.risk!.level === "Extreme").length,
    "Very High": loaded.filter((l) => l.risk!.level === "Very High").length,
    High: loaded.filter((l) => l.risk!.level === "High").length,
    Moderate: loaded.filter((l) => l.risk!.level === "Moderate").length,
    Low: loaded.filter((l) => l.risk!.level === "Low").length,
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-5 py-5 border-b border-black/5">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
          Province Overview
        </p>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Nova Scotia</h2>
        <p className="text-xs text-gray-400">
          {loaded.length} communities monitored
        </p>

        {highRisk.length > 0 && (
          <div className="mt-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-orange-600">
              ⚠️ {highRisk.length}{" "}
              {highRisk.length === 1 ? "community" : "communities"} at High risk
              or above
            </p>
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-b border-black/5">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">
          Risk Distribution
        </p>
        <div className="flex flex-col gap-2">
          {Object.entries(counts).map(([level, count]) => {
            const colors: Record<string, string> = {
              Extreme: "#9333EA",
              "Very High": "#EF4444",
              High: "#F97316",
              Moderate: "#EAB308",
              Low: "#22C55E",
            };
            return (
              <div key={level} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-20">{level}</span>
                <div className="flex-1 bg-black/5 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: loaded.length
                        ? `${(count / loaded.length) * 100}%`
                        : "0%",
                      backgroundColor: colors[level],
                    }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-4 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">
          Highest Risk
        </p>
        <div className="flex flex-col gap-1">
          {sorted.map((loc, i) => (
            <button
              key={loc.id}
              onClick={() => onSelect(loc.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/5 transition-colors text-left w-full"
            >
              <span className="text-xs text-gray-300 w-4">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {loc.name}
                </p>
                <p className="text-[10px] text-gray-400">{loc.region}</p>
              </div>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                style={{
                  backgroundColor: `${loc.risk!.color}20`,
                  color: loc.risk!.color,
                }}
              >
                {loc.risk!.score}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 border-t border-black/5 pb-8">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">
          🚒 Emergency Contacts
        </p>
        <div className="flex flex-col gap-2">
          <div className="bg-red-50 rounded-xl px-4 py-3">
            <p className="text-[10px] text-red-400 uppercase tracking-widest mb-0.5">
              Active Fire
            </p>
            <p className="text-sm font-bold text-gray-800">Call 911</p>
          </div>
          <div className="bg-gray-50 rounded-xl px-4 py-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">
              NS Forestry Fire Line
            </p>
            <p className="text-sm font-medium text-gray-800">1-800-565-2224</p>
            <p className="text-xs text-gray-400">Report wildfires 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DetailPanel({
  location,
  locations,
  onClose,
  onSelect,
  forecast,
  selectedDay,
  onDayChange,
}: Props) {
  const evac = location ? (evacuationInfo[location.id] ?? defaultEvac) : null;
  const [view, setView] = useState<"overview" | "forecast">("overview");

  useEffect(() => {
    setView("overview");
  }, [location?.id]);

  const forecastRisk = useMemo(() => {
    const day = forecast[selectedDay];
    if (!day) return null;
    return assessRisk({
      temperature: day.temperature,
      humidity: day.humidity,
      windspeed: day.windspeed,
      windDirection: day.windDirection,
      precipitation: day.precipitation,
      forecast: [],
    });
  }, [forecast, selectedDay]);

  return (
    <div
      className={`panel-slide-in flex flex-col bg-white border-l border-black/5 shadow-xl z-10 ${
        location ? "w-96" : "w-80"
      }`}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-black/5 shrink-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          {location ? location.name : "NS Overview"}
        </p>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-gray-600 transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>

      {!location ? (
        <NSummary locations={locations} onSelect={onSelect} />
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div
            className="px-5 py-5 border-b border-black/5"
            style={{
              borderLeft: location.risk
                ? `4px solid ${location.risk.color}`
                : undefined,
            }}
          >
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
              {location.region}
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {location.name}
            </h2>

            {location.risk && (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-sm font-bold px-3 py-1.5 rounded-full uppercase tracking-wide"
                    style={{
                      backgroundColor: `${location.risk.color}20`,
                      color: location.risk.color,
                    }}
                  >
                    {location.risk.level} Risk
                  </span>
                  <span
                    className="text-2xl font-black"
                    style={{ color: location.risk.color }}
                  >
                    {location.risk.score}
                    <span className="text-sm font-normal text-gray-400">
                      /100
                    </span>
                  </span>
                </div>

                <div
                  className="rounded-xl px-4 py-3"
                  style={{
                    backgroundColor: `${location.risk.color}10`,
                    borderLeft: `3px solid ${location.risk.color}`,
                  }}
                >
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {advisories[location.risk.level]}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="px-5 py-3 border-b border-black/5 flex gap-2">
            <button
              onClick={() => setView("overview")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                view === "overview"
                  ? "bg-black text-white"
                  : "bg-black/5 text-gray-500 hover:bg-black/10"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setView("forecast")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                view === "forecast"
                  ? "bg-black text-white"
                  : "bg-black/5 text-gray-500 hover:bg-black/10"
              }`}
            >
              Forecast
            </button>
          </div>

          {view === "overview" ? (
            <>
              {evac && (
                <div className="px-5 py-4 border-b border-black/5">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">
                    🚗 If You Need To Leave
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
                      <p className="text-[10px] text-orange-500 uppercase tracking-widest mb-1">
                        Evacuation Route
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {evac.route}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        ~{evac.time} min drive to safety
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                      <p className="text-[10px] text-blue-500 uppercase tracking-widest mb-1">
                        Nearest Shelter
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {evac.shelter}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="px-5 py-4 border-b border-black/5">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">
                  🚒 Emergency
                </p>
                <div className="flex flex-col gap-2">
                  <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-red-400 uppercase tracking-widest mb-0.5">
                        Active Fire
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        Call 911
                      </p>
                    </div>
                    <span className="text-2xl">🆘</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">
                      NS Forestry Fire Line
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      1-800-565-2224
                    </p>
                    <p className="text-xs text-gray-400">
                      Report wildfires 24/7
                    </p>
                  </div>
                </div>
              </div>

              {location.weather && (
                <div className="px-5 py-4 pb-8">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">
                    Current Conditions
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        label: "Temp",
                        value: `${location.weather.temperature}°C`,
                      },
                      {
                        label: "Wind",
                        value: `${location.weather.windspeed} km/h`,
                      },
                      {
                        label: "Humidity",
                        value: `${location.weather.humidity}%`,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl bg-black/3 px-3 py-2"
                      >
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="px-5 py-4 pb-8 space-y-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">
                  Forecast Outlook
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Slide the day selector to preview how conditions shift.
                </p>
              </div>

              {forecastRisk && (
                <div className="rounded-xl border border-black/5 bg-black/3 px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                      Selected Day Risk
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {forecastRisk.level}
                    </p>
                  </div>
                  <span
                    className="text-lg font-black"
                    style={{ color: forecastRisk.color }}
                  >
                    {forecastRisk.score}
                  </span>
                </div>
              )}

              <TimeSlider
                forecast={forecast}
                selectedDay={selectedDay}
                onDayChange={onDayChange}
                embedded
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
