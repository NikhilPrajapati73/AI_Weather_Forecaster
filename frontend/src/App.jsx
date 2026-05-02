import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import HeroWeather from './components/Weather/HeroWeather'
import ForecastCards from './components/Weather/ForecastCards'
import WeatherMetrics from './components/Weather/WeatherMetrics'
import AIAssistant from './components/AI/AIAssistant'
import SmartRecommendations from './components/AI/SmartRecommendations'
import { useWeatherData } from './hooks/useWeatherData'

function App() {
  const { weatherData, loading, searchLocation, aiResponse } = useWeatherData();

  return (
    <div className="app-container animate-fade-in">
      <Header location={weatherData?.location} onSearch={searchLocation} />
      
      <main className={`main-content ${loading ? 'opacity-50' : ''}`} style={{ transition: 'opacity 0.3s' }}>
        {/* Left Column - Main Weather */}
        <div className="side-column">
          <HeroWeather data={weatherData?.current} location={weatherData?.location} />
        </div>

        {/* Center Column - Forecast & Metrics */}
        <div className="center-column">
          <ForecastCards />
          <WeatherMetrics data={weatherData?.current} />
        </div>

        {/* Right Column - AI & Insights */}
        <div className="side-column">
          <AIAssistant location={weatherData?.location} aiResponse={aiResponse} />
          <SmartRecommendations />
        </div>
      </main>
    </div>
  )
}

export default App
