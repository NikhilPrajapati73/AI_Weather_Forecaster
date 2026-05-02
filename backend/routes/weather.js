const express = require('express');
const axios = require('axios');
const { formatWeatherResponse } = require('../services/aiService');

const router = express.Router();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Route: GET /api/weather?location=New+York
router.get('/', async (req, res) => {
  const { location, lat, lon } = req.query;

  try {
    let weatherData = null;
    let fullLocation = { city: '', state: '', country: '' };
    
    // If we have API keys, use OpenWeatherMap
    if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'dummy_key_for_now') {
      let geoUrl = '';
      
      // Location Handling (GPS vs City Name)
      if (lat && lon) {
        geoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`;
      } else if (location && location.toLowerCase() === 'current location') {
        // Fallback if IP-based location is needed, but typically frontend sends lat/lon
        // Mocking for now if they send literally 'current location' without lat/lon
        geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=Pune,Maharashtra,IN&limit=1&appid=${OPENWEATHER_API_KEY}`;
      } else if (location) {
        geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
      } else {
        return res.status(400).json({ error: "Location is required" });
      }

      // 1. Geocoding
      const geoResponse = await axios.get(geoUrl);
      if (!geoResponse.data || geoResponse.data.length === 0) {
        return res.status(404).json({ error: "Location not found" });
      }

      const geoInfo = geoResponse.data[0];
      fullLocation.city = geoInfo.name;
      fullLocation.state = geoInfo.state || '';
      fullLocation.country = geoInfo.country || '';

      const locationLat = geoInfo.lat;
      const locationLon = geoInfo.lon;

      // 2. Weather Fetching (Current & Forecast)
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${locationLat}&lon=${locationLon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
      const weatherRes = await axios.get(weatherUrl);
      
      const current = weatherRes.data;
      
      weatherData = {
        ...fullLocation,
        temp: Math.round(current.main.temp),
        feelsLike: Math.round(current.main.feels_like),
        high: Math.round(current.main.temp_max),
        low: Math.round(current.main.temp_min),
        condition: current.weather[0].main,
        humidity: current.main.humidity,
        wind: Math.round(current.wind.speed * 3.6) // m/s to km/h
      };

    } else {
      // DUMMY FALLBACK for when API key is missing
      const isRainy = Math.random() > 0.5;
      const baseTemp = Math.floor(Math.random() * 20) + 15;
      
      // Capitalize the first letter of the location if provided
      const capitalizedLocation = location ? location.charAt(0).toUpperCase() + location.slice(1) : 'Pune';
      
      fullLocation = { city: capitalizedLocation, state: '', country: '' };
      
      weatherData = {
        ...fullLocation,
        temp: baseTemp,
        feelsLike: baseTemp - 2,
        high: baseTemp + 4,
        low: baseTemp - 5,
        condition: isRainy ? 'Rain' : 'Clear',
        humidity: 65,
        wind: 12
      };
    }

    // AI Formatting Service
    const aiMessage = await formatWeatherResponse(weatherData, location);

    res.json({
      success: true,
      data: weatherData,
      aiResponse: aiMessage
    });

  } catch (error) {
    console.error('Weather API Error:', error.response?.data || error.message);
    res.status(500).json({ error: "Unable to fetch live weather data right now." });
  }
});

module.exports = router;
