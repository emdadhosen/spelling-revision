let words = [];
let index = 0;
let current = "";
let correctWords = 0;
let wrongLetters = 0;
let repeatCount = 0;

function saveWordList() {
  const list = document.getElementById("wordList").value.trim();
  localStorage.setItem("spellingWords", list);
}

function loadWordList() {
  const saved = localStorage.getItem("spellingWords");
  if (saved) document.getElementById("wordList").value = saved;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startTest() {
  saveWordList();
  let list = document.getElementById("wordList").value.trim();
  if (!list) return alert("Please enter words!");

  words = list.split("\n").map(w => w.trim()).filter(w => w);
  shuffle(words);

  index = 0;
  current = words[index];
  repeatCount = 0;

  document.getElementById("testArea").style.display = "block";
  document.getElementById("wordList").style.display = "none";
  document.querySelector("button").style.display = "none";

  speak(current);
  updateScore();
}

function speak(word, slow = false) {
  const msg = new SpeechSynthesisUtterance(word);
  msg.rate = slow ? 0.6 : 1.0;
  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}

// 🔑 Ctrl key press listener
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey) {
    repeatCount++;
    if (repeatCount === 1) {
      speak(current); // Normal
    } else {
      speak(current, true); // Slow
      repeatCount = 0;
    }
  }
});

function checkSpelling() {
  const typed = document.getElementById("answer").value;
  let colorized = "";
  let tempWrongLetters = 0;

  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === current[i]) {
      colorized += `<span class="correct">${typed[i]}</span>`;
    } else {
      colorized += `<span class="incorrect">${typed[i] || "_"}</span>`;
      tempWrongLetters++;
    }
  }

  const input = document.getElementById("answer");
  input.style.color = "transparent";
  input.style.textShadow = "0 0 0 black";
  document.getElementById("progress").innerHTML = colorized;
  wrongLetters += tempWrongLetters;

  if (typed === current) {
    correctWords++;
    updateScore();
    setTimeout(() => {
      index++;
      if (index < words.length) {
        current = words[index];
        repeatCount = 0;
        input.value = "";
        input.style.color = "";
        input.style.textShadow = "";
        speak(current);
        document.getElementById("progress").textContent = "";
      } else {
        document.getElementById("progress").innerHTML = "✅ Revision Complete!";
        input.disabled = true;
      }
    }, 800);
  }

  updateScore();
}

function updateScore() {
  document.getElementById("correctCount").textContent = correctWords;
  document.getElementById("wrongLetters").textContent = wrongLetters;

  const totalScore = correctWords * 1 - wrongLetters * 0.25;
  const maxScore = words.length * 1;
  const percentage = Math.max(0, ((totalScore / maxScore) * 100).toFixed(1));
  document.getElementById("percentage").textContent = percentage;
}

window.onload = loadWordList;
