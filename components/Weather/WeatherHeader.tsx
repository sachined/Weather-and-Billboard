import React from 'react';
import styles from './Weather.module.css';

interface WeatherHeaderProps {
  iconId: string;
  description: string;
  city: string;
  country: string;
  toggleUnit: () => void;
  displayTemp: string;
  feelsLike: number;
  unit: 'celsius' | 'fahrenheit';
}

export default function WeatherHeader({
  iconId,
  description,
  city,
  country,
  toggleUnit,
  displayTemp,
  feelsLike,
  unit
}: WeatherHeaderProps) {
  const feelsLikeDisplay = unit === 'celsius'
    ? `${feelsLike}°C`
    : `${Math.floor((feelsLike * 9) / 5 + 32)}°F`;

  return (
    <div className={styles.header} aria-live="polite">
      <p className={styles.headerLocation}>{city}, {country}</p>
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <button onClick={toggleUnit} className={styles.headerButton}>
            {displayTemp}
          </button>
          <p className={styles.description}>{description}</p>
          <p className={styles.headerFeelsLike}>Feels like {feelsLikeDisplay}</p>
        </div>
        <img
          className={styles.headerIcon}
          src={`/blog/icons/${iconId}.png`}
          alt={description}
          width={72}
          height={72}
        />
      </div>
    </div>
  );
}
