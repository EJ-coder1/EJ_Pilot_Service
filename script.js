/* EJ Pilot Service — interactions and order builder */
const SITE = {
  messengerUsername: "YOUR_FACEBOOK_USERNAME",
  gcashNumber: "09XXXXXXXXX",
};

const HEROES = ["Aamon", "Akai", "Aldous", "Alice", "Alpha", "Alucard", "Angela", "Argus", "Arlott", "Atlas", "Aulus", "Aurora", "Badang", "Balmond", "Bane", "Barats", "Baxia", "Beatrix", "Belerick", "Benedetta", "Brody", "Bruno", "Carmilla", "Cecilion", "Chang'e", "Chip", "Chou", "Cici", "Claude", "Clint", "Cyclops", "Diggie", "Dyrroth", "Edith", "Esmeralda", "Estes", "Eudora", "Fanny", "Faramis", "Floryn", "Franco", "Fredrinn", "Freya", "Gatotkaca", "Gloo", "Gord", "Granger", "Grock", "Guinevere", "Gusion", "Hanabi", "Hanzo", "Harith", "Harley", "Hayabusa", "Helcurt", "Hilda", "Hirara", "Hylos", "Irithel", "Ixia", "Jawhead", "Johnson", "Joy", "Julian", "Kadita", "Kagura", "Kaja", "Kalea", "Karina", "Karrie", "Khaleed", "Khufra", "Kimmy", "Lancelot", "Lapu-Lapu", "Layla", "Leomord", "Lesley", "Ling", "Lolita", "Lukas", "Lunox", "Luo Yi", "Lylia", "Marcel", "Martis", "Masha", "Mathilda", "Melissa", "Minotaur", "Minsitthar", "Miya", "Moskov", "Nana", "Natalia", "Natan", "Nolan", "Novaria", "Obsidia", "Odette", "Paquito", "Pharsa", "Phoveus", "Popol and Kupa", "Rafaela", "Roger", "Ruby", "Saber", "Selena", "Silvanna", "Sora", "Sun", "Suyou", "Terizla", "Thamuz", "Tigreal", "Uranus", "Vale", "Valentina", "Valir", "Vexana", "Wanwan", "X.Borg", "Xavier", "Yi Sun-shin", "Yin", "Yu Zhong", "Yve", "Zetian", "Zhask", "Zhuxin", "Zilong"];
const ROLES = {"Aamon": "Assassin", "Akai": "Tank", "Aldous": "Fighter", "Alice": "Mage", "Alpha": "Fighter", "Alucard": "Fighter", "Angela": "Support", "Argus": "Fighter", "Arlott": "Fighter", "Atlas": "Tank", "Aulus": "Fighter", "Aurora": "Mage", "Badang": "Fighter", "Balmond": "Fighter", "Bane": "Fighter", "Barats": "Tank", "Baxia": "Tank", "Beatrix": "Marksman", "Belerick": "Tank", "Benedetta": "Assassin", "Brody": "Marksman", "Bruno": "Marksman", "Carmilla": "Support", "Cecilion": "Mage", "Chang'e": "Mage", "Chip": "Support", "Chou": "Fighter", "Cici": "Fighter", "Claude": "Marksman", "Clint": "Marksman", "Cyclops": "Mage", "Diggie": "Support", "Dyrroth": "Fighter", "Edith": "Tank", "Esmeralda": "Mage", "Estes": "Support", "Eudora": "Mage", "Fanny": "Assassin", "Faramis": "Support", "Floryn": "Support", "Franco": "Tank", "Fredrinn": "Fighter", "Freya": "Fighter", "Gatotkaca": "Tank", "Gloo": "Tank", "Gord": "Mage", "Granger": "Marksman", "Grock": "Tank", "Guinevere": "Fighter", "Gusion": "Assassin", "Hanabi": "Marksman", "Hanzo": "Assassin", "Harith": "Mage", "Harley": "Mage", "Hayabusa": "Assassin", "Helcurt": "Assassin", "Hilda": "Fighter", "Hirara": "Assassin", "Hylos": "Tank", "Irithel": "Marksman", "Ixia": "Marksman", "Jawhead": "Fighter", "Johnson": "Tank", "Joy": "Assassin", "Julian": "Fighter", "Kadita": "Mage", "Kagura": "Mage", "Kaja": "Support", "Kalea": "Support", "Karina": "Assassin", "Karrie": "Marksman", "Khaleed": "Fighter", "Khufra": "Tank", "Kimmy": "Marksman", "Lancelot": "Assassin", "Lapu-Lapu": "Fighter", "Layla": "Marksman", "Leomord": "Fighter", "Lesley": "Marksman", "Ling": "Assassin", "Lolita": "Tank", "Lukas": "Fighter", "Lunox": "Mage", "Luo Yi": "Mage", "Lylia": "Mage", "Marcel": "Support", "Martis": "Fighter", "Masha": "Fighter", "Mathilda": "Support", "Melissa": "Marksman", "Minotaur": "Tank", "Minsitthar": "Fighter", "Miya": "Marksman", "Moskov": "Marksman", "Nana": "Mage", "Natalia": "Assassin", "Natan": "Marksman", "Nolan": "Assassin", "Novaria": "Mage", "Obsidia": "Marksman", "Odette": "Mage", "Paquito": "Fighter", "Pharsa": "Mage", "Phoveus": "Fighter", "Popol and Kupa": "Marksman", "Rafaela": "Support", "Roger": "Fighter", "Ruby": "Fighter", "Saber": "Assassin", "Selena": "Assassin", "Silvanna": "Fighter", "Sora": "Fighter", "Sun": "Fighter", "Suyou": "Assassin", "Terizla": "Fighter", "Thamuz": "Fighter", "Tigreal": "Tank", "Uranus": "Tank", "Vale": "Mage", "Valentina": "Mage", "Valir": "Mage", "Vexana": "Mage", "Wanwan": "Marksman", "X.Borg": "Fighter", "Xavier": "Mage", "Yi Sun-shin": "Assassin", "Yin": "Fighter", "Yu Zhong": "Fighter", "Yve": "Mage", "Zetian": "Mage", "Zhask": "Mage", "Zhuxin": "Mage", "Zilong": "Fighter"};

