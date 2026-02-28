import { typeChart, allTypes } from "./data/types.js";

// DOM REFERENCES //
const modeSelect = document.getElementById("mode-select");

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const highScoreWrap = document.getElementById("high-score-wrap");
const highScoreEl = document.getElementById("high-score");

const questionNumberEl = document.getElementById("question-number");
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const livesEl = document.getElementById("lives");

const questionTextEl = document.getElementById("question-text");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");

const finalScoreEl = document.getElementById("final-score");
const trainerRankEl = document.getElementById("trainer-rank");
const battleLogListEl = document.getElementById("battle-log-list");

const progressEl = document.getElementById("progress");

// CONTANTS & STATE //
const TOTAL_QUESTIONS = 10;
const EASY_TYPES = ["Fire", "Water", "Grass", "Flying", "Electric"];

const state = {
   currentQuestionIndex: 0,
   score: 0,
   lives: 3,
   selected: false,
   mode: "hard",
   typePool: [],
   questions: [],
   hasPlayed: false,
   streak: 0,
   history: [],
};

const TYPE_COLORS = {
   Normal: "#A8A77A",
   Fire: "#EE8130",
   Water: "#6390F0",
   Electric: "#ffd016",
   Grass: "#7AC74C",
   Ice: "#96D9D6",
   Fighting: "#C22E28",
   Poison: "#A33EA1",
   Ground: "#ac965d",
   Flying: "#A98FF3",
   Psychic: "#F95587",
   Bug: "#A6B91A",
   Rock: "#B6A136",
   Ghost: "#735797",
   Dragon: "#6F35FC",
   Dark: "#705746",
   Steel: "#B7B7CE",
   Fairy: "#D685AD",
};

function typeColor(type) {
   return TYPE_COLORS[type] || "#22c55e";
}

// UTILITIES //
function getTypePool(mode) {
   return mode === "easy" ? EASY_TYPES : allTypes;
}

function highScoreKeyForMode(mode) {
   return `pokemonTypeTrainerHighScore_${mode}`;
}

function getHighScore(mode) {
   const raw = localStorage.getItem(highScoreKeyForMode(mode));
   const num = Number(raw);
   return Number.isFinite(num) ? num : 0;
}

function setHighScore(mode, score) {
   localStorage.setItem(highScoreKeyForMode(mode), String(score));
}

function shuffle(array) {
   const copy = [...array];
   for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
   }
   return copy;
}

function randomItem(arr) {
   return arr[Math.floor(Math.random() * arr.length)];
}

function isEnterKey(e) {
   return e.key === "Enter" || e.key === "Return" || e.code === "NumpadEnter";
}

function isVisible(el) {
   return el && !el.classList.contains("hidden");
}

function isStartScreen() {
   return isVisible(startScreen);
}

function isQuizScreen() {
   return isVisible(quizScreen);
}

function isResultScreen() {
   return isVisible(resultScreen);
}

// PROGRESS ORBS //
function initProgress() {
   if (!progressEl) return;
   progressEl.innerHTML = "";
   for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      const orb = document.createElement("span");
      orb.className = "orb";
      orb.setAttribute("aria-hidden", "true");
      progressEl.appendChild(orb);
   }
}

function renderProgress() {
   if (!progressEl) return;
   const orbs = [...progressEl.querySelectorAll(".orb")];
   orbs.forEach((orb, i) => {
      orb.classList.toggle("done", i < state.currentQuestionIndex);
      orb.classList.toggle("now", i === state.currentQuestionIndex);
   });
}

// QUESTION GENERATION //
function makeQuestion(typePool) {
   const defender = randomItem(typePool);
   const superEffectiveAttackers = typeChart[defender] || [];

   // PREFER CORRECT INSIDE THE POOL (EASY MODE) IF POSSIBLE //
   const validCorrectOptions = superEffectiveAttackers.filter((t) => typePool.includes(t));
   const correct =
      validCorrectOptions.length > 0
      ? randomItem(validCorrectOptions)
      : randomItem(superEffectiveAttackers);

   // AVOID SHOWING ANY OTHER SUPER-EFFECTIVE TYPES AS DISTRACTORS (PREVENTS CONFUSION) //
   const safePool = typePool.filter((t) => t !== correct && !superEffectiveAttackers.includes(t));

   // FALLBACK FOR SMALL POOLS // 
   const poolToUse = safePool.length >= 3 ? safePool : typePool.filter((t) => t !== correct);

   const distractors = shuffle(poolToUse).slice(0, 3);
   const options = shuffle([correct, ...distractors]);

   return { defender, correct, options };
}

