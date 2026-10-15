export const mockLocation = {
  city: "León",
  region: "Guanajuato",
  country: "México",
  countryCode: "MX",
  latitude: 21.122,
  longitude: -101.683
}

export const mockWeather = {
  temperature: 24,
  apparentTemperature: 25,
  description: "Parcialmente nublado",
  icon: "⛅",
  humidity: 41,
  wind: 12
}

export const mockTasks = [
  { id: "task-1", title: "Entregar proyecto de programación", description: "Revisar README y subir el repositorio.", category: "Universidad", priority: "high", status: "pending", dueDate: "2026-10-02" },
  { id: "task-2", title: "Estudiar para examen de redes", description: "Repasar direccionamiento y servicios.", category: "Universidad", priority: "medium", status: "pending", dueDate: "2026-10-05" },
  { id: "task-3", title: "Actualizar portafolio", description: "Agregar evidencia del proyecto actual.", category: "Personal", priority: "low", status: "completed", dueDate: "2026-09-29" },
  { id: "task-4", title: "Preparar presentación", description: "Terminar diapositivas para exposición.", category: "Proyecto", priority: "high", status: "pending", dueDate: "2026-10-08" }
]

export const mockTransactions = [
  { id: "tx-1", description: "Beca", type: "income", amount: 4500, category: "Beca", date: "2026-09-03" },
  { id: "tx-2", description: "Proyecto freelance", type: "income", amount: 7500, category: "Trabajo", date: "2026-09-11" },
  { id: "tx-3", description: "Comida", type: "expense", amount: 1800, category: "Comida", date: "2026-09-08" },
  { id: "tx-4", description: "Transporte", type: "expense", amount: 850, category: "Transporte", date: "2026-09-14" },
  { id: "tx-5", description: "Suscripciones", type: "expense", amount: 600, category: "Suscripciones", date: "2026-09-18" },
  { id: "tx-6", description: "Material universidad", type: "expense", amount: 1500, category: "Universidad", date: "2026-09-22" }
]

export const mockRates = [
  { quote: "USD", rate: 0.0580 },
  { quote: "EUR", rate: 0.0540 },
  { quote: "GBP", rate: 0.0465 },
  { quote: "JPY", rate: 8.9700 },
  { quote: "CAD", rate: 0.0780 }
]

export const mockNews = [
  { title: "Universidades fortalecen programas de innovación tecnológica", description: "Nuevas iniciativas acercan a estudiantes a proyectos de desarrollo e innovación.", source: { name: "Noticias Campus" }, url: "#" },
  { title: "La inteligencia artificial transforma el aprendizaje universitario", description: "Herramientas de IA se incorporan a proyectos y actividades académicas.", source: { name: "Tecnología Hoy" }, url: "#" },
  { title: "Empresas buscan talento joven con habilidades digitales", description: "Desarrollo web, datos y automatización continúan entre las áreas de mayor interés.", source: { name: "Economía Digital" }, url: "#" }
]

export const mockFinanceSeries = {
  labels: ["Abr", "May", "Jun", "Jul", "Ago", "Sep"],
  income: [8200, 9600, 8800, 10400, 11200, 12000],
  expense: [5100, 5900, 5400, 6100, 6400, 4750]
}

export const mockCurrencyHistory = {
  labels: ["01", "05", "10", "15", "20", "25", "30"],
  values: [0.0568, 0.0571, 0.0567, 0.0576, 0.0582, 0.0578, 0.0580]
}
