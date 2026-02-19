import { typeChart, allTypes } from "./data/types.js";

// DOM REFERENCES

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const questionNumberEl = document.getElementById("question-number");
const scoreEl = document.getElementById("score");
const questionTextEl = document.getElementById("question-text");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const finalSCoreEl = document.getElementById("final-score");

// APP STATE
const TOTAL_QUESTIONS = 10;

const state = {
   currentQuestionIndex: 0,
   score: 0,
   questions: [],
   selected: false
};

// UTILITY HELPERS
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

/**
 * Build a single question object:
 * {
 *   defender: "Fire",
 *   correct: "Water",
 *   options: ["Water","Ice","Ghost","Fairy"]
 * }
 */

function makeQuestion() {
   const defender = randomItem(allTypes);
   const superEffectiveAttackers = typeChart[defender];
   const correct = randomItem(superEffectiveAttackers);

   //distractors = types that are NOT correct
   const distractorPool = allTypes.filter((type) => type !== correct);
   const distractors = shuffle(distractorPool).slice(0, 3);

   const options = shuffle([correct, ...distractors]);

   return { defender, correct, options };
}

function buildQuestionSet(count = TOTAL_QUESTIONS) {
   return Array.from({ length: count }, () => makeQuestion());
}

// RENDERING
function renderQueston(){
   const q = state.questions[state.currentQuestionIndex];
   if (!q) return;

   questionNumberEl.textContent = String(state.currentQuestionIndex + 1);
   scoreEl.textContent = String(state.score);
   questionTextEl.textContent = `Which type is super effective against ${q.defender}?`;

   optionsEl.innerHTML = "";
   feedbackEl.textContent = "";
   feedbackEl.className = "feedback";
   nextBtn.disabled = true;
   state.selected = false;

   q.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.textContent = option;
      btn.addEventListener("click", () => handleAnswer(option, btn));
      optionsEl.appendChild(btn);
   });
}

function showScreen(screenName) {
   startScreen.classList.add("hidden");
   quizScreen.classList.add("hidden");
   resultScreen.classList.add("hidden");

   if (screenName === "start") startScreen.classList.remove("hidden");
   if (screenName === "quiz") quizScreen.classList.remove("hidden");
   if (screenName === "result") resultScreen.classList.remove("hidden");
}

// GAME LOGIC

function startQuiz() {
   state.currentQuestionIndex = 0;
   state.score = 0;
   state.questions = buildQuestionSet(TOTAL_QUESTIONS);
   state.selected = false;

   showScreen("quiz");
   renderQueston();
}

function handleAnswer(selectedOption, selectedButtonEl) {
   if (state.selected) return; // PREVENT CHANGING ANSWER
   state.selected = true;

   const q = state.questions[state.currentQuestionIndex];
   const isCorrect = selectedOption === q.correct;

   // MARK ALL OPTIONS
   const optionButtons = [...optionsEl.querySelectorAll(".option-btn")];
   optionButtons.forEach((btn) => {
      if (btn.textContent === q.correct) {
         btn.classList.add("correct");
      }
      // DISABLE ALL AFTER FIRST PICK
      btn.disabled = true;
   });

   if (isCorrect) {
      state.score += 1;
      scoreEl.textContent = String(state.score);
      feedbackEl.textContent = "Correct. Nice one.";
      feedbackEl.classList.add("ok"); 
   } else {
      selectedButtonEl.classList.add("wrong");
      feedbackEl.textContent = `Not quite. Correct answer: ${q.correct}.`;
      feedbackEl.classList.add("bad");
   }

   nextBtn.disabled = false;
}

function nextQuestion() {
   state.currentQuestionIndex += 1;

   if (state.currentQuestionIndex >= TOTAL_QUESTIONS) {
      endQuiz();
      return;
   }

   renderQueston();
}

function endQuiz() {
   showScreen("result");
   finalSCoreEl.textContent = `You scored ${state.score} out of ${TOTAL_QUESTIONS}. `;

   // OPTIONAL DYNAMIC MESSAGE
   const ratio = state.score / TOTAL_QUESTIONS;
   const message = 
      ratio === 1
         ? "Perfect run. Pokémon Professor level."
         : ratio >=  0.7
         ? "Great job. You know your matchups."
         : ratio >= 0.4
         ? "Solid start. Keep training."
         : "Good try. You are just getting started.";

   finalSCoreEl.textContent += `${message}`;
}

// EVENT LISTENERS
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", startQuiz);

// INITIAL STATE
showScreen("start");