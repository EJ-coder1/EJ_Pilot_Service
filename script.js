/* EJ Pilot Service — single-page GitHub Pages build. Edit SITE and PRICING only. */
const SITE = {
  messengerUsername: "YOUR_FACEBOOK_USERNAME",
  gcashNumber: "09XXXXXXXXX",
  heroDataUrl: "https://raw.githubusercontent.com/Ceplin03/database-mlbb.Mobile-Legends-Bang-Bang/master/hero.json",
  heroImageBase: "https://raw.githubusercontent.com/Ceplin03/database-mlbb.Mobile-Legends-Bang-Bang/master/images-hero/"
};

const PRICING = [
  { rank: "Epic", note: "Per star", rate: 0 },
  { rank: "Legend", note: "Per star", rate: 0 },
  { rank: "Mythic", note: "Per star", rate: 0 },
  { rank: "Mythical Honor", note: "25★ tier", rate: 0 },
  { rank: "Mythical Glory", note: "50★ tier", rate: 0 },
  { rank: "Mythical Immortal", note: "100★ tier", rate: 0, featured: true }
];

const FALLBACK_HEROES = [
  "Aamon","Akai","Aldous","Alice","Alpha","Alucard","Angela","Argus","Arlott","Atlas","Aulus","Aurora",
  "Badang","Balmond","Bane","Barats","Baxia","Beatrix","Belerick","Benedetta","Brody","Bruno","Carmilla","Cecilion","Chang'e","Chip","Chou","Cici","Claude","Clint","Cyclops",
  "Diggie","Dyrroth","Edith","Esmeralda","Estes","Eudora","Fanny","Faramis","Floryn","Franco","Fredrinn","Freya","Gatotkaca","Gloo","Gord","Granger","Grock","Guinevere","Gusion",
  "Hanabi","Hanzo","Harith","Harley","Hayabusa","Helcurt","Hilda","Hirara","Hylos","Irithel","Ixia","Jawhead","Johnson","Joy","Julian","Kadita","Kagura","Kaja","Kalea","Karina","Karrie","Khaleed","Khufra","Kimmy",
  "Lancelot","Lapu-Lapu","Layla","Leomord","Lesley","Ling","Lolita","Lukas","Lunox","Luo Yi","Lylia","Marcel","Martis","Masha","Mathilda","Melissa","Minotaur","Minsitthar","Miya","Moskov","Nana","Natalia","Natan","Nolan","Novaria","Obsidia","Odette",
  "Paquito","Pharsa","Phoveus","Popol and Kupa","Rafaela","Roger","Ruby","Saber","Selena","Silvanna","Sora","Sun","Suyou","Terizla","Thamuz","Tigreal","Uranus","Vale","Valentina","Valir","Vexana","Wanwan","X.Borg","Xavier","Yi Sun-shin","Yin","Yu Zhong","Yve","Zetian","Zhask","Zhuxin","Zilong"
];

