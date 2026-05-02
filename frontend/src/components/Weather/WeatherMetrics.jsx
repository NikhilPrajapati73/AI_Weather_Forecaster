import React from 'react';
import { Thermometer, Wind, Droplets, Sun } from 'lucide-react';
import './WeatherMetrics.css';

const WeatherMetrics = ({ data }) => {
  const metrics = [
    { label: 'Humidity', value: `${data?.humidity || 84}%`, icon: Droplets, color: 'var(--color-rain)', status: data?.humidity > 60 ? 'High' : 'Normal' },
    { label: 'Wind', value: `${data?.wind || 12} km/h`, icon: Wind, color: 'var(--text-secondary)', status: data?.wind > 20 ? 'Strong' : 'Normal' },
    { label: 'UV Index', value: data?.uv || 2, icon: Sun, color: 'var(--color-sun)', status: data?.uv > 5 ? 'High' : 'Low' },
    { label: 'Air Quality', value: data?.aqi || 42, icon: Thermometer, color: 'var(--color-success)', status: data?.aqi > 50 ? 'Moderate' : 'Good' },
  ];

  return (
    <div className="metrics-grid animate-slide-up" style={{ animationDelay: '0.3s' }}>
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div key={index} className="metric-card glass-panel">
            <div className="metric-header">
              <span className="metric-label text-secondary">{metric.label}</span>
              <Icon size={20} color={metric.color} />
            </div>
            <div className="metric-body">
              <h4 className="metric-value font-primary">{metric.value}</h4>
              <span className="metric-status" style={{ color: metric.color }}>{metric.status}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeatherMetrics;
