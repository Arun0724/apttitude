let level = "";
let lastSelectedLevel = "";

let lives = 3;
let score = 0;
let totalQuestions = 0;
let correctAnswers = 0;

let timeLimit = 0;
let timerInterval;
let correctAnswer;

// progress config
const MAX_QUESTIONS = 20;
let currentQuestionIndex = 0;

// LEVEL CONFIG
const LEVELS = {
  Beginner: 20,
  Intermediate: 12,
  Advanced: 8,
  Expert: 5
};

// ---------------- SCREEN CONTROL ----------------
function showLevels() {
  hideAll();
  document.getElementById("levelScreen").classList.remove("hidden");
}

function startGame(selectedLevel) {
  level = selectedLevel;
  lastSelectedLevel = selectedLevel;

  timeLimit = LEVELS[level];
  lives = 3;
  score = 0;
  totalQuestions = 0;
  correctAnswers = 0;
  currentQuestionIndex = 0;

  // reset progress bar
  document.getElementById("progressBar").style.width = "0%";

  hideAll();
  document.getElementById("gameScreen").classList.remove("hidden");
  nextQuestion();
}

// ---------------- AI QUESTION ENGINE ----------------
function generateQuestion() {
  let q = "";
  let a = 0;

  /* ---------- BEGINNER ---------- */
  if (level === "Beginner") {
    const topic = randomPick(["add", "sub", "mul", "percent"]);

    if (topic === "add") {
      if (Math.random() > 0.5) {
        let x = rand(1, 20), y = rand(1, 20);
        q = `[Addition] ${x} + ${y} = ?`;
        a = x + y;
      } else {
        let x = rand(1, 10), y = rand(1, 10), z = rand(1, 10);
        q = `[Addition] ${x} + ${y} + ${z} = ?`;
        a = x + y + z;
      }
    }

    if (topic === "sub") {
      let x = rand(20, 50), y = rand(1, 20);
      q = `[Subtraction] ${x} − ${y} = ?`;
      a = x - y;
    }

    if (topic === "mul") {
      let x = rand(2, 9), y = rand(2, 5);
      q = `[Multiplication] ${x} × ${y} = ?`;
      a = x * y;
    }

    if (topic === "percent") {
      let p = randomPick([10, 20, 25, 50]);
      let n = rand(20, 200);
      q = `[Percentage] ${p}% of ${n} = ?`;
      a = (p * n) / 100;
    }
  }

  /* ---------- INTERMEDIATE ---------- */
  if (level === "Intermediate") {
    const topic = randomPick(["percent", "ratio", "avg"]);

    if (topic === "percent") {
      let p = rand(10, 40), n = rand(100, 400);
      q = `[Percentage] Increase ${n} by ${p}%`;
      a = n + (n * p) / 100;
    }

    if (topic === "ratio") {
      let a1 = rand(2, 5), a2 = rand(3, 7);
      let total = rand(100, 300);
      q = `[Ratio] Divide ${total} in ratio ${a1}:${a2}. Find first part`;
      a = (total * a1) / (a1 + a2);
    }

    if (topic === "avg") {
      let x = rand(20, 60), y = rand(20, 60), avg = rand(30, 60);
      q = `[Average] Avg of 3 numbers is ${avg}. Two are ${x}, ${y}. Find third`;
      a = avg * 3 - (x + y);
    }
  }

  /* ---------- ADVANCED ---------- */
  if (level === "Advanced") {
    const topic = randomPick(["work", "pl", "si"]);

    if (topic === "work") {
      let d1 = rand(10, 30), d2 = rand(15, 40);
      q = `[Time & Work] A takes ${d1} days, B takes ${d2} days. Find days together`;
      a = (d1 * d2) / (d1 + d2);
    }

    if (topic === "pl") {
      let cp = rand(200, 800), p = rand(10, 30);
      q = `[Profit & Loss] CP = ${cp}, Profit = ${p}%. Find SP`;
      a = cp + (cp * p) / 100;
    }

    if (topic === "si") {
      let si = rand(200, 600), r = rand(5, 10), t = rand(2, 4);
      q = `[Simple Interest] SI = ${si}, R = ${r}%, T = ${t} yrs. Find Principal`;
      a = (si * 100) / (r * t);
    }
  }

  /* ---------- EXPERT ---------- */
  if (level === "Expert") {
    const topic = randomPick(["speed", "ci", "mixed"]);

    if (topic === "speed") {
      let d = rand(100, 400), s = rand(40, 80);
      q = `[Speed] Distance = ${d} km, Speed = ${s} km/h. Find time`;
      a = d / s;
    }

    if (topic === "ci") {
      let p = rand(1000, 3000), r = rand(5, 10), t = rand(2, 3);
      q = `[Compound Interest] Find Amount on ₹${p} at ${r}% for ${t} yrs`;
      a = p * Math.pow(1 + r / 100, t);
    }

    if (topic === "mixed") {
      let p = rand(10, 30), n = rand(200, 500), s = rand(30, 70);
      q = `[Mixed] ${p}% of ${n} + ${s}`;
      a = (p * n) / 100 + s;
    }
  }

  correctAnswer = Number(a.toFixed(2));
  return q;
}

// ---------------- GAME LOOP ----------------
function nextQuestion() {
  if (currentQuestionIndex >= MAX_QUESTIONS) {
    endGame();
    return;
  }

  currentQuestionIndex++;
  totalQuestions++;

  // update progress bar
  let progress = (currentQuestionIndex / MAX_QUESTIONS) * 100;
  document.getElementById("progressBar").style.width = progress + "%";

  document.getElementById("answerInput").value = "";
  document.getElementById("answerInput").focus();

  document.getElementById("lives").innerText = lives;
  document.getElementById("score").innerText = score;
  document.getElementById("question").innerText = generateQuestion();

  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  let timeLeft = timeLimit;
  document.getElementById("timer").innerText = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      lives--;
      checkGameOver();
      if (lives > 0) nextQuestion();
    }
  }, 1000);
}

function submitAnswer() {
  clearInterval(timerInterval);

  let user = Number(document.getElementById("answerInput").value);

  if (user === correctAnswer) {
    correctAnswers++;
    score += 10;
  } else {
    lives--;
  }

  checkGameOver();
  if (lives > 0) nextQuestion();
}

// ---------------- END / REPLAY ----------------
function endGame() {
  clearInterval(timerInterval);
  hideAll();

  document.getElementById("gameOverScreen").classList.remove("hidden");
  document.getElementById("finalScore").innerText = score;
  document.getElementById("finalAccuracy").innerText =
    ((correctAnswers / totalQuestions) * 100).toFixed(2);
}

function checkGameOver() {
  if (lives <= 0) {
    endGame();
  }
}

function playAgainSameLevel() {
  startGame(lastSelectedLevel);
}

// ---------------- UTIL ----------------
function hideAll() {
  ["welcomeScreen", "levelScreen", "gameScreen", "gameOverScreen"]
    .forEach(id => document.getElementById(id).classList.add("hidden"));
}

function handleEnter(event) {
  if (event.key === "Enter") {
    submitAnswer();
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
