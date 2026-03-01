<div align="center">

# 🌸⚡ Pokémon Type Matchup Trainer ⚡🌸

### *A cute little battle quiz to help Trainers learn type matchups!*

![HTML5](https://img.shields.io/badge/HTML5-Structure-ffb6c1?style=for-the-badge)
![CSS3](https://img.shields.io/badge/CSS3-Styling-87cefa?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-Logic-ffd966?style=for-the-badge)
![LocalStorage](https://img.shields.io/badge/LocalStorage-High%20Scores-c3f584?style=for-the-badge)

**🎀 Learn Pokémon type effectiveness in a fun, colorful, and interactive way!**

[🌐 Live Demo](PASTE_YOUR_LIVE_DEMO_LINK) • [📂 GitHub Repo](PASTE_YOUR_GITHUB_REPO_LINK)

</div>

---

## 🌷 Project Title

**Pokémon Type Matchup Trainer**

---

## 💭 Problem

Many beginner Pokémon players know the different type names, but have trouble remembering which types are **super effective** in battle. Looking at a full type chart can feel overwhelming, especially for new players.

This project solves that problem by turning type practice into a cute and interactive quiz game that helps users learn through repetition and instant feedback.

---

## 🧑‍💻 What user problem am I solving?

I am helping users memorize Pokémon type matchups in a way that feels:

* fun
* beginner-friendly
* interactive
* easy to replay

Instead of memorizing from a chart, users can practice with short battle quiz rounds and improve as they go.

---

## 🎯 Goals

* Help users practice Pokémon type matchups in a simple and fun way
* Make learning feel more like a game than a study session
* Give users instant feedback after every answer
* Let users track their progress and improve over time

### 🌟 Measurable outcomes

* Users can complete a full **10-question quiz**
* Feedback appears immediately after each answer
* High scores are saved locally by difficulty mode
* Users can answer using both **mouse clicks** and **keyboard shortcuts**
* The game supports **Easy Mode** and **Hard Mode**

---

## 🧁 Tech Stack

* **HTML5** – for page structure
* **CSS3** – for styling, layout, responsiveness, and animations
* **JavaScript (ES Modules)** – for quiz logic, scoring, and state management
* **Local Storage** – for saving high scores
* **Google Fonts (Rubik)** – for playful typography

---

## 🌈 Process

**Wireframe → build → test → iterate**

### 1. 📝 Wireframe

I planned the layout with three main screens:

* Start screen
* Quiz screen
* Result screen

### 2. ⚙️ Build

I created the quiz system to:

* generate random questions
* shuffle answer choices
* track score, streak, progress, and lives
* show feedback after each answer

### 3. 🎨 Style

I designed the interface to feel:

* colorful
* battle-inspired
* easy to read
* responsive on smaller screens

### 4. 🧪 Test

I tested:

* correct and incorrect answers
* restarting the game
* keyboard shortcuts
* full quiz flow
* high score saving

### 5. 🔄 Iterate

I improved the project by adding:

* Easy and Hard modes
* trainer ranks
* battle logs
* clearer progress indicators

---

## ✨ Key Features

* **10-question quiz format**
* **Two difficulty modes**

  * Easy: Fire, Water, Grass, Flying, Electric
  * Hard: all 18 Pokémon types
* **3-life system** ❤️❤️❤️
* **Score tracking**
* **Streak tracking**
* **Progress indicator**
* **Instant feedback**
* **Trainer rank system**
* **Battle log**
* **Keyboard shortcuts**

  * `1–4` to answer
  * `Enter/Return` to continue
* **Local high score saving**
* **Responsive design**
* **Dynamic type-themed colors**

---

## 🩹 Challenges and Fixes

### 1. Confusing answer choices

**Problem:** Some defender types can be weak to more than one super effective type, which could make answer choices confusing.

**Fix:** I filtered out other valid super effective answers from the wrong options so each question only had one clear correct answer.

### 2. Small option pool in Easy Mode

**Problem:** Easy Mode has only five types, so generating enough unique wrong answers was tricky.

**Fix:** I added fallback logic to make sure the answer set stayed complete.

### 3. High scores getting mixed up

**Problem:** Easy and Hard mode scores could overwrite each other.

**Fix:** I used separate `localStorage` keys for each difficulty mode.

### 4. Missing icons

**Problem:** If an icon did not load, the UI could look broken.

**Fix:** I added an image error handler to remove broken icons cleanly.

---

## 🌼 What broke? How did you debug it?

The biggest issue was making sure every question had **one clear correct answer**. I debugged this by checking the type chart logic, reviewing the option generation, and testing the game repeatedly in both Easy and Hard modes.

I also tested edge cases like:

* low lives
* quiz completion
* restart flow
* high score updates
* keyboard shortcuts

---

## 📚 What I learned

Through this project, I learned how to:

* manage game state with JavaScript
* randomize quiz content fairly
* update the DOM dynamically
* use `localStorage` for persistent data
* improve UX through feedback and replayability
* create a stronger visual identity with CSS
* support keyboard accessibility

---

## 🚀 Future Improvements

* Add a **timer mode**
* Add **sound effects**
* Add more battle-style animations
* Show a short **type explanation** after answers
* Add **accuracy stats**
* Build an online **leaderboard**
* Improve the **mobile experience**
* Add a **study mode**
* Connect to **PokéAPI**

---

## 🔗 Live Demo + GitHub Link

* **Live Demo:** [Add your live demo link here](PASTE_YOUR_LIVE_DEMO_LINK)
* **GitHub Repository:** [Add your GitHub repo link here](PASTE_YOUR_GITHUB_REPO_LINK)

---

## 🧰 What libraries/tools you should add next

* **Vite** – faster development workflow
* **ESLint** – catch code issues early
* **Prettier** – cleaner formatting
* **GitHub Pages / Netlify / Vercel** – deployment
* **Vitest or Jest** – testing
* **PokéAPI** – richer Pokémon features

---

## 💖 Author

**John Fred B. Delos Santos**

> *Small project, big Trainer energy.* ✨
