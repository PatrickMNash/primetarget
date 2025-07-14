const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23];
const primeTarget = 47;
const startingValue = 86;
let currentValue = startingValue;
let currentRound;
let choicesIndex = 0;
let score = 0;
let maxMoves = 9
let currentLevel = 1;
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
  const pad2 = document.getElementById("pad-2");
  pad2.innerText = value;
}

function setTarget (value) {
  const pad8 = document.getElementById("pad-8");
  pad8.innerText = value;
}

function setChoices (choices) {
  const pad4Button = document.getElementById("pad-4").children[0];
  pad4Button.innerText = choices[0];
  pad4Button.onclick = () => applyPrime(choices[0]);
  const pad5Button = document.getElementById("pad-5").children[0];
  pad5Button.innerText = choices[1];
  pad5Button.onclick = () => applyPrime(choices[1]);
  const pad6Button = document.getElementById("pad-6").children[0];
  pad6Button.innerText = choices[2];
  pad6Button.onclick = () => applyPrime(choices[2]);
}

function setScore () {
  const pad3 = document.getElementById("pad-3");
  pad3.innerText = score;
}

function setCurrentLevel () {
  const pad7 = document.getElementById("pad-7");
  pad7.innerText = currentLevel;
}

function setShotsRemaining () {
  const pad1 = document.getElementById("pad-1");
  pad1.innerText = currentRound.length - choicesIndex;
}

function setHearts () {
  const pad9Button = document.getElementById("pad-9").children[0];
  pad9Button.innerText = hearts;
  pad9Button.onclick = () => applyHeart();
}

function applyPrime (value) {
  currentValue = currentValue - value;
  setCurrentValue(currentValue);
  choicesIndex++;
  setShotsRemaining();
  if (choicesIndex < currentRound.length) {
    setChoices(currentRound[choicesIndex]);
  }
  scoreMove(value);
}

function scoreMove (value) {
  if (currentValue > primeTarget && choicesIndex < currentRound.length) {
    score = score + value;
  } else if (currentValue == primeTarget) {
    score = score + value + primeTarget + currentLevel;
    if (maxMoves > 3) {
      maxMoves--;
    }
    currentLevel++;
    hearts++;
    endRound();
  }
  else {
    score = score - value - (startingValue - currentValue) - currentLevel;
    if (hearts > 0) {
      hearts = hearts - (Math.floor(currentLevel / 7) + 1);
      if (hearts < 0) {
        hearts = 0;
      }
    } else if (hearts == 0) {
      hearts--;
    }
    endRound();
  }
  setScore();
}

function applyHeart () {
  if (hearts > 0) {
    hearts--;
    setHearts();
    currentValue--;
    setCurrentValue(currentValue);
    scoreMove(1);
  }
}

function endRound () {
  hideChoices();
  const pad9Button = document.getElementById("pad-9").children[0];
  pad9Button.innerText = "Next";
  pad9Button.onclick = () => next();
  if (hearts < 0) {
    pad9Button.innerText = "Game Over";
    pad9Button.onclick = () => {
      pad9Button.innerText = "Play Again";
      pad9Button.onclick = () => initGame();
    };
  }
}

function showChoices () {
  const pad4Button = document.getElementById("pad-4").children[0];
  pad4Button.style.visibility = "visible";
  document.getElementById("pad-4").className = "pad red";
  const pad5Button = document.getElementById("pad-5").children[0];
  pad5Button.style.visibility = "visible";
  document.getElementById("pad-5").className = "pad yellow";
  const pad6Button = document.getElementById("pad-6").children[0];
  pad6Button.style.visibility = "visible";
  document.getElementById("pad-6").className = "pad red";
}

function hideChoices () {
  const pad4Button = document.getElementById("pad-4").children[0];
  pad4Button.style.visibility = "hidden";
  document.getElementById("pad-4").className = "pad green";
  const pad5Button = document.getElementById("pad-5").children[0];
  pad5Button.style.visibility = "hidden";
  document.getElementById("pad-5").className = "pad green";
  const pad6Button = document.getElementById("pad-6").children[0];
  pad6Button.style.visibility = "hidden";
  document.getElementById("pad-6").className = "pad green";
}

function next () {
  initRound();
}

function initRound () {
  showChoices();
  currentRound = buildRound(startingValue, primeTarget, primes, maxMoves);
  currentValue = startingValue;
  setCurrentValue(startingValue);
  choicesIndex = 0;
  setChoices(currentRound[choicesIndex]);
  setShotsRemaining();
  setCurrentLevel();
  setHearts();
}

function initGame () {
  hearts = 3;
  maxMoves = 9;
  initRound();
  score = 0;
  setScore();
  currentLevel = 1;
  setCurrentLevel();
  setTarget(primeTarget);
}

function main () {
  initGame();
}

window.onload = () => main();