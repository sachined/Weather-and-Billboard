import React from 'react';
import styles from './Weather.module.css';

interface WeatherHeaderProps {
  iconId: string;
  description: string;
  city: string;
  country: string;
  toggleUnit: () => void;
  displayTemp: string;
}

export default function WeatherHeader({ 
  iconId, 
  description, 
  city, 
  country, 
  toggleUnit, 
  displayTemp 
}: WeatherHeaderProps) {
  return (
    <div className={styles.header} aria-live="polite">
      <img
        src={`/blog/icons/${iconId}.png`}
        alt={description}
        width={80}
        height={80}
      />
      <button onClick={toggleUnit} className={styles.headerButton}>
        {displayTemp}
      </button>
      <p className={styles.description}>{description}</p>
      <p className={styles.location}>{city}, {country}</p>
    </div>
  );
}