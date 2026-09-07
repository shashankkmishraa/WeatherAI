import { Router } from "express";
import { aiService } from "./services/ai_service";
import { getCoordinates, getCurrentWeather, getForecast, getHourlyForecast } from "./services/weather_service";
import { getDb } from "./db";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", api: "WeatherAI Core v2.4" });
});

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });
    
    if (!aiService.isConfigured()) {
      return res.json({ 
        response: "OpenAI API Key is not configured. Please add it in the .env file or Settings.",
        telemetry: null,
        chartData: null
      });
    }

    const result = await aiService.processWeatherQuery(message);
    
    // Save to history
    const db = await getDb();
    await db.run(
      `INSERT INTO chat_messages (id, session_id, role, message, telemetry) VALUES (?, ?, ?, ?, ?)`,
      [crypto.randomUUID(), 'default-session', 'user', message, null]
    );
    await db.run(
      `INSERT INTO chat_messages (id, session_id, role, message, telemetry) VALUES (?, ?, ?, ?, ?)`,
      [crypto.randomUUID(), 'default-session', 'assistant', result.text, JSON.stringify(result.telemetry)]
    );

    res.json({
      response: result.text,
      telemetry: result.telemetry,
      chartData: result.chartData
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/weather/current", async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) return res.status(400).json({ error: "Location required" });
    const coords = await getCoordinates(location as string);
    if (!coords) return res.status(404).json({ error: "Location not found" });
    
    const weather = await getCurrentWeather(coords.latitude, coords.longitude);
    res.json({ location: coords, weather });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/weather/forecast", async (req, res) => {
  try {
    const { location, days = 7 } = req.query;
    if (!location) return res.status(400).json({ error: "Location required" });
    const coords = await getCoordinates(location as string);
    if (!coords) return res.status(404).json({ error: "Location not found" });
    
    const forecast = await getForecast(coords.latitude, coords.longitude, Number(days));
    res.json({ location: coords, forecast });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/locations", async (req, res) => {
  const db = await getDb();
  const locations = await db.all(`SELECT * FROM locations ORDER BY created_at DESC`);
  res.json(locations);
});

router.post("/locations", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name required" });
    const coords = await getCoordinates(name);
    if (!coords) return res.status(404).json({ error: "Location not found" });
    
    const db = await getDb();
    const id = crypto.randomUUID();
    await db.run(
      `INSERT INTO locations (id, name, latitude, longitude, country) VALUES (?, ?, ?, ?, ?)`,
      [id, coords.name, coords.latitude, coords.longitude, coords.country || '']
    );
    res.json({ id, ...coords });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
