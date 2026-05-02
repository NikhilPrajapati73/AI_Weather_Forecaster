const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'dummy_key_for_now'
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const buildFallbackResponse = (weatherData) => {
  const { city, state, country, temp, condition, humidity, wind } = weatherData;
  const fullLocation = [city, state, country].filter(Boolean).join(', ');

  const lines = [
    `Location: ${fullLocation}`,
    `Temperature: ${temp} C`,
    `Condition: ${condition}`,
    `Humidity: ${humidity}%`,
    `Wind: ${wind} km/h`,
  ];

  if (condition.toLowerCase().includes('rain')) {
    lines.push('Tip: Take an umbrella.');
  }
  if (temp > 35) {
    lines.push('Tip: Stay hydrated.');
  }
  if (temp < 15) {
    lines.push('Tip: Wear warm clothes.');
  }

  return lines.join('\n');
};

const formatWeatherResponse = async (weatherData) => {
  if (!weatherData) {
    return 'Unable to fetch live weather data right now.';
  }

  const { city, state, country, temp, condition, humidity, wind } = weatherData;
  const fullLocation = [city, state, country].filter(Boolean).join(', ');
  const fallbackResponse = buildFallbackResponse(weatherData);

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        You are a smart weather assistant.
        Keep the response short, clean, and plain text.

        Data:
        Location: ${fullLocation}
        Temperature: ${temp} C
        Condition: ${condition}
        Humidity: ${humidity}%
        Wind: ${wind} km/h

        Format:
        Location: [City, State, Country]
        Temperature: [Temp] C
        Condition: [Condition]
        Humidity: [Humidity]%
        Wind: [Wind] km/h
        Tip: [one useful short weather tip]

        Output only the requested text without markdown.
      `;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error('AI formatting failed, using rule-based fallback.', error);
      return fallbackResponse;
    }
  }

  return fallbackResponse;
};

module.exports = {
  formatWeatherResponse,
};
