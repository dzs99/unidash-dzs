# UniDash — Código nuevo de la sesión 3

Clase: **Aplicaciones de Internet, 15 de octubre de 2026**.

Este documento contiene completos los tres archivos nuevos trabajados en la grabación. La configuración conserva la clave de ejemplo. Los servicios de ubicación y clima quedan preparados; al final de esta clase todavía no están conectados a la interfaz, y divisas y noticias siguen en modo DEMO.

Se normalizó el formato y se aplicaron las correcciones mínimas detalladas al final. Por ello, es una versión funcional del código de la clase, no una copia carácter por carácter.

## Archivos nuevos

- `js/config.example.js`
- `js/services/location.service.js`
- `js/services/weather.service.js`

## js/config.example.js

```javascript
export const APP_CONFIG = {
  gnewsApiKey: 'YOUR_GNEWS_API_KEY'
}
```

## js/services/location.service.js

```javascript
export async function getCurrentCoordinates() {
  if (!navigator.geolocation) {
    throw new Error('Tu navegador no soporta geolocalizacion')
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => resolve({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }),
    () => reject(new Error('No fue posible encontrar la ubicacion')),
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000
    })
  })
}

export async function reverseGeocode(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    localityLanguage: "es"
  })
  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${params}`)

  if (!response.ok) {
    throw new Error('No fue posible ubicar tu ciudad')
  }

  const data = await response.json()

  return {
    city: data.city || data.locality || data.principalSubdivision || 'Ubicacion Actual',
    region: data.principalSubdivision || '',
    country: data.countryName || '',
    countryCode: (data.countryCode || 'MX').toUpperCase(),
    latitude,
    longitude
  }
}

export async function detectLocation() {
  try {
    const coordinates = await getCurrentCoordinates()
    return await reverseGeocode(coordinates.latitude, coordinates.longitude)
  } catch {
    const response = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=es')
    if (!response.ok) {
      throw new Error('No fue posible ubicar tu ciudad')
    }
    const data = await response.json()
    return {
      city: data.city || data.locality || data.principalSubdivision || 'Ubicacion Actual',
      region: data.principalSubdivision || '',
      country: data.countryName || '',
      countryCode: (data.countryCode || 'MX').toUpperCase(),
      latitude: data.latitude,
      longitude: data.longitude
    }
  }
}

const currencyByCountry = {
  MX: "MXN", US: "USD", CA: "CAD", GB: "GBP", JP: "JPY", CN: "CNY", KR: "KRW",
  BR: "BRL", AR: "ARS", CL: "CLP", CO: "COP", PE: "PEN", UY: "UYU", PY: "PYG",
  BO: "BOB", CR: "CRC", GT: "GTQ", HN: "HNL", NI: "NIO", PA: "PAB", DO: "DOP",
  IN: "INR", AU: "AUD", NZ: "NZD", CH: "CHF", NO: "NOK", SE: "SEK", DK: "DKK",
  PL: "PLN", CZ: "CZK", HU: "HUF", ZA: "ZAR", TR: "TRY", SG: "SGD", HK: "HKD",
  AE: "AED", SA: "SAR", IL: "ILS", TH: "THB", MY: "MYR", ID: "IDR", PH: "PHP",
  EG: "EGP", MA: "MAD"
}

const euroCountries = new Set([
  "AT", "BE", "BG", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT",
  "LU", "MT", "NL", "PT", "SK", "SI", "ES"
])

export function currencyForCountry(countryCode) {
  if (euroCountries.has(countryCode)) return "EUR"
  return currencyByCountry[countryCode] || "USD"
}

