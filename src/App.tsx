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
    NS_LOCATIONS.map(loc => ({ ...loc, weather: null, risk: null, loading: true }))
  )

  useEffect(() => {
    NS_LOCATIONS.forEach(async (loc) => {
      try {
        const weather = await fetchWeather(loc.lat, loc.lng)
        const risk = assessRisk(weather)
        setLocations(prev =>
          prev.map(l =>
            l.id === loc.id ? { ...l, weather, risk, loading: false } : l
          )
        )
      } catch (err) {
        console.error(`Failed to fetch weather for ${loc.name}`, err)
        setLocations(prev =>
          prev.map(l =>
            l.id === loc.id ? { ...l, loading: false } : l
          )
        )
      }
    })
  }, [])

  const highestRisk = locations
    .filter(l => l.risk !== null)
    .sort((a, b) => (b.risk!.score - a.risk!.score))[0]

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-tight">🔥 NS Wildfire Risk</h1>
        <p className="text-gray-400 text-sm">Live fire danger across Nova Scotia</p>
      </header>

      {highestRisk?.risk && highestRisk.risk.score >= 50 && (
        <AlertBanner location={highestRisk} />
      )}

      <main className="flex flex-1 overflow-hidden">
        <div className="w-80 shrink-0 overflow-y-auto border-r border-gray-800 p-4 flex flex-col gap-3">
          {locations.map(loc => (
            <RiskCard key={loc.id} location={loc} />
          ))}
        </div>
        <div className="flex-1">
          <Map locations={locations} />
        </div>
      </main>
    </div>
  )
}

export default App