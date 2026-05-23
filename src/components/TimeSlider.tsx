import type { ForecastDay } from '../types'
import { assessRisk } from '../utils/riskScore'

interface Props {
  forecast: ForecastDay[]
  selectedDay: number
  onDayChange: (day: number) => void
}

const dayLabels = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getDayLabel(index: number, dateStr: string): string {
  if (index < 2) return dayLabels[index]
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-CA', { weekday: 'short' })
}

export default function TimeSlider({ forecast, selectedDay, onDayChange }: Props) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-white rounded-2xl shadow-xl border border-black/10 px-5 py-3 flex flex-col gap-2 min-w-96">

      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">7-Day Risk Outlook</p>
        <p className="text-[10px] text-gray-400">
          {selectedDay === 0 ? 'Live conditions' : `+${selectedDay} day${selectedDay > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Day pills */}
      <div className="flex gap-1.5">
        {forecast.map((day, i) => {
          const risk = assessRisk({
            temperature: day.temperature,
            humidity: day.humidity,
            windspeed: day.windspeed,
            windDirection: day.windDirection,
            precipitation: day.precipitation,
            forecast: [],
          })
          const isSelected = i === selectedDay

          return (
            <button
              key={day.date}
              onClick={() => onDayChange(i)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all duration-150 border
                ${isSelected
                  ? 'border-transparent shadow-sm'
                  : 'border-transparent hover:bg-black/5'
                }`}
              style={isSelected ? { backgroundColor: `${risk.color}15`, borderColor: `${risk.color}40` } : {}}
            >
              <span className="text-[9px] text-gray-400 uppercase tracking-widest">
                {getDayLabel(i, day.date)}
              </span>
              <span className="text-lg">
                {risk.level === 'Extreme' ? '🟣'
                  : risk.level === 'Very High' ? '🔴'
                  : risk.level === 'High' ? '🟠'
                  : risk.level === 'Moderate' ? '🟡'
                  : '🟢'}
              </span>
              <span
                className="text-[10px] font-bold"
                style={{ color: risk.color }}
              >
                {risk.score}
              </span>
              <span className="text-[9px] text-gray-400">{day.temperature}°</span>
            </button>
          )
        })}
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={forecast.length - 1}
        value={selectedDay}
        onChange={e => onDayChange(Number(e.target.value))}
        className="w-full accent-orange-400 cursor-pointer"
      />

    </div>
  )
}