const FALLBACK_ROLE = {
  "Aamon":"Assassin","Akai":"Tank","Aldous":"Fighter","Alice":"Mage","Alpha":"Fighter","Alucard":"Fighter","Angela":"Support","Argus":"Fighter","Arlott":"Fighter","Atlas":"Tank","Aulus":"Fighter","Aurora":"Mage",
  "Badang":"Fighter","Balmond":"Fighter","Bane":"Fighter","Barats":"Tank","Baxia":"Tank","Beatrix":"Marksman","Belerick":"Tank","Benedetta":"Assassin","Brody":"Marksman","Bruno":"Marksman",
  "Carmilla":"Support","Cecilion":"Mage","Chang'e":"Mage","Chip":"Support","Chou":"Fighter","Cici":"Fighter","Claude":"Marksman","Clint":"Marksman","Cyclops":"Mage",
  "Diggie":"Support","Dyrroth":"Fighter","Edith":"Tank","Esmeralda":"Mage","Estes":"Support","Eudora":"Mage","Fanny":"Assassin","Faramis":"Support","Floryn":"Support","Franco":"Tank","Fredrinn":"Fighter","Freya":"Fighter",
  "Gatotkaca":"Tank","Gloo":"Tank","Gord":"Mage","Granger":"Marksman","Grock":"Tank","Guinevere":"Fighter","Gusion":"Assassin","Hanabi":"Marksman","Hanzo":"Assassin","Harith":"Mage","Harley":"Mage","Hayabusa":"Assassin","Helcurt":"Assassin","Hilda":"Fighter","Hirara":"Assassin","Hylos":"Tank",
  "Irithel":"Marksman","Ixia":"Marksman","Jawhead":"Fighter","Johnson":"Tank","Joy":"Assassin","Julian":"Fighter","Kadita":"Mage","Kagura":"Mage","Kaja":"Support","Kalea":"Support","Karina":"Assassin","Karrie":"Marksman","Khaleed":"Fighter","Khufra":"Tank","Kimmy":"Marksman",
  "Lancelot":"Assassin","Lapu-Lapu":"Fighter","Layla":"Marksman","Leomord":"Fighter","Lesley":"Marksman","Ling":"Assassin","Lolita":"Tank","Lukas":"Fighter","Lunox":"Mage","Luo Yi":"Mage","Lylia":"Mage","Marcel":"Support","Martis":"Fighter","Masha":"Fighter","Mathilda":"Support","Melissa":"Marksman","Minotaur":"Tank","Minsitthar":"Fighter","Miya":"Marksman","Moskov":"Marksman",
  "Nana":"Mage","Natalia":"Assassin","Natan":"Marksman","Nolan":"Assassin","Novaria":"Mage","Obsidia":"Marksman","Odette":"Mage","Paquito":"Fighter","Pharsa":"Mage","Phoveus":"Fighter","Popol and Kupa":"Marksman","Rafaela":"Support","Roger":"Fighter","Ruby":"Fighter","Saber":"Assassin","Selena":"Assassin","Silvanna":"Fighter","Sora":"Fighter","Sun":"Fighter","Suyou":"Assassin","Terizla":"Fighter","Thamuz":"Fighter","Tigreal":"Tank","Uranus":"Tank","Vale":"Mage","Valentina":"Mage","Valir":"Mage","Vexana":"Mage","Wanwan":"Marksman","X.Borg":"Fighter","Xavier":"Mage","Yi Sun-shin":"Assassin","Yin":"Fighter","Yu Zhong":"Fighter","Yve":"Mage","Zetian":"Mage","Zhask":"Mage","Zhuxin":"Mage","Zilong":"Fighter"
};

const RANKS = ["Warrior","Elite","Master","Grandmaster","Epic","Legend","Mythic","Mythical Honor","Mythical Glory","Mythical Immortal"];
let HEROES = [];
let selectedHero = "";
let activeRole = "All";

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

function formatPeso(value){ return "₱" + Number(value).toLocaleString("en-PH"); }
function initials(name){ return name.split(/\s+/).map(p=>p[0]).join("").slice(0,2).toUpperCase(); }
function showToast(message){ const el=$("#toast"); el.textContent=message; el.classList.add("show"); clearTimeout(showToast.t); showToast.t=setTimeout(()=>el.classList.remove("show"),3200); }

function cleanHeroData(list){
  return list.map((h)=>({
    name:h.name_hero,
    role:(h.role && h.role[0]) ? h.role[0][0].toUpperCase()+h.role[0].slice(1) : (FALLBACK_ROLE[h.name_hero]||"Hero"),
    roles:(h.role||[]),
    image:h["images-hero"] || ""
  })).filter(h=>h.name && h.image);
}

