import React, { useEffect } from 'react';
import styles from './Dashboard.module.css';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useWeather } from '@/hooks/useWeather';
import { TrendingUp, CloudSun, MapPin, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const GlobalDashboard = () => {
  const { totalValue, appreciation, loading: portfolioLoading } = usePortfolio();
  // Disable auto-location for the dashboard to prioritize search history
  const { weather, history, fetchWeatherByCity, getDisplayTemp, loading: weatherLoading } = useWeather({ autoLocation: false });

  useEffect(() => {
    // If no weather is loaded but history exists, fetch the most recent city
    if (!weather && history.length > 0) {
      fetchWeatherByCity(history[0]);
    }
  }, [history, weather, fetchWeatherByCity]);

  if (portfolioLoading || (weatherLoading && !weather)) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.loadingSkeleton}>Syncing Global Snapshot...</div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Global Snapshot</h2>
        <span className={styles.date}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>

      <div className={styles.grid}>
        {/* Portfolio Section */}
        <Link href="/portfolio" className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper} style={{ color: 'var(--color-success)' }}>
              <TrendingUp size={18} />
            </div>
            <h3>Portfolio Strategy</h3>
            <ExternalLink size={12} className={styles.arrow} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.mainStat}>
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {appreciation.value !== 0 && (
              <div className={`${styles.subStat} ${appreciation.value >= 0 ? styles.positive : styles.negative}`}>
                {appreciation.value >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span>{appreciation.percent.toFixed(2)}%</span>
              </div>
            )}
          </div>
          <p className={styles.footerText}>1-Year Growth Index</p>
        </Link>

        {/* Weather Section */}
        <Link href="/weather-seek" className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper} style={{ color: 'var(--accent-primary)' }}>
              <CloudSun size={18} />
            </div>
            <h3>Recent Weather</h3>
            <ExternalLink size={12} className={styles.arrow} />
          </div>
          {weather ? (
            <div className={styles.statContent}>
              <span className={styles.mainStat}>{getDisplayTemp()}</span>
              <div className={styles.subStat}>
                <MapPin size={14} />
                <span>{weather.city}</span>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>No recent searches found.</div>
          )}
          <p className={styles.footerText}>{weather?.description || 'View real-time global conditions'}</p>
        </Link>
      </div>
    </div>
  );
};

export default GlobalDashboard;