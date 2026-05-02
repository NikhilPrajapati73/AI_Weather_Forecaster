import { Umbrella, Activity, Car, Droplets, Sun, Wind } from 'lucide-react';
import './SmartRecommendations.css';

const buildRecommendations = (data) => {
  const condition = data?.condition?.toLowerCase() || '';
  const temp = Number(data?.temp ?? 18);
  const humidity = Number(data?.humidity ?? 65);
  const wind = Number(data?.wind ?? 12);

  const recommendations = [];

  if (condition.includes('rain')) {
    recommendations.push({
      icon: Umbrella,
      title: 'Rain Ready',
      desc: 'Carry an umbrella and choose shoes with good grip before heading out.',
      color: 'var(--color-rain)',
    });
  } else if (temp >= 32) {
    recommendations.push({
      icon: Sun,
      title: 'Heat Watch',
      desc: 'Use sunscreen, drink water, and avoid long outdoor breaks in direct sun.',
      color: 'var(--color-sun)',
    });
  } else {
    recommendations.push({
      icon: Activity,
      title: 'Outdoor Window',
      desc: 'Conditions look comfortable for errands, a walk, or a short workout.',
      color: 'var(--color-success)',
    });
  }

  recommendations.push({
    icon: Car,
    title: wind > 22 ? 'Commute Caution' : 'Commute Looks Clear',
    desc: wind > 22
      ? 'Expect stronger gusts on open roads and bridges.'
      : 'Travel conditions look steady based on current wind speed.',
    color: wind > 22 ? 'var(--color-alert)' : 'var(--color-success)',
  });

  recommendations.push({
    icon: humidity > 70 ? Droplets : Wind,
    title: humidity > 70 ? 'High Humidity' : 'Comfort Level',
    desc: humidity > 70
      ? 'It may feel warmer than the number says. Keep plans flexible.'
      : 'Air feels fairly balanced, so layering should be simple.',
    color: humidity > 70 ? 'var(--color-rain)' : 'var(--text-accent)',
  });

  return recommendations;
};

const SmartRecommendations = ({ data }) => {
  const recommendations = buildRecommendations(data);

  return (
    <div className="recommendations-container animate-slide-up" style={{ animationDelay: '0.5s' }}>
      <h3 className="section-title font-primary">Smart Insights</h3>

      <div className="insights-list">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <div key={rec.title} className="insight-card glass-panel">
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
