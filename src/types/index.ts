export interface Location {
  id: string
  name: string
  lat: number
  lng: number
  region: string
}

export interface WeatherData {
  temperature: number
  humidity: number
  windspeed: number
  windDirection: number
  precipitation: number
}

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme'

export interface RiskResult {
  score: number
  level: RiskLevel
  color: string
  textColor: string
}

export interface LocationWithRisk extends Location {
  weather: WeatherData | null
  risk: RiskResult | null
  loading: boolean
  selected: boolean
}