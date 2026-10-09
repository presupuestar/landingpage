/* PresupuestAR — landing con personalidad y dinamismo */

const CONTACT_WHATSAPP = ""; // Ej: "5492231234567"

const fmt = (n, currency = "ARS") => currency === "USD"
  ? "$" + Math.round(n).toLocaleString("en-US") + " USD"
  : "$ " + Math.round(n).toLocaleString("es-AR");

function parseImporte(txt){
  const clean = String(txt).trim().replace(/\$/g, "").replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(clean)) return NaN;
  return parseFloat(clean);
}

/* ---------- Demo interactiva ---------- */
let catalogo = [];
const extras = [];

const $ = s => document.querySelector(s);
const catalogEl = $("#catalog");

function renderCatalog(){
  catalogEl.innerHTML = "";
  catalogo.forEach(item => {
    const lab = document.createElement("label");
    lab.className = "cat-item" + (item.on ? " on" : "");
    lab.innerHTML = `<input type="checkbox" id="cat-${item.id}" ${item.on ? "checked" : ""}><span></span><em>${fmt(item.price, item.currency)}</em>`;
    lab.querySelector("span").textContent = item.name;
    lab.querySelector("input").addEventListener("change", e => {
      item.on = e.target.checked;
      lab.classList.toggle("on", item.on);
      renderPaper();
    });
    catalogEl.appendChild(lab);
  });
}

function renderPaper(){
  $("#p-cname").textContent = $("#c-name").value.trim() || "Nombre del cliente";
  $("#p-cmail").textContent = $("#c-mail").value.trim() || "correo@cliente.com";
  $("#p-ctel").textContent  = $("#c-tel").value.trim()  || "Teléfono";

  const list = $("#p-items");
  list.innerHTML = "";
  const items = [...catalogo.filter(i => i.on), ...extras];
  
  if (!items.length){
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "Seleccioná ítems o agregá uno a medida";
    list.appendChild(li);
  }
  
  items.forEach(i => {
    const li = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = i.name;
    if (i.custom){
      const t = document.createElement("span");
      t.className = "tag";
      t.textContent = "a medida";
      name.appendChild(t);
    }
    const price = document.createElement("span");
    price.textContent = fmt(i.price, i.currency);
    li.append(name, price);
    list.appendChild(li);
  });
  
  const totals = items.reduce((result, item) => {
    const currency = item.currency || "ARS";
    result[currency] = (result[currency] || 0) + item.price;
    return result;
  }, {});
  $("#p-total").textContent = Object.entries(totals).map(([currency, total]) => fmt(total, currency)).join(" + ") || fmt(0);
}

["#c-name", "#c-mail", "#c-tel"].forEach(id => $(id).addEventListener("input", renderPaper));

$("#builder").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#i-name").value.trim();
  const price = parseImporte($("#i-price").value);
  const hint = $("#i-hint");
  
  if (!name){ 
    hint.textContent = "⚠️ Escribí una descripción para el ítem."; 
    hint.style.color = "var(--red)"; 
    $("#i-name").focus(); 
    return; 
  }
  if (isNaN(price) || price <= 0){ 
    hint.textContent = "⚠️ Revisá el importe: por ejemplo 150.000"; 
    hint.style.color = "var(--red)"; 
    $("#i-price").focus(); 
    return; 
  }
  
  extras.push({ name, price, custom: true });
  $("#i-name").value = ""; 
  $("#i-price").value = "";
  hint.textContent = "✨ ¡Ítem agregado con éxito al PDF!";
  hint.style.color = "var(--green)";
  
  renderPaper();
  
  setTimeout(() => {
    hint.textContent = "Escribí el importe con o sin puntos.";
    hint.style.color = "var(--muted)";
  }, 3000);
});

// Formato de miles en tiempo real
$("#i-price").addEventListener("input", e => {
  const digits = e.target.value.replace(/\D/g, "");
  e.target.value = digits ? Number(digits).toLocaleString("es-AR") : "";
});

$("#dl").addEventListener("click", () => { 
  const msg = $("#dl-msg");
  msg.hidden = false;
  msg.style.animation = "none";
  msg.offsetHeight; /* trigger reflow */
  msg.style.animation = null;
});

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
const paper = $("#paper");

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

  catalogo = m.items.map(item => ({ ...item }));
  extras.length = 0;
  renderCatalog();
  renderPaper();
  
  paper.style.setProperty("--co", m.c1);
  paper.style.setProperty("--co2", m.c2);
  paper.style.setProperty("--pt", m.titleFont);
  paper.style.setProperty("--pb", m.bodyFont);
  $("#p-mark").src = m.logo;
  $("#p-company").textContent = m.name;
  
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

/* ---------- Contacto WhatsApp ---------- */
if (CONTACT_WHATSAPP){
  const a = document.createElement("a");
  a.className = "btn btn-wa";
  a.href = "https://wa.me/" + CONTACT_WHATSAPP + "?text=" + encodeURIComponent("Hola, quiero PresupuestAR para mi negocio.");
  a.target = "_blank";
  a.rel = "noopener";
  a.textContent = "Quiero PresupuestAR";
  $("#cta-btns").prepend(a);
}

setMarca(0);