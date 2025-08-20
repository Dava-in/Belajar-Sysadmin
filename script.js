const STORAGE_KEY = "sysadmin_roadmap_progress_v2";
const THEME_KEY = "sysadmin_theme_v2";

const $ = (s,p=document)=>p.querySelector(s);
const $$ = (s,p=document)=>Array.from(p.querySelectorAll(s));

function loadProgress(){ try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{}}catch{ return {}; } }
function saveProgress(p){ localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }

function setTheme(t){
  if(t==="dark") document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
  localStorage.setItem(THEME_KEY, t);
  const label = $("#theme-label"); if(label) label.textContent = t==="dark" ? "Terang" : "Gelap";
}
function initTheme(){ setTheme(localStorage.getItem(THEME_KEY)||"dark"); }
function toggleTheme(){ setTheme(document.documentElement.classList.contains("dark")?"light":"dark"); }

function progressCount(progress){ return Object.values(progress).filter(Boolean).length; }

function createModuleCard(mod, progress){
  const card = document.createElement("div"); card.className="card";
  const top = document.createElement("div"); top.className="module";

  const btn = document.createElement("button");
  btn.className = "checkbox" + (progress[mod.id] ? " checked" : "");
  btn.setAttribute("aria-label", progress[mod.id] ? "Tandai belum selesai" : "Tandai selesai");
  btn.innerHTML = progress[mod.id] ? "✔" : "";

  const main = document.createElement("div"); main.style.flex="1";

  const meta = document.createElement("div"); meta.className="module-meta"; meta.textContent = `${mod.day} • Minggu ${mod.week}`;
  const title = document.createElement("div"); title.className="module-title"; title.textContent = mod.title;
  const desc = document.createElement("div"); desc.className="module-desc"; desc.textContent = mod.desc;

  const details = document.createElement("div"); details.className="disclosure";
  const headerBtn = document.createElement("button");
  const headLeft = document.createElement("div"); headLeft.textContent = "Lihat Detail";
  const headRight = document.createElement("div"); headRight.textContent = "▾";
  headerBtn.appendChild(headLeft); headerBtn.appendChild(headRight);
  const content = document.createElement("div"); content.className="content"; content.style.display="none";

  if(mod.links && mod.links.length){
    const linksWrap = document.createElement("div"); linksWrap.className="links";
    mod.links.forEach(l=>{
      const a = document.createElement("a"); a.className="link"; a.href=l.url; a.target="_blank"; a.rel="noopener noreferrer";
      a.innerHTML = `🔗 <span>${l.label}</span>`; linksWrap.appendChild(a);
    });
    content.appendChild(linksWrap);
  } else {
    const none = document.createElement("div"); none.className="small muted"; none.textContent="Fokus praktik — tidak ada link eksternal."; content.appendChild(none);
  }

  const checklist = document.createElement("div"); checklist.style.marginTop="8px";
  checklist.innerHTML = `
    <div class="small" style="font-weight:700;margin-bottom:6px">Checklist Praktik</div>
    <ul style="margin:0 0 0 18px; padding:0; line-height:1.8">
      <li>Baca/lihat materi lalu catat perintah penting.</li>
      <li>Praktikkan sesuai tujuan modul.</li>
      <li>Dokumentasikan error & solusinya.</li>
    </ul>`;
  content.appendChild(checklist);

  headerBtn.addEventListener("click", ()=>{
    const isOpen = content.style.display !== "none";
    content.style.display = isOpen ? "none" : "block";
    headRight.textContent = isOpen ? "▾" : "▴";
    headLeft.textContent  = isOpen ? "Lihat Detail" : "Tutup Detail";
  });

  details.appendChild(headerBtn); details.appendChild(content);
  main.appendChild(meta); main.appendChild(title); main.appendChild(desc); main.appendChild(details);
  top.appendChild(btn); top.appendChild(main); card.appendChild(top);

  btn.addEventListener("click", ()=>{
    const p = loadProgress(); p[mod.id] = !p[mod.id]; saveProgress(p); render();
  });
  return card;
}

function render(){
  if(!window.ROADMAP_DATA){ console.warn("ROADMAP_DATA belum tersedia"); return; }
  const progress = loadProgress();
  const query = ($("#search")?.value || "").trim().toLowerCase();
  const weekFilter = (document.querySelector(".pill.active")?.dataset.key) || "all";
  const container = $("#content"); if(!container) return; container.innerHTML = "";

  const filtered = window.ROADMAP_DATA.filter(x => {
    const byWeek = (weekFilter === "all") ? true : String(x.week) === weekFilter;
    const q = !query ? true :
      x.title.toLowerCase().includes(query) ||
      x.desc.toLowerCase().includes(query) ||
      x.day.toLowerCase().includes(query) ||
      (x.links||[]).some(l => l.label.toLowerCase().includes(query));
    return byWeek && q;
  });

  for(let w=1; w<=4; w++){
    const items = filtered.filter(x=>x.week===w);
    const section = document.createElement("section");
    section.innerHTML = `<div class="section-title">Minggu ${w}</div>`;
    if(items.length === 0){
      const small = document.createElement("div"); small.className="small muted"; small.textContent = "Tidak ada hasil untuk filter/kata kunci."; section.appendChild(small);
    } else {
      items.forEach(mod => section.appendChild(createModuleCard(mod, progress)));
    }
    container.appendChild(section);
  }

  const total = window.ROADMAP_DATA.length;
  const done = Object.values(progress).filter(Boolean).length;
  $("#progress-text") && ($("#progress-text").textContent = `${done} dari ${total} modul selesai`);
  $("#progress-pct") && ($("#progress-pct").textContent   = `${Math.round((done/total)*100)}%`);
  $("#progress-fill") && ($("#progress-fill").style.width  = `${(done/total)*100}%`);
}

window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  $("#search") && $("#search").addEventListener("input", render);
  $$(".pill").forEach(p=>p.addEventListener("click", ()=>{
    $$(".pill").forEach(x=>x.classList.remove("active")); p.classList.add("active"); render();
  }));
  $("#reset") && $("#reset").addEventListener("click", ()=>{ localStorage.setItem(STORAGE_KEY, JSON.stringify({})); render(); });
  $("#toggle-theme") && $("#toggle-theme").addEventListener("click", toggleTheme);
  render();
});
