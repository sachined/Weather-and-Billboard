import { useState, useEffect } from 'react';

export interface WeatherData {
  temp: number;
  description: string;
  iconId: string;
  city: string;
  country: string;
  unit: 'celsius' | 'fahrenheit';
}

const API_KEY = "3c89aa25e1ffe7033918798686e4e89a";
const KELVIN = 273;

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Attempt local weather on mount
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (err) => {
          console.warn("Geolocation denied or failed:", err.message);
          setLoading(false);
          // Don't show error if it's just geolocation denied, let them search
        }
      );
    }
  }, []);

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
      if (!res.ok) throw new Error("Failed to fetch weather data");
      const data = await res.json();
      updateWeatherData(data);
    } catch (err: any) {
      setError(`Error fetching weather: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (city: string) => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("City not found");
        throw new Error("Failed to fetch weather data");
      }
      const data = await res.json();
      updateWeatherData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateWeatherData = (data: any) => {
    setWeather({
      temp: Math.floor(data.main.temp - KELVIN),
      description: data.weather[0].description,
      iconId: data.weather[0].icon,
      city: data.name,
      country: data.sys.country,
      unit: 'celsius'
    });
  };

  const toggleUnit = () => {
    if (!weather) return;
    setWeather(prev => {
      if (!prev) return null;
      return {
        ...prev,
        unit: prev.unit === 'celsius' ? 'fahrenheit' : 'celsius'
      };
    });
  };

  const getDisplayTemp = () => {
    if (!weather) return '-';
    if (weather.unit === 'celsius') return `${weather.temp}°C`;
    const f = Math.floor((weather.temp * 9) / 5 + 32);
    return `${f}°F`;
  };

  return { weather, error, loading, toggleUnit, getDisplayTemp, fetchWeatherByCity };
}
