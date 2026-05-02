import { useState, useEffect } from 'react';
import { Search, MapPin, Bell, LocateFixed } from 'lucide-react';
import './Header.css';

const Header = ({ location, onSearch }) => {
  const [time, setTime] = useState(new Date());
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  const quickCities = ['Pune', 'Mumbai', 'Delhi'];

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="header-container animate-slide-up">
      <div className="header-left">
        <div className="location-badge glass-pill">
          <MapPin size={18} className="text-gradient-accent" />
          <span className="location-name">{location || 'New York, USA'}</span>
        </div>
      </div>

      <div className="header-center">
        <form className="search-bar glass-panel" onSubmit={handleSearch}>
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search city, zip code..." 
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-submit" type="submit" aria-label="Search weather">
            <Search size={16} />
          </button>
        </form>
        <div className="quick-searches" aria-label="Quick city searches">
          <button type="button" className="quick-location-btn" onClick={() => onSearch('current location')}>
            <LocateFixed size={14} />
            Current
          </button>
          {quickCities.map((city) => (
            <button type="button" className="quick-city-btn" key={city} onClick={() => onSearch(city)}>
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="header-right">
        <div className="datetime-display">
          <span className="time font-primary">{formattedTime}</span>
          <span className="date text-secondary">{formattedDate}</span>
        </div>
        <button className="icon-btn glass-pill">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
