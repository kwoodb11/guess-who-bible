let selectedCharacter = null;
let usedCharacters = [];
let currentLevel = 1;
let totalScore = 0;
let cluePoints = 100;
let shownClues = [];

const levelEl = document.getElementById('level');
const scoreEl = document.getElementById('score');
const pointsLeftEl = document.getElementById('pointsLeft');
const clueText = document.getElementById('clueText');
const clueBox = document.getElementById('clueBox');
const guessForm = document.getElementById('guessForm');
const resultDiv = document.getElementById('result');

document.getElementById('playBtn').addEventListener('click', startLevel);
document.getElementById('anotherClueBtn').addEventListener('click', () => {
  if (cluePoints > 0) {
    deductPoints(10);
    showAnotherClue();
  } else {
    clueText.textContent = "❗ You're out of points!";
  }
});
document.getElementById('genderSelect').addEventListener('change', (e) => {
  populateDropdowns(e.target.value);
});
document.getElementById('guessBtn').addEventListener('click', makeGuess);

function startLevel() {
  if (usedCharacters.length === characters.length) {
    clueText.textContent = "🎉 All levels complete!";
    guessForm.classList.add('hidden');
    return;
  }

  do {
    selectedCharacter = characters[Math.floor(Math.random() * characters.length)];
  } while (usedCharacters.includes(selectedCharacter.name));

  usedCharacters.push(selectedCharacter.name);
  shownClues = [];
  cluePoints = 100;

  showAnotherClue(true);
  updateUI();

  clueBox.classList.remove('hidden');
  guessForm.classList.remove('hidden');
  resultDiv.classList.add('hidden');
}

function showAnotherClue(force = false) {
  const remainingClues = selectedCharacter.clues.filter(clue => !shownClues.includes(clue));

  if (remainingClues.length === 0) {
    clueText.textContent = "🧠 You've seen all the clues!";
    return;
  }

  const clue = remainingClues[Math.floor(Math.random() * remainingClues.length)];
  shownClues.push(clue);
  clueText.textContent = clue;

  updateUI();
}

function makeGuess() {
  const selectedName = document.getElementById('nameSelect').value;

  if (selectedName === selectedCharacter.name) {
    totalScore += cluePoints;
    resultDiv.innerHTML = `✅ Correct! It was <strong>${selectedCharacter.name}</strong>.<br>🏆 +${cluePoints} points!`;
    currentLevel++;
    setTimeout(startLevel, 2000);
  } else {
    deductPoints(10);
    resultDiv.textContent = `❌ Incorrect! -10 points. Try again.`;
  }

  resultDiv.classList.remove('hidden');
  updateUI();
}

function deductPoints(amount) {
  cluePoints = Math.max(cluePoints - amount, 0);
  updateUI();
}

function updateUI() {
  levelEl.textContent = currentLevel;
  scoreEl.textContent = totalScore;
  pointsLeftEl.textContent = cluePoints;
}

function populateDropdowns(gender) {
  const nameSelect = document.getElementById('nameSelect');
  nameSelect.innerHTML = '';

  let filtered = gender === 'all' ? characters : characters.filter(c => c.gender === gender);

  filtered.forEach(char => {
    const option = document.createElement('option');
    option.value = char.name;
    option.textContent = char.name;
    nameSelect.appendChild(option);
  });
}
