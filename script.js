/* =======================================================
   EJ Pilot Service — script.js
   Edit only SITE and PRICING to configure the site.
   Hero data is embedded — no network fetch required.
   ======================================================= */

/* ===================== CONFIGURATION ===================== */
const SITE = {
  // Your exact Facebook share/profile link. The site uses this as the
  // reliable mobile fallback because your account does not have a custom
  // Messenger username yet.
  facebookLink: "https://www.facebook.com/share/19aeGJULcA/",
  gcashNumber: "09757209196"
};

const PRICING = [
  { rank: "Epic",             note: "Per star",    rate: 0 },
  { rank: "Legend",           note: "Per star",    rate: 0 },
  { rank: "Mythic",           note: "Per star",    rate: 0 },
  { rank: "Mythical Honor",   note: "25★ tier",    rate: 0 },
  { rank: "Mythical Glory",   note: "50★ tier",    rate: 0 },
  { rank: "Mythical Immortal",note: "100★ tier",   rate: 0, featured: true }
];

const RANKS = [
  "Warrior","Elite","Master","Grandmaster",
  "Epic","Legend","Mythic",
  "Mythical Honor","Mythical Glory","Mythical Immortal"
];

/* ===================== HERO DATA (local — 133 heroes) ===================== */
const HEROES = [
{name:"Aamon",img:"images/heroes/aamon.png",role:"Assassin",roles:["Assassin"]},
{name:"Akai",img:"images/heroes/akai.png",role:"Tank",roles:["Tank"]},
{name:"Aldous",img:"images/heroes/aldous.png",role:"Fighter",roles:["Fighter"]},
{name:"Alice",img:"images/heroes/alice.png",role:"Tank",roles:["Tank","Mage"]},
{name:"Alpha",img:"images/heroes/alpha.png",role:"Fighter",roles:["Fighter"]},
{name:"Alucard",img:"images/heroes/alucard.png",role:"Fighter",roles:["Fighter","Assassin"]},
{name:"Angela",img:"images/heroes/angela.png",role:"Support",roles:["Support"]},
{name:"Argus",img:"images/heroes/argus.png",role:"Fighter",roles:["Fighter"]},
{name:"Arlott",img:"images/heroes/arlott.png",role:"Fighter",roles:["Fighter","Assassin"]},
{name:"Atlas",img:"images/heroes/atlas.png",role:"Tank",roles:["Tank"]},
{name:"Aulus",img:"images/heroes/aulus.png",role:"Fighter",roles:["Fighter"]},
{name:"Aurora",img:"images/heroes/aurora.png",role:"Mage",roles:["Mage"]},
{name:"Badang",img:"images/heroes/badang.png",role:"Fighter",roles:["Fighter"]},
{name:"Balmond",img:"images/heroes/balmond.png",role:"Fighter",roles:["Fighter"]},
{name:"Bane",img:"images/heroes/bane.png",role:"Fighter",roles:["Fighter","Mage"]},
{name:"Barats",img:"images/heroes/barats.png",role:"Tank",roles:["Tank","Fighter"]},
{name:"Baxia",img:"images/heroes/baxia.png",role:"Tank",roles:["Tank"]},
{name:"Beatrix",img:"images/heroes/beatrix.png",role:"Marksman",roles:["Marksman"]},
{name:"Belerick",img:"images/heroes/belerick.png",role:"Tank",roles:["Tank"]},
{name:"Benedetta",img:"images/heroes/benedetta.png",role:"Fighter",roles:["Fighter","Assassin"]},
{name:"Brody",img:"images/heroes/brody.png",role:"Marksman",roles:["Marksman"]},
{name:"Bruno",img:"images/heroes/bruno.png",role:"Marksman",roles:["Marksman"]},
{name:"Carmilla",img:"images/heroes/carmilla.png",role:"Tank",roles:["Tank","Support"]},
{name:"Cecilion",img:"images/heroes/cecilion.png",role:"Mage",roles:["Mage"]},
{name:"Chang'e",img:"images/heroes/chang27e.png",role:"Mage",roles:["Mage"]},
{name:"Chip",img:"images/heroes/chip.png",role:"Tank",roles:["Tank","Support"]},
{name:"Chou",img:"images/heroes/chou.png",role:"Fighter",roles:["Fighter"]},
{name:"Cici",img:"images/heroes/cici.png",role:"Fighter",roles:["Fighter"]},
{name:"Claude",img:"images/heroes/claude.png",role:"Marksman",roles:["Marksman"]},
{name:"Clint",img:"images/heroes/clint.png",role:"Marksman",roles:["Marksman"]},
{name:"Cyclops",img:"images/heroes/cyclops.png",role:"Mage",roles:["Mage"]},
{name:"Diggie",img:"images/heroes/diggie.png",role:"Support",roles:["Support"]},
{name:"Dyrroth",img:"images/heroes/dyrroth.png",role:"Fighter",roles:["Fighter"]},
{name:"Edith",img:"images/heroes/edith.png",role:"Tank",roles:["Tank","Marksman"]},
{name:"Esmeralda",img:"images/heroes/esmeralda.png",role:"Tank",roles:["Tank","Mage"]},
{name:"Estes",img:"images/heroes/estes.png",role:"Support",roles:["Support"]},
{name:"Eudora",img:"images/heroes/eudora.png",role:"Mage",roles:["Mage"]},
{name:"Fanny",img:"images/heroes/fanny.png",role:"Assassin",roles:["Assassin"]},
{name:"Faramis",img:"images/heroes/faramis.png",role:"Mage",roles:["Mage","Support"]},
{name:"Floryn",img:"images/heroes/floryn.png",role:"Support",roles:["Support"]},
{name:"Franco",img:"images/heroes/franco.png",role:"Tank",roles:["Tank"]},
{name:"Fredrinn",img:"images/heroes/fredrinn.png",role:"Tank",roles:["Tank","Fighter"]},
{name:"Freya",img:"images/heroes/freya.png",role:"Fighter",roles:["Fighter"]},
{name:"Gatotkaca",img:"images/heroes/gatotkaca.png",role:"Tank",roles:["Tank","Fighter"]},
{name:"Gloo",img:"images/heroes/gloo.png",role:"Tank",roles:["Tank"]},
{name:"Gord",img:"images/heroes/gord.png",role:"Mage",roles:["Mage"]},
{name:"Granger",img:"images/heroes/granger.png",role:"Marksman",roles:["Marksman"]},
{name:"Grock",img:"images/heroes/grock.png",role:"Tank",roles:["Tank","Fighter"]},
{name:"Guinevere",img:"images/heroes/guinevere.png",role:"Fighter",roles:["Fighter"]},
{name:"Gusion",img:"images/heroes/gusion.png",role:"Assassin",roles:["Assassin"]},
{name:"Hanabi",img:"images/heroes/hanabi.png",role:"Marksman",roles:["Marksman"]},
{name:"Hanzo",img:"images/heroes/hanzo.png",role:"Assassin",roles:["Assassin"]},
{name:"Harith",img:"images/heroes/harith.png",role:"Mage",roles:["Mage"]},
{name:"Harley",img:"images/heroes/harley.png",role:"Assassin",roles:["Assassin","Mage"]},
{name:"Hayabusa",img:"images/heroes/hayabusa.png",role:"Assassin",roles:["Assassin"]},
{name:"Helcurt",img:"images/heroes/helcurt.png",role:"Assassin",roles:["Assassin"]},
{name:"Hilda",img:"images/heroes/hilda.png",role:"Tank",roles:["Tank","Fighter"]},
{name:"Hirara",img:"images/heroes/hirara.png",role:"Assassin",roles:["Assassin"]},
{name:"Hylos",img:"images/heroes/hylos.png",role:"Tank",roles:["Tank"]},
{name:"Irithel",img:"images/heroes/irithel.png",role:"Marksman",roles:["Marksman"]},
{name:"Ixia",img:"images/heroes/ixia.png",role:"Marksman",roles:["Marksman"]},
{name:"Jawhead",img:"images/heroes/jawhead.png",role:"Fighter",roles:["Fighter"]},
{name:"Johnson",img:"images/heroes/johnson.png",role:"Tank",roles:["Tank","Support"]},
{name:"Joy",img:"images/heroes/joy.png",role:"Assassin",roles:["Assassin"]},
{name:"Julian",img:"images/heroes/julian.png",role:"Fighter",roles:["Fighter","Assassin"]},
{name:"Kadita",img:"images/heroes/kadita.png",role:"Assassin",roles:["Assassin","Mage"]},
{name:"Kagura",img:"images/heroes/kagura.png",role:"Mage",roles:["Mage"]},
{name:"Kaja",img:"images/heroes/kaja.png",role:"Fighter",roles:["Fighter","Support"]},
{name:"Kalea",img:"images/heroes/kalea.png",role:"Fighter",roles:["Fighter","Support"]},
{name:"Karina",img:"images/heroes/karina.png",role:"Assassin",roles:["Assassin"]},
{name:"Karrie",img:"images/heroes/karrie.png",role:"Marksman",roles:["Marksman"]},
{name:"Khaleed",img:"images/heroes/khaleed.png",role:"Fighter",roles:["Fighter"]},
{name:"Khufra",img:"images/heroes/khufra.png",role:"Tank",roles:["Tank"]},
{name:"Kimmy",img:"images/heroes/kimmy.png",role:"Mage",roles:["Mage","Marksman"]},
{name:"Lancelot",img:"images/heroes/lancelot.png",role:"Assassin",roles:["Assassin"]},
{name:"Lapu-Lapu",img:"images/heroes/lapu-lapu.png",role:"Fighter",roles:["Fighter"]},
{name:"Layla",img:"images/heroes/layla.png",role:"Marksman",roles:["Marksman"]},
{name:"Leomord",img:"images/heroes/leomord.png",role:"Fighter",roles:["Fighter"]},
{name:"Lesley",img:"images/heroes/lesley.png",role:"Assassin",roles:["Assassin","Marksman"]},
{name:"Ling",img:"images/heroes/ling.png",role:"Assassin",roles:["Assassin"]},
{name:"Lolita",img:"images/heroes/lolita.png",role:"Tank",roles:["Tank","Support"]},
{name:"Lukas",img:"images/heroes/lukas.png",role:"Fighter",roles:["Fighter"]},
{name:"Lunox",img:"images/heroes/lunox.png",role:"Mage",roles:["Mage"]},
{name:"Luo Yi",img:"images/heroes/luo_yi.png",role:"Mage",roles:["Mage"]},
{name:"Lylia",img:"images/heroes/lylia.png",role:"Mage",roles:["Mage"]},
{name:"Marcel",img:"images/heroes/marcel.png",role:"Support",roles:["Support"]},
{name:"Martis",img:"images/heroes/martis.png",role:"Fighter",roles:["Fighter"]},
{name:"Masha",img:"images/heroes/masha.png",role:"Tank",roles:["Tank","Fighter"]},
{name:"Mathilda",img:"images/heroes/mathilda.png",role:"Assassin",roles:["Assassin","Support"]},
{name:"Melissa",img:"images/heroes/melissa.png",role:"Marksman",roles:["Marksman"]},
{name:"Minotaur",img:"images/heroes/minotaur.png",role:"Tank",roles:["Tank","Support"]},
{name:"Minsitthar",img:"images/heroes/minsitthar.png",role:"Fighter",roles:["Fighter"]},
{name:"Miya",img:"images/heroes/miya.png",role:"Marksman",roles:["Marksman"]},
{name:"Moskov",img:"images/heroes/moskov.png",role:"Marksman",roles:["Marksman"]},
{name:"Nana",img:"images/heroes/nana.png",role:"Mage",roles:["Mage"]},
{name:"Natalia",img:"images/heroes/natalia.png",role:"Assassin",roles:["Assassin"]},
{name:"Natan",img:"images/heroes/natan.png",role:"Marksman",roles:["Marksman"]},
{name:"Nolan",img:"images/heroes/nolan.png",role:"Assassin",roles:["Assassin"]},
{name:"Novaria",img:"images/heroes/novaria.png",role:"Mage",roles:["Mage"]},
{name:"Obsidia",img:"images/heroes/obsidia.png",role:"Marksman",roles:["Marksman"]},
{name:"Odette",img:"images/heroes/odette.png",role:"Mage",roles:["Mage"]},
{name:"Paquito",img:"images/heroes/paquito.png",role:"Fighter",roles:["Fighter","Assassin"]},
{name:"Pharsa",img:"images/heroes/pharsa.png",role:"Mage",roles:["Mage"]},
{name:"Phoveus",img:"images/heroes/phoveus.png",role:"Fighter",roles:["Fighter"]},
{name:"Popol and Kupa",img:"images/heroes/popol_and_kupa.png",role:"Marksman",roles:["Marksman"]},
{name:"Rafaela",img:"images/heroes/rafaela.png",role:"Support",roles:["Support"]},
{name:"Roger",img:"images/heroes/roger.png",role:"Fighter",roles:["Fighter","Marksman"]},
{name:"Ruby",img:"images/heroes/ruby.png",role:"Fighter",roles:["Fighter"]},
{name:"Saber",img:"images/heroes/saber.png",role:"Assassin",roles:["Assassin"]},
{name:"Selena",img:"images/heroes/selena.png",role:"Assassin",roles:["Assassin","Mage"]},
{name:"Silvanna",img:"images/heroes/silvanna.png",role:"Fighter",roles:["Fighter"]},
{name:"Sora",img:"images/heroes/sora.png",role:"Fighter",roles:["Fighter","Assassin"]},
{name:"Sun",img:"images/heroes/sun.png",role:"Fighter",roles:["Fighter"]},
{name:"Suyou",img:"images/heroes/suyou.png",role:"Fighter",roles:["Fighter","Assassin"]},
{name:"Terizla",img:"images/heroes/terizla.png",role:"Tank",roles:["Tank","Fighter"]},
{name:"Thamuz",img:"images/heroes/thamuz.png",role:"Fighter",roles:["Fighter"]},
{name:"Tigreal",img:"images/heroes/tigreal.png",role:"Tank",roles:["Tank"]},
{name:"Uranus",img:"images/heroes/uranus.png",role:"Tank",roles:["Tank"]},
{name:"Vale",img:"images/heroes/vale.png",role:"Mage",roles:["Mage"]},
{name:"Valentina",img:"images/heroes/valentina.png",role:"Mage",roles:["Mage"]},
{name:"Valir",img:"images/heroes/valir.png",role:"Mage",roles:["Mage"]},
{name:"Vexana",img:"images/heroes/vexana.png",role:"Mage",roles:["Mage"]},
{name:"Wanwan",img:"images/heroes/wanwan.png",role:"Marksman",roles:["Marksman"]},
{name:"X.Borg",img:"images/heroes/xborg.png",role:"Fighter",roles:["Fighter"]},
{name:"Xavier",img:"images/heroes/xavier.png",role:"Mage",roles:["Mage"]},
{name:"Yi Sun-shin",img:"images/heroes/yi_sun-shin.png",role:"Assassin",roles:["Assassin","Marksman"]},
{name:"Yin",img:"images/heroes/yin.png",role:"Fighter",roles:["Fighter","Assassin"]},
{name:"Yu Zhong",img:"images/heroes/yu_zhong.png",role:"Fighter",roles:["Fighter"]},
{name:"Yve",img:"images/heroes/yve.png",role:"Mage",roles:["Mage"]},
{name:"Zetian",img:"images/heroes/zetian.png",role:"Mage",roles:["Mage"]},
{name:"Zhask",img:"images/heroes/zhask.png",role:"Mage",roles:["Mage"]},
{name:"Zhuxin",img:"images/heroes/zhuxin.png",role:"Mage",roles:["Mage"]},
{name:"Zilong",img:"images/heroes/zilong.png",role:"Fighter",roles:["Fighter","Assassin"]}
];

