import { seedDemoData } from "./services/storage.service.js"
import { initTasksModule, refreshTasks } from "./modules/tasks.module.js"
import { initFinanceModule, refreshFinance } from "./modules/finance.module.js"
import { refreshDashboard } from "./modules/dashboard.module.js"
import { renderAnalytics } from "./modules/charts.module.js"
import { initExternalVisualDemo } from "./modules/external.module.js"

const viewTitles={dashboard:["Datos locales","Dashboard"],tasks:["CRUD + LocalStorage","Tareas"],finance:["CRUD + LocalStorage","Finanzas"],analytics:["Datos calculados","Estadísticas"],currency:["Aún en modo mock","Divisas"],news:["Aún en modo mock","Noticias"]}
function showView(name){document.querySelectorAll(".view-section").forEach(s=>s.classList.remove("active"));document.querySelector(`#view-${name}`)?.classList.add("active");document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===name));const[e,t]=viewTitles[name]||viewTitles.dashboard;document.querySelector("#page-eyebrow").textContent=e;document.querySelector("#page-title").textContent=t;document.querySelector("#sidebar").classList.remove("open");if(name==="analytics")renderAnalytics()}
function initNavigation(){document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));document.querySelectorAll("[data-go-view]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.goView)));document.querySelector("#mobile-menu-button").addEventListener("click",()=>document.querySelector("#sidebar").classList.toggle("open"))}
function refreshAll(){refreshTasks();refreshFinance();refreshDashboard();renderAnalytics()}
function bootstrap(){seedDemoData();initNavigation();initTasksModule(refreshAll);initFinanceModule(refreshAll);refreshDashboard();renderAnalytics();initExternalVisualDemo()}
bootstrap()
