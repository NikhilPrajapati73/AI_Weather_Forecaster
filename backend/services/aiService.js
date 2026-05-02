const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'dummy_key_for_now' 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const formatWeatherResponse = async (weatherData, locationQuery) => {
  if (!weatherData) {
    return "Unable to fetch live weather data right now.";
  }

  const { city, state, country, temp, condition, humidity, wind } = weatherData;
  const fullLocation = [city, state, country].filter(Boolean).join(', ');

  // Rule-based fallback if no AI key or API fails
  let response = `📍 ${fullLocation}\n`;
  response += `🌡 Temperature: ${temp}°C\n`;
  response += `🌤 Condition: ${condition}\n`;
  response += `💧 Humidity: ${humidity}%\n`;
  response += `🌬 Wind: ${wind} km/h\n`;

  if (condition.toLowerCase().includes('rain')) {
    response += `\nTake an umbrella ☔`;
  }
  if (temp > 35) {
    response += `\nStay hydrated 🥤`;
  }

  // If we have a Gemini API Key, let's use it to potentially add a conversational touch 
  // while strictly maintaining the required format
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `
        You are a smart weather assistant. 
        Format this weather data strictly according to these rules:
        
        Input Data:
        Location: ${fullLocation}
        Temp: ${temp}°C
        Condition: ${condition}
        Humidity: ${humidity}%
        Wind: ${wind} km/h

        Rules:
        1. Keep responses short and clean.
        2. Format:
        📍 [City, State, Country]
        🌡 Temperature: [Temp]°C
        🌤 Condition: [Condition]
        💧 Humidity: [Humidity]%
        🌬 Wind: [Wind] km/h
        
        3. Extras:
        If condition includes rain, append "Take an umbrella ☔".
        If temp > 35, append "Stay hydrated 🥤".
        If temp < 15, append "Wear warm clothes 🧥".
        
        Output only the requested string without any markdown code blocks.
      `;

      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text();
      return aiResponse.trim();
    } catch (error) {
      console.error('AI formatting failed, using rule-based fallback.', error);
      return response;
    }
  }

  return response;
};

module.exports = {
  formatWeatherResponse
};
