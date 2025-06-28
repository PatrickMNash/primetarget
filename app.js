const munitions = [2, 3, 5, 7, 11, 13, 17, 19, 23];
const primeTarget = 47;
const startingValue = 86;
let currentValue = startingValue;
let currentRound;
let choicesIndex = 0;
let score = 0;
let maxMoves = 9
let currentLevel = 1;
let highScore = 0;

function getMunition (munitions) {
  const randomMunition = munitions[Math.floor(Math.random() * munitions.length)];
  return randomMunition;
}

function buildPath (startingValue, primeTarget, munitions) {
  let start = startingValue;
  const goal = primeTarget;
  const _munitions = munitions;
  const path = [];

  while (start != goal) {
    let munition = start + 1;
    while (munition > start) {
      munition = getMunition(_munitions);
    }
    start = start - munition;
    if (start >= goal) {
      path.push(munition);
    } else {
      start = start + munition;
    }
    if (start == goal + 1) {
      const undo = path.pop();
      start = start + undo;
    }
  }
  return path;
}

function buildChoices (munition, munitions) {
  const choices = [];
  choices.push(munition);
  while (choices.length < 3) {
    const choice = getMunition(munitions);
    if (choices.indexOf(choice) == -1) {
      choices.push(choice);
    }
  }
  return choices;
}

function buildRound (startingValue, primeTarget, munitions, maxMoves) {
  let round = buildPath(startingValue, primeTarget, munitions);
  while (round.length != maxMoves) {
    round = buildPath(startingValue, primeTarget, munitions);
  }

  for (let i = 0; i < round.length; i++) {
    const munition = round[i];
    const choices = buildChoices(munition, munitions);
    round[i] = choices;
  }

  return round;
}

function setCurrentValue (value) {
  const curValueDiv = document.getElementById("current-value");
  curValueDiv.innerText = value;
}

function setTarget (value) {
  const targetValueDiv = document.getElementById("target");
  targetValueDiv.innerText = value;
}

function setChoices (choices) {
  const choiceOne = document.getElementById("choice-one").children[0];
  choiceOne.innerText = choices[0];
  choiceOne.onclick = () => applyMunition(choices[0]);
  const choiceTwo = document.getElementById("choice-two").children[0];
  choiceTwo.innerText = choices[1];
  choiceTwo.onclick = () => applyMunition(choices[1]);
  const choiceThree = document.getElementById("choice-three").children[0];
  choiceThree.innerText = choices[2];
  choiceThree.onclick = () => applyMunition(choices[2]);
}

function setScore () {
  const scoreDisplay = document.getElementById("score");
  scoreDisplay.innerText = score;
}

function setCurrentLevel () {
  const levelDisplay = document.getElementById("current-level");
  levelDisplay.innerText = currentLevel;
}

function applyMunition (value) {
  currentValue = currentValue - value;
  setCurrentValue(currentValue);
  choicesIndex++;
  setShotsRemaining();
  if (choicesIndex < currentRound.length) {
    setChoices(currentRound[choicesIndex]);
  }
  else {
    endRound();
  }
  scoreMove(value);
}

function scoreMove (value) {
  if (currentValue > primeTarget && choicesIndex < currentRound.length) {
    score = score + value;
  } else if (currentValue == primeTarget) {
    score = score + value + primeTarget;
    if (maxMoves > 3) {
      maxMoves--;
    }
    currentLevel++;
    endRound();
  }
  else {
    score = score - value - (startingValue - currentValue);
    endRound();
  }
  setScore();
}

function checkHighScore () {
  if (score > highScore) {
    highScore = score;
  }
  //setHighScore();
}

function setHighScore () {
  const highScoreDisplay = document.getElementById("high-score");
  highScoreDisplay.innerText = highScore;
}

function setShotsRemaining () {
  const shotsRemaining = document.getElementById("shots");
  shotsRemaining.innerText = currentRound.length - choicesIndex;
}

function endRound () {
  const choiceOne = document.getElementById("choice-one").children[0];
  choiceOne.hidden = true;
  const choiceTwo = document.getElementById("choice-two").children[0];
  choiceTwo.hidden = true;
  const choiceThree = document.getElementById("choice-three").children[0];
  choiceThree.hidden = true;
  const continueButton = document.getElementById("continue").children[0];
  continueButton.hidden = false;
  checkHighScore();
}

function continueGame () {
  const choiceOne = document.getElementById("choice-one").children[0];
  choiceOne.hidden = false;
  const choiceTwo = document.getElementById("choice-two").children[0];
  choiceTwo.hidden = false;
  const choiceThree = document.getElementById("choice-three").children[0];
  choiceThree.hidden = false;
  const continueButton = document.getElementById("continue").children[0];
  continueButton.hidden = true;
  const round = buildRound(startingValue, primeTarget, munitions, maxMoves);
  currentRound = round;
  choicesIndex = 0;
  currentValue = startingValue;
  setShotsRemaining();
  setCurrentValue(startingValue);
  setChoices(currentRound[choicesIndex]);
  setCurrentLevel();
}

function main () {
  const round = buildRound(startingValue, primeTarget, munitions, maxMoves);
  currentRound = round;
  setCurrentValue(startingValue);
  setTarget(primeTarget);
  setChoices(currentRound[choicesIndex]);
  setScore();
  setShotsRemaining();
  setCurrentLevel();
}

main();