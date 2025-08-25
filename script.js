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
document.getElementById('anotherClueBtn').addEventListener('click', showAnotherClue);
document.getElementById('genderSelect').addEventListener('change', (e) => {
  populateDropdowns(e.target.value);
});
document.getElementById('guessBtn').addEventListener('click', makeGuess);

function startLevel() {
  if (usedCharacters.length === characters.length) {
    clueText.textContent = "🎉 You've completed all available levels!";
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

  clueBox.classList.remove('hidden');
  guessForm.classList.remove('hidden');
  resultDiv.classList.add('hidden');

  levelEl.textContent = currentLevel;
  pointsLeftEl.textContent = cluePoints;
  populateDropdowns('all');
}

function showAnotherClue(force = false) {
  const remainingClues = selectedCharacter.clues.filter(clue => !shownClues.includes(clue));

  if (remainingClues.length === 0) {
    clueText.textContent = "🧠 You've seen all the clues!";
    return;
  }

  const newClue = remainingClues[Math.floor(Math.random() * remainingClues.length)];
  shownClues.push(newClue);
  clueText.textContent = newClue;

  if (!force) {
    deductPoints(10);
  }
}

function makeGuess() {
  const selectedName = document.getElementById('nameSelect').value;

  if (selectedName === selectedCharacter.name) {
    totalScore += cluePoints;
    scoreEl.textContent = totalScore;
    resultDiv.innerHTML = `✅ Correct! It was <strong>${selectedCharacter.name}</strong>.<br>🏆 You earned ${cluePoints} points!`;
    resultDiv.classList.remove('hidden');
    currentLevel++;

    setTimeout(startLevel, 2000);
  } else {
    resultDiv.textContent = `❌ Nope, it's not ${selectedName}. -10 points`;
    resultDiv.classList.remove('hidden');
    deductPoints(10);
  }
}

function deductPoints(amount) {
  cluePoints = Math.max(cluePoints - amount, 0);
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
