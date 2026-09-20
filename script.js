/* =======================================================
   EJ Pilot Service — script.js
   Edit only SITE and PRICING to configure the site.
   Hero data is embedded — no network fetch required.
   ======================================================= */

/* ===================== SITE CONFIG ===================== */
const SITE = {
  facebookLink: "https://www.facebook.com/share/19aeGJULcA/",
  apiBase: ""
};

/* ===================== PRICING CONFIG ===================== */
/*
  All rates in Philippine Peso (₱).
  These are market-standard rates for PH ML pilot services.

  BASE_RATES   — fixed per-star/point rate without MMR
  MMR_RATES    — fixed per-star/point rate for PH or Global MMR
  DIFFICULTY_SURCHARGE — extra ₱/star for high-difficulty heroes (Fanny, etc.)
  TOP_RANK_SURCHARGE   — extra ₱/star for Top 1 / Top 10 / Top 50 / Top 100
*/
const PRICING = {
  /* Fixed per-star rates. Only the offered rank tiers appear here. */
  BASE_RATES: {
    "Grandmaster":       20,
    "Epic":              25,
    "Legend":            30,
    "Mythic":             30,
    "Mythical Honor":     30,
    "Mythical Glory":     35,
    "Mythical Immortal":  40
  },

  /* PH and Global MMR use fixed per-star rates. */
  MMR_RATES: {
    "Grandmaster":       35,
    "Epic":              35,
    "Legend":            35,
    "Mythic":             35,
    "Mythical Honor":     35,
    "Mythical Glory":     40,
    "Mythical Immortal":  40
  },

  /* Extra ₱ per star/point for high-difficulty heroes (Fanny, Ling, etc.). */
  DIFFICULTY_SURCHARGE: {
    high:   8,   // Fanny, Ling, Hayabusa, Gusion, Lancelot, etc.
    normal: 0
  },

  /* Extra ₱ per star/point when a Top Rank target is selected under MMR. */
  TOP_RANK_SURCHARGE: {
    "1":   15,  // Top 1 Global / PH — hardest
    "10":  10,
    "50":   6,
    "100":  4
  },

  /* Pricing cards displayed in Pricing section. */
  CARDS: [
    { rank: "Grandmaster",       note: "Per star",  rateKey: "Grandmaster"       },
    { rank: "Epic",              note: "Per star",  rateKey: "Epic"              },
    { rank: "Legend",            note: "Per star",  rateKey: "Legend"            },
    { rank: "Mythic",             note: "Per point", rateKey: "Mythic"             },
    { rank: "Mythical Honor",     note: "Per point", rateKey: "Mythical Honor"     },
    { rank: "Mythical Glory",     note: "Per point", rateKey: "Mythical Glory"     },
    { rank: "Mythical Immortal",  note: "Per point", rateKey: "Mythical Immortal", featured: true }
  ]
};

/* ===================== RANK SYSTEM ===================== */
/*
  Each offered rank tier has:
  - divisions: number of sub-divisions (I, II, III … from bottom to top)
  - starsPerDiv: stars required per division
  - totalStars: total stars to exit this tier (to next tier)
  - isPoints: true for Mythic+ (uses points, not stars)
  - minPoints / maxPoints: for Mythic+ tiers
*/
const RANK_TIERS = [
  { name: "Grandmaster",       divisions: 5, starsPerDiv: 5, totalStars: 25, isPoints: false },
  { name: "Epic",              divisions: 5, starsPerDiv: 5, totalStars: 25, isPoints: false },
  { name: "Legend",            divisions: 5, starsPerDiv: 5, totalStars: 25, isPoints: false },
  { name: "Mythic",            divisions: 0, starsPerDiv: 0, totalStars: 25, isPoints: true, minPoints: 0,  maxPoints: 24 },
  { name: "Mythical Honor",    divisions: 0, starsPerDiv: 0, totalStars: 25, isPoints: true, minPoints: 25, maxPoints: 49 },
  { name: "Mythical Glory",    divisions: 0, starsPerDiv: 0, totalStars: 50, isPoints: true, minPoints: 50, maxPoints: 99 },
  { name: "Mythical Immortal", divisions: 0, starsPerDiv: 0, totalStars: 0,  isPoints: true, minPoints: 100, maxPoints: 9999 }
];

const RANK_NAMES = RANK_TIERS.map(t => t.name);

