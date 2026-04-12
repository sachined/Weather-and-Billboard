import React from 'react';
import styles from './Weather.module.css';
import { ForecastItem } from '@/hooks/useWeather';

interface ForecastProps {
  forecast: ForecastItem[];
  unit: 'celsius' | 'fahrenheit';
}

const MAX_BAR_PX = 64;

function toDisplay(celsius: number, unit: 'celsius' | 'fahrenheit'): string {
  if (unit === 'fahrenheit') {
    return `${Math.floor((celsius * 9) / 5 + 32)}°`;
  }
  return `${celsius}°`;
}

export default function Forecast({ forecast, unit }: ForecastProps) {
  const weekMin = Math.min(...forecast.map((d) => d.minTemp));
  const weekMax = Math.max(...forecast.map((d) => d.maxTemp));
  const range = weekMax - weekMin || 1;

  return (
    <div className={styles.forecastContainer}>
      <p className={styles.forecastTitle}>5-Day Forecast</p>
      <div className={styles.forecastChart}>
        {forecast.map((day, index) => {
          const barHeight = Math.round(((day.maxTemp - weekMin) / range) * MAX_BAR_PX);
          return (
            <div key={index} className={styles.forecastCol}>
              <span className={styles.forecastMaxTemp}>{toDisplay(day.maxTemp, unit)}</span>
              <img
                src={`/blog/icons/${day.iconId}.png`}
                alt={day.description}
                width={32}
                height={32}
                className={styles.forecastIcon}
              />
              <div className={styles.forecastBarTrack}>
                <div
                  className={styles.forecastBar}
                  style={{ height: `${barHeight}px` }}
                />
              </div>
              <span className={styles.forecastMinTemp}>{toDisplay(day.minTemp, unit)}</span>
              <span className={styles.forecastDate}>{day.date}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
