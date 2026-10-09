/* PresupuestAR — landing */

const $ = s => document.querySelector(s);

/* ---------- Selector de marcas ---------- */
const marcas = [
  {
    name: "STICKEALA!", short: "S!", logo: "logotipo-stickeala.png", c1: "#000583", c2: "#00ff1a",
    titleFont: '"Anton", sans-serif', bodyFont: '"Bebas Neue", sans-serif',
    barText: "#FFFFFF", actionColor: "#000583", actionText: "#FFFFFF",
    items: [
      { id: "stickers100", name: "100 stickers", price: 29990, displayPrice: "$29.990", currency: "ARS", on: true },
      { id: "corte", name: "Corte personalizado", price: 5000, displayPrice: "$5.000", currency: "ARS", on: true }
    ],
    total: "$34.990"
  },
  {
    name: "sCode Digital Solutions", short: "sC", logo: "logotipo-scode.png", logoSurface: "#FFFFFF", c1: "#9F5CFF", c2: "#6D3FCC",
    titleFont: '"Space Grotesk", sans-serif', bodyFont: '"Inter", sans-serif',
    barText: "#101614", actionColor: "#6D3FCC", actionText: "#FFFFFF",
    items: [{ id: "landing", name: "Desarrollo de landing page", price: 150, displayPrice: "$150 USD", currency: "USD", on: true }],
    total: "$150 USD"
  },
];

const pick = $("#brand-pick");
const mini = $("#mini-app");

function setMarca(idx){
  const m = marcas[idx];
  mini.style.setProperty("--m1", m.c1);
  mini.style.setProperty("--m2", m.c2);
  mini.style.setProperty("--m1-text", m.barText);
  mini.style.setProperty("--ma", m.actionColor);
  mini.style.setProperty("--m2-text", m.actionText);
  mini.style.setProperty("--mt", m.titleFont);
  mini.style.setProperty("--mb", m.bodyFont);
  mini.style.setProperty("--logo-surface", m.logoSurface || "transparent");
  mini.style.setProperty("--logo-padding", m.logoSurface ? "3px" : "0px");
  $("#m-logo").src = m.logo;
  $("#m-name").textContent = m.name;

  const miniItems = $("#m-items");
  miniItems.replaceChildren(...m.items.map(item => {
    const row = document.createElement("div");
    const name = document.createElement("span");
    const price = document.createElement("span");
    row.className = "mini-row";
    name.textContent = item.name;
    price.textContent = item.displayPrice;
    row.append(name, price);
    return row;
  }));
  $("#m-total").textContent = m.total;

  pick.querySelectorAll(".swatch").forEach((b, i) => b.setAttribute("aria-checked", String(i === idx)));
}

marcas.forEach((m, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "swatch";
  b.id = "brand-" + i;
  b.setAttribute("role", "radio");
  b.innerHTML = `<i style="background:linear-gradient(135deg, ${m.c1} 50%, ${m.c2} 50%)"></i>`;
  b.append(m.name);
  b.addEventListener("click", () => setMarca(i));
  pick.appendChild(b);
});

setMarca(0);