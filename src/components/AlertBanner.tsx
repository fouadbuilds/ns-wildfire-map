import type { LocationWithRisk } from '../types'

interface Props {
  location: LocationWithRisk
}

export default function AlertBanner({ location }: Props) {
  const risk = location.risk!

  const styles: Record<string, { bg: string; border: string; text: string }> = {
    'Extreme':   { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
    'Very High': { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700' },
    'High':      { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
    'Moderate':  { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
  }

  const s = styles[risk.level] ?? styles['Moderate']

  return (
    <div className={`${s.bg} border-b ${s.border} px-5 py-2 flex items-center gap-3 shrink-0`}>
      <span className="text-sm">⚠️</span>
      <p className={`text-xs ${s.text}`}>
        <span className="font-semibold">{risk.level} fire danger</span>
        {' '}detected in{' '}
        <span className="font-semibold">{location.name}</span>
        {' '}— Risk score {risk.score}/100
      </p>
      <span className="ml-auto text-[10px] text-gray-400 uppercase tracking-widest shrink-0">
        {new Date().toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  )
}