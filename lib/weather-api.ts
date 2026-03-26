import { BASE_PATH } from './constants';

export const fetchWeather = async (type: 'weather' | 'forecast', params: string, signal?: AbortSignal) => {
    const res = await fetch(
        `${BASE_PATH}/api/weather/current?type=${type}&params=${encodeURIComponent(params)}`,
        { signal }
    );
    if (!res.ok) {
        if (res.status === 404) throw new Error('City not found');
        throw new Error(`Failed to fetch ${type} data`);
    }
    return res.json();
};