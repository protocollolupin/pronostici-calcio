const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

let DATA = null;

function openDrawer() {
  $("#drawer").classList.add("open");
  $("#backdrop").hidden = false;
  $("#drawer").setAttribute("aria-hidden", "false");
}
function closeDrawer() {
  $("#drawer").classList.remove("open");
  $("#backdrop").hidden = true;
  $("#drawer").setAttribute("aria-hidden", "true");
}
function showPage(id) {
  $$("[data-page]").forEach(p => p.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
  closeDrawer();
  // Keep scroll position sane on mobile
  window.scrollTo({ top: 0, behavior: "instant" });
}

function rowHTML(time, match, quota, subtitle=null){
  const sub = subtitle ? `<div class="p-pick">${subtitle}</div>` : "";
  const matchHtml = subtitle ? `<div><div class="p-match">${match}</div>${sub}</div>` : `<div class="match">${match}</div>`;
  return `
    <div class="row">
      <div class="time">${time || ""}</div>
      ${matchHtml}
      <div class="quota">@${quota}</div>
    </div>
  `;
}

function compactList(containerId, items, mode){
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = items.map(it => {
    if (mode === "withPick") {
      const [t, home, away, pick, q] = it;
      return rowHTML(t, `${home} – ${away}`, q, pick);
    }
    if (mode === "simplePick") {
      const [home, away, pick] = it;
      return rowHTML("", `${home} – ${away}`, "—", pick);
    }
    return "";
  }).join("");
}

function protocolHome(){
  const el = $("#protocolHome");
  el.innerHTML = DATA.protocol_home.map(([match, pick]) => `
    <div class="play">
      <div class="match">${match}</div>
      <div class="pick">${pick}</div>
    </div>
  `).join("");
}

function mgTempi(){
  const el = $("#mgTempiList");
  el.innerHTML = DATA.lists.multigol_tempi.map(([h,a,p1,p2]) => `
    <div class="row">
      <div class="time">—</div>
      <div class="match">${h} – ${a}</div>
      <div class="quota">${p1} / ${p2}</div>
    </div>
  `).join("");
}

function htSolide(){
  const el = $("#htSolideList");
  el.innerHTML = DATA.lists.ht_solide.map(([h,a]) => `
    <div class="row">
      <div class="time">—</div>
      <div class="match">${h} – ${a}</div>
      <div class="quota">SOLIDA</div>
    </div>
  `).join("");
}

function mgCO(){
  const casa = $("#mgCasaList");
  casa.innerHTML = DATA.lists.multigol_casa.map(([h,a,p]) => `
    <div class="row">
      <div class="time">—</div>
      <div class="match">${h} – ${a}</div>
      <div class="quota">${p}</div>
    </div>
  `).join("");
  const osp = $("#mgOspiteList");
  osp.innerHTML = DATA.lists.multigol_ospite.map(([h,a,p]) => `
    <div class="row">
      <div class="time">—</div>
      <div class="match">${h} – ${a}</div>
      <div class="quota">${p}</div>
    </div>
  `).join("");
}

function mgTot(){
  const el = $("#mgTotList");
  el.innerHTML = DATA.lists.multigol_totale.map(([h,a,p]) => `
    <div class="row">
      <div class="time">—</div>
      <div class="match">${h} – ${a}</div>
      <div class="quota">${p}</div>
    </div>
  `).join("");
}

function schedineRender(){
  const wrap = $("#schedineWrap");
  wrap.innerHTML = "";
  const entries = Object.entries(DATA.lists.schedine);
  for (const [title, picks] of entries){
    const ticket = document.createElement("div");
    ticket.className = "ticket";
    const count = picks.length;
    ticket.innerHTML = `
      <div class="ticket-head">
        <div class="ticket-title">${title}</div>
        <div class="badge">${count} eventi</div>
      </div>
      <div class="ticket-body">
        ${picks.map(([m,p]) => `
          <div class="pickrow">
            <div class="p-match">${m}</div>
            <div class="p-pick">${p}</div>
          </div>
        `).join("")}
      </div>
    `;
    wrap.appendChild(ticket);
  }
}

async function init(){
  // Events
  $("#menuBtn").addEventListener("click", openDrawer);
  $("#closeBtn").addEventListener("click", closeDrawer);
  $("#backdrop").addEventListener("click", closeDrawer);
  $$(".navitem").forEach(btn => {
    btn.addEventListener("click", () => showPage(btn.dataset.target));
  });

  // Load data
  const res = await fetch("data.json", { cache: "no-store" });
  DATA = await res.json();

  protocolHome();
  // Lists
  compactList("listOver15", DATA.lists.over15, "withPick");
  compactList("listHT", DATA.lists.ht, "withPick");
  compactList("listOver35", DATA.lists.over35, "withPick");

  mgTot();
  mgCO();
  mgTempi();
  htSolide();
  schedineRender();

  // default page is home (already active)
}

init().catch(err => {
  console.error(err);
  alert("Errore nel caricamento dei dati. Controlla data.json.");
});