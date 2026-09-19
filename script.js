/* =======================================================
   EJ Pilot Service — script.js
   Edit only SITE and PRICING to configure the site.
   Hero data is embedded — no network fetch required.
   ======================================================= */

/* ===================== SITE CONFIG ===================== */
const SITE = {
  facebookLink: "https://www.facebook.com/share/19aeGJULcA/",
  gcashNumber:  "09757209196"
};

/* ===================== PRICING CONFIG ===================== */
/*
  IMPORTANT: All rates are in Philippine Peso (₱).

  BASE_RATES: cost per STAR/POINT at that rank tier.
  Set each rank's rate. 0 = "to confirm" (shows ₱XX in UI).

  MULTIPLIERS:
  - specificHero  : flat multiplier when client picks a specific hero (e.g. 1.20 = +20%)
  - globalMMR     : flat multiplier for Global server instead of PH  (e.g. 1.30 = +30%)
  - heroDifficulty: extra multiplier stacked on specificHero when hero is marked hard (e.g. 1.25 = additional +25%)
*/
const PRICING = {
  /* Per-tier base rates (₱ per star/point) */
  BASE_RATES: {
    "Warrior":           20,
    "Elite":             25,
    "Master":            30,
    "Grandmaster":       35,
    "Epic":              50,
    "Legend":            60,
    "Mythic":            80,
    "Mythical Honor":    90,
    "Mythical Glory":   110,
    "Mythical Immortal":150
  },
  /* Multipliers */
  MULTIPLIERS: {
    specificHero:   1.20,   // +20% for specific hero pick
    heroDifficulty: 1.25,   // additional +25% when hero is high-difficulty
    globalMMR:      1.30    // +30% for Global MMR
  },
  /* Pricing card display (shown in Pricing section) */
  CARDS: [
    { rank: "Warrior – Master",        note: "Per star",   rateKey: "Warrior"           },
    { rank: "Grandmaster – Epic",      note: "Per star",   rateKey: "Grandmaster"       },
    { rank: "Legend",                  note: "Per star",   rateKey: "Legend"            },
    { rank: "Mythic",                  note: "Per point",  rateKey: "Mythic"            },
    { rank: "Mythical Honor",          note: "Per point",  rateKey: "Mythical Honor"    },
    { rank: "Mythical Glory",          note: "Per point",  rateKey: "Mythical Glory"    },
    { rank: "Mythical Immortal",       note: "Per point",  rateKey: "Mythical Immortal", featured: true }
  ]
};

/* ===================== RANK SYSTEM ===================== */
/*
  Each rank tier has:
  - divisions: number of sub-divisions (I, II, III … from bottom to top)
  - starsPerDiv: stars required per division
  - totalStars: total stars to exit this tier (to next tier)
  - isPoints: true for Mythic+ (uses points, not stars)
  - minPoints / maxPoints: for Mythic+ tiers
*/
const RANK_TIERS = [
  { name: "Warrior",          divisions: 3,  starsPerDiv: 3,  totalStars: 9,   isPoints: false },
  { name: "Elite",            divisions: 3,  starsPerDiv: 4,  totalStars: 12,  isPoints: false },
  { name: "Master",           divisions: 4,  starsPerDiv: 4,  totalStars: 16,  isPoints: false },
  { name: "Grandmaster",      divisions: 5,  starsPerDiv: 5,  totalStars: 25,  isPoints: false },
  { name: "Epic",             divisions: 5,  starsPerDiv: 5,  totalStars: 25,  isPoints: false },
  { name: "Legend",           divisions: 5,  starsPerDiv: 5,  totalStars: 25,  isPoints: false },
  { name: "Mythic",           divisions: 0,  starsPerDiv: 0,  totalStars: 25,  isPoints: true,  minPoints: 0,   maxPoints: 24  },
  { name: "Mythical Honor",   divisions: 0,  starsPerDiv: 0,  totalStars: 25,  isPoints: true,  minPoints: 25,  maxPoints: 49  },
  { name: "Mythical Glory",   divisions: 0,  starsPerDiv: 0,  totalStars: 50,  isPoints: true,  minPoints: 50,  maxPoints: 99  },
  { name: "Mythical Immortal",divisions: 0,  starsPerDiv: 0,  totalStars: 0,   isPoints: true,  minPoints: 100, maxPoints: 9999}
];

const RANK_NAMES = RANK_TIERS.map(t => t.name);

