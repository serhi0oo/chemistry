const ring = document.getElementById("hex-ring");
const miniGame = document.getElementById("mini-game");
const gameContent = document.getElementById("game-content");
const backBtn = document.getElementById("back-btn");
const resetBtn = document.getElementById("reset-btn");

let progress = JSON.parse(localStorage.getItem("chem-progress") || "[]");
const container = document.getElementById("ring-container");
let radius = Math.min(container.offsetWidth, container.offsetHeight) / 2.5;

elements.forEach((el, i) => {
  const hex = document.createElement("div");
  hex.className = "hex";
  if (progress.includes(el.symbol)) {
    hex.classList.add("done");
    hex.textContent = el.symbol;
  } else {
    hex.textContent = "❓";
  }

  const angle = (i / elements.length) * 2 * Math.PI;
  const x = container.offsetWidth / 2 + radius * Math.cos(angle) - 40;
  const y = container.offsetHeight / 2 + radius * Math.sin(angle) - 40;
  hex.style.left = `${x}px`;
  hex.style.top = `${y}px`;

  hex.addEventListener("click", () => startMiniGame(i, hex));
  ring.appendChild(hex);
});

backBtn.addEventListener("click", returnToMenu);
resetBtn.addEventListener("click", resetProgress);

function resetProgress() {
  localStorage.removeItem("chem-progress");
  progress = [];
  document.querySelectorAll(".hex").forEach(h => {
    h.classList.remove("done");
    h.textContent = "❓";
  });
  alert("Postęp zresetowany ✅");
}

function returnToMenu() {
  miniGame.classList.add("hidden");
  ring.classList.remove("hidden");
  gameContent.innerHTML = "";
}

function startMiniGame(index, hex) {
  const element = elements[index];
  ring.classList.add("hidden");
  miniGame.classList.remove("hidden");
  gameContent.innerHTML = "";

  const games = [quizGame, trueFalseGame, matchSymbolGame, formulaGame];
  const game = games[index % games.length];
  game(element, hex);
}

function quizGame(element, hex) {
  const q = document.createElement("h2");
  q.textContent = `Który pierwiastek ma symbol "${element.symbol}"?`;
  gameContent.appendChild(q);
  const opts = shuffle([element.name, ...getRandomNames(element.name, 3)]);
  opts.forEach(opt => {
    const btn = createBtn(opt, () => check(btn, opt === element.name, element, hex));
  });
}

function trueFalseGame(element, hex) {
  const fact = [`${element.name} jest metalem`, ["Fe","Cu","Ag","Zn","Al","Ca","K","Na","Mg"].includes(element.symbol)];
  const q = document.createElement("h2");
  q.textContent = fact[0] + "?";
  gameContent.appendChild(q);
  ["Prawda","Fałsz"].forEach((txt,i)=>{
    const btn=createBtn(txt,()=>check(btn,(i===0&&fact[1])||(i===1&&!fact[1]),element,hex));
  });
}

function matchSymbolGame(element, hex) {
  const q = document.createElement("h2");
  q.textContent = `Jak wygląda symbol pierwiastka ${element.name}?`;
  gameContent.appendChild(q);
  const opts = shuffle([element.symbol, ...getRandomSymbols(element.symbol, 3)]);
  opts.forEach(opt => {
    const btn = createBtn(opt, () => check(btn, opt === element.symbol, element, hex));
  });
}

function formulaGame(element, hex) {
  const formulas = {
    "H": "H₂O", "O": "CO₂", "C": "CH₄", "N": "NH₃", "Na": "NaCl",
    "K": "KOH", "Mg": "MgO", "Ca": "CaCO₃", "Fe": "Fe₂O₃", "Cu": "CuSO₄",
    "Zn": "ZnO", "Cl": "NaCl", "S": "H₂S", "Al": "Al₂O₃", "Ag": "AgNO₃"
  };
  const q = document.createElement("h2");
  q.textContent = `Który związek zawiera ${element.name}?`;
  gameContent.appendChild(q);
  const correct = formulas[element.symbol];
  const opts = shuffle(Object.values(formulas)).slice(0,3);
  if (!opts.includes(correct)) opts[0] = correct;
  opts.forEach(opt => {
    const btn = createBtn(opt, () => check(btn, opt === correct, element, hex));
  });
}

function createBtn(text, handler) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className = "answer";
  btn.onclick = handler;
  gameContent.appendChild(btn);
  return btn;
}

function check(btn, ok, element, hex) {
  Array.from(document.querySelectorAll(".answer")).forEach(b => b.disabled = true);
  btn.classList.add(ok ? "correct" : "wrong");
  if (ok) {
    hex.classList.add("done");
    hex.textContent = element.symbol;
    if (!progress.includes(element.symbol)) {
      progress.push(element.symbol);
      localStorage.setItem("chem-progress", JSON.stringify(progress));
    }
    setTimeout(returnToMenu, 1000);
  }
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function getRandomNames(ex, c) { return shuffle(elements.map(e=>e.name).filter(n=>n!==ex)).slice(0,c); }
function getRandomSymbols(ex, c) { return shuffle(elements.map(e=>e.symbol).filter(s=>s!==ex)).slice(0,c); }
