import React from 'react';
import styles from './Weather.module.css';

interface WeatherDetailsProps {
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  sunrise: number;
  sunset: number;
  unit: 'celsius' | 'fahrenheit';
}

export default function WeatherDetails({
  feelsLike,
  humidity,
  windSpeed,
  sunrise,
  sunset,
  unit
}: WeatherDetailsProps) {
  return (
    <div className={styles.detailsGrid}>
      <div className={styles.detailItem}>
        <span className={styles.detailLabel}>Feels Like</span>
        <span className={styles.detailValue}>
          {unit === 'celsius'
            ? `${feelsLike}°C`
            : `${Math.floor((feelsLike * 9) / 5 + 32)}°F`}
        </span>
      </div>
      <div className={styles.detailItem}>
        <span className={styles.detailLabel}>Humidity</span>
        <span className={styles.detailValue}>{humidity}%</span>
      </div>
      <div className={styles.detailItem}>
        <span className={styles.detailLabel}>Wind Speed</span>
        <span className={styles.detailValue}>
          {unit === 'celsius'
            ? `${windSpeed.toFixed(1)} m/s`
            : `${(windSpeed * 2.237).toFixed(1)} mph`}
        </span>
      </div>
      <div className={styles.detailItem}>
        <span className={styles.detailLabel}>Sunrise / Sunset</span>
        <span className={styles.detailValueSmall}>
          {new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} / {' '}
          {new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}