/* ===================== HERO DATA ===================== */
/*
  difficulty: "normal" | "high"
  High = heroes that require precise mechanics and heavy game knowledge.
  These automatically get the heroDifficulty multiplier.
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
let mmrServer    = "ph";       // "ph" | "global"
let heroMode     = "general";  // "general" | "specific"

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
function populateRanks() {
  const opts = RANK_NAMES.map(r => `<option value="${r}">${r}</option>`).join("");
  $("#currentRank").innerHTML = opts;
  $("#targetRank").innerHTML  = opts;
  $("#currentRank").value = "Epic";
  $("#targetRank").value  = "Legend";
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

  // Stars remaining in current tier
  if (!curTier.isPoints) {
    total += curTier.totalStars - curStars;
  } else {
    // Points to reach end of current Mythic tier
    total += curTier.totalStars - curStars;
  }

  // Full tiers in between
  for (let i = curIdx + 1; i < tgtIdx; i++) {
    total += RANK_TIERS[i].totalStars;
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

/* Full price calculation */
function calcPrice() {
  const tgtName = $("#targetRank")?.value;
  const baseRate = PRICING.BASE_RATES[tgtName] || 0;
  const { starsNeeded, valid, warning } = computeStarsNeeded();

  if (!valid || baseRate === 0) {
    return { base: 0, heroAdd: 0, diffAdd: 0, globalAdd: 0, total: 0, starsNeeded, valid, warning, baseRate };
  }

  const base       = baseRate * starsNeeded;
  let   multiplier = 1;
  let   heroAdd    = 0;
  let   diffAdd    = 0;
  let   globalAdd  = 0;

  // Specific hero surcharge
  const effectiveHero = getEffectiveHero();
  if (heroMode === "specific" && effectiveHero) {
    const heroMult = PRICING.MULTIPLIERS.specificHero - 1; // just the extra %
    heroAdd = base * heroMult;
    multiplier += heroMult;

    // Additional difficulty surcharge
    if (effectiveHero.difficulty === "high") {
      const diffMult = (PRICING.MULTIPLIERS.heroDifficulty - 1);
      diffAdd = base * diffMult;
      multiplier += diffMult;
    }
  }

  // Global MMR surcharge
  if (mmrServer === "global") {
    const globalMult = PRICING.MULTIPLIERS.globalMMR - 1;
    globalAdd = base * globalMult;
    multiplier += globalMult;
  }

  const total = base + heroAdd + diffAdd + globalAdd;
  return { base, heroAdd, diffAdd, globalAdd, total, starsNeeded, valid, warning, baseRate };
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
  $("#summaryMMR").textContent     = mmrServer === "global" ? "Global" : "Philippines";

  if (valid && total > 0) {
    $("#estimate").textContent     = formatPeso(total);
    $("#estimateNote").textContent = "Estimate only. Confirm via Messenger.";
  } else {
    $("#estimate").textContent     = "₱—";
    $("#estimateNote").textContent = "Set ranks to see estimate.";
  }
}

function updatePriceBreakdown() {
  const { base, heroAdd, diffAdd, globalAdd, total, starsNeeded, valid, warning } = calcPrice();

  // Rank info bar
  const rib = $("#rankInfoBar");
  if (rib) {
    if (warning) {
      rib.innerHTML = `<div class="rib-inner rib-warn">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1L1 13h12L7 1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 6v3M7 11v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <span>${warning}</span>
      </div>`;
    } else if (valid) {
      const tgtName  = $("#targetRank")?.value;
      const tgtTier  = tierByName(tgtName);
      const modeText = heroMode === "specific"
        ? (getEffectiveHero()?.difficulty === "high" ? " + <strong>Hero Difficulty</strong>" : " + <strong>Specific Hero</strong>")
        : "";
      const mmrText  = mmrServer === "global" ? " + <strong>Global MMR</strong>" : "";
      const surcharge = modeText || mmrText ? ` (surcharges: ${modeText}${mmrText})` : "";
      const label    = tgtTier?.isPoints ? "points" : "stars";
      rib.innerHTML = `<div class="rib-inner">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.4"/><path d="M7 6v4M7 4.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        <span><strong>${starsNeeded} ${label}</strong> to boost${surcharge}</span>
      </div>`;
    } else {
      rib.innerHTML = "";
    }
  }

  // Price breakdown rows
  const pbBase   = $("#pbBase");
  const pbHero   = $("#pbHero");
  const pbDiff   = $("#pbDiff");
  const pbGlobal = $("#pbGlobal");
  const pbTotal  = $("#pbTotal");
  const pbHeroRow   = $("#pbHeroRow");
  const pbDiffRow   = $("#pbDiffRow");
  const pbGlobalRow = $("#pbGlobalRow");

  if (valid && base > 0) {
    if (pbBase)   pbBase.textContent   = formatPeso(base);
    if (pbHeroRow) {
      pbHeroRow.hidden = !(heroMode === "specific" && heroAdd > 0);
      if (pbHero) pbHero.textContent = "+" + formatPeso(heroAdd);
    }
    if (pbDiffRow) {
      pbDiffRow.hidden = !(heroMode === "specific" && diffAdd > 0);
      if (pbDiff) pbDiff.textContent = "+" + formatPeso(diffAdd);
    }
    if (pbGlobalRow) {
      pbGlobalRow.hidden = !(globalAdd > 0);
      if (pbGlobal) pbGlobal.textContent = "+" + formatPeso(globalAdd);
    }
    if (pbTotal) pbTotal.textContent = formatPeso(total);
  } else {
    if (pbBase)   pbBase.textContent   = "₱—";
    if (pbHeroRow)   pbHeroRow.hidden   = true;
    if (pbDiffRow)   pbDiffRow.hidden   = true;
    if (pbGlobalRow) pbGlobalRow.hidden = true;
    if (pbTotal)  pbTotal.textContent  = "₱—";
  }
}

