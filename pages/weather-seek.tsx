import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/layout';
import { useWeather } from '../hooks/useWeather';
import { SITE_NAME } from '../lib/constants';
import WeatherCard from '../components/Weather/WeatherCard';

export default function WeatherSearch() {
  const [city, setCity] = useState('');
  const { weather, error, loading, toggleUnit, getDisplayTemp, fetchWeatherByCity } = useWeather();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherByCity(city);
  };

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
          
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '400px' }}>
            <input 
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name (e.g. New York)"
              aria-label="City name"
              style={{
                flex: 1,
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
                fontSize: '1rem'
              }}
            />
            <button 
              type="submit"
              style={{
                padding: '0.8rem 1.5rem',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Search
            </button>
          </form>
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
