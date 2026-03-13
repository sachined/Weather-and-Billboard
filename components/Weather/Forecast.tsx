import React from 'react';
import Image from 'next/image';
import styles from './Weather.module.css';
import { ForecastItem } from '@/hooks/useWeather';

interface ForecastProps {
  forecast: ForecastItem[];
  unit: 'celsius' | 'fahrenheit';
}

export default function Forecast({ forecast, unit }: ForecastProps) {
  return (
    <div className={styles.forecastContainer}>
      {forecast.map((day, index) => (
        <div key={index} className={styles.forecastItem}>
          <p className={styles.forecastDate}>{day.date}</p>
          <div className={styles.forecastIcon}>
            <Image
              src={`/icons/${day.iconId}.png`}
              alt={day.description}
              width={32}
              height={32}
            />
          </div>
          <p className={styles.forecastTemp}>
            {unit === 'celsius'
              ? `${day.maxTemp}°`
              : `${Math.floor((day.maxTemp * 9) / 5 + 32)}°`}
            <span className={styles.minTemp}>
              {unit === 'celsius'
                ? `${day.minTemp}°`
                : `${Math.floor((day.minTemp * 9) / 5 + 32)}°`}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}