/* ===================== HERO DATA ===================== */
/*
  difficulty: "normal" | "high"
  High difficulty heroes add PRICING.DIFFICULTY_SURCHARGE.high per star/point.
*/
const HEROES = [
{name:"Aamon",      img:"images/heroes/aamon.png",      role:"Assassin",  roles:["Assassin"],              difficulty:"high"},
{name:"Akai",       img:"images/heroes/akai.png",       role:"Tank",      roles:["Tank"],                  difficulty:"normal"},
{name:"Aldous",     img:"images/heroes/aldous.png",     role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Alice",      img:"images/heroes/alice.png",       role:"Tank",      roles:["Tank","Mage"],           difficulty:"normal"},
{name:"Alpha",      img:"images/heroes/alpha.png",      role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Alucard",    img:"images/heroes/alucard.png",    role:"Fighter",   roles:["Fighter","Assassin"],    difficulty:"normal"},
{name:"Angela",     img:"images/heroes/angela.png",     role:"Support",   roles:["Support"],               difficulty:"normal"},
{name:"Argus",      img:"images/heroes/argus.png",      role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Arlott",     img:"images/heroes/arlott.png",     role:"Fighter",   roles:["Fighter","Assassin"],    difficulty:"high"},
{name:"Atlas",      img:"images/heroes/atlas.png",      role:"Tank",      roles:["Tank"],                  difficulty:"high"},
{name:"Aulus",      img:"images/heroes/aulus.png",      role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Aurora",     img:"images/heroes/aurora.png",     role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Badang",     img:"images/heroes/badang.png",     role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Balmond",    img:"images/heroes/balmond.png",    role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Bane",       img:"images/heroes/bane.png",       role:"Fighter",   roles:["Fighter","Mage"],        difficulty:"normal"},
{name:"Barats",     img:"images/heroes/barats.png",     role:"Tank",      roles:["Tank","Fighter"],        difficulty:"normal"},
{name:"Baxia",      img:"images/heroes/baxia.png",      role:"Tank",      roles:["Tank"],                  difficulty:"normal"},
{name:"Beatrix",    img:"images/heroes/beatrix.png",    role:"Marksman",  roles:["Marksman"],              difficulty:"high"},
{name:"Belerick",   img:"images/heroes/belerick.png",   role:"Tank",      roles:["Tank"],                  difficulty:"normal"},
{name:"Benedetta",  img:"images/heroes/benedetta.png",  role:"Fighter",   roles:["Fighter","Assassin"],    difficulty:"high"},
{name:"Brody",      img:"images/heroes/brody.png",      role:"Marksman",  roles:["Marksman"],              difficulty:"normal"},
{name:"Bruno",      img:"images/heroes/bruno.png",      role:"Marksman",  roles:["Marksman"],              difficulty:"normal"},
{name:"Carmilla",   img:"images/heroes/carmilla.png",   role:"Tank",      roles:["Tank","Support"],        difficulty:"normal"},
{name:"Cecilion",   img:"images/heroes/cecilion.png",   role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Chang'e",    img:"images/heroes/chang27e.png",   role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Chip",       img:"images/heroes/chip.png",       role:"Tank",      roles:["Tank","Support"],        difficulty:"normal"},
{name:"Chou",       img:"images/heroes/chou.png",       role:"Fighter",   roles:["Fighter"],               difficulty:"high"},
{name:"Cici",       img:"images/heroes/cici.png",       role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Claude",     img:"images/heroes/claude.png",     role:"Marksman",  roles:["Marksman"],              difficulty:"high"},
{name:"Clint",      img:"images/heroes/clint.png",      role:"Marksman",  roles:["Marksman"],              difficulty:"normal"},
{name:"Cyclops",    img:"images/heroes/cyclops.png",    role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Diggie",     img:"images/heroes/diggie.png",     role:"Support",   roles:["Support"],               difficulty:"normal"},
{name:"Dyrroth",    img:"images/heroes/dyrroth.png",    role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Edith",      img:"images/heroes/edith.png",      role:"Tank",      roles:["Tank","Marksman"],       difficulty:"normal"},
{name:"Esmeralda",  img:"images/heroes/esmeralda.png",  role:"Tank",      roles:["Tank","Mage"],           difficulty:"normal"},
{name:"Estes",      img:"images/heroes/estes.png",      role:"Support",   roles:["Support"],               difficulty:"normal"},
{name:"Eudora",     img:"images/heroes/eudora.png",     role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Fanny",      img:"images/heroes/fanny.png",      role:"Assassin",  roles:["Assassin"],              difficulty:"high"},
{name:"Faramis",    img:"images/heroes/faramis.png",    role:"Mage",      roles:["Mage","Support"],        difficulty:"normal"},
{name:"Floryn",     img:"images/heroes/floryn.png",     role:"Support",   roles:["Support"],               difficulty:"normal"},
{name:"Franco",     img:"images/heroes/franco.png",     role:"Tank",      roles:["Tank"],                  difficulty:"high"},
{name:"Fredrinn",   img:"images/heroes/fredrinn.png",   role:"Tank",      roles:["Tank","Fighter"],        difficulty:"normal"},
{name:"Freya",      img:"images/heroes/freya.png",      role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Gatotkaca",  img:"images/heroes/gatotkaca.png",  role:"Tank",      roles:["Tank","Fighter"],        difficulty:"normal"},
{name:"Gloo",       img:"images/heroes/gloo.png",       role:"Tank",      roles:["Tank"],                  difficulty:"normal"},
{name:"Gord",       img:"images/heroes/gord.png",       role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Granger",    img:"images/heroes/granger.png",    role:"Marksman",  roles:["Marksman"],              difficulty:"high"},
{name:"Grock",      img:"images/heroes/grock.png",      role:"Tank",      roles:["Tank","Fighter"],        difficulty:"normal"},
{name:"Guinevere",  img:"images/heroes/guinevere.png",  role:"Fighter",   roles:["Fighter"],               difficulty:"high"},
{name:"Gusion",     img:"images/heroes/gusion.png",     role:"Assassin",  roles:["Assassin"],              difficulty:"high"},
{name:"Hanabi",     img:"images/heroes/hanabi.png",     role:"Marksman",  roles:["Marksman"],              difficulty:"normal"},
{name:"Hanzo",      img:"images/heroes/hanzo.png",      role:"Assassin",  roles:["Assassin"],              difficulty:"high"},
{name:"Harith",     img:"images/heroes/harith.png",     role:"Mage",      roles:["Mage"],                  difficulty:"high"},
{name:"Harley",     img:"images/heroes/harley.png",     role:"Assassin",  roles:["Assassin","Mage"],       difficulty:"high"},
{name:"Hayabusa",   img:"images/heroes/hayabusa.png",   role:"Assassin",  roles:["Assassin"],              difficulty:"high"},
{name:"Helcurt",    img:"images/heroes/helcurt.png",    role:"Assassin",  roles:["Assassin"],              difficulty:"normal"},
{name:"Hilda",      img:"images/heroes/hilda.png",      role:"Tank",      roles:["Tank","Fighter"],        difficulty:"normal"},
{name:"Hirara",     img:"images/heroes/hirara.png",     role:"Assassin",  roles:["Assassin"],              difficulty:"high"},
{name:"Hylos",      img:"images/heroes/hylos.png",      role:"Tank",      roles:["Tank"],                  difficulty:"normal"},
{name:"Irithel",    img:"images/heroes/irithel.png",    role:"Marksman",  roles:["Marksman"],              difficulty:"normal"},
{name:"Ixia",       img:"images/heroes/ixia.png",       role:"Marksman",  roles:["Marksman"],              difficulty:"normal"},
{name:"Jawhead",    img:"images/heroes/jawhead.png",    role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Johnson",    img:"images/heroes/johnson.png",    role:"Tank",      roles:["Tank","Support"],        difficulty:"high"},
{name:"Joy",        img:"images/heroes/joy.png",        role:"Assassin",  roles:["Assassin"],              difficulty:"high"},
{name:"Julian",     img:"images/heroes/julian.png",     role:"Fighter",   roles:["Fighter","Assassin"],    difficulty:"high"},
{name:"Kadita",     img:"images/heroes/kadita.png",     role:"Assassin",  roles:["Assassin","Mage"],       difficulty:"normal"},
{name:"Kagura",     img:"images/heroes/kagura.png",     role:"Mage",      roles:["Mage"],                  difficulty:"high"},
{name:"Kaja",       img:"images/heroes/kaja.png",       role:"Fighter",   roles:["Fighter","Support"],     difficulty:"normal"},
{name:"Kalea",      img:"images/heroes/kalea.png",      role:"Fighter",   roles:["Fighter","Support"],     difficulty:"normal"},
{name:"Karina",     img:"images/heroes/karina.png",     role:"Assassin",  roles:["Assassin"],              difficulty:"normal"},
{name:"Karrie",     img:"images/heroes/karrie.png",     role:"Marksman",  roles:["Marksman"],              difficulty:"normal"},
{name:"Khaleed",    img:"images/heroes/khaleed.png",    role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Khufra",     img:"images/heroes/khufra.png",     role:"Tank",      roles:["Tank"],                  difficulty:"high"},
{name:"Kimmy",      img:"images/heroes/kimmy.png",      role:"Mage",      roles:["Mage","Marksman"],       difficulty:"high"},
{name:"Lancelot",   img:"images/heroes/lancelot.png",   role:"Assassin",  roles:["Assassin"],              difficulty:"high"},
{name:"Lapu-Lapu",  img:"images/heroes/lapu-lapu.png",  role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Layla",      img:"images/heroes/layla.png",      role:"Marksman",  roles:["Marksman"],              difficulty:"normal"},
{name:"Leomord",    img:"images/heroes/leomord.png",    role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Lesley",     img:"images/heroes/lesley.png",     role:"Assassin",  roles:["Assassin","Marksman"],   difficulty:"normal"},
{name:"Ling",       img:"images/heroes/ling.png",       role:"Assassin",  roles:["Assassin"],              difficulty:"high"},
{name:"Lolita",     img:"images/heroes/lolita.png",     role:"Tank",      roles:["Tank","Support"],        difficulty:"normal"},
{name:"Lukas",      img:"images/heroes/lukas.png",      role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Lunox",      img:"images/heroes/lunox.png",      role:"Mage",      roles:["Mage"],                  difficulty:"high"},
{name:"Luo Yi",     img:"images/heroes/luo_yi.png",     role:"Mage",      roles:["Mage"],                  difficulty:"high"},
{name:"Lylia",      img:"images/heroes/lylia.png",      role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Marcel",     img:"images/heroes/marcel.png",     role:"Support",   roles:["Support"],               difficulty:"normal"},
{name:"Martis",     img:"images/heroes/martis.png",     role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Masha",      img:"images/heroes/masha.png",      role:"Tank",      roles:["Tank","Fighter"],        difficulty:"normal"},
{name:"Mathilda",   img:"images/heroes/mathilda.png",   role:"Assassin",  roles:["Assassin","Support"],    difficulty:"high"},
{name:"Melissa",    img:"images/heroes/melissa.png",    role:"Marksman",  roles:["Marksman"],              difficulty:"normal"},
{name:"Minotaur",   img:"images/heroes/minotaur.png",   role:"Tank",      roles:["Tank","Support"],        difficulty:"normal"},
{name:"Minsitthar", img:"images/heroes/minsitthar.png", role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Miya",       img:"images/heroes/miya.png",       role:"Marksman",  roles:["Marksman"],              difficulty:"normal"},
{name:"Moskov",     img:"images/heroes/moskov.png",     role:"Marksman",  roles:["Marksman"],              difficulty:"normal"},
{name:"Nana",       img:"images/heroes/nana.png",       role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Natalia",    img:"images/heroes/natalia.png",    role:"Assassin",  roles:["Assassin"],              difficulty:"high"},
{name:"Natan",      img:"images/heroes/natan.png",      role:"Marksman",  roles:["Marksman"],              difficulty:"normal"},
{name:"Nolan",      img:"images/heroes/nolan.png",      role:"Assassin",  roles:["Assassin"],              difficulty:"high"},
{name:"Novaria",    img:"images/heroes/novaria.png",    role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Obsidia",    img:"images/heroes/obsidia.png",    role:"Marksman",  roles:["Marksman"],              difficulty:"normal"},
{name:"Odette",     img:"images/heroes/odette.png",     role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Paquito",    img:"images/heroes/paquito.png",    role:"Fighter",   roles:["Fighter","Assassin"],    difficulty:"high"},
{name:"Pharsa",     img:"images/heroes/pharsa.png",     role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Phoveus",    img:"images/heroes/phoveus.png",    role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Popol and Kupa",img:"images/heroes/popol_and_kupa.png",role:"Marksman",roles:["Marksman"],          difficulty:"high"},
{name:"Rafaela",    img:"images/heroes/rafaela.png",    role:"Support",   roles:["Support"],               difficulty:"normal"},
{name:"Roger",      img:"images/heroes/roger.png",      role:"Fighter",   roles:["Fighter","Marksman"],    difficulty:"high"},
{name:"Ruby",       img:"images/heroes/ruby.png",       role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Saber",      img:"images/heroes/saber.png",      role:"Assassin",  roles:["Assassin"],              difficulty:"normal"},
{name:"Selena",     img:"images/heroes/selena.png",     role:"Assassin",  roles:["Assassin","Mage"],       difficulty:"high"},
{name:"Silvanna",   img:"images/heroes/silvanna.png",   role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Sora",       img:"images/heroes/sora.png",       role:"Fighter",   roles:["Fighter","Assassin"],    difficulty:"high"},
{name:"Sun",        img:"images/heroes/sun.png",        role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Suyou",      img:"images/heroes/suyou.png",      role:"Fighter",   roles:["Fighter","Assassin"],    difficulty:"high"},
{name:"Terizla",    img:"images/heroes/terizla.png",    role:"Tank",      roles:["Tank","Fighter"],        difficulty:"normal"},
{name:"Thamuz",     img:"images/heroes/thamuz.png",     role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Tigreal",    img:"images/heroes/tigreal.png",    role:"Tank",      roles:["Tank"],                  difficulty:"normal"},
{name:"Uranus",     img:"images/heroes/uranus.png",     role:"Tank",      roles:["Tank"],                  difficulty:"normal"},
{name:"Vale",       img:"images/heroes/vale.png",       role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Valentina",  img:"images/heroes/valentina.png",  role:"Mage",      roles:["Mage"],                  difficulty:"high"},
{name:"Valir",      img:"images/heroes/valir.png",      role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Vexana",     img:"images/heroes/vexana.png",     role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Wanwan",     img:"images/heroes/wanwan.png",     role:"Marksman",  roles:["Marksman"],              difficulty:"high"},
{name:"X.Borg",     img:"images/heroes/xborg.png",      role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Xavier",     img:"images/heroes/xavier.png",     role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Yi Sun-shin",img:"images/heroes/yi_sun-shin.png",role:"Assassin",  roles:["Assassin","Marksman"],   difficulty:"high"},
{name:"Yin",        img:"images/heroes/yin.png",        role:"Fighter",   roles:["Fighter","Assassin"],    difficulty:"high"},
{name:"Yu Zhong",   img:"images/heroes/yu_zhong.png",   role:"Fighter",   roles:["Fighter"],               difficulty:"normal"},
{name:"Yve",        img:"images/heroes/yve.png",        role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Zetian",     img:"images/heroes/zetian.png",     role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Zhask",      img:"images/heroes/zhask.png",      role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Zhuxin",     img:"images/heroes/zhuxin.png",     role:"Mage",      roles:["Mage"],                  difficulty:"normal"},
{name:"Zilong",     img:"images/heroes/zilong.png",     role:"Fighter",   roles:["Fighter","Assassin"],    difficulty:"normal"}
];

/* ===================== STATE ===================== */
let selectedHero = null;   // hero object or null
let activeRole   = "All";
let orderStep    = 1;
let orderFlow    = false;
let mmrServer    = "none";       // "ph" | "global" | "none"
let heroMode     = "general";  // "general" | "specific"
let mmrTopTarget = null;       // null | number (e.g. 50 = Top 50)

/* ===================== UTILS ===================== */
const $  = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];

function formatPeso(n) {
  return "₱" + Math.round(n).toLocaleString("en-PH");
}

function showToast(msg) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove("show"), 3400);
}

function heroByName(name) {
  return HEROES.find(h => h.name === name) || null;
}

function tierByName(name) {
  return RANK_TIERS.find(t => t.name === name) || null;
}

function tierIndex(name) {
  return RANK_TIERS.findIndex(t => t.name === name);
}

function roleClass(role) {
  const map = { Tank:"tank", Fighter:"fighter", Assassin:"assassin",
                Mage:"mage", Marksman:"marksman", Support:"support" };
  return map[role] || "fighter";
}

/* ===================== RANK SELECTS ===================== */
/* Color dot class per tier */
/* Official-style MLBB rank badge SVGs (compact) */
function rankBadgeSVG(name) {
  const badges = {
    "Grandmaster": `<svg class="rank-badge" viewBox="0 0 32 32" width="22" height="22" aria-hidden="true"><defs><linearGradient id="gm" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7eb8f0"/><stop offset="1" stop-color="#3a7bc8"/></linearGradient></defs><path d="M16 2l4 6h7l-5.5 5 2.5 8L16 17l-8 4 2.5-8L5 8h7z" fill="url(#gm)" stroke="#2a5a9a" stroke-width="0.8"/><circle cx="16" cy="12" r="3.5" fill="#c8e4ff"/></svg>`,
    "Epic": `<svg class="rank-badge" viewBox="0 0 32 32" width="22" height="22" aria-hidden="true"><defs><linearGradient id="ep" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6b9aff"/><stop offset="1" stop-color="#3d5fe0"/></linearGradient></defs><path d="M16 3l3 5.5 6.5.5-5 4.5 1.8 6.5L16 16.5 9.7 20l1.8-6.5-5-4.5 6.5-.5z" fill="url(#ep)" stroke="#2a40b0" stroke-width="0.8"/><path d="M16 9l1.5 3h3l-2.5 2 1 3.2L16 15.5 13 17.2l1-3.2-2.5-2h3z" fill="#b8d0ff"/></svg>`,
    "Legend": `<svg class="rank-badge" viewBox="0 0 32 32" width="22" height="22" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#5ce0ff"/><stop offset="1" stop-color="#1aa8d0"/></linearGradient></defs><path d="M16 2l2.5 7.5H26l-6 4.5 2.5 7.5L16 17l-6.5 4.5 2.5-7.5-6-4.5h7.5z" fill="url(#lg)" stroke="#0a7a9a" stroke-width="0.8"/><circle cx="16" cy="13" r="3" fill="#d0f6ff"/></svg>`,
    "Mythic": `<svg class="rank-badge" viewBox="0 0 32 32" width="22" height="22" aria-hidden="true"><defs><linearGradient id="my" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f0d060"/><stop offset="1" stop-color="#c89020"/></linearGradient></defs><path d="M16 2l3.5 8 8.5.5-6.5 5.5 2.5 8.5L16 19.5 8 24.5l2.5-8.5L4 10.5l8.5-.5z" fill="url(#my)" stroke="#9a6a10" stroke-width="0.8"/><path d="M16 8v10M12 12h8" stroke="#fff4c0" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    "Mythical Honor": `<svg class="rank-badge" viewBox="0 0 32 32" width="22" height="22" aria-hidden="true"><defs><linearGradient id="mh" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffb84a"/><stop offset="1" stop-color="#e07820"/></linearGradient></defs><path d="M16 2l4 7 8 1-6 5.5 2 8.5L16 19l-8 5 2-8.5-6-5.5 8-1z" fill="url(#mh)" stroke="#a05010" stroke-width="0.8"/><path d="M16 9l2 4.5h4.5l-3.5 3 1.5 4.5L16 18.5 11.5 21l1.5-4.5-3.5-3H14z" fill="#ffe0a0"/></svg>`,
    "Mythical Glory": `<svg class="rank-badge" viewBox="0 0 32 32" width="22" height="22" aria-hidden="true"><defs><linearGradient id="mgl" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff8a4a"/><stop offset="1" stop-color="#e04020"/></linearGradient></defs><path d="M16 1.5l4.5 8 9 .8-6.8 6 2.5 9L16 20l-9.2 5.3 2.5-9-6.8-6 9-.8z" fill="url(#mgl)" stroke="#a02810" stroke-width="0.8"/><circle cx="16" cy="13" r="4" fill="#ffd0b0"/><path d="M16 10v6M13 13h6" stroke="#e04020" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    "Mythical Immortal": `<svg class="rank-badge" viewBox="0 0 32 32" width="22" height="22" aria-hidden="true"><defs><linearGradient id="mi" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff6a7a"/><stop offset="1" stop-color="#c02040"/></linearGradient></defs><path d="M16 1l5 8.5 9.5 1-7 6.2 2.5 9.3L16 20.5 6 26l2.5-9.3-7-6.2 9.5-1z" fill="url(#mi)" stroke="#801020" stroke-width="0.8"/><path d="M16 7l1.8 4h4.2l-3.4 2.8 1.4 4.2L16 15.5 12 18l1.4-4.2-3.4-2.8h4.2z" fill="#ffc0c8"/><path d="M16 11v5" stroke="#c02040" stroke-width="1.2" stroke-linecap="round"/></svg>`
  };
  return badges[name] || badges["Grandmaster"];
}

function rankDotClass(name) {
  const map = {
    "Grandmaster": "rank-dot-grandmaster",
    "Epic": "rank-dot-epic",
    "Legend": "rank-dot-legend",
    "Mythic": "rank-dot-mythic",
    "Mythical Honor": "rank-dot-mythicalhonor",
    "Mythical Glory": "rank-dot-mythicalglory",
    "Mythical Immortal": "rank-dot-mythicalimmortal"
  };
  return map[name] || "rank-dot-grandmaster";
}

function renderRankCards(containerId, hiddenSelectId, defaultValue) {
  const container = document.getElementById(containerId);
  const hiddenSel = document.getElementById(hiddenSelectId);
  if (!container || !hiddenSel) return;

  // Populate hidden select
  hiddenSel.innerHTML = RANK_NAMES.map(r => `<option value="${r}">${r}</option>`).join("");
  hiddenSel.value = defaultValue;

  // Render card buttons with real rank badges
  container.innerHTML = RANK_NAMES.map(name => {
    const active = name === defaultValue ? " active" : "";
    const badge = rankBadgeSVG(name);
    return `<button class="rank-card${active}" type="button"
      data-rank="${name.replace(/"/g,"&quot;")}"
      data-for="${hiddenSelectId}"
      role="radio" aria-checked="${name === defaultValue}"
      aria-label="${name}">
      ${badge}<span class="rank-card-name">${name}</span>
    </button>`;
  }).join("");

  // Click handler
  container.addEventListener("click", e => {
    const card = e.target.closest(".rank-card");
    if (!card || card.classList.contains("rank-card-disabled")) return;
    const rankName = card.dataset.rank;
    const selId = card.dataset.for;

    // Update active state in this container
    container.querySelectorAll(".rank-card").forEach(c => {
      c.classList.remove("active");
      c.setAttribute("aria-checked", "false");
    });
    card.classList.add("active");
    card.setAttribute("aria-checked", "true");

    // Update hidden select
    const sel = document.getElementById(selId);
    if (sel) sel.value = rankName;

    // If this is currentRank, disable lower ranks in targetRank
    if (selId === "currentRank") {
      updateTargetRankAvailability();
    }

    updateStarsLabelsAndLimits();
    updateAll();
  });
}

function updateTargetRankAvailability() {
  const curName = $("#currentRank")?.value;
  const curIdx  = tierIndex(curName);
  const tgtContainer = document.getElementById("targetRankCards");
  if (!tgtContainer) return;

  tgtContainer.querySelectorAll(".rank-card").forEach(card => {
    const idx = RANK_NAMES.indexOf(card.dataset.rank);
    if (idx <= curIdx) {
      card.classList.add("rank-card-disabled");
      card.setAttribute("aria-disabled", "true");
    } else {
      card.classList.remove("rank-card-disabled");
      card.setAttribute("aria-disabled", "false");
    }
  });

  // If target is now lower or equal to current, auto-advance to next
  const tgtName = $("#targetRank")?.value;
  const tgtIdx  = tierIndex(tgtName);
  if (tgtIdx <= curIdx) {
    const nextName = RANK_NAMES[curIdx + 1] || RANK_NAMES[curIdx];
    const tgtCards = tgtContainer.querySelectorAll(".rank-card");
    tgtCards.forEach(c => {
      c.classList.remove("active");
      c.setAttribute("aria-checked", "false");
    });
    const nextCard = tgtContainer.querySelector(`[data-rank="${nextName}"]`);
    if (nextCard) {
      nextCard.classList.add("active");
      nextCard.setAttribute("aria-checked", "true");
    }
    const tgtSel = $("#targetRank");
    if (tgtSel) tgtSel.value = nextName;
  }
}

function populateRanks() {
  renderRankCards("currentRankCards", "currentRank", "Grandmaster");
  renderRankCards("targetRankCards", "targetRank", "Legend");
  updateTargetRankAvailability();
  updateStarsLabelsAndLimits();
}

/* Populate specific hero dropdown */
function populateHeroDrop() {
  const sel = $("#specificHeroDrop");
  if (!sel) return;
  const sorted = [...HEROES].sort((a, b) => a.name.localeCompare(b.name));
  sel.innerHTML = `<option value="">— select a hero —</option>` +
    sorted.map(h =>
      `<option value="${h.name.replace(/&/g,"&amp;").replace(/"/g,"&quot;")}">${h.name}${h.difficulty === "high" ? " ★" : ""}</option>`
    ).join("");
}

/* ===================== STARS LABELS ===================== */
function updateStarsLabelsAndLimits() {
  const curName = $("#currentRank")?.value;
  const tgtName = $("#targetRank")?.value;
  const curTier = tierByName(curName);
  const tgtTier = tierByName(tgtName);

  const curWrap = $("#currentStarsWrap");
  const tgtWrap = $("#targetStarsWrap");
  const curInput = $("#currentStars");
  const tgtInput = $("#stars");

  if (!curTier || !tgtTier) return;

  // Current rank stars/points label + limits
  if (curTier.isPoints) {
    curWrap?.querySelector("label, .field-label")?.childNodes[0] && null;
    setLabelText(curWrap, "Current points");
    if (curInput) {
      curInput.min = curTier.minPoints;
      curInput.max = curTier.maxPoints < 9999 ? curTier.maxPoints : 9999;
      curInput.placeholder = `${curTier.minPoints}–${curTier.maxPoints < 9999 ? curTier.maxPoints : "100+"}`;
    }
  } else {
    setLabelText(curWrap, "Current stars (0 = start of rank)");
    if (curInput) {
      curInput.min = 0;
      curInput.max = curTier.totalStars;
      curInput.placeholder = `0–${curTier.totalStars}`;
    }
  }

  // Target rank stars/points
  if (tgtTier.isPoints) {
    setLabelText(tgtWrap, "Target points");
    if (tgtInput) {
      tgtInput.min = tgtTier.minPoints;
      tgtInput.max = tgtTier.maxPoints < 9999 ? tgtTier.maxPoints : 9999;
      tgtInput.placeholder = `${tgtTier.minPoints}–${tgtTier.maxPoints < 9999 ? tgtTier.maxPoints : "100+"}`;
    }
  } else {
    setLabelText(tgtWrap, "Target stars");
    if (tgtInput) {
      tgtInput.min = 1;
      tgtInput.max = tgtTier.totalStars;
      tgtInput.placeholder = `1–${tgtTier.totalStars}`;
    }
  }
}

function setLabelText(wrap, text) {
  if (!wrap) return;
  const lbl = wrap.querySelector(".field-label");
  if (!lbl) return;
  // First text node is the label text
  for (const node of lbl.childNodes) {
    if (node.nodeType === 3 && node.textContent.trim()) {
      node.textContent = text + "\n";
      return;
    }
  }
}

/* ===================== CORE CALCULATOR ===================== */
/*
  Computes number of stars/points needed to get from
  (currentRank, currentStars) → (targetRank, targetStars).

  Returns { starsNeeded, valid, warning }.
*/
function computeStarsNeeded() {
  const curName   = $("#currentRank")?.value;
  const tgtName   = $("#targetRank")?.value;
  const curTier   = tierByName(curName);
  const tgtTier   = tierByName(tgtName);
  const curStarsRaw = parseInt($("#currentStars")?.value, 10);
  const tgtStarsRaw = parseInt($("#stars")?.value, 10);

  if (!curTier || !tgtTier) return { starsNeeded: 0, valid: false, warning: "Invalid rank selection." };

  const curIdx = tierIndex(curName);
  const tgtIdx = tierIndex(tgtName);

  const curStars = isNaN(curStarsRaw) ? 0 : Math.max(0, curStarsRaw);
  const tgtStars = isNaN(tgtStarsRaw) ? 0 : Math.max(0, tgtStarsRaw);

  // Same tier
  if (curIdx === tgtIdx) {
    if (tgtTier.isPoints) {
      const diff = tgtStars - curStars;
      if (diff <= 0) return { starsNeeded: 0, valid: false, warning: "Target points must be higher than current points within the same rank." };
      return { starsNeeded: diff, valid: true, warning: null, sameTier: true };
    } else {
      const diff = tgtStars - curStars;
      if (diff <= 0) return { starsNeeded: 0, valid: false, warning: "Target stars must be higher than current stars within the same rank." };
      return { starsNeeded: diff, valid: true, warning: null, sameTier: true };
    }
  }

  // Target is lower than current
  if (tgtIdx < curIdx) {
    return { starsNeeded: 0, valid: false, warning: "Target rank is lower than current rank. Choose a higher target." };
  }

  // Multi-tier calculation
  let total = 0;

  // Remaining progress in the current tier. Point-based tiers use their absolute ranges.
  if (!curTier.isPoints) {
    total += curTier.totalStars - curStars;
  } else {
    total += (curTier.maxPoints - curStars + 1);
  }

  // Full tiers in between.
  for (let i = curIdx + 1; i < tgtIdx; i++) {
    const tier = RANK_TIERS[i];
    total += tier.isPoints ? (tier.maxPoints - tier.minPoints + 1) : tier.totalStars;
  }

  // Stars/points within target tier
  if (!tgtTier.isPoints) {
    total += tgtStars;
  } else {
    // For Mythic+ tiers: stars needed = target points minus start of that tier
    const needed = tgtStars - tgtTier.minPoints;
    if (needed < 0) return { starsNeeded: 0, valid: false, warning: `Target points for ${tgtName} must be at least ${tgtTier.minPoints}.` };
    total += needed;
  }

  if (total <= 0) return { starsNeeded: 0, valid: false, warning: "No boosting needed — adjust your star/points values." };

  return { starsNeeded: total, valid: true, warning: null };
}

/* Top Rank label helper */
function getMMRTopTargetLabel() {
  return mmrTopTarget ? `Top ${mmrTopTarget}` : "";
}

/* Full price calculation — base/MMR rate + difficulty + top-rank surcharges */
function calcPrice() {
  const tgtName = $("#targetRank")?.value;
  const baseRate = PRICING.BASE_RATES[tgtName] || 0;
  const mmrRate = PRICING.MMR_RATES[tgtName] || 0;
  const { starsNeeded, valid, warning } = computeStarsNeeded();

  if (!valid || baseRate === 0) {
    return { base: 0, heroAdd: 0, diffAdd: 0, globalAdd: 0, topAdd: 0, total: 0, starsNeeded, valid, warning, baseRate, ratePerStar: 0, mode: "invalid" };
  }

  const useMmr = mmrServer === "ph" || mmrServer === "global";
  const ratePerStar = useMmr ? mmrRate : baseRate;
  const base = ratePerStar * starsNeeded;

  // Hero difficulty surcharge (only when a specific high-difficulty hero is chosen)
  let diffPerStar = 0;
  const effectiveHero = getEffectiveHero();
  if (heroMode === "specific" && effectiveHero) {
    const diffKey = effectiveHero.difficulty === "high" ? "high" : "normal";
    diffPerStar = PRICING.DIFFICULTY_SURCHARGE[diffKey] || 0;
  }
  const diffAdd = diffPerStar * starsNeeded;

  // Top Rank surcharge (only when MMR + top target selected)
  let topPerStar = 0;
  if (useMmr && mmrTopTarget) {
    const key = String(mmrTopTarget);
    topPerStar = PRICING.TOP_RANK_SURCHARGE[key] || 0;
  }
  const topAdd = topPerStar * starsNeeded;

  const total = base + diffAdd + topAdd;

  return {
    base,
    heroAdd: 0,
    diffAdd,
    globalAdd: 0,
    topAdd,
    total,
    starsNeeded,
    valid: true,
    warning: null,
    baseRate,
    mmrRate,
    ratePerStar,
    diffPerStar,
    topPerStar,
    mode: useMmr ? "mmr" : "base",
    topTarget: mmrTopTarget
  };
}

/* The hero whose difficulty determines surcharge */
function getEffectiveHero() {
  if (heroMode === "specific") {
    // Check specific dropdown first
    const dropVal = $("#specificHeroDrop")?.value;
    if (dropVal) return heroByName(dropVal);
    // Fall back to selected hero from grid
    if (selectedHero) return selectedHero;
  }
  return null;
}

/* ===================== UI UPDATES ===================== */
function updateSummary() {
  const curName = $("#currentRank")?.value || "—";
  const tgtName = $("#targetRank")?.value || "—";
  const { starsNeeded, valid, total } = calcPrice();

  $("#summaryCurrent").textContent = curName;
  $("#summaryTarget").textContent  = tgtName;
  $("#summaryStars").textContent   = valid ? String(starsNeeded) : "—";
  const mmrTopLabel = mmrTopTarget ? ` · Top ${mmrTopTarget}` : "";
  $("#summaryMMR").textContent     = mmrServer === "global" ? "Global" + mmrTopLabel : mmrServer === "none" ? "Not specified" : "Philippines" + mmrTopLabel;

  if (valid && total > 0) {
    $("#estimate").textContent     = formatPeso(total);
    $("#estimateNote").textContent = "Estimate only. Confirm via Messenger.";
  } else {
    $("#estimate").textContent     = "₱—";
    $("#estimateNote").textContent = "Set ranks to see estimate.";
  }
}

function updatePriceBreakdown() {
  const { total, starsNeeded, valid, warning, ratePerStar, mode, diffAdd, topAdd, diffPerStar, topPerStar } = calcPrice();

  const rib = $("#rankInfoBar");
  if (rib) {
    if (warning) {
      rib.innerHTML = `<div class="rib-inner rib-warn"><span>${warning}</span></div>`;
    } else if (valid) {
      const tgtName = $("#targetRank")?.value;
      const tgtTier = tierByName(tgtName);
      const label = tgtTier?.isPoints ? "points" : "stars";
      const choices = [];
      if (heroMode === "specific") {
        const h = getEffectiveHero();
        choices.push(h && h.difficulty === "high" ? `${h.name} (Hard)` : "Specific Hero");
      }
      if (mode === "mmr") choices.push(mmrServer === "global" ? "Global MMR" : "PH MMR");
      if (mmrTopTarget) choices.push(`Top ${mmrTopTarget}`);
      const suffix = choices.length ? ` · ${choices.join(" + ")}` : "";
      rib.innerHTML = `<div class="rib-inner"><span><strong>${starsNeeded} ${label}</strong> at ${formatPeso(ratePerStar)}/star${suffix}</span></div>`;
    } else {
      rib.innerHTML = "";
    }
  }

  const show = valid && total > 0;
  if (show) {
    const base = $("#pbBase");
    if (base) base.textContent = `${formatPeso(ratePerStar)} × ${starsNeeded}`;

    // Specific hero row
    const heroRow = $("#pbHeroRow");
    if (heroRow) heroRow.hidden = heroMode !== "specific";
    const hero = $("#pbHero");
    if (hero) {
      const h = getEffectiveHero();
      hero.textContent = h ? h.name : "Any";
    }

    // Difficulty surcharge
    const diffRow = $("#pbDiffRow");
    if (diffRow) diffRow.hidden = !(heroMode === "specific" && diffAdd > 0);
    const diff = $("#pbDiff");
    if (diff) {
      diff.textContent = diffAdd > 0 ? `+${formatPeso(diffAdd)} (+${formatPeso(diffPerStar)}/star)` : "₱0";
    }

    const mmrRow = $("#pbGlobalRow");
    if (mmrRow) mmrRow.hidden = mode !== "mmr";
    const mmr = $("#pbGlobal");
    if (mmr) mmr.textContent = mode === "mmr" ? `${formatPeso(ratePerStar)}/star` : "₱0";

    // Top rank surcharge
    const topRow = $("#pbTopRow");
    if (topRow) topRow.hidden = !(mmrTopTarget && topAdd > 0);
    const topLabel = $("#pbTopLabel");
    if (topLabel) topLabel.textContent = mmrTopTarget ? `Top ${mmrTopTarget} target` : "Top target";
    const top = $("#pbTop");
    if (top) {
      top.textContent = topAdd > 0 ? `+${formatPeso(topAdd)} (+${formatPeso(topPerStar)}/star)` : "₱0";
    }

    const totalEl = $("#pbTotal");
    if (totalEl) totalEl.textContent = formatPeso(total);
  } else {
    $("#pbBase") && ($("#pbBase").textContent = "₱—");
    ["pbHeroRow", "pbDiffRow", "pbGlobalRow", "pbTopRow"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.hidden = true;
    });
    $("#pbTotal") && ($("#pbTotal").textContent = "₱—");
  }
}

function updateFinalReview() {
  const curName = $("#currentRank")?.value || "—";
  const tgtName = $("#targetRank")?.value || "—";
  const role    = $("#preferredRole")?.value || "No preference";
  const { starsNeeded, valid, total } = calcPrice();

  const effectiveHero = heroMode === "specific" ? getEffectiveHero() : selectedHero;
  const paymentMethod = $("#paymentMethod")?.value || "GCash";

  $("#reviewRank")?.textContent  !== undefined && ($("#reviewRank").textContent  = `${curName} → ${tgtName}`);
  $("#reviewStars")?.textContent !== undefined && ($("#reviewStars").textContent = valid ? String(starsNeeded) : "—");
  const mmrTopReviewLabel = mmrTopTarget ? ` (Top ${mmrTopTarget})` : "";
  $("#reviewMMR")?.textContent   !== undefined && ($("#reviewMMR").textContent   = mmrServer === "global" ? "Global" + mmrTopReviewLabel : mmrServer === "none" ? "Not specified" : "Philippines" + mmrTopReviewLabel);
  $("#reviewRole")?.textContent  !== undefined && ($("#reviewRole").textContent  = role);
  $("#reviewHero")?.textContent  !== undefined && ($("#reviewHero").textContent  = effectiveHero ? effectiveHero.name : (heroMode === "general" ? "General (any)" : "No hero selected"));
  $("#reviewPayment")?.textContent !== undefined && ($("#reviewPayment").textContent = paymentMethod);
  $("#reviewTotal")?.textContent !== undefined && ($("#reviewTotal").textContent = valid && total > 0 ? formatPeso(total) : "₱— (to confirm)");
}

function updateAll() {
  updateSummary();
  updatePriceBreakdown();
  updateFinalReview();
}

/* ===================== MMR TOGGLE ===================== */
function updateMMRTopVisibility() {
  const wrap = document.getElementById("mmrTopWrap");
  if (!wrap) return;
  const show = (mmrServer === "ph" || mmrServer === "global");
  wrap.hidden = !show;
  if (!show) {
    mmrTopTarget = null;
    const inp = document.getElementById("mmrTopInput");
    if (inp) inp.value = "";
  }
}

function setupMMRToggle() {
  $$(".mmr-card").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".mmr-card").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-checked", "true");
      mmrServer = btn.dataset.mmr;
      updateMMRTopVisibility();
      updateAll();
    });
  });

  // Top target input
  const topInput = document.getElementById("mmrTopInput");
  if (topInput) {
    topInput.addEventListener("input", () => {
      const raw = parseInt(topInput.value, 10);
      if (!isNaN(raw) && raw >= 1 && raw <= 99) {
        mmrTopTarget = raw;
      } else {
        mmrTopTarget = null;
      }
      updateAll();
    });
  }

  // Clear top button
  const clearTop = document.getElementById("mmrTopClear");
  if (clearTop) {
    clearTop.addEventListener("click", () => {
      mmrTopTarget = null;
      const inp = document.getElementById("mmrTopInput");
      if (inp) inp.value = "";
      updateAll();
    });
  }
}

/* ===================== HERO MODE TOGGLE ===================== */
function updateNextStep1Button() {
  const btn    = $("#nextToHero");
  const label  = $("#nextStep1Label");
  if (!btn || !label) return;
  if (heroMode === "general") {
    label.textContent = "Continue to Details";
  } else {
    label.textContent = "Choose a Hero";
  }
  // Show/hide hero tab
  const heroTab    = document.getElementById("heroTab");
  const heroTabSep = document.getElementById("heroTabSep");
  if (heroTab)    heroTab.style.display    = heroMode === "general" ? "none" : "";
  if (heroTabSep) heroTabSep.style.display = heroMode === "general" ? "none" : "";
}

function setupHeroModeToggle() {
  $$(".hero-mode-opt").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".hero-mode-opt").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-checked", "true");
      heroMode = btn.dataset.heromode;

      const dropWrap = $("#specificHeroDropWrap");
      if (dropWrap) dropWrap.hidden = heroMode !== "specific";

      // When switching to general, clear any selected hero
      if (heroMode === "general") {
        selectedHero = null;
        updateChosenHero(null);
        updateStepHeroPreview(null);
        // Clear dropdown
        const drop = $("#specificHeroDrop");
        if (drop) drop.value = "";
      }

      updateNextStep1Button();
      renderHeroes(); // re-render hero grid to apply/remove lock
      renderHpp();    // re-render custom hero panel
      updateAll();
    });
  });

  // Specific hero dropdown change
  const specificDrop = $("#specificHeroDrop");
  if (specificDrop) {
    specificDrop.addEventListener("change", () => {
      if (heroMode === "general") return; // blocked in general mode
      const h = heroByName(specificDrop.value);
      if (h) {
        selectedHero = h;
        updateChosenHero(h);
        updateStepHeroPreview(h);
      }
      updateAll();
    });
  }
}

/* ===================== PRICING CARDS ===================== */
function renderPricing() {
  const grid = $("#pricingGrid");
  if (!grid) return;
  grid.innerHTML = PRICING.CARDS.map(p => {
    const rate    = PRICING.BASE_RATES[p.rateKey] || 0;
    const rateStr = rate > 0 ? formatPeso(rate) : "₱XX";
    const rateNote = rate > 0 ? `${p.note}` : "Set your rate";
    const badge = rankBadgeSVG(p.rank);
    return `
      <article class="price-card${p.featured ? " featured" : ""}">
        <div class="price-card-top">
          <span class="price-rank-icon">${badge}</span>
          <span class="tier">${p.note}</span>
        </div>
        ${p.featured ? '<span class="price-tag">FEATURED</span>' : ""}
        <h3>${p.rank}</h3>
        <div class="price-rate">
          ${rateStr}
          <small>${rateNote}</small>
        </div>
      </article>`;
  }).join("");
}

/* ===================== HERO STAGE ===================== */
function renderStage() {
  const picks = [
    heroByName("Kalea"),
    heroByName("Sora"),
    heroByName("Obsidia")
  ].filter(Boolean);
  const final = picks.length === 3 ? picks : HEROES.slice(-3);
  const [a, b, c] = final;
  if (a) {
    const img = $("#stageImg1");
    if (img) { img.src = a.img; img.alt = a.name; }
    const name = $("#stageName1");
    const role = $("#stageRole1");
    if (name) name.textContent = a.name;
    if (role) role.textContent = a.role;
  }
  if (b) {
    const img = $("#stageImg2");
    if (img) { img.src = b.img; img.alt = b.name; }
    const name = $("#stageName2");
    if (name) name.textContent = b.name;
  }
  if (c) {
    const img = $("#stageImg3");
    if (img) { img.src = c.img; img.alt = c.name; }
    const name = $("#stageName3");
    if (name) name.textContent = c.name;
  }
}

/* ===================== HERO GRID ===================== */
function renderHeroes() {
  const query  = ($("#heroSearch")?.value || "").toLowerCase().trim();
  const grid   = $("#heroGrid");
  if (!grid) return;

  // Lock grid visually when general mode
  const isLocked = heroMode === "general";
  grid.classList.toggle("hero-grid-locked", isLocked);

  const filtered = HEROES.filter(h => {
    const matchName = h.name.toLowerCase().includes(query);
    const matchRole = activeRole === "All" ||
      h.roles.some(r => r.toLowerCase() === activeRole.toLowerCase());
    return matchName && matchRole;
  });

  const countEl = $("#heroCount");
  if (countEl) countEl.textContent = filtered.length;

  if (!filtered.length) {
    grid.innerHTML = `<p class="no-results">No heroes match your search.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(h => {
    const sel  = selectedHero && selectedHero.name === h.name;
    const rc   = roleClass(h.role);
    const safe = h.name.replace(/&/g,"&amp;").replace(/"/g,"&quot;");
    const diff = h.difficulty === "high"
      ? `<span class="hero-diff-badge" title="High difficulty" aria-label="High difficulty">★</span>` : "";
    return `
      <button
        class="hero-card${sel ? " selected" : ""}${h.difficulty === "high" ? " hard-hero" : ""}"
        type="button"
        data-hero="${safe}"
        aria-pressed="${sel}"
        aria-label="${safe} — ${h.role}${h.difficulty === "high" ? " (High difficulty)" : ""}">
        <img src="${h.img}" alt="${safe}" loading="lazy" width="120" height="160"
          onerror="this.style.display='none'">
        <div class="hero-card-overlay"></div>
        <div class="hero-card-info">
          <span class="hero-card-name">${safe}</span>
          <span class="hero-card-role role-text-${rc}">${h.role}</span>
        </div>
        <div class="hero-check" aria-hidden="true">✓</div>
        ${diff}
      </button>`;
  }).join("");
}

/* ===================== HERO SELECTION ===================== */
function selectHero(name) {
  // Block hero selection when general mode is active
  if (heroMode === "general") {
    showToast("Switch to Specific Hero mode to select a hero.");
    return;
  }
  const h = heroByName(name);
  if (!h) return;

  selectedHero = h;

  // If specific mode, also sync the dropdown
  if (heroMode === "specific") {
    const drop = $("#specificHeroDrop");
    if (drop) drop.value = h.name;
  }

  updateChosenHero(h);
  updateStepHeroPreview(h);
  updateAll();
  renderHeroes();

  if (orderFlow && orderStep === 2) {
    setOrderStep(3);
    const orderEl = document.getElementById("order");
    if (orderEl) {
      setTimeout(() => {
        orderEl.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => document.getElementById("customerName")?.focus(), 450);
      }, 80);
    }
    showToast(`${h.name} selected. Continue with your details.`);
  } else {
    showToast(`${h.name} selected.`);
  }
}

function updateChosenHero(h) {
  const container = $("#chosenHero");
  if (!container) return;
  if (!h) {
    container.innerHTML = `
      <div class="chosen-thumb" aria-hidden="true"><span class="no-hero-icon">?</span></div>
      <div class="chosen-info">
        <span>Hero preference</span>
        <strong>No hero selected</strong>
      </div>`;
    return;
  }
  const rc = roleClass(h.role);
  const diffBadge = h.difficulty === "high" ? ` <span style="color:var(--gold);font-size:11px;">★ High difficulty</span>` : "";
  container.innerHTML = `
    <div class="chosen-thumb" aria-hidden="true">
      <img src="${h.img}" alt="${h.name}" width="52" height="52" onerror="this.style.display='none'">
    </div>
    <div class="chosen-info">
      <span class="role-text-${rc}">${h.role}</span>
      <strong>${h.name}${diffBadge}</strong>
    </div>`;
}

/* ===================== ORDER FLOW ===================== */
function stepIsValid(step) {
  if (step === 1) {
    const current = $("#currentRank");
    const target  = $("#targetRank");
    if (!current?.value || !target?.value) {
      showToast("Choose your current and target rank first.");
      return false;
    }
    const { valid, warning } = calcPrice();
    if (!valid) {
      showToast(warning || "Fix your rank/star values first.");
      return false;
    }
  }
  // Step 2 check: general mode always passes (hero optional), specific needs a hero
  if (step === 2) {
    if (heroMode === "general") return true; // no hero required
    const effectiveHero = getEffectiveHero();
    if (heroMode === "specific" && !effectiveHero) {
      showToast("Choose a hero from the dropdown or the grid.");
      return false;
    }
  }
  return true;
}

function updateStepTabs() {
  // In general mode, orderStep goes 1 -> 3 (skips 2)
  // We remap for display: if general and step>=3, show as step 2 visually via tab numbering
  $$("[data-step-tab]").forEach(tab => {
    const step   = Number(tab.dataset.stepTab);
    const active = step === orderStep;

    let available = false;
    if (step === 1) available = true;
    else if (step === 2) available = heroMode === "specific" && orderStep >= 2;
    else if (step === 3) available = orderStep >= 3 ||
      (heroMode === "general" && orderStep >= 3) ||
      Boolean(selectedHero || (heroMode === "specific" && $("#specificHeroDrop")?.value));

    tab.classList.toggle("active", active);
    tab.classList.toggle("complete", step < orderStep);
    tab.setAttribute("aria-selected", String(active));
    tab.disabled = !available;
  });
  $$("[data-step-pane]").forEach(pane => {
    const step = Number(pane.dataset.stepPane);
    const show = step === orderStep;
    pane.hidden = !show;
    pane.classList.toggle("active", show);
  });
}

function setOrderStep(step) {
  const safeStep = Math.min(3, Math.max(1, step));
  if (safeStep === 2 && !stepIsValid(1)) return;
  // Step 3 validation: in general mode skip the step 2 check
  if (safeStep === 3 && heroMode !== "general" && !stepIsValid(2)) return;
  orderStep = safeStep;
  updateStepTabs();
  updateStepHeroPreview(selectedHero);
  updateFinalReview();
  const hint = $("#heroFlowHint");
  if (hint) hint.hidden = !(orderFlow && orderStep === 2);
  const nextDetails = $("#nextToDetails");
  if (nextDetails) nextDetails.disabled = !(
    heroMode === "general" ||
    selectedHero ||
    (heroMode === "specific" && $("#specificHeroDrop")?.value)
  );
}

function beginHeroStep() {
  if (!stepIsValid(1)) return;
  orderFlow = true;

  if (heroMode === "general") {
    // Skip hero selection entirely — go straight to details
    orderStep = 3;
    updateStepTabs();
    const orderEl = document.getElementById("order");
    if (orderEl) setTimeout(() => orderEl.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    setTimeout(() => $("#customerName")?.focus(), 80);
    updateFinalReview();
    return;
  }

  orderStep = 2;
  updateStepTabs();
  const hint = $("#heroFlowHint");
  if (hint) hint.hidden = false;
  const heroSection = document.getElementById("heroes");
  if (heroSection) setTimeout(() => heroSection.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  showToast("Choose one hero from the list.");
}

function goBackToRank() {
  orderFlow = true;
  setOrderStep(1);
  const orderEl = document.getElementById("order");
  if (orderEl) setTimeout(() => orderEl.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
}

function goBackToHero() {
  orderFlow = true;
  orderStep = 2;
  updateStepTabs();
  const hint = $("#heroFlowHint");
  if (hint) hint.hidden = false;
  const heroSection = document.getElementById("heroes");
  if (heroSection) setTimeout(() => heroSection.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
}

function updateStepHeroPreview(h) {
  const box = $("#stepSelectedHero");
  if (!box) return;
  if (!h) {
    box.innerHTML = `
      <div class="step-selected-thumb" aria-hidden="true"><span>?</span></div>
      <div><span>Current selection</span><strong>No hero selected</strong></div>`;
    return;
  }
  box.innerHTML = `
    <div class="step-selected-thumb">
      <img src="${h.img}" alt="${h.name}" width="54" height="54" loading="lazy">
    </div>
    <div>
      <span>Current selection</span>
      <strong>${h.name}</strong>
      <small>${h.role}${h.difficulty === "high" ? " · High difficulty ★" : ""}</small>
    </div>`;
}

function setupOrderFlow() {
  $$("[data-step-tab]").forEach(tab => {
    tab.addEventListener("click", () => {
      const targetStep = Number(tab.dataset.stepTab);
      if (targetStep === 1) { orderFlow = true; setOrderStep(1); return; }
      if (targetStep === 2) { beginHeroStep(); return; }
      if (targetStep === 3) {
        if (heroMode === "specific" && !selectedHero && !$("#specificHeroDrop")?.value) {
          showToast("Choose your hero before entering the details step.");
          return;
        }
        orderFlow = true;
        setOrderStep(3);
      }
    });
  });

  $("#nextToHero")?.addEventListener("click", beginHeroStep);
  $("#backToRank")?.addEventListener("click", goBackToRank);

  $("#nextToDetails")?.addEventListener("click", () => {
    if (heroMode === "specific" && !selectedHero && !$("#specificHeroDrop")?.value) {
      showToast("Choose a hero first.");
      return;
    }
    orderFlow = true;
    setOrderStep(3);
    setTimeout(() => $("#customerName")?.focus(), 60);
  });

  $("#backToHero")?.addEventListener("click", goBackToHero);

  $("#backToOrderFromHeroes")?.addEventListener("click", () => {
    orderFlow = true;
    if (selectedHero || heroMode === "general") setOrderStep(3);
    else setOrderStep(2);
    const orderEl = document.getElementById("order");
    if (orderEl) setTimeout(() => orderEl.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  });

  ["currentRank", "targetRank", "currentStars", "stars", "preferredRole"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input",  () => { updateStarsLabelsAndLimits(); updateAll(); });
    el.addEventListener("change", () => { updateStarsLabelsAndLimits(); updateAll(); });
  });

  setOrderStep(1);

  // Schedule card picker
  $$(".schedule-card").forEach(card => {
    card.addEventListener("click", () => {
      $$(".schedule-card").forEach(c => {
        c.classList.remove("active");
        c.setAttribute("aria-checked", "false");
      });
      card.classList.add("active");
      card.setAttribute("aria-checked", "true");
      // Update hidden select value
      const sel = document.getElementById("schedule");
      if (sel) sel.value = card.dataset.schedule;
    });
  });

  // Payment method card picker
  $$(".payment-card").forEach(card => {
    card.addEventListener("click", () => {
      $$(".payment-card").forEach(c => {
        c.classList.remove("active");
        c.setAttribute("aria-checked", "false");
      });
      card.classList.add("active");
      card.setAttribute("aria-checked", "true");
      const sel = document.getElementById("paymentMethod");
      if (sel) {
        sel.value = card.dataset.payment;
      }
      updateFinalReview();
    });
  });
}

/* ===================== ROLE PICKER (order form) ===================== */
function setupRolePicker() {
  $$(".role-pick-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".role-pick-btn").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-checked", "true");
      const sel = $("#preferredRole");
      if (sel) sel.value = btn.dataset.rolepick;
    });
  });
}

/* ===================== CUSTOM HERO PICKER PANEL ===================== */
let hppRole = "All";

function renderHpp() {
  const grid = document.getElementById("hppGrid");
  if (!grid) return;

  const query = (document.getElementById("hppSearch")?.value || "").toLowerCase().trim();

  const filtered = HEROES.filter(h => {
    const matchName = h.name.toLowerCase().includes(query);
    const matchRole = hppRole === "All" ||
      h.roles.some(r => r.toLowerCase() === hppRole.toLowerCase());
    return matchName && matchRole;
  });

  if (!filtered.length) {
    grid.innerHTML = `<p class="hpp-no-results">No heroes found.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(h => {
    const isSelected = selectedHero && selectedHero.name === h.name;
    const rc  = roleClass(h.role);
    const safe = h.name.replace(/&/g,"&amp;").replace(/"/g,"&quot;");
    const diffBadge = h.difficulty === "high"
      ? `<span class="hpp-diff-badge" title="High difficulty">★</span>` : "";
    return `
      <button class="hpp-card${isSelected ? " hpp-selected" : ""}"
        type="button"
        data-hppname="${safe}"
        role="option"
        aria-selected="${isSelected}"
        aria-label="${safe}${h.difficulty === "high" ? " — High difficulty" : ""}">
        <img src="${h.img}" alt="${safe}" loading="lazy" width="72" height="72"
          onerror="this.style.opacity='0'">
        <div class="hpp-card-overlay"></div>
        <div class="hpp-card-info">
          <span class="hpp-name">${safe}</span>
          <span class="hpp-role role-text-${rc}">${h.role}</span>
        </div>
        <div class="hpp-check" aria-hidden="true">✓</div>
        ${diffBadge}
      </button>`;
  }).join("");
}

function selectHppHero(name) {
  const h = heroByName(name);
  if (!h) return;

  selectedHero = h;

  // Sync the hidden select
  const drop = document.getElementById("specificHeroDrop");
  if (drop) drop.value = h.name;

  updateChosenHero(h);
  updateStepHeroPreview(h);
  updateAll();
  renderHpp();

  // Enable next button
  const nextDetails = document.getElementById("nextToDetails");
  if (nextDetails) nextDetails.disabled = false;

  // In order flow step 2 → auto-advance to step 3
  if (orderFlow && orderStep === 2) {
    setOrderStep(3);
    const orderEl = document.getElementById("order");
    if (orderEl) {
      setTimeout(() => {
        orderEl.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => document.getElementById("customerName")?.focus(), 450);
      }, 80);
    }
    showToast(`${h.name} selected. Fill in your details.`);
  } else {
    showToast(`${h.name} selected.`);
  }
}

function setupHpp() {
  const grid = document.getElementById("hppGrid");
  if (!grid) return;

  // Click delegation
  grid.addEventListener("click", e => {
    const card = e.target.closest(".hpp-card");
    if (card) selectHppHero(card.dataset.hppname);
  });

  // Search
  const search = document.getElementById("hppSearch");
  if (search) search.addEventListener("input", renderHpp);

  // Role tabs
  $$(".hpp-rtab").forEach(tab => {
    tab.addEventListener("click", () => {
      $$(".hpp-rtab").forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      hppRole = tab.dataset.hpprole;
      renderHpp();
    });
  });
}

/* ===================== ROLE FILTERS (hero grid section) ===================== */
function setupFilters() {
  const searchInput = $("#heroSearch");
  if (searchInput) searchInput.addEventListener("input", renderHeroes);

  $$(".role-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".role-pill").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      activeRole = btn.dataset.role;
      renderHeroes();
    });
  });
}

/* ===================== COPY + FACEBOOK ===================== */
function copyOrderText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
      .then(() => true)
      .catch(() => fallbackCopyText(text));
  }
  return Promise.resolve(fallbackCopyText(text));
}

function fallbackCopyText(text) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.cssText = "position:fixed;opacity:0;pointer-events:none;top:0;left:0;";
  document.body.appendChild(area);
  area.select();
  area.setSelectionRange(0, area.value.length);
  let copied = false;
  try { copied = document.execCommand("copy"); } catch (e) { console.error(e); }
  area.remove();
  return copied;
}

async function createOrderMessage() {
  if (orderStep !== 3) { showToast("Complete Rank → Hero → Details first."); return; }

  const effectiveHero = heroMode === "specific" ? getEffectiveHero() : selectedHero;
  if (!effectiveHero && heroMode !== "general") {
    showToast("Choose a hero before sending the order.");
    return;
  }

  const customerName = $("#customerName")?.value.trim() || "";
  const mlId = $("#mlId")?.value.trim() || "";
  const serverId = $("#server")?.value.trim() || "";
  const paymentMethod = $("#paymentMethod")?.value || "GCash";

  if (!customerName) { $("#customerName")?.focus(); showToast("Enter your in-game name."); return; }
  if (!mlId) { $("#mlId")?.focus(); showToast("Enter your MLBB Account ID."); return; }
  if (!serverId) { $("#server")?.focus(); showToast("Enter your Server ID."); return; }

  const curName = $("#currentRank")?.value || "";
  const tgtName = $("#targetRank")?.value || "";
  const role = $("#preferredRole")?.value || "No preference";
  const schedule = $("#schedule")?.value || "Any available time";
  const price = calcPrice();
  const { starsNeeded, valid, total, ratePerStar, diffAdd, topAdd } = price;
  const estimate = valid && total > 0 ? formatPeso(total) : "To confirm";
  const heroLabel = effectiveHero
    ? `${effectiveHero.name} (${effectiveHero.role}${effectiveHero.difficulty === "high" ? ", Hard" : ""})`
    : "General — any hero";
  const mmrTopLabel = mmrTopTarget ? ` (Top ${mmrTopTarget})` : "";
  const mmrLabel = mmrServer === "global" ? "Global" + mmrTopLabel : mmrServer === "ph" ? "Philippines" + mmrTopLabel : "No MMR";

  const payload = {
    customerName, mlId, serverId, currentRank: curName, targetRank: tgtName,
    starsNeeded: valid ? starsNeeded : null, mmrServer: mmrServer, mmrTopTarget: mmrTopTarget,
    preferredHero: heroLabel, preferredRole: role, schedule, paymentMethod, estimate, ratePerStar: valid ? ratePerStar : null,
    difficultySurcharge: diffAdd || 0, topRankSurcharge: topAdd || 0
  };

  let orderId = "";
  try {
    const response = await fetch(`${SITE.apiBase}/api/orders`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Order could not be submitted.");
    orderId = data.orderId || "";
    if (orderId) {
      const field = $("#paymentOrderId");
      if (field) field.value = orderId;
      showToast(`Order ${orderId} submitted. Payment stays locked until approval.`);
    }
  } catch (error) {
    console.warn("Order API unavailable:", error);
    showToast("Order API unavailable. Your Messenger draft will still open.");
  }

  const extraNotes = [];
  if (diffAdd > 0) extraNotes.push(`Hero difficulty surcharge included (+${formatPeso(diffAdd)})`);
  if (topAdd > 0) extraNotes.push(`Top ${mmrTopTarget} surcharge included (+${formatPeso(topAdd)})`);

  const lines = [
    "Hello EJ Pilot Service! I want to place an order.",
    orderId ? `Order ID: ${orderId}` : "",
    "",
    `Name: ${customerName}`,
    `Current Rank: ${curName}`,
    `Target Rank: ${tgtName}`,
    `Estimated Stars/Points Needed: ${valid ? starsNeeded : "To confirm"}`,
    `MMR: ${mmrLabel}`,
    `Preferred Hero: ${heroLabel}`,
    `Preferred Role: ${role}`,
    `Preferred Schedule: ${schedule}`,
    `Preferred Payment Method: ${paymentMethod}`,
    `MLBB Account ID: ${mlId}`,
    `Server ID: ${serverId}`,
    `Website Estimate: ${estimate}`,
    ...extraNotes,
    "",
    "Please confirm the final price, schedule, and order approval before payment."
  ].filter(Boolean);

  const message = lines.join("\n");
  const facebookLink = String(SITE.facebookLink || "").trim();
  if (!/^https:\/\/(www\.)?facebook\.com\//i.test(facebookLink)) { showToast("Facebook link is not configured correctly."); return; }

  const button = $("#messageOrder");
  if (button) { button.disabled = true; button.classList.add("is-loading"); }
  try {
    const copied = await copyOrderText(message);
    showToast(copied ? "Order copied. Opening Facebook…" : "Facebook is opening. Copy the order manually if needed.");
    setTimeout(() => window.location.assign(facebookLink), 500);
  } finally {
    setTimeout(() => { if (button) { button.disabled = false; button.classList.remove("is-loading"); } }, 1000);
  }
}

/* ===================== SECURE PAYMENT ===================== */
function paymentDetailHtml(details, method) {
  if (!details) return "";
  const parts = [];
  if (details.message) parts.push(`<p>${escapeHtml(details.message)}</p>`);
  if (details.accountName) parts.push(`<div class="payment-detail-row"><span>Account name</span><strong>${escapeHtml(details.accountName)}</strong></div>`);
  if (details.accountNumber) parts.push(`<div class="payment-detail-row"><span>Account / reference</span><strong>${escapeHtml(details.accountNumber)}</strong></div>`);
  if (details.email) parts.push(`<div class="payment-detail-row"><span>Email / username</span><strong>${escapeHtml(details.email)}</strong></div>`);
  if (details.cardType) parts.push(`<div class="payment-detail-row"><span>Landbank option</span><strong>${escapeHtml(details.cardType)}</strong></div>`);
  if (details.qrUrl) parts.push(`<img class="approved-payment-qr" src="${encodeURI(details.qrUrl)}" alt="Approved ${escapeHtml(method)} payment QR code">`);
  return `<div class="approved-payment"><div class="approved-payment-label">APPROVED PAYMENT · ${escapeHtml(method)}</div>${parts.join("")}</div>`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'\"':"&quot;", "'":"&#039;"}[ch]));
}

async function checkPaymentStatus(orderId) {
  const title = $("#paymentStatusTitle");
  const text = $("#paymentStatusText");
  const box = $("#paymentDetails");
  if (!orderId) { showToast("Enter your Order ID."); return; }
  try {
    const response = await fetch(`${SITE.apiBase}/api/orders/${encodeURIComponent(orderId)}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Order not found.");
    box.hidden = true; box.innerHTML = "";
    if (data.status === "approved") {
      title.textContent = "Order approved";
      text.textContent = `Payment method: ${data.paymentMethod}. The server released only the payment details for this approved order.`;
      if (data.paymentDetails) { box.innerHTML = paymentDetailHtml(data.paymentDetails, data.paymentMethod); box.hidden = false; }
    } else {
      title.textContent = data.status === "pending" ? "Pending admin approval" : data.status.replace(/_/g, " ");
      text.textContent = `Payment method: ${data.paymentMethod}. Payment details remain locked until approval.`;
    }
  } catch (error) {
    title.textContent = "Status unavailable";
    text.textContent = error.message || "Could not check the order status.";
    box.hidden = true; box.innerHTML = "";
    showToast(text.textContent);
  }
}

function setupSecurePayment() {
  $("#paymentStatusForm")?.addEventListener("submit", e => {
    e.preventDefault();
    checkPaymentStatus($("#paymentOrderId")?.value.trim());
  });
}

/* ===================== MODALS ===================== */
function setupModals() {
  $$("[data-close]").forEach(btn => btn.addEventListener("click", closeAllModals));

  $$(".modal").forEach(modal => {
    modal.addEventListener("click", e => { if (e.target === modal) closeAllModals(); });
  });

  $$(".proof-card").forEach(card => {
    card.addEventListener("click", () => {
      const src = card.dataset.proof;
      const img = $("#proofPreview");
      const modal = $("#proofModal");
      if (!img || !modal || !src) return;
      img.src = src;
      img.onerror = () => {
        img.removeAttribute("src");
        showToast("Add proof images to images/proofs/ first.");
        closeAllModals();
      };
      modal.classList.remove("hidden");
    });
  });
}

function closeAllModals() {
  $$(".modal").forEach(m => m.classList.add("hidden"));
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeAllModals();
});

/* ===================== MOBILE NAV ===================== */
function setupMobileNav() {
  const toggle = $("#navToggle");
  const menu   = $("#mobileMenu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    menu.classList.toggle("open", !expanded);
    menu.setAttribute("aria-hidden", String(expanded));
  });

  $$(".mm-link, .mm-cta").forEach(link => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("open");
      menu.setAttribute("aria-hidden", "true");
    });
  });
}

/* ===================== SCROLL REVEAL ===================== */
function setupReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.07, rootMargin: "0px 0px -40px 0px" });
  items.forEach(el => io.observe(el));
}

/* ===================== HARD-HERO BADGE CSS ===================== */
function injectDiffBadgeStyle() {
  const style = document.createElement("style");
  style.textContent = `
    .hero-diff-badge {
      position: absolute;
      top: 8px; left: 8px;
      width: 18px; height: 18px;
      border-radius: 50%;
      background: rgba(232,184,75,0.22);
      border: 1px solid rgba(232,184,75,0.55);
      color: var(--gold);
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 4;
      line-height: 1;
    }
    .hard-hero .hero-card-name { color: #fff; }
  `;
  document.head.appendChild(style);
}

/* ===================== CONTACT FORM ===================== */
async function setupContactForm() {
  const form = $("#contactForm");
  const status = $("#contactStatus");
  if (!form) return;

  // Topic chip picker
  $$(".topic-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      $$(".topic-chip").forEach(c => {
        c.classList.remove("active");
        c.setAttribute("aria-checked", "false");
      });
      chip.classList.add("active");
      chip.setAttribute("aria-checked", "true");
      const sel = document.getElementById("contactTopic");
      if (sel) sel.value = chip.dataset.topic;
    });
  });

  // Message character counter
  const msgArea = $("#contactMessage");
  const charCount = $("#messageCharCount");
  function updateCharCount() {
    if (!msgArea || !charCount) return;
    const len = msgArea.value.length;
    const max = 2000;
    charCount.textContent = `${len} / ${max}`;
    charCount.classList.toggle("near-limit", len >= max * 0.85 && len < max);
    charCount.classList.toggle("at-limit", len >= max);
  }
  if (msgArea) {
    msgArea.addEventListener("input", updateCharCount);
    updateCharCount();
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const payload = {
      name: $("#contactName")?.value.trim() || "",
      email: $("#contactEmail")?.value.trim() || "",
      topic: $("#contactTopic")?.value || "Other",
      message: $("#contactMessage")?.value.trim() || ""
    };
    if (!payload.name || !payload.message) { status.textContent = "Name and message are required."; return; }
    status.textContent = "Sending…";
    try {
      const response = await fetch(`${SITE.apiBase}/api/contact`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Contact form could not be sent.");
      status.textContent = "Message sent. Keep your reference private.";
      form.reset();
      // Restore topic chip default after reset
      $$(".topic-chip").forEach(c => {
        const isOrder = c.dataset.topic === "Order";
        c.classList.toggle("active", isOrder);
        c.setAttribute("aria-checked", isOrder ? "true" : "false");
      });
      const topicSel = document.getElementById("contactTopic");
      if (topicSel) topicSel.value = "Order";
      updateCharCount();
    } catch (error) {
      status.textContent = "Contact form is unavailable on this static host. Configure the site server to receive submissions.";
    }
  });
}

/* ===================== INIT ===================== */
function init() {
  injectDiffBadgeStyle();
  populateRanks();
  populateHeroDrop();
  renderPricing();
  renderStage();
  renderHeroes();
  renderHpp();
  setupMMRToggle();
  setupHeroModeToggle();
  setupRolePicker();
  setupHpp();
  setupFilters();
  setupModals();
  setupSecurePayment();
  setupMobileNav();
  setupReveal();
  setupOrderFlow();
  setupContactForm();
  updateStepHeroPreview(selectedHero);
  updateNextStep1Button();
  updateMMRTopVisibility();
  updateAll();

  // Messenger button
  $("#messageOrder")?.addEventListener("click", createOrderMessage);


  // Hero grid event delegation
  const grid = $("#heroGrid");
  if (grid) {
    grid.addEventListener("click", e => {
      const card = e.target.closest(".hero-card");
      if (card) selectHero(card.dataset.hero);
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
