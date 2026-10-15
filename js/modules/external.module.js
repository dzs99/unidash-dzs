import { mockLocation, mockWeather, mockRates, mockNews, mockCurrencyHistory } from "../data/mock.data.js"
let currencyChart
function escapeHtml(v){return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}

export function renderExternalVisuals() {
  document.querySelector("#location-status").textContent = `${mockLocation.city}, ${mockLocation.region} · DEMO`
  document.querySelector("#weather-icon").textContent = mockWeather.icon
  document.querySelector("#weather-temperature").textContent = `${mockWeather.temperature}°C`
  document.querySelector("#weather-description").textContent = `${mockWeather.description} · Sensación ${mockWeather.apparentTemperature}°`
  document.querySelector("#base-currency-label").textContent = "MXN"
  const ratesHtml = mockRates.map((x)=>`<article class="rate-card"><p class="rate-code">MXN → ${x.quote}</p><p class="rate-value">${x.rate}</p></article>`).join("")
  document.querySelector("#dashboard-rates").innerHTML = ratesHtml
  document.querySelector("#currency-rate-list").innerHTML = ratesHtml
  const newsHtml = mockNews.map((x)=>`<article class="news-card"><div class="news-card-body"><p class="eyebrow">${x.source.name} · DEMO</p><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.description)}</p><span class="text-cyan-400">Contenido simulado</span></div></article>`).join("")
  document.querySelector("#news-list").innerHTML = newsHtml
  document.querySelector("#news-context").textContent = "Noticias simuladas para visualizar el componente antes de conectar una API."
  document.querySelector("#dashboard-news").innerHTML = mockNews.slice(0,3).map((x)=>`<article class="list-item"><div class="list-item-main"><p class="list-item-title">${escapeHtml(x.title)}</p><p class="list-item-meta">${x.source.name} · DEMO</p></div></article>`).join("")
  const selects=["#currency-from","#currency-to","#currency-history-quote"].map((s)=>document.querySelector(s)); const currencies=["MXN","USD","EUR","GBP","JPY","CAD"]; selects.forEach((el)=>el.innerHTML=currencies.map(c=>`<option>${c}</option>`).join("")); document.querySelector("#currency-from").value="MXN"; document.querySelector("#currency-to").value="USD"; document.querySelector("#currency-history-quote").value="USD"
  if(currencyChart)currencyChart.destroy(); currencyChart=new Chart(document.querySelector("#currency-history-chart"),{type:"line",data:{labels:mockCurrencyHistory.labels,datasets:[{label:"MXN/USD · DEMO",data:mockCurrencyHistory.values,borderColor:"#22d3ee",backgroundColor:"rgba(34,211,238,.12)",fill:true,tension:.3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:"#cbd5e1"}}},scales:{x:{ticks:{color:"#94a3b8"},grid:{display:false}},y:{ticks:{color:"#94a3b8"},grid:{color:"rgba(148,163,184,.08)"}}}}})
}

export function initExternalVisualDemo(){
  renderExternalVisuals()
  document.querySelector("#detect-location-button")?.addEventListener("click",()=>alert("La geolocalización real se conectará en la Sesión 3."))
  document.querySelector("#currency-form")?.addEventListener("submit",(e)=>{e.preventDefault();document.querySelector("#currency-result").textContent="Sesión 1: conversión visual; API real en Sesión 3."})
}