async function loadHeroes(){
  try{
    const res=await fetch(SITE.heroDataUrl,{cache:"no-store"});
    if(!res.ok) throw new Error("Hero data request failed");
    const data=await res.json();
    const parsed=cleanHeroData(data);
    if(parsed.length<100) throw new Error("Hero dataset looks incomplete");
    HEROES=parsed;
  }catch(error){
    HEROES=FALLBACK_HEROES.map(name=>({name,role:FALLBACK_ROLE[name]||"Hero",roles:[(FALLBACK_ROLE[name]||"Hero").toLowerCase()],image:name.toLowerCase().replace(/[^a-z0-9]+/g,"-")+".png"}));
    showToast("Hero images use the built-in fallback list.");
  }
  renderHeroes();
  renderFeatured();
}

function heroByName(name){ return HEROES.find(h=>h.name===name); }
function heroImage(hero){ return hero ? SITE.heroImageBase + hero.image : ""; }

function populateRanks(){
  ["currentRank","targetRank"].forEach((id)=>$("#"+id).innerHTML=RANKS.map(r=>`<option value="${r}">${r}</option>`).join(""));
  $("#currentRank").value="Epic"; $("#targetRank").value="Legend";
}
function getRate(rank){ return PRICING.find(p=>p.rank===rank)?.rate || 0; }

function updateSummary(){
  const current=$("#currentRank").value, target=$("#targetRank").value, stars=Math.max(1,Number($("#stars").value)||1), rate=getRate(target);
  $("#summaryCurrent").textContent=current; $("#summaryTarget").textContent=target; $("#summaryStars").textContent=stars;
  $("#estimate").textContent=rate>0?formatPeso(rate*stars):"₱—";
  $("#estimateNote").textContent=rate>0?`${formatPeso(rate)} × ${stars} star(s). Confirm the final quote.`:`Set the ${target} rate in script.js.`;
}

function renderPricing(){
  $("#pricingGrid").innerHTML=PRICING.map(p=>`<article class="price-card ${p.featured?"featured":""}"><span class="tier">${p.note}</span>${p.featured?'<span class="tag">FEATURED</span>':''}<h3>${p.rank}</h3><div class="rate">${p.rate>0?formatPeso(p.rate):"₱XX"}<small>${p.rate>0?"per star":"set your rate"}</small></div></article>`).join("");
}

function renderFeatured(){
  if(!HEROES.length) return;
  const featured=[heroByName("Kalea"),heroByName("Sora"),heroByName("Obsidia")].filter(Boolean);
  const picks=featured.length===3?featured:[...HEROES.slice(-3)];
  $("#featuredHeroName").textContent=picks[0]?.name||"MLBB Hero";
  $("#featuredHeroRole").textContent=picks[0]?.role||"Hero";
  $("#featuredHeroImage").src=heroImage(picks[0]);
  $("#featuredHeroImage2").src=heroImage(picks[1]);
  $("#featuredHeroImage3").src=heroImage(picks[2]);
}

function renderHeroes(){
  const query=$("#heroSearch").value.toLowerCase().trim();
  const list=HEROES.filter(h=>h.name.toLowerCase().includes(query) && (activeRole==="All" || h.roles.some(r=>r.toLowerCase()===activeRole.toLowerCase())));
  $("#heroCount").textContent=list.length;
  $("#heroGrid").innerHTML=list.length?list.map(h=>{
    const selected=h.name===selectedHero;
    return `<button class="hero-item ${selected?"selected":""}" type="button" data-hero="${h.name.replace(/"/g,"&quot;")}" aria-pressed="${selected}">
      <div class="hero-avatar"><img src="${heroImage(h)}" alt="${h.name}" loading="lazy" width="160" height="160" onerror="this.remove();this.parentElement.innerHTML='<span>${initials(h.name)}</span>'"></div>
      <div class="hero-meta"><span class="hero-name">${h.name}</span><span class="hero-role">${h.role}</span></div><span class="hero-check">✓</span>
    </button>`;
  }).join(""):`<p class="muted">No heroes match your search.</p>`;
  $$(".hero-item").forEach(btn=>btn.addEventListener("click",()=>selectHero(btn.dataset.hero)));
}

