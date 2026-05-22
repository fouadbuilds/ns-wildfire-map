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
      ].join(','),
      hourly: 'relativehumidity_2m',
      forecast_days: 1,
      timezone: 'America/Halifax',
    },
  })

  const daily = response.data.daily

  return {
   temperature: daily.temperature_2m_max[0],
    humidity: response.data.hourly.relativehumidity_2m[0],
    windspeed: daily.windspeed_10m_max[0],
    precipitation: daily.precipitation_sum[0],
  }
}