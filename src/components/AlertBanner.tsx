import type { LocationWithRisk } from '../types'

interface Props {
  location: LocationWithRisk
}

export default function AlertBanner({ location }: Props) {
  const risk = location.risk!

  const styles: Record<string, { bg: string; border: string; icon: string }> = {
    'Extreme':   { bg: 'bg-purple-950/80', border: 'border-purple-500/50', icon: '🟣' },
    'Very High': { bg: 'bg-red-950/80',    border: 'border-red-500/50',    icon: '🔴' },
    'High':      { bg: 'bg-orange-950/80', border: 'border-orange-500/50', icon: '🟠' },
    'Moderate':  { bg: 'bg-yellow-950/80', border: 'border-yellow-500/50', icon: '🟡' },
  }

  const s = styles[risk.level] ?? styles['Moderate']

  return (
    <div className={`${s.bg} border-b ${s.border} px-5 py-2 flex items-center gap-3 shrink-0`}>
      <span className="text-sm">{s.icon}</span>
      <p className="text-xs text-white/80">
        <span className="font-semibold text-white">{risk.level} fire danger</span>
        {' '}detected in{' '}
        <span className="font-semibold text-white">{location.name}</span>
        {' '}— Risk score {risk.score}/100
      </p>
      <span className="ml-auto text-[10px] text-white/30 uppercase tracking-widest shrink-0">
        {new Date().toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  )
}