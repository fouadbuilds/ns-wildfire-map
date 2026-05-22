import { useState } from 'react'
import type { LocationWithRisk } from '../types'
import { windDirectionLabel } from '../utils/weather'

interface Props {
  location: LocationWithRisk
  selected: boolean
  onSelect: (id: string) => void
}

const riskBorder: Record<string, string> = {
  'Extreme':   'border-purple-500/60',
  'Very High': 'border-red-500/60',
  'High':      'border-orange-500/60',
  'Moderate':  'border-yellow-500/60',
  'Low':       'border-green-500/60',
}

const riskBg: Record<string, string> = {
  'Extreme':   'bg-purple-500/10',
  'Very High': 'bg-red-500/10',
  'High':      'bg-orange-500/10',
  'Moderate':  'bg-yellow-500/10',
  'Low':       'bg-green-500/10',
}

export default function RiskCard({ location, selected, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false)

  if (location.loading) {
    return (
      <div className="px-3 py-3 border-b border-white/5 animate-pulse">
        <div className="h-3.5 bg-white/10 rounded w-1/2 mb-2" />
        <div className="h-2.5 bg-white/5 rounded w-1/3" />
      </div>
    )
  }

  if (!location.risk || !location.weather) {
    return (
      <div className="px-4 py-3 border-b border-white/5">
        <p className="text-xs text-white/20">{location.name}</p>
      </div>
    )
  }

  const { risk, weather } = location
  const borderClass = riskBorder[risk.level] ?? riskBorder['Low']
  const bgClass = riskBg[risk.level] ?? riskBg['Low']

  return (
    <div
      className={`border-b border-white/5 cursor-pointer transition-all duration-200
        ${selected ? `${bgClass} border-l-2 ${borderClass}` : 'hover:bg-white/5'}`}
      onClick={() => {
        onSelect(location.id)
        setExpanded(prev => selected ? prev : true)
      }}
    >
      {/* Top row — always visible */}
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{location.name}</p>
          <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">{location.region}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{ backgroundColor: `${risk.color}25`, color: risk.color }}
          >
            {risk.level}
          </span>
          <span className="text-xs text-white/30 w-8 text-right">{risk.score}</span>
        </div>
      </div>

      {/* Risk bar */}
      <div className="px-4 pb-2">
        <div className="w-full bg-white/5 rounded-full h-0.5">
          <div
            className="h-0.5 rounded-full transition-all duration-700"
            style={{ width: `${risk.score}%`, backgroundColor: risk.color }}
          />
        </div>
      </div>

      {/* Expanded drawer */}
      {selected && (
        <div className="px-4 pb-3 pt-1">
          <button
            className="text-[10px] text-white/20 uppercase tracking-widest mb-3 hover:text-white/40 transition-colors"
            onClick={e => { e.stopPropagation(); setExpanded(p => !p) }}
          >
            {expanded ? '▲ Hide breakdown' : '▼ Show breakdown'}
          </button>

          {expanded && (
            <div className="flex flex-col gap-2">

              {/* Temperature */}
              <div>
                <div className="flex justify-between text-[10px] text-white/40 mb-1">
                  <span>🌡️ Temperature</span>
                  <span className="text-white/70">{weather.temperature}°C</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1">
                  <div
                    className="h-1 rounded-full bg-orange-400"
                    style={{ width: `${Math.min((weather.temperature / 40) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Humidity */}
              <div>
                <div className="flex justify-between text-[10px] text-white/40 mb-1">
                  <span>💧 Humidity</span>
                  <span className="text-white/70">{weather.humidity}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1">
                  <div
                    className="h-1 rounded-full bg-blue-400"
                    style={{ width: `${weather.humidity}%` }}
                  />
                </div>
              </div>

              {/* Wind */}
              <div>
                <div className="flex justify-between text-[10px] text-white/40 mb-1">
                  <span>💨 Wind</span>
                  <span className="text-white/70">
                    {weather.windspeed} km/h {windDirectionLabel(weather.windDirection)}
                  </span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1">
                  <div
                    className="h-1 rounded-full bg-cyan-400"
                    style={{ width: `${Math.min((weather.windspeed / 80) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Precipitation */}
              <div>
                <div className="flex justify-between text-[10px] text-white/40 mb-1">
                  <span>🌧️ Precipitation</span>
                  <span className="text-white/70">{weather.precipitation}mm</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1">
                  <div
                    className="h-1 rounded-full bg-sky-400"
                    style={{ width: `${Math.min((weather.precipitation / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* What to do */}
              <div className="mt-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Advisory</p>
                <p className="text-xs text-white/60">
                  {risk.level === 'Extreme' && 'Evacuate if ordered. Avoid all outdoor burning. Follow emergency alerts.'}
                  {risk.level === 'Very High' && 'Avoid outdoor burning. Stay alert to emergency notifications.'}
                  {risk.level === 'High' && 'No campfires. Monitor local fire updates closely.'}
                  {risk.level === 'Moderate' && 'Exercise caution with any open flame outdoors.'}
                  {risk.level === 'Low' && 'Conditions are currently safe. Stay aware.'}
                </p>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  )
}