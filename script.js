const HEROES = ["Aamon", "Akai", "Aldous", "Alice", "Alpha", "Alucard", "Angela", "Argus", "Arlott", "Atlas", "Aulus", "Aurora", "Badang", "Balmond", "Bane", "Barats", "Baxia", "Beatrix", "Belerick", "Benedetta", "Brody", "Bruno", "Carmilla", "Cecilion", "Chang'e", "Chip", "Chou", "Cici", "Claude", "Clint", "Cyclops", "Diggie", "Dyrroth", "Edith", "Esmeralda", "Estes", "Eudora", "Fanny", "Faramis", "Floryn", "Franco", "Fredrinn", "Freya", "Gatotkaca", "Gloo", "Gord", "Granger", "Grock", "Guinevere", "Gusion", "Hanabi", "Hanzo", "Harith", "Harley", "Hayabusa", "Helcurt", "Hilda", "Hirara", "Hylos", "Irithel", "Ixia", "Jawhead", "Johnson", "Joy", "Julian", "Kadita", "Kagura", "Kaja", "Kalea", "Karina", "Karrie", "Khaleed", "Khufra", "Kimmy", "Lancelot", "Lapu-Lapu", "Layla", "Leomord", "Lesley", "Ling", "Lolita", "Lukas", "Lunox", "Luo Yi", "Lylia", "Marcel", "Martis", "Masha", "Mathilda", "Melissa", "Minotaur", "Minsitthar", "Miya", "Moskov", "Nana", "Natalia", "Natan", "Nolan", "Novaria", "Obsidia", "Odette", "Paquito", "Pharsa", "Phoveus", "Popol and Kupa", "Rafaela", "Roger", "Ruby", "Saber", "Selena", "Silvanna", "Sora", "Sun", "Suyou", "Terizla", "Thamuz", "Tigreal", "Uranus", "Vale", "Valentina", "Valir", "Vexana", "Wanwan", "X.Borg", "Xavier", "Yi Sun-shin", "Yin", "Yu Zhong", "Yve", "Zetian", "Zhask", "Zhuxin", "Zilong"];
const ROLES = {"Aamon": "Assassin", "Akai": "Tank", "Aldous": "Fighter", "Alice": "Mage", "Alpha": "Fighter", "Alucard": "Fighter", "Angela": "Support", "Argus": "Fighter", "Arlott": "Fighter", "Atlas": "Tank", "Aulus": "Fighter", "Aurora": "Mage", "Badang": "Fighter", "Balmond": "Fighter", "Bane": "Fighter", "Barats": "Tank", "Baxia": "Tank", "Beatrix": "Marksman", "Belerick": "Tank", "Benedetta": "Assassin", "Brody": "Marksman", "Bruno": "Marksman", "Carmilla": "Support", "Cecilion": "Mage", "Chang'e": "Mage", "Chip": "Support", "Chou": "Fighter", "Cici": "Fighter", "Claude": "Marksman", "Clint": "Marksman", "Cyclops": "Mage", "Diggie": "Support", "Dyrroth": "Fighter", "Edith": "Tank", "Esmeralda": "Mage", "Estes": "Support", "Eudora": "Mage", "Fanny": "Assassin", "Faramis": "Support", "Floryn": "Support", "Franco": "Tank", "Fredrinn": "Fighter", "Freya": "Fighter", "Gatotkaca": "Tank", "Gloo": "Tank", "Gord": "Mage", "Granger": "Marksman", "Grock": "Tank", "Guinevere": "Fighter", "Gusion": "Assassin", "Hanabi": "Marksman", "Hanzo": "Assassin", "Harith": "Mage", "Harley": "Mage", "Hayabusa": "Assassin", "Helcurt": "Assassin", "Hilda": "Fighter", "Hirara": "Assassin", "Hylos": "Tank", "Irithel": "Marksman", "Ixia": "Marksman", "Jawhead": "Fighter", "Johnson": "Tank", "Joy": "Assassin", "Julian": "Fighter", "Kadita": "Mage", "Kagura": "Mage", "Kaja": "Support", "Kalea": "Support", "Karina": "Assassin", "Karrie": "Marksman", "Khaleed": "Fighter", "Khufra": "Tank", "Kimmy": "Marksman", "Lancelot": "Assassin", "Lapu-Lapu": "Fighter", "Layla": "Marksman", "Leomord": "Fighter", "Lesley": "Marksman", "Ling": "Assassin", "Lolita": "Tank", "Lukas": "Fighter", "Lunox": "Mage", "Luo Yi": "Mage", "Lylia": "Mage", "Marcel": "Support", "Martis": "Fighter", "Masha": "Fighter", "Mathilda": "Support", "Melissa": "Marksman", "Minotaur": "Tank", "Minsitthar": "Fighter", "Miya": "Marksman", "Moskov": "Marksman", "Nana": "Mage", "Natalia": "Assassin", "Natan": "Marksman", "Nolan": "Assassin", "Novaria": "Mage", "Obsidia": "Marksman", "Odette": "Mage", "Paquito": "Fighter", "Pharsa": "Mage", "Phoveus": "Fighter", "Popol and Kupa": "Marksman", "Rafaela": "Support", "Roger": "Fighter", "Ruby": "Fighter", "Saber": "Assassin", "Selena": "Assassin", "Silvanna": "Fighter", "Sora": "Fighter", "Sun": "Fighter", "Suyou": "Assassin", "Terizla": "Fighter", "Thamuz": "Fighter", "Tigreal": "Tank", "Uranus": "Tank", "Vale": "Mage", "Valentina": "Mage", "Valir": "Mage", "Vexana": "Mage", "Wanwan": "Marksman", "X.Borg": "Fighter", "Xavier": "Mage", "Yi Sun-shin": "Assassin", "Yin": "Fighter", "Yu Zhong": "Fighter", "Yve": "Mage", "Zetian": "Mage", "Zhask": "Mage", "Zhuxin": "Mage", "Zilong": "Fighter"};