/* ===================== STATE ===================== */
let selectedHero = null; // hero object or null
let activeRole   = "All";

/* ===================== UTILITIES ===================== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

function formatPeso(n) {
  return "₱" + Number(n).toLocaleString("en-PH");
}

function showToast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove("show"), 3200);
}

function heroByName(name) {
  return HEROES.find(h => h.name === name) || null;
}

function roleClass(role) {
  const map = {
    Tank:"tank", Fighter:"fighter", Assassin:"assassin",
    Mage:"mage", Marksman:"marksman", Support:"support"
  };
  return map[role] || "fighter";
}

/* ===================== RANK SELECTS ===================== */
function populateRanks() {
  const opts = RANKS.map(r => `<option value="${r}">${r}</option>`).join("");
  $("#currentRank").innerHTML = opts;
  $("#targetRank").innerHTML  = opts;
  $("#currentRank").value = "Epic";
  $("#targetRank").value  = "Legend";
}

/* ===================== PRICING CARDS ===================== */
function renderPricing() {
  const grid = $("#pricingGrid");
  if (!grid) return;
  grid.innerHTML = PRICING.map(p => {
    const rateStr = p.rate > 0 ? formatPeso(p.rate) : "₱XX";
    const rateNote = p.rate > 0 ? "per star" : "set your rate";
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

/* ===================== ORDER SUMMARY ===================== */
function getRate(rank) {
  return PRICING.find(p => p.rank === rank)?.rate || 0;
}

function updateSummary() {
  const current = $("#currentRank").value;
  const target  = $("#targetRank").value;
  const stars   = Math.max(1, parseInt($("#stars").value, 10) || 1);
  const rate    = getRate(target);

  $("#summaryCurrent").textContent = current;
  $("#summaryTarget").textContent  = target;
  $("#summaryStars").textContent   = stars;

  if (rate > 0) {
    $("#estimate").textContent    = formatPeso(rate * stars);
    $("#estimateNote").textContent = `${formatPeso(rate)} × ${stars} star(s). Confirm final quote.`;
  } else {
    $("#estimate").textContent    = "₱—";
    $("#estimateNote").textContent = `Set the ${target} rate in script.js.`;
  }
}

/* ===================== HERO STAGE (featured picks) ===================== */
function renderStage() {
  const picks = [
    heroByName("Kalea"),
    heroByName("Sora"),
    heroByName("Obsidia")
  ].filter(Boolean);

  // If any pick is missing, fall back to last 3 heroes in list
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
  const query = ($("#heroSearch")?.value || "").toLowerCase().trim();
  const grid  = $("#heroGrid");
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
    const safeHeroName = h.name.replace(/&/g,"&amp;").replace(/"/g,"&quot;");
    return `
      <button
        class="hero-card${sel ? " selected" : ""}"
        type="button"
        data-hero="${safeHeroName}"
        aria-pressed="${sel}"
        aria-label="${safeHeroName} — ${h.role}">
        <img
          src="${h.img}"
          alt="${safeHeroName}"
          loading="lazy"
          width="120"
          height="160"
          onerror="this.style.display='none'">
        <div class="hero-card-overlay"></div>
        <div class="hero-card-info">
          <span class="hero-card-name">${safeHeroName}</span>
          <span class="hero-card-role role-text-${rc}">${h.role}</span>
        </div>
        <div class="hero-check" aria-hidden="true">✓</div>
      </button>`;
  }).join("");

  // Bind click via event delegation on the grid
  grid.addEventListener("click", handleHeroGridClick, { once: true });
  // Re-bind by replacing with a new grid approach — use delegation on grid itself
}

// Event delegation for hero grid (attached once on the grid, rebinds after each render)
function handleHeroGridClick(e) {
  const card = e.target.closest(".hero-card");
  if (card) selectHero(card.dataset.hero);
}

/* ===================== HERO SELECTION ===================== */
function selectHero(name) {
  const h = heroByName(name);
  if (!h) return;

  // Toggle off if already selected
  if (selectedHero && selectedHero.name === name) {
    selectedHero = null;
    updateChosenHero(null);
    renderHeroes();
    return;
  }

  selectedHero = h;
  updateChosenHero(h);
  renderHeroes();

  // Scroll order section into view
  const orderEl = document.getElementById("order");
  if (orderEl) {
    orderEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function updateChosenHero(h) {
  const container = $("#chosenHero");
  if (!container) return;

  if (!h) {
    container.innerHTML = `
      <div class="chosen-thumb" aria-hidden="true">
        <span class="no-hero-icon">?</span>
      </div>
      <div class="chosen-info">
        <span>Hero preference</span>
        <strong>No hero selected</strong>
      </div>`;
    return;
  }

  const rc = roleClass(h.role);
  container.innerHTML = `
    <div class="chosen-thumb" aria-hidden="true">
      <img src="${h.img}" alt="${h.name}" width="52" height="52"
        onerror="this.style.display='none'">
    </div>
    <div class="chosen-info">
      <span class="role-text-${rc}">${h.role}</span>
      <strong>${h.name}</strong>
    </div>`;
}

/* ===================== ROLE FILTERS ===================== */
function setupFilters() {
  const searchInput = $("#heroSearch");
  if (searchInput) {
    searchInput.addEventListener("input", renderHeroes);
  }

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

/* ===================== COPY + FACEBOOK ORDER ===================== */
function copyOrderText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => fallbackCopyText(text)
    );
  }
  return Promise.resolve(fallbackCopyText(text));
}

function fallbackCopyText(text) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  area.style.pointerEvents = "none";
  document.body.appendChild(area);
  area.select();
  area.setSelectionRange(0, area.value.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    console.error("Clipboard fallback failed:", error);
  }

  area.remove();
  return copied;
}

function createOrderMessage() {
  const target = $("#targetRank")?.value || "";
  const stars  = Math.max(1, parseInt($("#stars")?.value, 10) || 1);
  const rate   = getRate(target);

  const customerName = ($("#customerName")?.value || "").trim() || "Not provided";
  const mlId         = ($("#mlId")?.value || "").trim() || "Not provided";
  const serverId     = ($("#server")?.value || "").trim() || "Not provided";
  const role         = $("#preferredRole")?.value || "No preference";
  const schedule     = $("#schedule")?.value || "Any available time";
  const heroName     = selectedHero ? selectedHero.name : "No preference";
  const estimate     = rate > 0 ? formatPeso(rate * stars) : "To confirm";

  const lines = [
    "Hello EJ Pilot Service! I want to place an order.",
    "",
    `Name: ${customerName}`,
    `Current Rank: ${$("#currentRank")?.value || ""}`,
    `Target Rank: ${target}`,
    `Target Stars/Points: ${stars}`,
    `Preferred Hero: ${heroName}`,
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

  if (!facebookLink || !/^https:\/\/(www\.)?facebook\.com\//i.test(facebookLink)) {
    showToast("Facebook link is not configured correctly.");
    return;
  }

  const button = $("#messageOrder");
  if (button) {
    button.disabled = true;
    button.classList.add("is-loading");
  }

  copyOrderText(message).then(copied => {
    if (copied) {
      showToast("Order copied. Opening Facebook…");
    } else {
      showToast("Facebook will open. Copy the order text from the page if needed.");
    }

    // Give the toast a moment to appear before navigation.
    setTimeout(() => {
      window.location.assign(facebookLink);
    }, 450);
  }).finally(() => {
    setTimeout(() => {
      if (button) {
        button.disabled = false;
        button.classList.remove("is-loading");
      }
    }, 900);
  });
}

/* ===================== GCASH COPY ===================== */
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
  // Show QR modal
  const showQr = $("#showQr");
  if (showQr) {
    showQr.addEventListener("click", () => {
      const m = $("#qrModal");
      if (m) m.classList.remove("hidden");
    });
  }

  // Close buttons
  $$("[data-close]").forEach(btn => {
    btn.addEventListener("click", closeAllModals);
  });

  // Backdrop click closes
  $$(".modal").forEach(modal => {
    modal.addEventListener("click", e => {
      if (e.target === modal) closeAllModals();
    });
  });

  // Proof cards
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

/* ===================== KEYBOARD (ESC closes modals) ===================== */
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

  // Close menu when a link is tapped
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
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07, rootMargin: "0px 0px -40px 0px" });

  items.forEach(el => io.observe(el));
}

/* ===================== GCASH NUMBER DISPLAY ===================== */
function updateGcashDisplay() {
  const el = $("#gcashNumber");
  if (!el) return;
  if (!SITE.gcashNumber.includes("X")) {
    el.textContent = SITE.gcashNumber;
  }
}

/* ===================== INIT ===================== */
function init() {
  populateRanks();
  renderPricing();
  updateSummary();
  renderStage();
  renderHeroes();
  setupFilters();
  setupModals();
  setupMobileNav();
  setupReveal();
  updateGcashDisplay();

  // Order summary live updates
  ["currentRank", "targetRank", "stars"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input",  updateSummary);
      el.addEventListener("change", updateSummary);
    }
  });

  // Messenger button
  const msgBtn = $("#messageOrder");
  if (msgBtn) msgBtn.addEventListener("click", createOrderMessage);

  // GCash copy
  const copyBtn = $("#copyGcash");
  if (copyBtn) copyBtn.addEventListener("click", copyGcash);

  // Hero grid event delegation (persistent — not re-attached on render)
  const grid = $("#heroGrid");
  if (grid) {
    grid.addEventListener("click", e => {
      const card = e.target.closest(".hero-card");
      if (card) selectHero(card.dataset.hero);
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
