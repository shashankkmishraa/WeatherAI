// src/backend/services/ai_service.ts
import OpenAI from "openai";
import { getCoordinates, getForecast, getCurrentWeather, getHourlyForecast, getHistoricalWeather, getClimateData } from "./weather_service";
import z from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const IntentSchema = z.object({
  intent: z.enum([
    "CURRENT_WEATHER", "TODAY_FORECAST", "TOMORROW_FORECAST", 
    "MULTI_DAY_FORECAST", "HOURLY_FORECAST", "RAIN_FORECAST", 
    "TEMPERATURE_FORECAST", "WIND_FORECAST", "HUMIDITY_FORECAST", 
    "SUNRISE_SUNSET", "HISTORICAL_WEATHER", "CLIMATE_INFORMATION", 
    "WEATHER_COMPARISON", "SEVERE_WEATHER", "GENERAL_WEATHER_QUESTION"
  ]),
  location: z.string().describe("The location mentioned in the query"),
  date_range: z.string().optional().describe("E.g., 2025-05-18 or tomorrow or weekend"),
  time_window: z.string().optional().describe("E.g., 17:00 - 20:30"),
  variables: z.array(z.string()).describe("List of weather variables needed e.g., precipitation_probability, temperature"),
  compare_location: z.string().optional().describe("Second location if comparing"),
  compare_date: z.string().optional().describe("Second date if comparing"),
});

export type ParsedIntent = z.infer<typeof IntentSchema>;

export class AIService {
  private openai: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }

  isConfigured() {
    return this.openai !== null;
  }

  async processWeatherQuery(userQuery: string) {
    if (!this.openai) {
      return { 
        text: "OpenAI API Key is not configured. Please add OPENAI_API_KEY in Settings.",
        telemetry: null 
      };
    }

    try {
      // 1. Determine intent
      const intentCompletion = await this.openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
          { role: "system", content: "You are an expert meteorological intent parser. Extract structured parameters from the user's weather query." },
          { role: "user", content: userQuery }
        ],
        response_format: zodResponseFormat(IntentSchema, "intent_extraction"),
      });

      const parsedIntent = intentCompletion.choices[0].message.parsed;
      if (!parsedIntent) throw new Error("Failed to parse intent");

      // 2. Geocode location
      const locationCoords = await getCoordinates(parsedIntent.location);
      if (!locationCoords) {
        return {
          text: `I couldn't find the location "${parsedIntent.location}". Please try entering a city and country.`,
          telemetry: { ...parsedIntent, error: "Location not found" }
        };
      }

      // 3. Fetch appropriate data based on intent
      let weatherData: any = null;
      let queriedApi = "";
      
      const lat = locationCoords.latitude;
      const lon = locationCoords.longitude;

      if (["CURRENT_WEATHER", "WIND_FORECAST", "HUMIDITY_FORECAST", "SUNRISE_SUNSET", "SEVERE_WEATHER"].includes(parsedIntent.intent)) {
         weatherData = await getCurrentWeather(lat, lon);
         queriedApi = "open-meteo/v1/current";
      } else if (parsedIntent.intent === "HOURLY_FORECAST" || parsedIntent.intent === "RAIN_FORECAST" || parsedIntent.time_window) {
         weatherData = await getHourlyForecast(lat, lon, 3); // next 3 days
         queriedApi = "open-meteo/v1/forecast/hourly";
      } else if (parsedIntent.intent === "HISTORICAL_WEATHER") {
         // rough estimation, default to last year if no date provided
         weatherData = await getHistoricalWeather(lat, lon, "2023-01-01", "2023-01-07"); 
         queriedApi = "open-meteo/v1/archive";
      } else if (parsedIntent.intent === "CLIMATE_INFORMATION") {
         weatherData = await getClimateData(lat, lon, "1950-01-01", "2050-12-31");
         queriedApi = "open-meteo/v1/climate";
      } else {
         // Default to daily forecast
         weatherData = await getForecast(lat, lon, 7);
         queriedApi = "open-meteo/v1/forecast/daily";
      }

      // Build telemetry object
      const telemetry = {
        intent: parsedIntent.intent,
        location: `${locationCoords.name}${locationCoords.country ? ', ' + locationCoords.country : ''}`,
        coordinates: { lat, lon },
        date_range: parsedIntent.date_range,
        time_window: parsedIntent.time_window,
        queried_api: queriedApi,
        model_cluster: "ECMWF_IFS_01D",
        variables: parsedIntent.variables
      };

      // 4. Generate natural language response
      const responseCompletion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are WeatherAI, a highly intelligent, precise, and conversational meteorological agent. Use the provided JSON weather data (from Open-Meteo) to answer the user's query accurately. DO NOT hallucinate numbers. Do not output raw JSON, summarize the findings beautifully with accurate units (°C, mm, km/h). Use bolding for emphasis on key numbers." },
          { role: "user", content: `User Query: ${userQuery}\\n\\nLocation: ${locationCoords.name}\\n\\nWeather Data: ${JSON.stringify(weatherData).substring(0, 3000)}` }
        ]
      });

      return {
        text: responseCompletion.choices[0].message.content || "Sorry, I couldn't process the response.",
        telemetry,
        chartData: weatherData // To pass to the UI for visualization
      };

    } catch (error: any) {
      console.error("AI Service Error:", error);
      return { text: "There was an error communicating with the AI service or weather API.", telemetry: null };
    }
  }
}

export const aiService = new AIService();
