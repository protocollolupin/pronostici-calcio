(async function(){
  const $ = (id)=>document.getElementById(id);
  const drawer = $("drawer");
  const backdrop = $("backdrop");
  const openDrawer = ()=>{
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden","false");
    backdrop.hidden = false;
  };
  const closeDrawer = ()=>{
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden","true");
    backdrop.hidden = true;
  };
  $("menuBtn").addEventListener("click", openDrawer);
  $("closeBtn").addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);

  // close drawer on nav click
  drawer.addEventListener("click", (e)=>{
    const a = e.target.closest("a");
    if(a){ closeDrawer(); }
  });

  let data;
  try{
    const res = await fetch("data.json", {cache:"no-store"});
    data = await res.json();
  }catch(err){
    console.error(err);
    $("brandSub").textContent = "Errore caricamento dati";
    return;
  }

  $("brandSub").textContent = "Aggiornato: " + (data.updated || "");
  const telegram = data.telegram || "https://t.me/";
  $("telegramBtn").href = telegram;

  const row = (item, opts={})=>{
    const el = document.createElement("div");
    el.className = "row";
    el.innerHTML = `
      <div class="row-top">
        <div>
          <div class="match">${escapeHtml(item.match)}</div>
          <div class="meta">${escapeHtml(item.time || "")} • ${escapeHtml(item.league || "")}</div>
        </div>
        ${item.odd ? `<div class="odd">${escapeHtml(item.odd)}</div>` : ``}
      </div>
      ${item.pick ? `<div class="pick"><span class="pill good">${escapeHtml(item.pick)}</span><span class="pill">${item.odd ? "Quota" : ""}</span></div>` : ``}
      ${item.reason ? `<div class="meta" style="margin-top:8px;"><span class="pill bad">Esclusa</span> ${escapeHtml(item.reason)}</div>` : ``}
    `;
    return el;
  };

  const simple = (item)=>{
    const el = document.createElement("div");
    el.className = "row";
    el.innerHTML = `
      <div class="row-top">
        <div>
          <div class="match">${escapeHtml(item.match)}</div>
          <div class="meta">${item.pick ? escapeHtml(item.pick) : ""}</div>
        </div>
        <div class="odd">${item.odd ? escapeHtml(item.odd) : ""}</div>
      </div>`;
    return el;
  };

  // Protocollo (home)
  const pWrap = $("protocolloWrap");
  (data.protocollo || []).forEach(p=>{
    const box = document.createElement("div");
    box.className = "proto";
    box.innerHTML = `<div class="proto-title">${escapeHtml(p.title || "Giocata")}</div>`;
    (p.events || []).forEach((ev)=>{
      const line = document.createElement("div");
      line.className = "ev";
      line.innerHTML = `
        <div>
          <div class="match">${escapeHtml(ev.match)}</div>
          <div class="m">${escapeHtml(ev.market)}</div>
        </div>
      `;
      box.appendChild(line);
    });
    pWrap.appendChild(box);
  });

  // Lists
  fillList($("htSolide"), data.lists?.ht_solide, true);
  fillList($("htEscluse"), data.lists?.ht_escluse, false);
  fillList($("over15List"), data.lists?.over15, true);
  fillList($("over35List"), data.lists?.over35, true);

  // Mixed slips
  const mixWrap = $("mixWrap");
  (data.mixed_slips || []).forEach(s=>{
    const card = document.createElement("div");
    card.className = "slip";
    card.innerHTML = `
      <div class="slip-head">
        <div class="slip-title">${escapeHtml(s.title || "Schedina")}</div>
        <div class="target">${escapeHtml(s.target || "")}</div>
      </div>
    `;
    (s.events || []).forEach((ev)=>{
      const line = document.createElement("div");
      line.className = "ev";
      line.innerHTML = `
        <div>
          <div class="match">${escapeHtml(ev.match)}</div>
          <div class="m">${escapeHtml(ev.market)}</div>
        </div>
      `;
      card.appendChild(line);
    });
    mixWrap.appendChild(card);
  });

  // Multigol
  fillSimple($("mgCasaOspite"), data.multigol?.casa_ospite);
  fillSimple($("mg1t"), data.multigol?.primo_tempo);
  fillSimple($("mg2t"), data.multigol?.secondo_tempo);
  fillSimple($("mgTot"), data.multigol?.totale);

  function fillList(container, arr, showPick){
    container.innerHTML = "";
    (arr || []).forEach(it=>{
      const el = document.createElement("div");
      el.className = "row";
      const topOdd = it.odd ? `<div class="odd">${escapeHtml(it.odd)}</div>` : "";
      const pick = it.pick ? `<div class="pick"><span class="pill good">${escapeHtml(it.pick)}</span><span class="pill">Quota</span></div>` : "";
      const reason = it.reason ? `<div class="meta" style="margin-top:8px;"><span class="pill bad">Esclusa</span> ${escapeHtml(it.reason)}</div>` : "";
      el.innerHTML = `
        <div class="row-top">
          <div>
            <div class="match">${escapeHtml(it.match)}</div>
            <div class="meta">${escapeHtml(it.time || "")} • ${escapeHtml(it.league || "")}</div>
          </div>
          ${topOdd}
        </div>
        ${pick}
        ${reason}
      `;
      container.appendChild(el);
    });
  }

  function fillSimple(container, arr){
    container.innerHTML = "";
    (arr || []).forEach(it=>{
      const el = document.createElement("div");
      el.className = "row";
      el.innerHTML = `
        <div class="row-top">
          <div>
            <div class="match">${escapeHtml(it.match)}</div>
            <div class="meta">${escapeHtml(it.pick || "")}</div>
          </div>
        </div>
      `;
      container.appendChild(el);
    });
  }

  function escapeHtml(s){
    return String(s ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }
})();
