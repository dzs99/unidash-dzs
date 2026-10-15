import { mockTransactions } from "../data/mock.data.js"

function money(value) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value)
}

export function renderFinanceVisual() {
  const list = document.querySelector("#transaction-list")
  list.innerHTML = mockTransactions.map((item) => `
    <article class="list-item">
      <div class="list-item-main"><p class="list-item-title">${item.description}</p><p class="list-item-meta">${item.category} · ${item.date}</p></div>
      <strong class="${item.type === "income" ? "text-emerald-400" : "text-rose-400"}">${item.type === "income" ? "+" : "-"}${money(item.amount)}</strong>
    </article>`).join("")
}

export function initFinanceVisualDemo() {
  renderFinanceVisual()
  document.querySelector("#transaction-form")?.addEventListener("submit", (event) => {
    event.preventDefault()
    alert("Sesión 1: el formulario ya está diseñado. La persistencia se implementa en la Sesión 2.")
  })
}
