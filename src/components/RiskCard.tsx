import type { LocationWithRisk } from '../types'

interface Props {
  location: LocationWithRisk
}

export default function RiskCard({ location }: Props) {
  if (location.loading) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-2/3 mb-2" />
        <div className="h-3 bg-gray-800 rounded w-1/3" />
      </div>
    )
  }

  if (!location.risk || !location.weather) {
    return (
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
        <p className="text-gray-500 text-sm">{location.name} — data unavailable</p>
      </div>
    )
  }

  const { risk, weather } = location

  return (
    <div
      className="rounded-lg border border-gray-800 bg-gray-900 p-4 flex flex-col gap-3"
      style={{ borderLeftColor: risk.color, borderLeftWidth: 4 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-white">{location.name}</p>
          <p className="text-gray-500 text-xs">{location.region}</p>
        </div>
        <span
          className="text-xs font-bold px-2 py-1 rounded-full"
          style={{ backgroundColor: risk.color, color: risk.textColor }}
        >
          {risk.level}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
        <div>🌡️ <span className="text-white">{weather.temperature}°C</span></div>
        <div>💧 <span className="text-white">{weather.humidity}%</span> humidity</div>
        <div>💨 <span className="text-white">{weather.windspeed} km/h</span></div>
        <div>🌧️ <span className="text-white">{weather.precipitation}mm</span> rain</div>
      </div>

      <div className="w-full bg-gray-800 rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${risk.score}%`, backgroundColor: risk.color }}
        />
      </div>
      <p className="text-xs text-gray-500 text-right">Risk score: {risk.score}/100</p>
    </div>
  )
}