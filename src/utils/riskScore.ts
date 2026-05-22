import type { WeatherData, RiskResult, RiskLevel } from '../types'

export function calculateRiskScore(weather: WeatherData): number {
  let score = 0

  if (weather.temperature > 32) score += 30
  else if (weather.temperature > 28) score += 22
  else if (weather.temperature > 23) score += 14
  else if (weather.temperature > 18) score += 6

  if (weather.humidity < 25) score += 30
  else if (weather.humidity < 35) score += 22
  else if (weather.humidity < 50) score += 14
  else if (weather.humidity < 65) score += 6

  if (weather.windspeed > 50) score += 25
  else if (weather.windspeed > 35) score += 18
  else if (weather.windspeed > 20) score += 10
  else if (weather.windspeed > 10) score += 4

  if (weather.precipitation < 1) score += 15
  else if (weather.precipitation < 5) score += 8
  else if (weather.precipitation < 15) score += 3

  return Math.min(score, 100)
}

export function getRiskLevel(score: number): { level: RiskLevel; color: string } {
  if (score >= 80) return { level: 'Extreme', color: '#9333EA' }
  if (score >= 60) return { level: 'Very High', color: '#EF4444' }
  if (score >= 40) return { level: 'High', color: '#F97316' }
  if (score >= 20) return { level: 'Moderate', color: '#EAB308' }
  return { level: 'Low', color: '#22C55E' }
}

export function assessRisk(weather: WeatherData): RiskResult {
  const score = calculateRiskScore(weather)
  const { level, color } = getRiskLevel(score)
  return { score, level, color, textColor: 'white' }
}