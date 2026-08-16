if (window.Telegram && window.Telegram.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
}

const target = document.getElementById("target");
const result = document.getElementById("result");
const best = document.getElementById("best");

let state = "idle";
let readyAt = 0;
let timeoutId = null;

const BEST_SCORE_KEY = "reaction-game-best-ms";

function getBestScore() {
  const stored = localStorage.getItem(BEST_SCORE_KEY);
  return stored ? Number(stored) : null;
}

function renderBestScore() {
  const bestScore = getBestScore();
  best.textContent = bestScore ? `Лучший результат: ${bestScore} мс` : "";
}

function maybeSaveBestScore(reactionMs) {
  const bestScore = getBestScore();
  if (bestScore === null || reactionMs < bestScore) {
    localStorage.setItem(BEST_SCORE_KEY, String(reactionMs));
  }
  renderBestScore();
}

renderBestScore();

function startRound() {
  state = "waiting";
  target.className = "target waiting";
  target.textContent = "Жди...";
  result.textContent = "";

  const delay = 1000 + Math.random() * 3000;
  timeoutId = setTimeout(() => {
    state = "ready";
    readyAt = performance.now();
    target.className = "target ready";
    target.textContent = "Жми!";
  }, delay);
}

target.addEventListener("click", () => {
  if (state === "idle") {
    startRound();
    return;
  }

  if (state === "waiting") {
    clearTimeout(timeoutId);
    result.textContent = "Слишком рано! Попробуй ещё раз.";
    state = "idle";
    target.className = "target waiting";
    target.textContent = "Начать";
    return;
  }

  if (state === "ready") {
    const reactionMs = Math.round(performance.now() - readyAt);
    result.textContent = `Твоё время: ${reactionMs} мс`;
    maybeSaveBestScore(reactionMs);
    state = "idle";
    target.className = "target waiting";
    target.textContent = "Ещё раз";
  }
});
