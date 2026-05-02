import React from 'react';
import { Umbrella, Activity, Car, Heart } from 'lucide-react';
import './SmartRecommendations.css';

const recommendations = [
  {
    icon: Umbrella,
    title: 'Rain Expected',
    desc: 'Take an umbrella if you are going out between 4 PM and 6 PM.',
    color: 'var(--color-rain)'
  },
  {
    icon: Car,
    title: 'Commute Advisory',
    desc: 'Roads might be slippery. Drive safely on your way home.',
    color: 'var(--color-alert)'
  },
  {
    icon: Activity,
    title: 'Outdoor Risk Score',
    desc: '72/100 - Good conditions for a short walk, but carry a jacket.',
    color: 'var(--color-success)'
  }
];

const SmartRecommendations = () => {
  return (
    <div className="recommendations-container animate-slide-up" style={{ animationDelay: '0.5s' }}>
      <h3 className="section-title font-primary">Smart Insights</h3>
      
      <div className="insights-list">
        {recommendations.map((rec, index) => {
          const Icon = rec.icon;
          return (
            <div key={index} className="insight-card glass-panel">
              <div className="insight-icon" style={{ backgroundColor: `${rec.color}20`, color: rec.color }}>
                <Icon size={20} />
              </div>
              <div className="insight-content">
                <h4 className="insight-title font-primary">{rec.title}</h4>
                <p className="insight-desc text-secondary">{rec.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SmartRecommendations;
