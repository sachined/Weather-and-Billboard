import React from 'react';
import { WeatherData } from '@/hooks/useWeather';
import styles from './Weather.module.css';
import WeatherHeader from './WeatherHeader';
import WeatherDetails from './WeatherDetails';
import Forecast from './Forecast';

interface WeatherCardProps {
  weather: WeatherData | null;
  error: string | null;
  loading: boolean;
  toggleUnit: () => void;
  getDisplayTemp: () => string;
}

export default function WeatherCard({ weather, error, loading, toggleUnit, getDisplayTemp }: WeatherCardProps) {
  return (
    <div className={styles.card}>
      {loading ? (
        <p className={styles.message}>Loading weather...</p>
      ) : error ? (
        <p className={styles.errorMessage} role="alert">{error}</p>
      ) : weather ? (
        <>
          <WeatherHeader
            iconId={weather.iconId}
            description={weather.description}
            city={weather.city}
            country={weather.country}
            toggleUnit={toggleUnit}
            displayTemp={getDisplayTemp()}
            feelsLike={weather.feelsLike}
            unit={weather.unit}
          />
          
          <WeatherDetails
            humidity={weather.humidity}
            windSpeed={weather.windSpeed}
            sunrise={weather.sunrise}
            sunset={weather.sunset}
            unit={weather.unit}
          />

          <Forecast
            forecast={weather.forecast}
            unit={weather.unit}
          />
        </>
      ) : null}
    </div>
  );
}
