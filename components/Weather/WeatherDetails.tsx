import React from 'react';
import styles from './Weather.module.css';

interface WeatherDetailsProps {
  humidity: number;
  windSpeed: number;
  sunrise: number;
  sunset: number;
  unit: 'celsius' | 'fahrenheit';
}

function fmt(ts: number): string {
  return new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function WeatherDetails({
  humidity,
  windSpeed,
  sunrise,
  sunset,
  unit,
}: WeatherDetailsProps) {
  const windDisplay = unit === 'celsius'
    ? `${windSpeed.toFixed(1)} m/s`
    : `${(windSpeed * 2.237).toFixed(1)} mph`;

  return (
    <div className={styles.detailsStrip}>
      <div className={styles.detailCell}>
        <span className={styles.detailLabel}>Humidity</span>
        <span className={styles.detailValue}>{humidity}%</span>
      </div>
      <div className={styles.detailCell}>
        <span className={styles.detailLabel}>Wind</span>
        <span className={styles.detailValue}>{windDisplay}</span>
      </div>
      <div className={styles.detailCell}>
        <span className={styles.detailLabel}>Sunrise</span>
        <span className={styles.detailValue}>{fmt(sunrise)}</span>
      </div>
      <div className={styles.detailCell}>
        <span className={styles.detailLabel}>Sunset</span>
        <span className={styles.detailValue}>{fmt(sunset)}</span>
      </div>
    </div>
  );
}
