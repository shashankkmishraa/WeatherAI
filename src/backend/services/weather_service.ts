// src/backend/services/weather_service.ts
import z from 'zod';

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive';
const CLIMATE_URL = 'https://climate-api.open-meteo.com/v1/climate';

export const LocationSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  country: z.string().optional(),
  admin1: z.string().optional(),
});
export type LocationType = z.infer<typeof LocationSchema>;

export async function getCoordinates(location: string): Promise<LocationType | null> {
  try {
    const res = await fetch(`${GEO_URL}?name=${encodeURIComponent(location)}&count=1&language=en&format=json`);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const { id, name, latitude, longitude, country, admin1 } = data.results[0];
      return { id, name, latitude, longitude, country, admin1 };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export async function getCurrentWeather(lat: number, lon: number) {
  const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto`;
  const res = await fetch(url);
  return res.json();
}

export async function getForecast(lat: number, lon: number, days: number = 7) {
  const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto&forecast_days=${days}`;
  const res = await fetch(url);
  return res.json();
}

export async function getHourlyForecast(lat: number, lon: number, days: number = 2) {
  const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,pressure_msl,surface_pressure,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,evapotranspiration,et0_fao_evapotranspiration,vapor_pressure_deficit,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m,wind_gusts_10m,temperature_80m,temperature_120m,temperature_180m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,soil_moisture_27_to_81cm&timezone=auto&forecast_days=${days}`;
  const res = await fetch(url);
  return res.json();
}

export async function getHistoricalWeather(lat: number, lon: number, startDate: string, endDate: string) {
  // Dates must be YYYY-MM-DD
  const url = `${ARCHIVE_URL}?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,apparent_temperature_max,apparent_temperature_min,apparent_temperature_mean,sunrise,sunset,precipitation_sum,rain_sum,snowfall_sum,precipitation_hours,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&timezone=auto`;
  const res = await fetch(url);
  return res.json();
}

export async function getClimateData(lat: number, lon: number, startDate: string, endDate: string) {
  // using CMIP6 models
  const url = `${CLIMATE_URL}?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&models=CMIP6_seamless&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
  const res = await fetch(url);
  return res.json();
}
