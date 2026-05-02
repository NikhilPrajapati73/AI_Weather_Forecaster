import React from 'react';
import { CloudRain, Wind, Droplets, Sun, Cloud, CloudLightning } from 'lucide-react';
import './HeroWeather.css';

const getIcon = (condition) => {
  if (condition.includes('Rain')) return CloudRain;
  if (condition.includes('Cloud')) return Cloud;
  if (condition.includes('Thunder')) return CloudLightning;
  return Sun;
};

const HeroWeather = ({ data, location }) => {
  const Icon = getIcon(data?.condition || 'Rain');
  
  return (
    <div className="hero-weather glass-panel-heavy animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="hero-header">
        <h2 className="city-name font-primary">{location}</h2>
        <span className="condition-badge glass-pill text-gradient-accent">{data?.condition || 'Light Rain'}</span>
      </div>

      <div className="main-temp-container">
        <div className="temp-display">
          <span className="temperature font-primary text-gradient">{data?.temp || 18}</span>
          <span className="unit font-primary text-gradient">°C</span>
        </div>
        
        <div className="weather-illustration animate-float">
          <Icon size={120} className="weather-icon" strokeWidth={1.5} />
        </div>
      </div>

      <div className="feels-like">
        <p className="text-secondary">Feels like {data?.feelsLike || 16}°C • High {data?.high || 22}° • Low {data?.low || 14}°</p>
      </div>

      <div className="quick-stats">
        <div className="stat-item">
          <Wind size={18} className="text-secondary" />
          <span>{data?.wind || 12} km/h</span>
        </div>
        <div className="stat-item">
          <Droplets size={18} className="text-secondary" />
          <span>{data?.humidity || 84}%</span>
        </div>
      </div>
    </div>
  );
};

export default HeroWeather;