function updateFinalReview() {
  const curName = $("#currentRank")?.value || "—";
  const tgtName = $("#targetRank")?.value || "—";
  const role    = $("#preferredRole")?.value || "No preference";
  const { starsNeeded, valid, total } = calcPrice();

  const effectiveHero = heroMode === "specific" ? getEffectiveHero() : selectedHero;

  $("#reviewRank")?.textContent  !== undefined && ($("#reviewRank").textContent  = `${curName} → ${tgtName}`);
  $("#reviewStars")?.textContent !== undefined && ($("#reviewStars").textContent = valid ? String(starsNeeded) : "—");
  $("#reviewMMR")?.textContent   !== undefined && ($("#reviewMMR").textContent   = mmrServer === "global" ? "Global" : "Philippines");
  $("#reviewRole")?.textContent  !== undefined && ($("#reviewRole").textContent  = role);
  $("#reviewHero")?.textContent  !== undefined && ($("#reviewHero").textContent  = effectiveHero ? effectiveHero.name : (heroMode === "general" ? "General (any)" : "No hero selected"));
  $("#reviewTotal")?.textContent !== undefined && ($("#reviewTotal").textContent = valid && total > 0 ? formatPeso(total) : "₱— (to confirm)");
}

function updateAll() {
  updateSummary();
  updatePriceBreakdown();
  updateFinalReview();
}

/* ===================== MMR TOGGLE ===================== */
function setupMMRToggle() {
  $$("[data-mmr]").forEach(btn => {
    btn.addEventListener("click", () => {
      $$("[data-mmr]").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-checked", "true");
      mmrServer = btn.dataset.mmr;
      updateAll();
    });
  });
}

