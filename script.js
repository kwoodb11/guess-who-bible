let currentRound = 1;
let currentCharacterIndex = 0;
let totalScore = 0;
let roundScore = 0;
let cluePoints = 100;
let shownClues = [];
let wrongGuesses = 0;

const roundSize = 10;
const maxCluesPerCharacter = 5;
const maxWrongGuesses = 3;
const pointsPerRoundRequired = 800;
const maxPointsPerCharacter = 100;

const levelEl = document.getElementById('level');
const scoreEl = document.getElementById('score');
const pointsLeftEl = document.getElementById('pointsLeft');
const clueText = document.getElementById('clueText');
const clueBox = document.getElementById('clueBox');
const guessForm = document.getElementById('guessForm');
const resultDiv = document.getElementById('result');
const roundMessage = document.getElementById('roundMessage');

document.getElementById('playBtn').addEventListener('click', startCharacter);
document.getElementById('anotherClueBtn').addEventListener('click', () => {
  if (shownClues.length >= maxCluesPerCharacter) {
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

function getRoundCharacters() {
  const start = (currentRound - 1) * roundSize;
  const end = start + roundSize;
  return characters.slice(start, end);
}

function startCharacter() {
  const roundCharacters = getRoundCharacters();

  if (currentCharacterIndex >= roundCharacters.length) {
    if (roundScore >= pointsPerRoundRequired) {
      roundMessage.innerHTML = `🎉 You passed Level ${currentRound} with ${roundScore} points! Moving to next level.`;
      currentRound++;
    } else {
      roundMessage.innerHTML = `❌ You scored ${roundScore}. You need ${pointsPerRoundRequired} to pass Level ${currentRound}.<br>Retrying...`;
    }

    roundMessage.classList.remove('hidden');
    setTimeout(() => roundMessage.classList.add('hidden'), 5000);

    currentCharacterIndex = 0;
    roundScore = 0;
  }

  const currentCharacters = getRoundCharacters();
  if (!currentCharacters[currentCharacterIndex]) {
    clueText.textContent = "🎉 No more characters available!";
    return;
  }

  selectedCharacter = currentCharacters[currentCharacterIndex];
  cluePoints = maxPointsPerCharacter;
  shownClues = [];
  wrongGuesses = 0;

  showAnotherClue(true);
  updateUI();

  clueBox.classList.remove('hidden');
  guessForm.classList.remove('hidden');
  resultDiv.classList.add('hidden');
}

function showAnotherClue(force = false) {
  const remaining = selectedCharacter.clues.filter(clue => !shownClues.includes(clue));
  if (remaining.length === 0) {
    clueText.textContent = "🧠 You've seen all the clues!";
    return;
  }

  const clue = remaining[Math.floor(Math.random() * remaining.length)];
  shownClues.push(clue);
  clueText.textContent = clue;
  updateUI();
}

function makeGuess() {
  const guess = document.getElementById('nameSelect').value;

  if (guess === selectedCharacter.name) {
    totalScore += cluePoints;
    roundScore += cluePoints;
    resultDiv.innerHTML = `✅ Correct! +${cluePoints} points`;
    currentCharacterIndex++;
    setTimeout(startCharacter, 2500);
  } else {
    wrongGuesses++;
    deductPoints(10);

    if (wrongGuesses >= maxWrongGuesses) {
      resultDiv.innerHTML = `❌ Out of guesses! The answer was <strong>${selectedCharacter.name}</strong>`;
      currentCharacterIndex++;
      setTimeout(startCharacter, 2500);
    } else {
      resultDiv.innerHTML = `❌ Wrong! (${wrongGuesses}/${maxWrongGuesses}) -10 points`;
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
  levelEl.textContent = currentRound;
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
