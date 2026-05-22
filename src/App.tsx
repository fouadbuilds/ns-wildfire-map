import { useEffect, useState } from 'react'
import { NS_LOCATIONS } from './data/locations'
import type { LocationWithRisk } from './types'
import { fetchWeather } from './utils/weather'
import { assessRisk } from './utils/riskScore'
import Map from './components/Map'
import AlertBanner from './components/AlertBanner'
import RiskCard from './components/RiskCard'

function App() {
  const [locations, setLocations] = useState<LocationWithRisk[]>(
    NS_LOCATIONS.map(loc => ({ ...loc, weather: null, risk: null, loading: true, selected: false }))
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    NS_LOCATIONS.forEach(async (loc) => {
      try {
        const weather = await fetchWeather(loc.lat, loc.lng)
        const risk = assessRisk(weather)
        setLocations(prev =>
          prev.map(l => l.id === loc.id ? { ...l, weather, risk, loading: false } : l)
        )
      } catch {
        setLocations(prev =>
          prev.map(l => l.id === loc.id ? { ...l, loading: false } : l)
        )
      }
    })
  }, [])

  const highestRisk = [...locations]
    .filter(l => l.risk !== null)
    .sort((a, b) => (b.risk!.score - a.risk!.score))[0]

  const filtered = locations.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.region.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (id: string) => {
    setSelectedId(prev => prev === id ? null : id)
  }

  return (
    <div className="h-screen w-screen bg-[#0f0f0f] text-white flex flex-col overflow-hidden">

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#0f0f0f] z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🔥</span>
          <div>
            <h1 className="text-base font-bold tracking-widest uppercase text-orange-400">Firewatch</h1>
            <p className="text-[10px] text-white/30 tracking-widest uppercase">Nova Scotia</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live
        </div>
      </header>

      {/* Alert Banner */}
      {highestRisk?.risk && highestRisk.risk.score >= 40 && (
        <AlertBanner location={highestRisk} />
      )}

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-72 shrink-0 flex flex-col border-r border-white/10 bg-[#111111] overflow-hidden">

          {/* Search */}
          <div className="px-3 py-3 border-b border-white/10">
            <input
              type="text"
              placeholder="Search communities..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-orange-400/50 transition-colors"
            />
          </div>

          {/* Count */}
          <div className="px-4 py-2 text-[10px] text-white/20 uppercase tracking-widest border-b border-white/5">
            {filtered.length} communities
          </div>

          {/* Cards */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map(loc => (
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
        <main className="flex-1 relative">
          <Map
            locations={locations}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </main>
      </div>
    </div>
  )
}

export default App