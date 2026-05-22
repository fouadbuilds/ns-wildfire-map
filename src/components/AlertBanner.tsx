import type { LocationWithRisk } from '../types'

interface Props {
  location: LocationWithRisk
}

export default function AlertBanner({ location }: Props) {
  const risk = location.risk!

  const bgColor =
    risk.level === 'Extreme' ? 'bg-red-600' : 'bg-orange-500'

  return (
    <div className={`${bgColor} px-6 py-3 flex items-center gap-3`}>
      <span className="text-xl">⚠️</span>
      <div>
        <span className="font-bold">{risk.level} Fire Risk</span>
        <span className="text-white/90 ml-2">
          — Highest danger currently in {location.name}, {location.region}
        </span>
      </div>
      <div className="ml-auto text-white/80 text-sm">
        Risk Score: {risk.score}/100
      </div>
    </div>
  )
}