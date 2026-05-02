import React from 'react';
import { Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';
import './ForecastCards.css';

const hourlyData = [
  { time: 'Now', temp: 18, icon: CloudRain, color: 'var(--color-rain)' },
  { time: '14:00', temp: 19, icon: Cloud, color: 'var(--color-cloud)' },
  { time: '15:00', temp: 20, icon: Sun, color: 'var(--color-sun)' },
  { time: '16:00', temp: 21, icon: Sun, color: 'var(--color-sun)' },
  { time: '17:00', temp: 19, icon: CloudLightning, color: 'var(--color-storm)' },
  { time: '18:00', temp: 17, icon: CloudRain, color: 'var(--color-rain)' },
];

const dailyData = [
  { day: 'Today', min: 14, max: 22, icon: CloudRain, color: 'var(--color-rain)' },
  { day: 'Tue', min: 15, max: 24, icon: Sun, color: 'var(--color-sun)' },
  { day: 'Wed', min: 16, max: 25, icon: Sun, color: 'var(--color-sun)' },
  { day: 'Thu', min: 13, max: 20, icon: Cloud, color: 'var(--color-cloud)' },
];

const ForecastCards = () => {
  return (
    <div className="forecast-container animate-slide-up" style={{ animationDelay: '0.2s' }}>
      {/* Hourly Forecast */}
      <div className="glass-panel hourly-forecast">
        <h3 className="section-title font-primary">Today</h3>
        <div className="hourly-scroll">
          {hourlyData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="hourly-item">
                <span className="time text-secondary">{item.time}</span>
                <Icon size={28} color={item.color} className="weather-icon" />
                <span className="temp font-primary">{item.temp}°</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Forecast */}
      <div className="glass-panel daily-forecast">
        <h3 className="section-title font-primary">7-Day Forecast</h3>
        <div className="daily-list">
          {dailyData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="daily-item">
                <span className="day text-secondary">{item.day}</span>
                <div className="icon-wrapper">
                  <Icon size={24} color={item.color} />
                </div>
                <div className="temp-range">
                  <span className="min-temp text-secondary">{item.min}°</span>
                  <div className="temp-bar">
                    <div 
                      className="temp-bar-fill" 
                      style={{ 
                        left: `${(item.min / 30) * 100}%`, 
                        right: `${100 - (item.max / 30) * 100}%`,
                        background: `linear-gradient(90deg, ${item.color}, var(--color-sun))`
                      }}
                    ></div>
                  </div>
                  <span className="max-temp">{item.max}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ForecastCards;