/* Edit only the "rate" values below. The pricing table and calculator stay in sync. */
const PRICING = [
  { rank: "Epic", note: "Per star", rate: 0 },
  { rank: "Legend", note: "Per star", rate: 0 },
  { rank: "Mythic", note: "Per star", rate: 0 },
  { rank: "Mythical Honor", note: "25★ tier", rate: 0 },
  { rank: "Mythical Glory", note: "50★ tier", rate: 0 },
  { rank: "Mythical Immortal", note: "100★ tier", rate: 0, featured: true }
];

const RANKS = ["Warrior","Elite","Master","Grandmaster","Epic","Legend","Mythic","Mythical Honor","Mythical Glory","Mythical Immortal"];

let activeRole = "All";
let selectedHero = "";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function slug(name) {
  return name.toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function initials(name) {
  return name.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();
}

function formatPeso(value) {
  return "₱" + Number(value).toLocaleString("en-PH");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

function populateRanks() {
  const current = $("#currentRank");
  const target = $("#targetRank");
  current.innerHTML = RANKS.map(rank => `<option value="${rank}">${rank}</option>`).join("");
  target.innerHTML = RANKS.map(rank => `<option value="${rank}">${rank}</option>`).join("");
  current.value = "Epic";
  target.value = "Legend";
}

function getRate(rank) {
  return PRICING.find(item => item.rank === rank)?.rate ?? 0;
}

function updateSummary() {
  const current = $("#currentRank").value;
  const target = $("#targetRank").value;
  const stars = Math.max(1, Number($("#stars").value) || 1);
  const rate = getRate(target);

  $("#summaryCurrent").textContent = current;
  $("#summaryTarget").textContent = target;
  $("#summaryStars").textContent = stars;

  if (rate > 0) {
    const total = rate * stars;
    $("#estimate").textContent = formatPeso(total);
    $("#estimateNote").textContent = `${formatPeso(rate)} × ${stars} star(s). Confirm the final quote.`;
  } else {
    $("#estimate").textContent = "₱—";
    $("#estimateNote").textContent = "Set the selected rank's rate in script.js.";
  }
}

function renderPricing() {
  $("#pricingTable").innerHTML = PRICING.map(item => {
    const rateLabel = item.rate > 0 ? `${formatPeso(item.rate)} / star` : "₱XX / star";
    return `
      <div class="price-row ${item.featured ? "featured" : ""}">
        <div class="price-rank"><b>${item.rank}</b><small>${item.note}</small></div>
        <div class="price-value">${rateLabel}</div>
        <div class="price-note">${item.rate > 0 ? "Configured rate" : "Set your rate"}</div>
      </div>
    `;
  }).join("");
}

function renderHeroes() {
  const query = $("#heroSearch").value.toLowerCase().trim();
  const list = HEROES.filter(hero => {
    const matchesName = hero.toLowerCase().includes(query);
    const matchesRole = activeRole === "All" || ROLES[hero] === activeRole;
    return matchesName && matchesRole;
  });

  $("#heroCount").textContent = list.length;
  $("#heroGrid").innerHTML = list.length ? list.map(hero => {
    const role = ROLES[hero] || "Hero";
    const selected = selectedHero === hero;
    const image = `images/heroes/${slug(hero)}.webp`;

    return `
      <button class="hero-item ${selected ? "selected" : ""}" type="button" aria-pressed="${selected}" data-hero="${hero.replace(/"/g, "&quot;")}">
        <div class="hero-avatar" data-fallback="${initials(hero)}">
          <img src="${image}" alt="" loading="lazy" width="160" height="160"
               onerror="this.remove()"
               style="width:100%;height:100%;object-fit:cover;border-radius:11px;display:block">
        </div>
        <span class="hero-name">${hero}</span>
        <span class="hero-role">${role}</span>
        <span class="hero-check" aria-hidden="true">✓</span>
      </button>
    `;
  }).join("") : `<p class="muted">No heroes match your search.</p>`;

  $$(".hero-item").forEach(button => {
    button.addEventListener("click", () => selectHero(button.dataset.hero));
  });
}

function ensureFallbackInitials() {
  $$(".hero-avatar").forEach(box => {
    const img = box.querySelector("img");
    if (!img) {
      box.textContent = box.dataset.fallback || "?";
      return;
    }
    img.addEventListener("error", () => {
      box.innerHTML = `<span>${box.dataset.fallback || "?"}</span>`;
    }, { once: true });
  });
}

function selectHero(hero) {
  selectedHero = hero;
  const role = ROLES[hero] || "Hero";
  const image = `images/heroes/${slug(hero)}.webp`;

  $("#chosenHero").innerHTML = `
    <div class="hero-initial">
      <img src="${image}" alt="" width="44" height="44" style="width:100%;height:100%;object-fit:cover;border-radius:12px"
           onerror="this.remove();this.parentElement.textContent='${initials(hero)}'">
    </div>
    <div><span>Selected hero</span><strong>${hero} · ${role}</strong></div>
  `;

  renderHeroes();
  ensureFallbackInitials();
}

function openMessengerOrder() {
  if (SITE.messengerUsername.includes("YOUR_")) {
    showToast("Replace YOUR_FACEBOOK_USERNAME in script.js first.");
    return;
  }

  const data = {
    name: $("#customerName").value.trim() || "Not provided",
    current: $("#currentRank").value,
    target: $("#targetRank").value,
    stars: Math.max(1, Number($("#stars").value) || 1),
    role: $("#preferredRole").value,
    hero: selectedHero || "No preference",
    id: $("#mlId").value.trim() || "Not provided",
    server: $("#server").value.trim() || "Not provided"
  };

  const rate = getRate(data.target);
  const quote = rate > 0 ? formatPeso(rate * data.stars) : "To confirm";

  const message = [
    "Hello EJ Pilot Service! I want to place an order.",
    "",
    `Name: ${data.name}`,
    `Current Rank: ${data.current}`,
    `Target Rank: ${data.target}`,
    `Target Stars/Points: ${data.stars}`,
    `Preferred Hero: ${data.hero}`,
    `Preferred Role: ${data.role}`,
    `MLBB ID: ${data.id}`,
    `Server ID: ${data.server}`,
    `Website Estimate: ${quote}`,
    "",
    "Please send me the final price and available schedule."
  ].join("\n");

  const url = `https://m.me/${SITE.messengerUsername}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function copyGcash() {
  if (SITE.gcashNumber.includes("X")) {
    showToast("Replace the placeholder GCash number in script.js first.");
    return;
  }

  navigator.clipboard?.writeText(SITE.gcashNumber).then(
    () => showToast("GCash number copied."),
    () => showToast(`GCash: ${SITE.gcashNumber}`)
  );
}

function setupModals() {
  $$("[data-close]").forEach(button => button.addEventListener("click", closeOpenModals));

  $("#showQr").addEventListener("click", () => $("#qrModal").classList.remove("hidden"));

  $$(".proof-slot").forEach(slot => {
    slot.addEventListener("click", () => {
      const src = slot.dataset.proof;
      const img = $("#proofPreview");
      img.onerror = () => showToast("Add a real proof image at " + src);
      img.src = src;
      $("#proofModal").classList.remove("hidden");
    });
  });
}

function closeOpenModals() {
  $("#qrModal").classList.add("hidden");
  $("#proofModal").classList.add("hidden");
}

function setupReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -60px 0px", threshold: .08 });

  items.forEach(item => observer.observe(item));
}

function setupHeroFilters() {
  $("#heroSearch").addEventListener("input", renderHeroes);
  $$(".filter").forEach(button => {
    button.addEventListener("click", () => {
      $$(".filter").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      activeRole = button.dataset.role;
      renderHeroes();
      ensureFallbackInitials();
    });
  });
}

function setupOrderForm() {
  ["currentRank","targetRank","stars"].forEach(id => {
    $(`#${id}`).addEventListener("input", updateSummary);
    $(`#${id}`).addEventListener("change", updateSummary);
  });
  $("#messageOrder").addEventListener("click", openMessengerOrder);
  $("#copyGcash").addEventListener("click", copyGcash);
}

function init() {
  populateRanks();
  renderPricing();
  renderHeroes();
  ensureFallbackInitials();
  updateSummary();
  setupHeroFilters();
  setupOrderForm();
  setupModals();
  setupReveal();
}

document.addEventListener("DOMContentLoaded", init);
