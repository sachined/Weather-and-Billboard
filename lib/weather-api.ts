const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const fetchWeather = async (type: 'weather' | 'forecast', params: string, signal?: AbortSignal) => {
    const res = await fetch(`${BASE_URL}/${type}?${params}&appid=${API_KEY}`, { signal });
    if (!res.ok) {
        if (res.status === 404) throw new Error('City not found');
        throw new Error(`Failed to fetch ${type} data`);
    }
    return res.json();
};