const PRICES = {
  "Epic": 0,
  "Legend": 0,
  "Mythic": 0,
  "Mythical Honor": 0,
  "Mythical Glory": 0,
  "Mythical Immortal": 0
};

const rankOrder = ["Warrior","Elite","Master","Grandmaster","Epic","Legend","Mythic","Mythical Honor","Mythical Glory","Mythical Immortal"];
let activeRole = "All";
let selectedHero = "";

function slug(name) {
  return name.toLowerCase().replace(/['.]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");
}

function renderHeroGrid() {
  const grid = document.getElementById("heroGrid");
  const query = document.getElementById("heroSearch").value.toLowerCase().trim();

  const list = HEROES.filter(name => {
    const matchesName = name.toLowerCase().includes(query);
    const matchesRole = activeRole === "All" || ROLES[name] === activeRole;
    return matchesName && matchesRole;
  });

  grid.innerHTML = list.map(name => {
    const role = ROLES[name] || "Hero";
    const path = "images/heroes/" + slug(name) + ".jpg";
    const selected = selectedHero === name ? " selected" : "";

    return `
      <button class="hero-item${selected}" onclick="selectHero(${JSON.stringify(name)})">
        <img class="hero-img" src="${path}" alt="${name}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid';">
        <div class="avatar fallback" style="display:none">${name.slice(0,2).toUpperCase()}</div>
        <div class="hero-name">${name}</div>
        <div class="hero-role">${role}</div>
      </button>`;
  }).join("");

  if (!list.length) grid.innerHTML = '<p class="muted">No hero found.</p>';
}

function selectHero(name) {
  selectedHero = name;
  const role = ROLES[name] || "Hero";
  const avatarPath = "images/heroes/" + slug(name) + ".jpg";

  document.getElementById("chosenHero").innerHTML = `
    <div class="avatar">
      <img src="${avatarPath}" alt="${name}" onerror="this.style.display='none';">
    </div>
    <div><b>${name}</b><span>${role}</span></div>
  `;
  renderHeroGrid();
}

function fillRanks() {
  const current = document.getElementById("currentRank");
  const target = document.getElementById("targetRank");
  current.innerHTML = rankOrder.map(r => "<option>" + r + "</option>").join("");
  target.innerHTML = rankOrder.map(r => "<option>" + r + "</option>").join("");
  current.value = "Epic";
  target.value = "Legend";
  updateEstimate();
}

function updateEstimate() {
  const target = document.getElementById("targetRank").value;
  const stars = Math.max(1, Number(document.getElementById("stars").value) || 1);
  const rate = PRICES[target] || 0;
  const total = rate * stars;

  document.getElementById("estimate").textContent = rate > 0 ? "₱" + total.toLocaleString() : "₱—";
  document.getElementById("estimateNote").textContent =
    rate > 0 ? "Based on ₱" + rate.toLocaleString() + " × " + stars + " star(s). Confirm final quote."
             : "Set the " + target + " rate in script.js.";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function copyGCash() {
  const number = document.getElementById("gcashNumber").textContent.trim();
  if (number.includes("X")) {
    showToast("Add your real GCash number first.");
    return;
  }
  navigator.clipboard.writeText(number).then(
    () => showToast("GCash number copied."),
    () => showToast("Copy failed. Please copy it manually.")
  );
}

function showQRCode() {
  document.getElementById("qrModal").classList.remove("hidden");
}
function closeQRCode() {
  document.getElementById("qrModal").classList.add("hidden");
}

function createOrderMessage() {
  const currentRank = document.getElementById("currentRank").value;
  const targetRank = document.getElementById("targetRank").value;
  const stars = document.getElementById("stars").value;
  const role = document.getElementById("preferredRole").value;
  const name = document.getElementById("customerName").value.trim() || "Not provided";
  const id = document.getElementById("mlId").value.trim() || "Not provided";
  const server = document.getElementById("server").value.trim() || "Not provided";
  const hero = selectedHero || "No preference";

  const message =
`Hello EJ Pilot Service! I want to place an order.

Name: ${name}
Current Rank: ${currentRank}
Target Rank: ${targetRank}
Target Stars/Points: ${stars}
Preferred Hero: ${hero}
Preferred Role: ${role}
MLBB ID: ${id}
Server ID: ${server}

Please send me the final price and available schedule.`;

  window.open(
    "https://m.me/YOUR_FACEBOOK_USERNAME?text=" + encodeURIComponent(message),
    "_blank",
    "noopener"
  );
}

document.getElementById("heroSearch").addEventListener("input", renderHeroGrid);

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    activeRole = button.dataset.role;
    renderHeroGrid();
  });
});

["currentRank","targetRank","stars"].forEach(id => {
  document.getElementById(id).addEventListener("input", updateEstimate);
  document.getElementById(id).addEventListener("change", updateEstimate);
});

document.getElementById("qrModal").addEventListener("click", e => {
  if (e.target.id === "qrModal") closeQRCode();
});

fillRanks();
renderHeroGrid();
