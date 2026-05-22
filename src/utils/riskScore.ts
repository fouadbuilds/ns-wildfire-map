import type { WeatherData, RiskResult } from '../types'

export function calculateRiskScore(weather: WeatherData): number {
  let score = 0

  // Temperature
  if (weather.temperature > 30) score += 30
  else if (weather.temperature > 25) score += 20
  else if (weather.temperature > 20) score += 10

  // Humidity (lower = drier = more dangerous)
  if (weather.humidity < 30) score += 30
  else if (weather.humidity < 50) score += 20
  else if (weather.humidity < 65) score += 10

  // Wind speed (km/h)
  if (weather.windspeed > 40) score += 25
  else if (weather.windspeed > 25) score += 15
  else if (weather.windspeed > 15) score += 5

  // Precipitation — lower recent rain = higher risk
  if (weather.precipitation < 2) score += 15
  else if (weather.precipitation < 10) score += 5

  return Math.min(score, 100)
}

export function getRiskLevel(score: number): RiskResult {
  if (score >= 70) return { score, level: 'Extreme', color: '#DC2626', textColor: 'white' }
  if (score >= 50) return { score, level: 'High', color: '#EA580C', textColor: 'white' }
  if (score >= 30) return { score, level: 'Moderate', color: '#CA8A04', textColor: 'white' }
  return { score, level: 'Low', color: '#16A34A', textColor: 'white' }
}

export function assessRisk(weather: WeatherData): RiskResult {
  const score = calculateRiskScore(weather)
  return getRiskLevel(score)
}