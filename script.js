let selectedCharacter = null;
let currentLevel = 1;
let totalScore = 0;
let cluePoints = 100;
let roundScore = 0;
let shownClues = [];
let wrongGuesses = 0;

const roundSize = 10;
const maxCluesPerLevel = 5;
const maxWrongGuessesPerLevel = 3;
const requiredTotalPerRound = 800;
const maxPointsPerLevel = 100;

const levelEl = document.getElementById('level');
const scoreEl = document.getElementById('score');
const pointsLeftEl = document.getElementById('pointsLeft');
const clueText = document.getElementById('clueText');
const clueBox = document.getElementById('clueBox');
const guessForm = document.getElementById('guessForm');
const resultDiv = document.getElementById('result');

document.getElementById('playBtn').addEventListener('click', startLevel);
document.getElementById('anotherClueBtn').addEventListener('click', () => {
  if (shownClues.length >= maxCluesPerLevel) {
    clueText.textContent = "❗ No more clues allowed.";
    return;
  }
  deductPoints(10);
  showAnotherClue();
});
document.getElementById('genderSelect').addEventListener('change', (e) => {
  populateDropdowns(e.target.value);
});
document.getElementById('guessBtn').addEventListener('click', makeGuess);

function startLevel() {
  if (currentLevel > characters.length) {
    clueText.textContent = "🎉 You completed all characters!";
    guessForm.classList.add('hidden');
    return;
  }

  // Round check
  if ((currentLevel - 1) % roundSize === 0 && currentLevel > 1) {
    if (roundScore >= requiredTotalPerRound) {
      alert(`✅ Round Passed! You scored ${roundScore} points.`);
      roundScore = 0;
    } else {
      alert(`❌ Round Failed. You needed ${requiredTotalPerRound} points. Restarting round...`);
      currentLevel = currentLevel - roundSize;
      roundScore = 0;
    }
  }

  selectedCharacter = characters[currentLevel - 1];
  shownClues = [];
  wrongGuesses = 0;
  cluePoints = maxPointsPerLevel;

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
    roundScore += cluePoints;

    resultDiv.innerHTML = `✅ Correct! It was <strong>${selectedCharacter.name}</strong>.<br>+${cluePoints} points.`;
    currentLevel++;
    setTimeout(startLevel, 2500);
  } else {
    wrongGuesses++;
    deductPoints(10);
    if (wrongGuesses >= maxWrongGuessesPerLevel) {
      resultDiv.innerHTML = `❌ You used all ${maxWrongGuessesPerLevel} guesses.<br>The correct answer was <strong>${selectedCharacter.name}</strong>.`;
      currentLevel++;
      setTimeout(startLevel, 2500);
    } else {
      resultDiv.innerHTML = `❌ Wrong guess! (${wrongGuesses}/${maxWrongGuessesPerLevel}) -10 points.`;
    }
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
