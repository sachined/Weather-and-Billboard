import { useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout';
import { useWeather } from '@/hooks/useWeather';
import { SITE_NAME } from '@/lib/constants';
import WeatherCard from '@/components/Weather/WeatherCard';
import SearchBar from '@/components/Weather/SearchBar';
import SearchHistory from '@/components/Weather/SearchHistory';
import styles from '@/styles/WeatherSeek.module.css';

export default function WeatherSearch() {
  const { 
    weather, 
    error, 
    loading, 
    toggleUnit, 
    getDisplayTemp, 
    fetchWeatherByCity, 
    history,
    removeHistoryItem,
    fetchWeatherByLocation 
  } = useWeather();

  // --- Synchronize Theme to the DOM ---
  useEffect(() => {
    if (weather?.theme) {
      document.documentElement.setAttribute('data-weather-theme', weather.theme);
    } else {
      document.documentElement.removeAttribute('data-weather-theme');
    }
    return () => {
      document.documentElement.removeAttribute('data-weather-theme');
    };
  }, [weather]);

  return (
    <Layout>
      <Head>
        <title>{`Weather Lookup - ${SITE_NAME}`}</title>
      </Head>
        
      <div className={styles.container}>
        <h3 className={styles.title}>
          <span role="img" aria-label="Sun and Cloud">🌤️</span> Weather Lookup
        </h3>

        <div className={styles.searchWrapper}>
          <SearchBar 
            onSearch={fetchWeatherByCity} 
            onLocationClick={() => fetchWeatherByLocation(true)} 
          />
          <SearchHistory 
            history={history} 
            onCityClick={fetchWeatherByCity}
            onRemove={removeHistoryItem}
          />
        </div>
      </div>

      <WeatherCard 
        weather={weather}
        error={error}
        loading={loading}
        toggleUnit={toggleUnit}
        getDisplayTemp={getDisplayTemp}
      />
    </Layout>
  );
}