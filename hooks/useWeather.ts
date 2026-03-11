import { useState, useEffect, useCallback } from 'react';
import { fetchWeather } from '../lib/weather-api';
import { kelvinToCelsius, getThemeFromIcon } from '../lib/weather-utils';

export interface ForecastItem {
  date: string;
  temp: number; // Daily high (approximate)
  minTemp: number;
  maxTemp: number;
  description: string;
  iconId: string;
}

export interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  iconId: string;
  city: string;
  country: string;
  unit: 'celsius' | 'fahrenheit';
  forecast: ForecastItem[];
  sunrise: number;
  sunset: number;
  theme: string | null;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('celsius');

  const [isUnitLoaded, setIsUnitLoaded] = useState(false);

  useEffect(() => {
    // Load unit preference
    const savedUnit = localStorage.getItem('weatherUnit');
    if (savedUnit === 'celsius' || savedUnit === 'fahrenheit') {
      setUnit(savedUnit);
    }
    
    // Load history
    const saved = localStorage.getItem('weatherSearchHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history:", e);
      }
    }

    setIsUnitLoaded(true);
  }, []);


  const updateWeatherData = useCallback((current: any, forecast: any) => {
    const dailyData: { [key: string]: any } = {};

    forecast.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          min: item.main.temp_min,
          max: item.main.temp_max,
          iconId: item.weather[0].icon,
          description: item.weather[0].description
        };
      } else {
        dailyData[date].min = Math.min(dailyData[date].min, item.main.temp_min);
        dailyData[date].max = Math.max(dailyData[date].max, item.main.temp_max);
        if (item.dt_txt.includes("12:00:00")) {
          dailyData[date].iconId = item.weather[0].icon;
          dailyData[date].description = item.weather[0].description;
        }
      }
    });

    const forecastItems: ForecastItem[] = Object.values(dailyData).slice(0, 5).map(day => ({
      date: day.date,
      temp: kelvinToCelsius(day.max),
      minTemp: kelvinToCelsius(day.min),
      maxTemp: kelvinToCelsius(day.max),
      description: day.description,
      iconId: day.iconId
    }));

    setWeather({
      temp: kelvinToCelsius(current.main.temp),
      feelsLike: kelvinToCelsius(current.main.feels_like),
      humidity: current.main.humidity,
      windSpeed: current.wind.speed,
      description: current.weather[0].description,
      iconId: current.weather[0].icon,
      city: current.name,
      country: current.sys.country,
      unit,
      forecast: forecastItems,
      sunrise: current.sys.sunrise,
      sunset: current.sys.sunset,
      theme: getThemeFromIcon(current.weather[0].icon)
    });
  }, [unit]);

  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = `lat=${lat}&lon=${lon}`;
      const [currData, foreData] = await Promise.all([
        fetchWeather('weather', params),
        fetchWeather('forecast', params)
      ]);
      updateWeatherData(currData, foreData);
    } catch (err: any) {
      setError(`Error fetching weather: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [updateWeatherData]);

  const fetchWeatherByCity = useCallback(async (city: string) => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const params = `q=${encodeURIComponent(city)}`;
      const [currData, foreData] = await Promise.all([
        fetchWeather('weather', params),
        fetchWeather('forecast', params)
      ]);
      updateWeatherData(currData, foreData);

      // Update History
      const cityName = currData.name;
      setHistory(prev => {
        const filtered = prev.filter(c => c.toLowerCase() !== cityName.toLowerCase());
        const updated = [cityName, ...filtered].slice(0, 5);
        localStorage.setItem('weatherSearchHistory', JSON.stringify(updated));
        return updated;
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [updateWeatherData]);

  const fetchWeatherByLocation = useCallback((showError = true) => {
    if (!('geolocation' in navigator)) {
      if (showError) setError("Geolocation is not supported by this browser.");
      return;
    }
    setLoading(true);
    if (showError) setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (err) => {
        console.warn("Geolocation denied or failed:", err.message);
        setLoading(false);
        if (showError) {
          setError(`Error fetching weather: ${err.message}`);
        }
      }
    );
  }, [fetchWeatherByCoords]);

  const toggleUnit = useCallback(() => {
    setUnit(prev => {
      const newUnit = prev === 'celsius' ? 'fahrenheit' : 'celsius';
      localStorage.setItem('weatherUnit', newUnit);
      if (weather) {
        setWeather({ ...weather, unit: newUnit });
      }
      return newUnit;
    });
  }, [weather]);

  const getDisplayTemp = useCallback(() => {
    if (!weather) return '-';
    if (weather.unit === 'celsius') return `${weather.temp}°C`;
    const f = Math.floor((weather.temp * 9) / 5 + 32);
    return `${f}°F`;
  }, [weather]);

  useEffect(() => {
    if (isUnitLoaded) {
      // Attempt geolocation on mount after unit is loaded
      fetchWeatherByLocation(false);
    }
  }, [isUnitLoaded, fetchWeatherByLocation]);

  return {
    weather,
    error,
    loading,
    toggleUnit,
    getDisplayTemp,
    fetchWeatherByCity,
    history,
    fetchWeatherByLocation
  };
}