import React from 'react';
import Image from 'next/image';
import { WeatherData } from '../../hooks/useWeather';

interface WeatherCardProps {
  weather: WeatherData | null;
  error: string | null;
  loading: boolean;
  toggleUnit: () => void;
  getDisplayTemp: () => string;
}

export default function WeatherCard({ 
  weather, 
  error, 
  loading, 
  toggleUnit, 
  getDisplayTemp 
}: WeatherCardProps) {
  return (
    <div style={cardStyle}>
      {loading ? (
        <p style={messageStyle}>Loading weather...</p>
      ) : error ? (
        <p style={{ ...messageStyle, color: '#dc2626' }} role="alert">{error}</p>
      ) : weather ? (
        <div style={{ textAlign: 'center' }} aria-live="polite">
          <Image 
            src={`/icons/${weather.iconId}.png`} 
            alt={weather.description} 
            width={80}
            height={80}
            priority
          />
          <button 
            onClick={toggleUnit}
            aria-label={`Current temperature is ${getDisplayTemp()}. Click to toggle between Celsius and Fahrenheit.`}
            style={buttonStyle}
          >
            {getDisplayTemp()}
          </button>
          <p style={descriptionStyle}>
            {weather.description}
          </p>
          <p style={locationStyle}>
            {weather.city}, {weather.country}
          </p>
        </div>
      ) : null}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-surface)',
  borderRadius: '16px',
  padding: '2.5rem 2rem',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  border: '1px solid var(--border-subtle)',
  maxWidth: '400px',
  width: '100%',
  margin: '0 auto'
};

const messageStyle: React.CSSProperties = {
  textAlign: 'center',
  color: 'var(--text-muted)'
};

const buttonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  margin: '1rem 0', 
  fontSize: '3rem', 
  fontWeight: '800', 
  cursor: 'pointer',
  fontFamily: 'inherit',
  color: 'var(--text-main)',
  display: 'block',
  width: '100%',
  transition: 'transform 0.2s'
};

const descriptionStyle: React.CSSProperties = {
  margin: '0.5rem 0', 
  fontSize: '1.2rem', 
  color: 'var(--text-main)', 
  fontWeight: '600',
  textTransform: 'capitalize'
};

const locationStyle: React.CSSProperties = {
  margin: '0.5rem 0', 
  fontSize: '1rem', 
  color: 'var(--text-muted)'
};
