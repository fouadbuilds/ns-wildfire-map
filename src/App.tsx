import { useEffect, useState } from "react";
import { NS_LOCATIONS } from "./data/locations";
import type { LocationWithRisk } from "./types";
import { fetchWeather } from "./utils/weather";
import { assessRisk } from "./utils/riskScore";
import MapView from "./components/Map";
import AlertBanner from "./components/AlertBanner";
import RiskCard from "./components/RiskCard";
import DetailPanel from "./components/DetailPanel";
import TimeSlider from "./components/TimeSlider";

function App() {
  const [locations, setLocations] = useState<LocationWithRisk[]>(
    NS_LOCATIONS.map((loc) => ({
      ...loc,
      weather: null,
      risk: null,
      loading: true,
      selected: false,
    })),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [panelOpen, setPanelOpen] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    NS_LOCATIONS.forEach(async (loc) => {
      try {
        const weather = await fetchWeather(loc.lat, loc.lng);
        const risk = assessRisk(weather);
        setLocations((prev) =>
          prev.map((l) =>
            l.id === loc.id ? { ...l, weather, risk, loading: false } : l,
          ),
        );
      } catch {
        setLocations((prev) =>
          prev.map((l) => (l.id === loc.id ? { ...l, loading: false } : l)),
        );
      }
    });
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
    setPanelOpen(true);
  };

  const forecastLocations = locations.map((loc) => {
    if (!loc.weather?.forecast || selectedDay === 0) return loc;
    const day = loc.weather.forecast[selectedDay];
    if (!day) return loc;
    const risk = assessRisk({
      temperature: day.temperature,
      humidity: day.humidity,
      windspeed: day.windspeed,
      windDirection: day.windDirection,
      precipitation: day.precipitation,
      forecast: [],
    });
    return { ...loc, risk, weather: { ...loc.weather, ...day } };
  });
  const filtered = forecastLocations.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.region.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#F5F0E8]">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 bg-[#1a1a1a] z-10 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xl">🔥</span>
          <div>
            <h1 className="text-sm font-bold tracking-widest uppercase text-orange-400">
              Firewatch
            </h1>
            <p className="text-[9px] text-white/30 tracking-widest uppercase">
              Nova Scotia
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live
        </div>
      </header>

      {/* Alert Banner */}

      <AlertBanner locations={forecastLocations} />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <aside className="w-64 shrink-0 flex flex-col bg-white border-r border-black/5 overflow-hidden z-10 shadow-sm">
          <div className="px-3 py-3 border-b border-black/5">
            <input
              type="text"
              placeholder="Search communities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
            />
          </div>
          <div className="px-4 py-2 text-[10px] text-gray-400 uppercase tracking-widest border-b border-black/5">
            {filtered.length} communities
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((loc) => (
                <RiskCard
                  key={loc.id}
                  location={loc}
                  selected={selectedId === loc.id}
                  onSelect={handleSelect}
                />
              ))}
          </div>
        </aside>

        {/* Map */}
        <main className="flex-1 relative isolate">
          <MapView
            locations={forecastLocations}
            selectedId={selectedId}
            onSelect={handleSelect}
          />

          {/* Time Slider */}
          {locations.some(
            (l) => l.weather?.forecast && l.weather.forecast.length > 1,
          ) && (
            <TimeSlider
              forecast={
                locations.find((l) => l.weather?.forecast)?.weather?.forecast ??
                []
              }
              selectedDay={selectedDay}
              onDayChange={setSelectedDay}
            />
          )}
        </main>

        {/* Toggle arrow when panel is closed */}
        {!panelOpen && (
          <button
            onClick={() => setPanelOpen(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white border border-black/10 rounded-l-lg px-1.5 py-3 shadow-md hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-400 text-xs">←</span>
          </button>
        )}

        {/* Right Detail Panel */}
        {panelOpen && (
          <DetailPanel
            location={
              forecastLocations.find((l) => l.id === selectedId) ?? null
            }
            locations={forecastLocations}
            onClose={() => setPanelOpen(false)}
            onSelect={handleSelect}
          />
        )}
      </div>
    </div>
  );
}

export default App;