function selectHero(name){
  selectedHero=name;
  const h=heroByName(name);
  $("#chosenHero").innerHTML=`<div class="chosen-thumb"><img src="${heroImage(h)}" alt="${name}" onerror="this.remove();this.parentElement.textContent='${initials(name)}'"/></div><div><span>Hero preference</span><strong>${name} · ${h?.role||"Hero"}</strong></div>`;
  renderHeroes();
  document.getElementById("order").scrollIntoView({behavior:"smooth",block:"center"});
}

function createOrderMessage(){
  if(SITE.messengerUsername.includes("YOUR_")){showToast("Replace YOUR_FACEBOOK_USERNAME in script.js first.");return;}
  const target=$("#targetRank").value, stars=Math.max(1,Number($("#stars").value)||1), rate=getRate(target);
  const message=[
    "Hello EJ Pilot Service! I want to place an order.","",
    `Name: ${$("#customerName").value.trim()||"Not provided"}`,
    `Current Rank: ${$("#currentRank").value}`,
    `Target Rank: ${target}`,
    `Target Stars/Points: ${stars}`,
    `Preferred Hero: ${selectedHero||"No preference"}`,
    `Preferred Role: ${$("#preferredRole").value}`,
    `Preferred Schedule: ${$("#schedule").value}`,
    `MLBB ID: ${$("#mlId").value.trim()||"Not provided"}`,
    `Server ID: ${$("#server").value.trim()||"Not provided"}`,
    `Website Estimate: ${rate>0?formatPeso(rate*stars):"To confirm"}`,
    "","Please send me the final price and available schedule."
  ].join("\n");
  window.open(`https://m.me/${SITE.messengerUsername}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
}

function copyGcash(){
  if(SITE.gcashNumber.includes("X")){showToast("Replace the placeholder GCash number in script.js first.");return;}
  if(navigator.clipboard?.writeText){navigator.clipboard.writeText(SITE.gcashNumber).then(()=>showToast("GCash number copied."),()=>showToast(SITE.gcashNumber));}
  else showToast(SITE.gcashNumber);
}

function setupReveal(){
  const items=$$(".reveal");
  if(!("IntersectionObserver" in window)){items.forEach(i=>i.classList.add("visible"));return;}
  const io=new IntersectionObserver((entries,obs)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");obs.unobserve(e.target);}})},{threshold:.08,rootMargin:"0px 0px -50px 0px"});
  items.forEach(i=>io.observe(i));
}

function setupFilters(){
  $("#heroSearch").addEventListener("input",renderHeroes);
  $$(".role-filter").forEach(btn=>btn.addEventListener("click",()=>{ $$(".role-filter").forEach(b=>{b.classList.remove("active");b.setAttribute("aria-selected","false")}); btn.classList.add("active");btn.setAttribute("aria-selected","true");activeRole=btn.dataset.role;renderHeroes(); }));
}
function setupModals(){
  $("#showQr").addEventListener("click",()=>$("#qrModal").classList.remove("hidden"));
  $$('[data-close]').forEach(b=>b.addEventListener("click",()=>{$("#qrModal").classList.add("hidden");$("#proofModal").classList.add("hidden");}));
  $$(".proof-slot").forEach(slot=>slot.addEventListener("click",()=>{const img=$("#proofPreview");img.src=slot.dataset.proof;img.onerror=()=>{img.removeAttribute("src");showToast("Add the proof image inside images/proofs/ first.")};$("#proofModal").classList.remove("hidden");}));
  $$(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.add("hidden")}));
}

function init(){
  populateRanks();renderPricing();updateSummary();setupFilters();setupModals();setupReveal();loadHeroes();
  ["currentRank","targetRank","stars"].forEach(id=>{ $("#"+id).addEventListener("input",updateSummary);$("#"+id).addEventListener("change",updateSummary); });
  $("#messageOrder").addEventListener("click",createOrderMessage);$("#copyGcash").addEventListener("click",copyGcash);
}

document.addEventListener("DOMContentLoaded",init);