function buildQuestionSet(typePool, count = TOTAL_QUESTIONS) {
   return Array.from({ length: count }, () => makeQuestion(typePool));
}

// RENDERING HELPERS //
function showScreen(name) {
   startScreen.classList.add("hidden");
   quizScreen.classList.add("hidden");
   resultScreen.classList.add("hidden");

   if (name === "start") startScreen.classList.remove("hidden");
   if (name === "quiz") quizScreen.classList.remove("hidden");
   if (name === "result") resultScreen.classList.remove("hidden");
}

function renderHighScore() {
   if (!highScoreWrap || !highScoreEl) return;

   // Uncomment if you want to show only after one completed run:
   // if (!state.hasPlayed) {
   //   highScoreWrap.classList.add("hidden");
   //   return;
   // }

   const mode = modeSelect ? modeSelect.value : state.mode;
   highScoreEl.textContent = String(getHighScore(mode));
   highScoreWrap.classList.remove("hidden");
}

function renderLives() {
   const hearts = "♥︎".repeat(Math.max(0, state.lives)) + "♡".repeat(Math.max(0, 3 - state.lives));
   livesEl.textContent = hearts;
}

function setFeedback(text, type) {
   feedbackEl.textContent = text;
   feedbackEl.className = "feedback";
   if (type === "ok") feedbackEl.classList.add("ok");
   if (type === "bad") feedbackEl.classList.add("bad");
}

function applyTypeTheme(defenderType) {
   if (!quizScreen) return;
   quizScreen.dataset.type = defenderType;
   quizScreen.style.setProperty("--type-color", typeColor(defenderType));
}

function styleOptionButton(btn, optionType) {
   btn.style.setProperty("--opt-color", typeColor(optionType));
}

function renderQuestion() {
   const q = state.questions[state.currentQuestionIndex];
   if (!q) return;

   questionNumberEl.textContent = String(state.currentQuestionIndex + 1);
   scoreEl.textContent = String(state.score);
   streakEl.textContent = String(state.streak);
   questionTextEl.textContent = `Which type is super effective against ${q.defender}?`;

   applyTypeTheme(q.defender);
   renderProgress();

   optionsEl.innerHTML = "";
   setFeedback("", null);

   nextBtn.disabled = true;
   state.selected = false;

   q.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";

      const label = document.createElement("span");
      label.className = "option-label";
      label.textContent = option;

      const icon = document.createElement("img");
      icon.className = "option-icon";
      icon.src = `./assets/types/${option}.svg`;
      icon.alt = "";
      icon.setAttribute("aria-hidden", true);
      icon.onerror = () => icon.remove();

      btn.appendChild(label);
      btn.appendChild(icon);

      styleOptionButton(btn, option);
      btn.addEventListener("click", () => handleAnswer(option, btn));
      optionsEl.appendChild(btn);
   });
}

// KEYBOARD HELPERS //
function chooseOptionByIndex(index) {
   const optionButtons = [...optionsEl.querySelectorAll(".option-btn")];
   const btn = optionButtons[index];
   if (!btn || btn.disabled) return;
   btn.focus();
   btn.click();
}

function goNextIfReady() {
   if (nextBtn.disabled) return;
   nextBtn.click();
}

// GAME LOGIC //
function startQuiz() {
   state.currentQuestionIndex = 0;
   state.score = 0;
   state.lives = 3;
   state.selected = false;
   state.streak = 0;
   state.history = [];

   state.mode = modeSelect ? modeSelect.value : "hard";
   state.typePool = getTypePool(state.mode);
   state.questions = buildQuestionSet(state.typePool, TOTAL_QUESTIONS);

   initProgress();
   renderLives();

   showScreen("quiz");
   renderQuestion();
}

