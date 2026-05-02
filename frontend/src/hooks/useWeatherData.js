import { useState, useEffect } from 'react';
import axios from 'axios';

export const useWeatherData = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  const fetchWeather = async (query, lat, lon) => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/weather?`;
      if (lat && lon) {
        url += `lat=${lat}&lon=${lon}`;
      } else {
        url += `location=${encodeURIComponent(query)}`;
      }

      const response = await axios.get(url);
      
      if (response.data.success) {
        const locData = response.data.data;
        const locationParts = [locData.city, locData.state, locData.country].filter(Boolean);

        setWeatherData({
          location: locationParts.join(', '),
          current: locData
        });
        setLocation(locData.city);
        setAiResponse(response.data.aiResponse);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      // Fallback or error state handling could go here
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = (query) => {
    if (!query) return;
    if (query.toLowerCase() === 'current location') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeather(null, position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error("Geolocation error:", error);
            fetchWeather('Pune'); // Fallback to Pune as requested in the rules example
          }
        );
      } else {
        fetchWeather('Pune');
      }
    } else {
      fetchWeather(query);
    }
  };

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => fetchWeather('New York'), 0);
    return () => clearTimeout(timer);
  }, []);

  return {
    location,
    weatherData,
    loading,
    searchLocation,
    aiResponse
  };
};
