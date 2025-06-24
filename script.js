const sentences = [
  "The quick brown fox jumps over the lazy dog.",
  "Practice makes perfect.",
  "Typing speed can be improved with effort.",
  "Consistency is the key to success.",
  "OpenAI develops artificial intelligence.",
  "Remember to take breaks while working.",
  "Accuracy is as important as speed.",
  "Stay focused and do your best.",
  "Simple web tools are fun to build.",
  "JavaScript makes websites interactive."
];

let startTime, endTime, currentSentence;
const sentenceEl = document.getElementById('sentence');
const inputEl = document.getElementById('input');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const statsEl = document.getElementById('stats');

function getRandomSentence() {
  return sentences[Math.floor(Math.random() * sentences.length)];
}

function startTest() {
  currentSentence = getRandomSentence();
  sentenceEl.textContent = currentSentence;
  inputEl.value = '';
  inputEl.disabled = false;
  inputEl.focus();
  statsEl.textContent = '';
  startBtn.disabled = true;
  resetBtn.disabled = false;
  startTime = null;
  endTime = null;
}

function endTest() {
  inputEl.disabled = true;
  endTime = new Date();
  const timeTaken = (endTime - startTime) / 1000;
  const userInput = inputEl.value;
  const wpm = calculateWPM(userInput, timeTaken);
  const accuracy = calculateAccuracy(currentSentence, userInput);
  statsEl.innerHTML = `
    <strong>Results:</strong><br>
    Time: ${timeTaken.toFixed(2)} seconds<br>
    WPM: ${wpm}<br>
    Accuracy: ${accuracy}%
  `;
}

function calculateWPM(text, seconds) {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.round((wordCount / seconds) * 60);
}

function calculateAccuracy(target, typed) {
  let correct = 0;
  for (let i = 0; i < Math.min(target.length, typed.length); i++) {
    if (target[i] === typed[i]) correct++;
  }
  return Math.round((correct / target.length) * 100);
}

inputEl.addEventListener('input', () => {
  if (!startTime) startTime = new Date();
  if (inputEl.value === currentSentence) endTest();
});

startBtn.addEventListener('click', startTest);

resetBtn.addEventListener('click', () => {
  inputEl.value = '';
  inputEl.disabled = true;
  sentenceEl.textContent = '';
  statsEl.textContent = '';
  startBtn.disabled = false;
  resetBtn.disabled = true;
});

window.onload = () => {
  inputEl.disabled = true;
  resetBtn.disabled = true;
};
