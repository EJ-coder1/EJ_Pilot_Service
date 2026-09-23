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
    { rank: "Mythic",             note: "Per star",  rateKey: "Mythic"             },
    { rank: "Mythical Honor",     note: "Per star",  rateKey: "Mythical Honor"     },
    { rank: "Mythical Glory",     note: "Per star",  rateKey: "Mythical Glory"     },
    { rank: "Mythical Immortal",  note: "Per star",  rateKey: "Mythical Immortal", featured: true }
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
/*
  MLBB rank badge images — cropped directly from the official rank emblem
  reference sheet. Each image is the real MLBB rank icon embedded as base64.
  Mobile Legends: Bang Bang and rank emblems are trademarks of Moonton.
  Used here for identification only. EJ Pilot Service is not affiliated
  with or endorsed by Moonton.
*/
function rankBadgeSVG(name) {
  const imgs = {
    "Grandmaster": `<img class="rank-badge rank-badge-grandmaster" src="data:image/png;base64,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" alt="Grandmaster rank" width="28" height="28" aria-hidden="true">`,
    "Epic": `<img class="rank-badge rank-badge-epic" src="data:image/png;base64,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" alt="Epic rank" width="28" height="28" aria-hidden="true">`,
    "Legend": `<img class="rank-badge rank-badge-legend" src="data:image/png;base64,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" alt="Legend rank" width="28" height="28" aria-hidden="true">`,
    "Mythic": `<img class="rank-badge rank-badge-mythic" src="data:image/png;base64,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" alt="Mythic rank" width="28" height="28" aria-hidden="true">`,
    "Mythical Honor": `<img class="rank-badge rank-badge-mythicalhonor" src="data:image/png;base64,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" alt="Mythical Honor rank" width="28" height="28" aria-hidden="true">`,
    "Mythical Glory": `<img class="rank-badge rank-badge-mythicalglory" src="data:image/png;base64,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" alt="Mythical Glory rank" width="28" height="28" aria-hidden="true">`,
    "Mythical Immortal": `<img class="rank-badge rank-badge-mythicalimmortal" src="data:image/png;base64,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" alt="Mythical Immortal rank" width="28" height="28" aria-hidden="true">`,
  };
  return imgs[name] || imgs["Grandmaster"];
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
  const RANK_SUBTITLES = {
    "Grandmaster":       "V–I · 5 stars/div",
    "Epic":              "V–I · 5 stars/div",
    "Legend":            "V–I · 5 stars/div",
    "Mythic":            "Stars 0–24",
    "Mythical Honor":    "Stars 25–49",
    "Mythical Glory":    "Stars 50–99",
    "Mythical Immortal": "Stars 100+",
  };
  container.innerHTML = RANK_NAMES.map(name => {
    const active = name === defaultValue ? " active" : "";
    const badge = rankBadgeSVG(name);
    const sub = RANK_SUBTITLES[name] || "";
    return `<button class="rank-card${active}" type="button"
      data-rank="${name.replace(/"/g,"&quot;")}"
      data-for="${hiddenSelectId}"
      role="radio" aria-checked="${name === defaultValue}"
      aria-label="${name}">
      ${badge}
      <span class="rank-card-inner">
        <span class="rank-card-name">${name}</span>
        ${sub ? `<span class="rank-card-sub">${sub}</span>` : ""}
      </span>
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

  /* Wire position pickers (division pills + star taps) */
  setupPositionPicker({
    divPickerId:  "currentDivPicker",
    divHiddenId:  "currentDiv",
    starTapId:    "currentStarTaps",
    starHiddenId: "currentStars",
    onChange: () => { updateStarsLabelsAndLimits(); updateAll(); }
  });
  setupPositionPicker({
    divPickerId:  "targetDivPicker",
    divHiddenId:  "targetDiv",
    starTapId:    "targetStarTaps",
    starHiddenId: "stars",
    onChange: () => { updateStarsLabelsAndLimits(); updateAll(); }
  });
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

/* ===================== POSITION PICKERS (Division + Stars) ===================== */
/*
  MLBB Rank structure for Grandmaster / Epic / Legend:
    5 divisions per rank: V (lowest) → I (highest)
    5 stars per division: 0 (entry) to 5 (promote)
    Absolute star within rank = (5 - divNum) * 5 + starsInDiv
      Div V  star 0 = abs 0   … Div V  star 5 = abs 5
      Div IV star 0 = abs 5   … Div IV star 5 = abs 10
      Div III star 0 = abs 10 … etc.
      Div I  star 5 = abs 25 = exit rank
    Total stars in rank = 5 × 5 = 25

  Mythic / Mythical Honor / Glory / Immortal:
    Cumulative star count (no divisions):
      Mythic:            0 – 24
      Mythical Honor:   25 – 49
      Mythical Glory:   50 – 99
      Mythical Immortal: 100+
*/

/* Wire a div-pill picker row and the matching star-tap row for one side (current/target) */
function setupPositionPicker(cfg) {
  /* cfg = { divPickerId, divHiddenId, starTapId, starHiddenId, onChange } */
  const divPicker  = $("#" + cfg.divPickerId);
  const starTaps   = $("#" + cfg.starTapId);
  const divHidden  = $("#" + cfg.divHiddenId);
  const starHidden = $("#" + cfg.starHiddenId);

  /* Division pills */
  if (divPicker) {
    divPicker.querySelectorAll(".div-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        divPicker.querySelectorAll(".div-pill").forEach(b => {
          b.classList.remove("active");
          b.setAttribute("aria-checked", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-checked", "true");
        if (divHidden) divHidden.value = btn.dataset.div;
        cfg.onChange?.();
      });
    });
  }

  /* Star taps */
  if (starTaps) {
    starTaps.querySelectorAll(".star-tap").forEach(btn => {
      btn.addEventListener("click", () => {
        starTaps.querySelectorAll(".star-tap").forEach(b => {
          b.classList.remove("active");
          b.setAttribute("aria-checked", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-checked", "true");
        if (starHidden) starHidden.value = btn.dataset.star;
        cfg.onChange?.();
      });
    });
  }
}

/* Convert division number + stars-in-division → absolute star index within rank
   divNum: 5 = Division V (lowest), 1 = Division I (highest)
   starsInDiv: 0–5 */
function divToAbsolute(divNum, starsInDiv) {
  return (5 - parseInt(divNum, 10)) * 5 + parseInt(starsInDiv || 0, 10);
}

/* Get an effective cumulative star value for a rank slot.
   For division ranks: converts div + stars → absolute.
   For Mythic+: reads the hidden input directly (cumulative). */
function getEffectiveStars(rankName, starHiddenId, divHiddenId) {
  const tier = tierByName(rankName);
  if (!tier) return 0;
  const raw = parseInt($("#" + starHiddenId)?.value, 10) || 0;
  if (tier.isPoints) return Math.max(tier.minPoints, Math.min(tier.maxPoints < 9999 ? tier.maxPoints : 999, raw));
  const div = parseInt($("#" + divHiddenId)?.value, 10) || 1;
  const starsInDiv = Math.min(5, Math.max(0, raw));
  return divToAbsolute(div, starsInDiv);
}

/* Rebuild the star tap buttons for Mythic+ as a plain number input overlay,
   or restore the 0–5 taps for division ranks. */
function updateStarsLabelsAndLimits() {
  const curName = $("#currentRank")?.value;
  const tgtName = $("#targetRank")?.value;
  const curTier = tierByName(curName);
  const tgtTier = tierByName(tgtName);
  if (!curTier || !tgtTier) return;

  _applyPosPicker("cur", curTier);
  _applyPosPicker("tgt", tgtTier);
}

function _applyPosPicker(side, tier) {
  const prefix   = side === "cur" ? "current" : "target";
  const divRow   = $("#" + prefix + "DivRow");
  const starRow  = $("#" + (side === "cur" ? "current" : "target") + "StarRow");
  const hdLabel  = $("#" + prefix + "StarsLabel");
  const hint     = $("#" + prefix + "StarsHint");
  const starTaps = $("#" + prefix + "StarTaps");
  const divPills = $("#" + prefix + "DivPicker");
  const starHid  = $("#" + (side === "cur" ? "currentStars" : "stars"));

  if (tier.isPoints) {
    /* ── Mythic+ mode: hide division row, replace star taps with cumulative number ── */
    if (divRow)  divRow.style.display  = "none";
    if (hdLabel) hdLabel.textContent   = side === "cur" ? "Current stars" : "Target stars";
    if (hint)    hint.textContent      = `Cumulative — ${tier.minPoints}${tier.maxPoints < 9999 ? "–"+tier.maxPoints : "+"}`;

    /* Replace star-tap row with a single number input */
    if (starRow) {
      const min = tier.minPoints;
      const max = tier.maxPoints < 9999 ? tier.maxPoints : 999;
      const cur = parseInt(starHid?.value, 10);
      const clamped = isNaN(cur) ? min : Math.max(min, Math.min(max, cur));
      starRow.innerHTML = `
        <label class="pos-num-label">
          <span class="pos-div-label">Stars</span>
          <input class="pos-num-input" id="${side === "cur" ? "currentStars" : "stars"}"
            type="number" min="${min}" max="${max}" value="${clamped}"
            inputmode="numeric" placeholder="${min}–${tier.maxPoints < 9999 ? tier.maxPoints : "999"}">
        </label>`;
      /* Re-wire the new input to trigger recalc */
      const newInput = starRow.querySelector("input");
      if (newInput) {
        newInput.addEventListener("input", () => {
          let v = parseInt(newInput.value, 10);
          if (!isNaN(v)) {
            if (v < min) newInput.value = min;
            if (v > max) newInput.value = max;
          }
          updateAll();
        });
        newInput.addEventListener("blur", () => {
          let v = parseInt(newInput.value, 10);
          if (isNaN(v) || v < min) newInput.value = min;
          if (v > max) newInput.value = max;
          updateAll();
        });
      }
    }

  } else {
    /* ── Division rank mode: show division pills + star taps 0–5 ── */
    if (divRow) divRow.style.display = "";
    if (hdLabel) hdLabel.textContent = side === "cur" ? "Current position" : "Target position";
    if (hint) hint.textContent = "Pick your division (V = lowest, I = highest)";

    /* Restore star-tap row if it was replaced */
    if (starRow && !starRow.querySelector(".star-tap")) {
      const prevVal = parseInt(starHid?.value, 10) || 0;
      const clamped = Math.min(5, Math.max(0, prevVal));
      const hidId   = side === "cur" ? "currentStars" : "stars";
      const tapId   = side === "cur" ? "currentStarTaps" : "targetStarTaps";
      const tapsHtml = [0,1,2,3,4,5].map(n =>
        `<button class="star-tap${n === clamped ? " active" : ""}" type="button"
          data-star="${n}" data-for="${hidId}"
          aria-checked="${n === clamped}">${n}</button>`
      ).join("");
      starRow.innerHTML = `
        <span class="pos-div-label" id="${side === "cur" ? "currentStarsFieldLabel" : "targetStarsFieldLabel"}">Stars</span>
        <div class="star-tap-row" id="${tapId}" role="radiogroup">${tapsHtml}</div>
        <input type="hidden" id="${hidId}" value="${clamped}" min="0" max="5">`;

      /* Re-wire star taps */
      starRow.querySelectorAll(".star-tap").forEach(btn => {
        btn.addEventListener("click", () => {
          starRow.querySelectorAll(".star-tap").forEach(b => {
            b.classList.remove("active");
            b.setAttribute("aria-checked", "false");
          });
          btn.classList.add("active");
          btn.setAttribute("aria-checked", "true");
          const h = starRow.querySelector("input[type=hidden]");
          if (h) h.value = btn.dataset.star;
          updateAll();
        });
      });
    }
  }
}

/* Human-readable position label for order message */
function _posLabel(rankName, starHiddenId, divHiddenId) {
  const tier = tierByName(rankName);
  if (!tier) return "—";
  const starVal = parseInt($("#" + starHiddenId)?.value, 10) || 0;
  if (tier.isPoints) return starVal + " cumulative stars";
  const divNum = parseInt($("#" + divHiddenId)?.value, 10) || 1;
  const divName = ["","I","II","III","IV","V"][divNum] || divNum;
  return `Division ${divName}, ${starVal} star${starVal !== 1 ? "s" : ""}`;
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
  if (!curTier || !tgtTier) return { starsNeeded: 0, valid: false, warning: "Invalid rank selection." };

  const curIdx = tierIndex(curName);
  const tgtIdx = tierIndex(tgtName);

  /* For division ranks: div-pill + star-tap → absolute star index.
     For Mythic+: cumulative star number input, clamped to tier range. */
  const curStars = getEffectiveStars(curName, "currentStars", "currentDiv");
  const tgtStars = getEffectiveStars(tgtName, "stars", "targetDiv");

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

/* Attempt clipboard write. Returns true if copied, false otherwise. */
function copyOrderText(text) {
  /* Modern async API — works on Chrome, Firefox, Safari 13.1+, Edge */
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
      .then(() => true)
      .catch(() => _execCopy(text));
  }
  /* Fallback for http, older Android WebView, iOS < 13.4 */
  return Promise.resolve(_execCopy(text));
}

/* execCommand fallback — synchronous, works on Oppo/older Android */
function _execCopy(text) {
  const area = document.createElement("textarea");
  area.value = text;
  /* Must be in DOM and visible (even 1px) for iOS Safari to select */
  area.style.cssText = [
    "position:fixed", "top:0", "left:0",
    "width:2em", "height:2em",
    "padding:0", "border:none", "outline:none",
    "box-shadow:none", "background:transparent",
    "font-size:16px" /* prevents iOS zoom on focus */
  ].join(";");
  document.body.appendChild(area);
  area.focus();
  area.select();
  area.setSelectionRange(0, area.value.length);
  let ok = false;
  try { ok = document.execCommand("copy"); } catch (_) {}
  document.body.removeChild(area);
  return ok;
}

/* Show an overlay with the message text so user can long-press copy on any device */
function showOrderOverlay(message, onProceed) {
  /* Remove any existing overlay */
  const old = document.getElementById("orderOverlay");
  if (old) old.remove();

  const overlay = document.createElement("div");
  overlay.id = "orderOverlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Order ready to send");
  overlay.innerHTML = `
    <div class="order-overlay-box">
      <div class="order-overlay-hd">
        <span class="order-overlay-title">Your order is ready</span>
        <button class="order-overlay-close" aria-label="Close" id="orderOverlayClose">&#10005;</button>
      </div>
      <p class="order-overlay-hint">Your order was <strong>copied to clipboard</strong>. Tap the button below to open Messenger, then paste and send.<br><em>If the copy didn't work, long-press the text below and copy it manually.</em></p>
      <textarea class="order-overlay-text" readonly id="orderOverlayText">${escapeHtml(message)}</textarea>
      <div class="order-overlay-actions">
        <button class="order-overlay-copy btn btn-secondary" id="orderOverlayCopy" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy again
        </button>
        <button class="order-overlay-send btn btn-primary" id="orderOverlaySend" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Open Messenger &amp; Paste
        </button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  /* Focus trap and close */
  const close = () => overlay.remove();
  overlay.querySelector("#orderOverlayClose").addEventListener("click", close);
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", function esc(e) {
    if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); }
  });

  /* Copy again button */
  overlay.querySelector("#orderOverlayCopy").addEventListener("click", () => {
    copyOrderText(message).then(ok => {
      const btn = overlay.querySelector("#orderOverlayCopy");
      btn.textContent = ok ? "Copied!" : "Select text above & copy";
      setTimeout(() => {
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2-2v1"/></svg> Copy again`;
      }, 2000);
      /* Also select textarea for manual copy */
      const ta = overlay.querySelector("#orderOverlayText");
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
    });
  });

  /* Send = open Messenger */
  overlay.querySelector("#orderOverlaySend").addEventListener("click", () => {
    onProceed();
    close();
  });

  /* Auto-select textarea so mobile can see it */
  setTimeout(() => {
    const ta = overlay.querySelector("#orderOverlayText");
    if (ta) { ta.focus(); ta.select(); ta.setSelectionRange(0, ta.value.length); }
  }, 80);
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
    `Current Position: ${_posLabel(curName, "currentStars", "currentDiv")}`,
    `Target Rank: ${tgtName}`,
    `Target Position: ${_posLabel(tgtName, "stars", "targetDiv")}`,
    `Stars Needed to Boost: ${valid ? starsNeeded : "To confirm"}`,
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
  /* ── Resolve Messenger link ─────────────────────────────────────────
     SITE.facebookLink accepts:
       • https://m.me/username          → used directly
       • https://www.facebook.com/share/XXXX  → converted to m.me link
       • https://www.facebook.com/username    → converted to m.me link
     m.me links open the Messenger app on Android & iOS automatically.
  ───────────────────────────────────────────────────────────────────── */
  let rawLink = String(SITE.facebookLink || "").trim();
  let messengerLink = rawLink;

  /* If it's already an m.me link, keep it */
  if (!/^https:\/\/m\.me\//i.test(rawLink)) {
    /* Try to extract username from facebook.com/username */
    const profileMatch = rawLink.match(/facebook\.com\/(?!share\/)([a-zA-Z0-9_.]+)/);
    if (profileMatch) {
      messengerLink = "https://m.me/" + profileMatch[1];
    } else {
      /* share/XXXX links — can't convert, fall back to raw link */
      messengerLink = rawLink;
    }
  }

  if (!messengerLink || !/^https:\/\//i.test(messengerLink)) {
    showToast("Facebook/Messenger link is not configured correctly.");
    return;
  }

  const button = $("#messageOrder");
  if (button) { button.disabled = true; button.classList.add("is-loading"); }

  /* Copy first while we're still in the synchronous click context */
  let copied = false;
  try { copied = await copyOrderText(message); } catch (_) {}

  /* Show overlay — user taps "Open Messenger & Paste" to proceed */
  showOrderOverlay(message, () => {
    /* Use window.open so we don't navigate away from the page.
       On mobile this opens the Messenger app or the m.me web page.
       noopener/noreferrer for security. */
    const win = window.open(messengerLink, "_blank", "noopener,noreferrer");
    /* Fallback: if popup was blocked, navigate directly */
    if (!win || win.closed || typeof win.closed === "undefined") {
      window.location.href = messengerLink;
    }
  });

  if (button) { button.disabled = false; button.classList.remove("is-loading"); }
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
