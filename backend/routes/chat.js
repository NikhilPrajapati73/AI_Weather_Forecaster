const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

const genAI = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'dummy_key_for_now' 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

router.post('/', async (req, res) => {
  const { message, location } = req.body;

  if (!genAI) {
    return res.json({ 
      success: true, 
      response: "Please configure your Gemini API key in the backend/.env file to chat with me!" 
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are an intelligent weather assistant integrated inside a weather dashboard.
      The user is currently looking at weather for ${location || 'unknown'}.
      The user just said: "${message}".

      Rules to follow strictly:
      1. Auto-correct unclear queries (like 'tmwpreture' to 'temperature').
      2. If asked about a location, resolve it to 'City, State/Region, Country'.
      3. Never say "Sorry, I couldn't process that." Try to understand intent and respond.
      4. If API fails, say "Unable to fetch weather right now."
      5. Keep responses short and friendly.
      6. Use smart suggestions (e.g., If rain -> "Take an umbrella ☔", If hot -> "Stay hydrated 🥤", If cold -> "Wear warm clothes 🧥").
    `;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    res.json({ success: true, response: text });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: "Failed to process chat message." });
  }
});

module.exports = router;
