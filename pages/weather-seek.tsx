import { useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/layout';
import { useWeather } from '../hooks/useWeather';
import { SITE_NAME } from '../lib/constants';
import WeatherCard from '../components/Weather/WeatherCard';
import SearchBar from '../components/Weather/SearchBar';
import SearchHistory from '../components/Weather/SearchHistory';

export default function WeatherSearch() {
  const { 
    weather, 
    error, 
    loading, 
    toggleUnit, 
    getDisplayTemp, 
    fetchWeatherByCity, 
    history, 
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
        
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2rem',
        gap: '1.5rem'
      }}>
        <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.5rem', textAlign: 'center' }}>
          <span role="img" aria-label="Sun and Cloud">🌤️</span> Weather Lookup
        </h3>

        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <SearchBar 
            onSearch={fetchWeatherByCity} 
            onLocationClick={() => fetchWeatherByLocation(true)} 
          />
          <SearchHistory 
            history={history} 
            onCityClick={fetchWeatherByCity} 
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