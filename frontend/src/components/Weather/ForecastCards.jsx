import { createElement } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';
import './ForecastCards.css';

const baseHourlyData = [
  { time: 'Now', temp: 18, icon: 'rain', color: 'var(--color-rain)' },
  { time: '14:00', temp: 19, icon: 'cloud', color: 'var(--color-cloud)' },
  { time: '15:00', temp: 20, icon: 'clear', color: 'var(--color-sun)' },
  { time: '16:00', temp: 21, icon: 'clear', color: 'var(--color-sun)' },
  { time: '17:00', temp: 19, icon: 'thunder', color: 'var(--color-storm)' },
  { time: '18:00', temp: 17, icon: 'rain', color: 'var(--color-rain)' },
];

const baseDailyData = [
  { day: 'Today', min: 14, max: 22, icon: 'rain', color: 'var(--color-rain)' },
  { day: 'Tue', min: 15, max: 24, icon: 'clear', color: 'var(--color-sun)' },
  { day: 'Wed', min: 16, max: 25, icon: 'clear', color: 'var(--color-sun)' },
  { day: 'Thu', min: 13, max: 20, icon: 'cloud', color: 'var(--color-cloud)' },
];

const tempOffsets = [0, 1, 2, 1, -1, -2];
const minOffsets = [0, 1, 2, -1];
const maxOffsets = [0, 2, 3, -2];

const weatherIcons = {
  rain: CloudRain,
  cloud: Cloud,
  thunder: CloudLightning,
  clear: Sun,
};

const ForecastIcon = ({ name, ...props }) => {
  return createElement(weatherIcons[name] || Sun, props);
};

const getWeatherStyle = (condition = '') => {
  const normalized = condition.toLowerCase();
  if (normalized.includes('rain')) return { icon: 'rain', color: 'var(--color-rain)' };
  if (normalized.includes('thunder')) return { icon: 'thunder', color: 'var(--color-storm)' };
  if (normalized.includes('cloud')) return { icon: 'cloud', color: 'var(--color-cloud)' };
  return { icon: 'clear', color: 'var(--color-sun)' };
};

const getHourLabel = (offset) => {
  if (offset === 0) return 'Now';
  const hour = new Date(Date.now() + offset * 60 * 60 * 1000).getHours();
  return `${String(hour).padStart(2, '0')}:00`;
};

const getDayLabel = (offset) => {
  if (offset === 0) return 'Today';
  return new Date(Date.now() + offset * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' });
};

const ForecastCards = ({ data }) => {
  const currentTemp = Number(data?.temp);
  const high = Number(data?.high);
  const low = Number(data?.low);
  const weatherStyle = getWeatherStyle(data?.condition);

  const hourlyData = Number.isFinite(currentTemp)
    ? tempOffsets.map((offset, index) => ({
        time: getHourLabel(index),
        temp: currentTemp + offset,
        ...weatherStyle,
      }))
    : baseHourlyData;

  const dailyData = Number.isFinite(high) && Number.isFinite(low)
    ? minOffsets.map((offset, index) => ({
        day: getDayLabel(index),
        min: low + offset,
        max: high + maxOffsets[index],
        ...weatherStyle,
      }))
    : baseDailyData;

  return (
    <div className="forecast-container animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="glass-panel hourly-forecast">
        <h3 className="section-title font-primary">Today</h3>
        <div className="hourly-scroll">
          {hourlyData.map((item) => {
            return (
              <div key={item.time} className="hourly-item">
                <span className="time text-secondary">{item.time}</span>
                <ForecastIcon name={item.icon} size={28} color={item.color} className="weather-icon" />
                <span className="temp font-primary">{item.temp}&deg;</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel daily-forecast">
        <h3 className="section-title font-primary">4-Day Outlook</h3>
        <div className="daily-list">
          {dailyData.map((item) => {
            const left = Math.max(0, Math.min(82, (item.min / 40) * 100));
            const right = Math.max(0, Math.min(82, 100 - (item.max / 40) * 100));

            return (
              <div key={item.day} className="daily-item">
                <span className="day text-secondary">{item.day}</span>
                <div className="icon-wrapper">
                  <ForecastIcon name={item.icon} size={24} color={item.color} />
                </div>
                <div className="temp-range">
                  <span className="min-temp text-secondary">{item.min}&deg;</span>
                  <div className="temp-bar" aria-hidden="true">
                    <div
                      className="temp-bar-fill"
                      style={{
                        left: `${left}%`,
                        right: `${right}%`,
                        background: `linear-gradient(90deg, ${item.color}, var(--color-sun))`,
                      }}
                    ></div>
                  </div>
                  <span className="max-temp">{item.max}&deg;</span>
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
