const weatherCodes = {
  0: ["☀️", "Despejado"],
  1: ["🌤️", "Mayormente despejado"],
  2: ["⛅", "Parcialmente nublado"],
  3: ["☁️", "Nublado"],
  45: ["🌫️", "Niebla"],
  48: ["🌫️", "Niebla con escarcha"],
  51: ["🌦️", "Llovizna ligera"],
  53: ["🌦️", "Llovizna"],
  55: ["🌧️", "Llovizna intensa"],
  61: ["🌦️", "Lluvia ligera"],
  63: ["🌧️", "Lluvia"],
  65: ["🌧️", "Lluvia intensa"],
  71: ["🌨️", "Nieve ligera"],
  73: ["🌨️", "Nieve"],
  75: ["❄️", "Nieve intensa"],
  80: ["🌦️", "Chubascos"],
  81: ["🌦️", "Chubascos"],
  82: ["🌧️", "Chubascos intensos"],
  95: ["⛈️", "Tormenta"]
}

export async function getWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    forecast_days: "5"
  })
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  if (!response.ok) {
    throw new Error('No fue posible consultar el clima')
  }
  return response.json()
}

export function weatherDescription(code) {
  return weatherCodes[code] || ["🌡️", "Condición Actual"]
}
