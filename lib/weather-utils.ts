export const KELVIN = 273;
export const kelvinToCelsius = (k: number) => Math.floor(k - KELVIN);

export const getThemeFromIcon = (iconId: string): string | null => {
  const code = iconId.substring(0, 2);
  const mapping: Record<string, string> = {
    '01': 'clear',          // Clear sky
    '02': 'clouds',         // Few clouds
    '03': 'clouds',         // Scattered clouds
    '04': 'clouds',         // Broken clouds
    '09': 'rain',           // Shower rain
    '10': 'rain',           // Rain
    '11': 'rain',           // Thunderstorm
    '13': 'snow',           // Snow
    '50': 'mist',           // Mist
  };
  return mapping[code] || null;
};