function handleAnswer(selectedOption, selectedButtonEl) {
   if (state.selected) return;
   state.selected = true;

   const q = state.questions[state.currentQuestionIndex];
   const isCorrect = selectedOption === q.correct;

   const optionButtons = [...optionsEl.querySelectorAll(".option-btn")];

   optionButtons.forEach((btn) => {
      const label = btn.querySelector(".option-label")?.textContent;
      if (label === q.correct) btn.classList.add("correct");
      btn.disabled = true;
   });

   if (isCorrect) {
      state.score += 1;
      state.streak += 1;
      scoreEl.textContent = String(state.score);
      streakEl.textContent = String(state.streak);
      setFeedback("Super effective!", "ok");
   } else {
      selectedButtonEl.classList.add("wrong");
      state.streak = 0;
      streakEl.textContent = "0";
      state.lives -= 1;
      renderLives();
      setFeedback(`Not very effective. Correct answer: ${q.correct}.`, "bad");
   }

   state.history.push({
      defender: q.defender,
      picked: selectedOption,
      correct: q.correct,
      isCorrect,
   });

   nextBtn.disabled = false;
}

function nextQuestion() {
   state.currentQuestionIndex += 1;

   if (state.currentQuestionIndex >= TOTAL_QUESTIONS || state.lives <= 0) {
      endQuiz();
      return;
   }

   renderQuestion();
}

function trainerRank(score, total) {
   const ratio = score / total;
   if (ratio === 1) return "Pokémon Professor";
   if (ratio >= 0.8) return "Elite Trainer";
   if (ratio >= 0.6) return "Gym Challenger";
   if (ratio >= 0.4) return "Rising Rookie";
   return "Rookie Trainer";
}

function renderBattleLog() {
   if (!battleLogListEl) return;
   battleLogListEl.innerHTML = "";

   const lastThree = state.history.slice(-3).reverse();
   lastThree.forEach((h) => {
      const li = document.createElement("li");
      const verdict = h.isCorrect ? "Win" : "Loss";
      li.textContent = `${verdict}: vs ${h.defender}, you chose ${h.picked}, correct was ${h.correct}`;
      battleLogListEl.appendChild(li);
   });
}

function endQuiz() {
   showScreen("result");

   finalScoreEl.textContent = `You scored ${state.score} out of ${TOTAL_QUESTIONS}. `;

   const best = getHighScore(state.mode);
   if (state.score > best) setHighScore(state.mode, state.score);

   state.hasPlayed = true;
   renderHighScore();

   if (trainerRankEl) trainerRankEl.textContent = trainerRank(state.score, TOTAL_QUESTIONS);
   renderBattleLog();

   const ratio = state.score / TOTAL_QUESTIONS;
   const message =
      ratio === 1
      ? "Perfect run. Pokémon Professor level."
      : ratio >= 0.7
      ? "Great job. You know your matchups."
      : ratio >= 0.4
      ? "Solid start. Keep training."
      : "Good try. You are just getting started.";

   finalScoreEl.textContent += message;
}

// EVENTS LISTENERS //
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);

restartBtn.addEventListener("click", () => {
   showScreen("start");
   renderHighScore();
});

modeSelect?.addEventListener("change", renderHighScore);

document.addEventListener("keydown", (e) => {
   const tag = e.target.tagName;
   const inControl = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
   if (inControl) return;

   if (isStartScreen() && isEnterKey(e)) {
      e.preventDefault();
      startBtn.click();
      return;
   }

   if (isQuizScreen()) {
      if (e.key === "1") { e.preventDefault(); chooseOptionByIndex(0); return; }
      if (e.key === "2") { e.preventDefault(); chooseOptionByIndex(1); return; }
      if (e.key === "3") { e.preventDefault(); chooseOptionByIndex(2); return; }
      if (e.key === "4") { e.preventDefault(); chooseOptionByIndex(3); return; }

      if (isEnterKey(e)) {
      e.preventDefault();
      goNextIfReady();
      return;
      }
   }

   if (isResultScreen() && isEnterKey(e)) {
      e.preventDefault();
      restartBtn.click();
   }
});

// INITIAL STATE //
renderHighScore();
showScreen("start");
