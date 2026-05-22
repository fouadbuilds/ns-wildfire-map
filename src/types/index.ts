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
  precipitation: number
}

export interface RiskResult {
  score: number
  level: 'Low' | 'Moderate' | 'High' | 'Extreme'
  color: string
  textColor: string
}

export interface LocationWithRisk extends Location {
  weather: WeatherData | null
  risk: RiskResult | null
  loading: boolean
}