/* ===================== HERO MODE TOGGLE ===================== */
function setupHeroModeToggle() {
  $$("[data-heromode]").forEach(btn => {
    btn.addEventListener("click", () => {
      $$("[data-heromode]").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-checked", "true");
      heroMode = btn.dataset.heromode;

      const dropWrap = $("#specificHeroDropWrap");
      if (dropWrap) dropWrap.hidden = heroMode !== "specific";

      updateAll();
    });
  });

  // Specific hero dropdown change
  const specificDrop = $("#specificHeroDrop");
  if (specificDrop) {
    specificDrop.addEventListener("change", () => {
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
    return `
      <article class="price-card${p.featured ? " featured" : ""}">
        <span class="tier">${p.note}</span>
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
  if (step === 2 && !selectedHero && heroMode !== "specific") {
    // In specific mode the grid hero is optional (they can use dropdown)
    const dropVal = $("#specificHeroDrop")?.value;
    if (!dropVal) {
      showToast("Choose a hero first.");
      return false;
    }
  }
  if (step === 2) {
    const effectiveHero = getEffectiveHero();
    if (heroMode === "general" && !selectedHero) {
      showToast("Choose a hero first.");
      return false;
    }
    if (heroMode === "specific" && !effectiveHero) {
      showToast("Choose a hero from the dropdown or the grid.");
      return false;
    }
  }
  return true;
}

function updateStepTabs() {
  $$("[data-step-tab]").forEach(tab => {
    const step      = Number(tab.dataset.stepTab);
    const active    = step === orderStep;
    const available = step <= orderStep && (step !== 3 || Boolean(selectedHero || (heroMode === "specific" && $("#specificHeroDrop")?.value)));
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
  if (safeStep === 3 && !stepIsValid(2)) return;
  orderStep = safeStep;
  updateStepTabs();
  updateStepHeroPreview(selectedHero);
  updateFinalReview();
  const hint = $("#heroFlowHint");
  if (hint) hint.hidden = !(orderFlow && orderStep === 2);
  const nextDetails = $("#nextToDetails");
  if (nextDetails) nextDetails.disabled = !(selectedHero || (heroMode === "specific" && $("#specificHeroDrop")?.value));
}

function beginHeroStep() {
  if (!stepIsValid(1)) return;
  orderFlow = true;
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
        if (!selectedHero && !(heroMode === "specific" && $("#specificHeroDrop")?.value)) {
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
    if (!selectedHero && !(heroMode === "specific" && $("#specificHeroDrop")?.value)) {
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
    if (selectedHero) setOrderStep(3);
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
}

/* ===================== ROLE FILTERS ===================== */
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

function createOrderMessage() {
  if (orderStep !== 3) { showToast("Complete Rank → Hero → Details first."); return; }

  const effectiveHero = heroMode === "specific" ? getEffectiveHero() : selectedHero;
  if (!effectiveHero && heroMode !== "general") {
    showToast("Choose a hero before sending the order.");
    return;
  }

  const customerName = $("#customerName")?.value.trim() || "";
  const mlId         = $("#mlId")?.value.trim() || "";
  const serverId     = $("#server")?.value.trim() || "";

  if (!customerName) { $("#customerName")?.focus(); showToast("Enter your in-game name."); return; }
  if (!mlId)         { $("#mlId")?.focus(); showToast("Enter your MLBB Account ID."); return; }
  if (!serverId)     { $("#server")?.focus(); showToast("Enter your Server ID."); return; }

  const curName  = $("#currentRank")?.value || "";
  const tgtName  = $("#targetRank")?.value  || "";
  const role     = $("#preferredRole")?.value || "No preference";
  const schedule = $("#schedule")?.value || "Any available time";
  const { starsNeeded, valid, total, warning } = calcPrice();

  const estimate   = valid && total > 0 ? formatPeso(total) : "To confirm";
  const heroLabel  = effectiveHero
    ? `${effectiveHero.name} (${effectiveHero.role}${effectiveHero.difficulty === "high" ? " · High difficulty" : ""})`
    : "General — any hero";
  const mmrLabel   = mmrServer === "global" ? "Global" : "Philippines";
  const starsLabel = valid ? String(starsNeeded) : "To confirm";

  const lines = [
    "Hello EJ Pilot Service! I want to place an order.",
    "",
    `Name: ${customerName}`,
    `Current Rank: ${curName}`,
    `Target Rank: ${tgtName}`,
    `Estimated Stars/Points Needed: ${starsLabel}`,
    `MMR Server: ${mmrLabel}`,
    `Preferred Hero: ${heroLabel}`,
    `Preferred Role: ${role}`,
    `Preferred Schedule: ${schedule}`,
    `MLBB Account ID: ${mlId}`,
    `Server ID: ${serverId}`,
    `Website Estimate: ${estimate}`,
    "",
    "Please confirm the final price and available schedule."
  ];

  const message = lines.join("\n");
  const facebookLink = String(SITE.facebookLink || "").trim();

  if (!/^https:\/\/(www\.)?facebook\.com\//i.test(facebookLink)) {
    showToast("Facebook link is not configured correctly.");
    return;
  }

  const button = $("#messageOrder");
  if (button) { button.disabled = true; button.classList.add("is-loading"); }

  copyOrderText(message).then(copied => {
    showToast(copied
      ? "Order copied. Opening Facebook…"
      : "Facebook is opening. Copy your order message manually if needed.");
    setTimeout(() => window.location.assign(facebookLink), 500);
  }).finally(() => {
    setTimeout(() => {
      if (button) { button.disabled = false; button.classList.remove("is-loading"); }
    }, 1000);
  });
}

/* ===================== GCASH ===================== */
function copyGcash() {
  if (SITE.gcashNumber.includes("X")) {
    showToast("Replace the placeholder GCash number in script.js first.");
    return;
  }
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(SITE.gcashNumber)
      .then(() => showToast("GCash number copied to clipboard."))
      .catch(() => showToast(SITE.gcashNumber));
  } else {
    showToast(SITE.gcashNumber);
  }
}

/* ===================== MODALS ===================== */
function setupModals() {
  const showQr = $("#showQr");
  if (showQr) showQr.addEventListener("click", () => {
    const m = $("#qrModal");
    if (m) m.classList.remove("hidden");
  });

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

/* ===================== GCASH DISPLAY ===================== */
function updateGcashDisplay() {
  const el = $("#gcashNumber");
  if (!el) return;
  if (!SITE.gcashNumber.includes("X")) el.textContent = SITE.gcashNumber;
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

/* ===================== INIT ===================== */
function init() {
  injectDiffBadgeStyle();
  populateRanks();
  populateHeroDrop();
  renderPricing();
  renderStage();
  renderHeroes();
  setupMMRToggle();
  setupHeroModeToggle();
  setupFilters();
  setupModals();
  setupMobileNav();
  setupReveal();
  setupOrderFlow();
  updateStepHeroPreview(selectedHero);
  updateAll();
  updateGcashDisplay();

  // Messenger button
  $("#messageOrder")?.addEventListener("click", createOrderMessage);

  // GCash copy
  $("#copyGcash")?.addEventListener("click", copyGcash);

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