export function languageForCountry(countryCode) {
  const spanish = new Set(["MX", "AR", "CL", "CO", "PE", "UY", "PY", "BO", "CR", "GT", "HN", "NI", "PA", "DO", "ES"])
  if (spanish.has(countryCode)) return "es"
  if (countryCode === "BR" || countryCode === "PT") return "pt"
  if (countryCode === "FR") return "fr"
  if (countryCode === "DE" || countryCode === "AT") return "de"
  if (countryCode === "IT") return "it"
  return "en"
}
```

## js/services/weather.service.js

```javascript
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
```

## Correcciones frente a lo visible en la grabación

| Archivo | En la grabación | En esta versión |
|---|---|---|
| `location.service.js` | `fetch(...)` sin `await` en `reverseGeocode` | Espera la respuesta antes de leer `.ok` y `.json()`. |
| `location.service.js` | `if (response.ok)` en la alternativa de `detectLocation` | `if (!response.ok)`: sólo lanza el error cuando la respuesta falla. |
| `location.service.js` | `latitude` y `longitude` sin declarar en el `catch` | Lee `data.latitude` y `data.longitude` de la respuesta por IP. |
| `weather.service.js` | `wind_speed_10` | `wind_speed_10m`. |
| `weather.service.js` | `weatherCodes(code)` | `weatherCodes[code]`, porque el catálogo es un objeto. |

El catálogo de monedas e idiomas se conserva como en la clase; no es una lista universal. Los iconos se transcribieron desde la grabación. No se agregaron otros servicios ni se generaron claves API.

### Diferencias exactas de las correcciones

```diff
--- grabacion/js/services/location.service.js
+++ proyecto/js/services/location.service.js
@@ -23,7 +23,7 @@
     longitude: String(longitude),
     localityLanguage: "es"
   })
-  const response = fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${params}`)
+  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${params}`)
 
   if (!response.ok) {
     throw new Error('No fue posible ubicar tu ciudad')
@@ -47,7 +47,7 @@
     return await reverseGeocode(coordinates.latitude, coordinates.longitude)
   } catch {
     const response = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=es')
-    if (response.ok) {
+    if (!response.ok) {
       throw new Error('No fue posible ubicar tu ciudad')
     }
     const data = await response.json()
@@ -56,8 +56,8 @@
       region: data.principalSubdivision || '',
       country: data.countryName || '',
       countryCode: (data.countryCode || 'MX').toUpperCase(),
-      latitude,
-      longitude
+      latitude: data.latitude,
+      longitude: data.longitude
     }
   }
 }
```

```diff
--- grabacion/js/services/weather.service.js
+++ proyecto/js/services/weather.service.js
@@ -24,7 +24,7 @@
   const params = new URLSearchParams({
     latitude: String(latitude),
     longitude: String(longitude),
-    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10",
+    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
     daily: "weather_code,temperature_2m_max,temperature_2m_min",
     timezone: "auto",
     forecast_days: "5"
@@ -37,5 +37,5 @@
 }
 
 export function weatherDescription(code) {
-  return weatherCodes(code) || ["🌡️", "Condición Actual"]
+  return weatherCodes[code] || ["🌡️", "Condición Actual"]
 }
```

## Comprobaciones

- Se validó la sintaxis de JavaScript.
- Pruebas con respuestas externas simuladas: geolocalización disponible, denegada y no soportada; alternativa por IP; errores HTTP; moneda e idioma por país; parámetros del pronóstico y descripción del clima.
- Se comprobó en Safari que un movimiento actualiza las métricas del dashboard y persiste al recargar.
- No se consultó ni transmitió la ubicación real del usuario para las pruebas. No se afirma una integración visual del clima que el profesor aún no hizo en esta clase.

## Material de referencia

- Grabación en Teams/SharePoint: `Aplicaciones de Internet - 15Oct26.mp4`.
- Cierre de LocalStorage: aproximadamente 00:00–24:20.
- Configuración: aproximadamente 26:40–28:06.
- Servicio de ubicación: aproximadamente 28:06–54:52.
- Servicio del clima: aproximadamente 55:23–1:06:16.
- Instrucción de entregar un MD: aproximadamente 1:07:06.
- [Repositorio del profesor](https://github.com/MarcoARamirezS/aplicaciones-de-internet-ad-2026/tree/58d1f32/projects/unidash360/docs).
