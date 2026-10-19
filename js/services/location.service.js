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
