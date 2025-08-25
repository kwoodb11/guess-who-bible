let selectedCharacter = null;

document.getElementById('playBtn').addEventListener('click', () => {
  selectedCharacter = characters[Math.floor(Math.random() * characters.length)];
  const clue = selectedCharacter.clues[Math.floor(Math.random() * selectedCharacter.clues.length)];

  document.getElementById('clueText').innerText = clue;
  document.getElementById('clueBox').classList.remove('hidden');
  document.getElementById('guessForm').classList.remove('hidden');
  document.getElementById('result').classList.add('hidden');

  populateDropdowns('all');
});

document.getElementById('genderSelect').addEventListener('change', (e) => {
  populateDropdowns(e.target.value);
});

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

document.getElementById('guessBtn').addEventListener('click', () => {
  const selectedName = document.getElementById('nameSelect').value;
  const resultDiv = document.getElementById('result');

  if (selectedName === selectedCharacter.name) {
    resultDiv.textContent = `🎉 Correct! It was ${selectedCharacter.name}.`;
  } else {
    resultDiv.textContent = `❌ Nope, it's not ${selectedName}. Try again!`;
  }

  resultDiv.classList.remove('hidden');
});
