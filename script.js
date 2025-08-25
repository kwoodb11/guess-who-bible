let selectedCharacter = null;
let currentLevel = 1;
let totalScore = 0;
let cluePoints = 100;
let shownClues = [];

const requiredPoints = [
  50, 60, 70, 80, 90, 100, 110, 120, 130, 140, // levels 1–10
  150, 160, 170, 180, 190, 200, 210, 220, 230, 240, // 11–20
  250, 260, 270, 280, 290, 300, 310, 320, 330, 340, // 21–30
  350, 360, 370, 380, 390, 400, 410, 420, 430, 440, // 31–40
  450, 460, 470, 480, 490, 500, 510, 520, 530, 540  // 41–50
];

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
  if (currentLevel > characters.length) {
    clueText.textContent = "🎉 You've completed all available levels!";
    guessForm.classList.add('hidden');
    return;
  }

  selectedCharacter = characters[currentLevel - 1];
  shownClues = [];
  cluePoints = 100;

  updateUI();
  showAnotherClue(true);

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
    const needed = requiredPoints[currentLevel - 1];

    if (cluePoints >= needed) {
      totalScore += cluePoints;
      resultDiv.innerHTML = `✅ Correct! You scored ${cluePoints} points.<br>🔓 You unlocked the next level!`;
      currentLevel++;
    } else {
      resultDiv.innerHTML = `✅ Correct, but you only scored ${cluePoints} points.<br>🔒 You need at least ${needed} points to unlock the next level. Try again.`;
    }

    setTimeout(startLevel, 3000);
  } else {
    resultDiv.textContent = `❌ Wrong guess! -10 points.`;
    deductPoints(10);
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
