const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23];
const primeTarget = 47;
const startingValue = 86;
let currentValue = startingValue;
let currentRound;
let choicesIndex = 0;
let score = 0;
let maxMoves = 9
let currentLevel = 1;
let highScore = 0;
let hearts = 3;

function getPrime (primes) {
  const randomPrime = primes[Math.floor(Math.random() * primes.length)];
  return randomPrime;
}

function buildPath (startingValue, primeTarget, primes) {
  let start = startingValue;
  const goal = primeTarget;
  const _primes = primes;
  const path = [];

  while (start != goal) {
    let prime = start + 1;
    while (prime > start) {
      prime = getPrime(_primes);
    }
    start = start - prime;
    if (start >= goal) {
      path.push(prime);
    } else {
      start = start + prime;
    }
    if (start == goal + 1) {
      const undo = path.pop();
      start = start + undo;
    }
  }
  return path;
}

function buildChoices (prime, primes) {
  const choices = [];
  choices.push(prime);
  while (choices.length < 3) {
    const choice = getPrime(primes);
    if (choices.indexOf(choice) == -1) {
      choices.push(choice);
    }
  }
  return choices;
}

function buildRound (startingValue, primeTarget, primes, maxMoves) {
  let round = buildPath(startingValue, primeTarget, primes);
  while (round.length != maxMoves) {
    round = buildPath(startingValue, primeTarget, primes);
  }

  for (let i = 0; i < round.length; i++) {
    const prime = round[i];
    const choices = buildChoices(prime, primes);
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
  choiceOne.onclick = () => applyPrime(choices[0]);
  const choiceTwo = document.getElementById("choice-two").children[0];
  choiceTwo.innerText = choices[1];
  choiceTwo.onclick = () => applyPrime(choices[1]);
  const choiceThree = document.getElementById("choice-three").children[0];
  choiceThree.innerText = choices[2];
  choiceThree.onclick = () => applyPrime(choices[2]);
}

function setScore () {
  const scoreDisplay = document.getElementById("score");
  scoreDisplay.innerText = score;
}

function setCurrentLevel () {
  const levelDisplay = document.getElementById("current-level");
  levelDisplay.innerText = currentLevel;
}

function setHighScore () {
  const highScoreDisplay = document.getElementById("high-score");
  highScoreDisplay.innerText = highScore;
}

function setShotsRemaining () {
  const shotsRemaining = document.getElementById("shots");
  shotsRemaining.innerText = currentRound.length - choicesIndex;
}

function setHearts () {
  const heartsDisplay = document.getElementById("heart-button");
  heartsDisplay.innerText = hearts;
}

function applyPrime (value) {
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
    hearts++;
    endRound();
  }
  else {
    score = score - value - (startingValue - currentValue);
    endRound();
    if (hearts == 0) {
      gameOver();
    }
    if (hearts > 0) {
      hearts--;
    }
  }
  setScore();
}

function gameOver () {
  const continueButton = document.getElementById("next");
  continueButton.innerText = "Game Over";
}

function applyHeart () {
  if (hearts > 0) {
    currentValue--;
    setCurrentValue(currentValue);
    scoreMove(1);
    hearts--;
  }
  setHearts();
}

function endRound () {
  const choiceOne = document.getElementById("choice-one").children[0];
  choiceOne.hidden = true;
  const choiceTwo = document.getElementById("choice-two").children[0];
  choiceTwo.hidden = true;
  const choiceThree = document.getElementById("choice-three").children[0];
  choiceThree.hidden = true;
  const heartButton = document.getElementById("heart-button");
  heartButton.hidden = true;
  const continueButton = document.getElementById("next");
  continueButton.hidden = false;
}

function continueGame () {
  const continueButton = document.getElementById("next");
  const nextText = continueButton.innerText;
  if (nextText == "Game Over") {
    currentValue = startingValue;
    currentRound;
    choicesIndex = 0;
    score = 0;
    maxMoves = 9
    currentLevel = 1;
    highScore = 0;
    hearts = 3;
    continueButton.innerText = "Play Again";
    main();
  } else {
    continueButton.innerText = "Next";
    const choiceOne = document.getElementById("choice-one").children[0];
    choiceOne.hidden = false;
    const choiceTwo = document.getElementById("choice-two").children[0];
    choiceTwo.hidden = false;
    const choiceThree = document.getElementById("choice-three").children[0];
    choiceThree.hidden = false;
    continueButton.hidden = true;
    const heartButton = document.getElementById("heart-button");
    heartButton.hidden = false;
    const round = buildRound(startingValue, primeTarget, primes, maxMoves);
    currentRound = round;
    choicesIndex = 0;
    currentValue = startingValue;
    setShotsRemaining();
    setCurrentValue(startingValue);
    setChoices(currentRound[choicesIndex]);
    setCurrentLevel();
    setHearts();
  }
}

function main () {
  const round = buildRound(startingValue, primeTarget, primes, maxMoves);
  currentRound = round;
  setCurrentValue(startingValue);
  setTarget(primeTarget);
  setChoices(currentRound[choicesIndex]);
  setScore();
  setShotsRemaining();
  setCurrentLevel();
  setHearts();
}

main();