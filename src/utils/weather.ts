import axios from 'axios'
import type { WeatherData } from '../types'

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude: lat,
      longitude: lng,
      daily: [
        'temperature_2m_max',
        'precipitation_sum',
        'windspeed_10m_max',
        'winddirection_10m_dominant',
      ].join(','),
      hourly: 'relativehumidity_2m',
      forecast_days: 7,
      timezone: 'America/Halifax',
    },
  })

  const daily = response.data.daily

  return {
    temperature: daily.temperature_2m_max[0],
    humidity: response.data.hourly.relativehumidity_2m[0],
    windspeed: daily.windspeed_10m_max[0],
    windDirection: daily.winddirection_10m_dominant[0],
    precipitation: daily.precipitation_sum[0],
    forecast: daily.temperature_2m_max.map((_: number, i: number) => ({
      date: daily.time[i],
      temperature: daily.temperature_2m_max[i],
      windspeed: daily.windspeed_10m_max[i],
      precipitation: daily.precipitation_sum[i],
      humidity: response.data.hourly.relativehumidity_2m[i * 24] ?? response.data.hourly.relativehumidity_2m[0],
      windDirection: daily.winddirection_10m_dominant[i],
    }))
  }
}

export function windDirectionLabel(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(degrees / 45) % 8]
}