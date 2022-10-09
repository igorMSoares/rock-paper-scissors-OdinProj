/** Creates an array with n times (10 by default) each option, in random order */
const shuffleOptions = (n = 10) => {
  const options = ['Rock', 'Paper', 'Scissors'];
  let temp = [...options];
  const shuffled = [];
  let idx = -1;

  for (let i = 0; i < 3 * n; i++) {
    idx = Math.round(Math.random() * (temp.length - 1));
    shuffled[i] = temp[idx];
    temp.splice(idx, 1);

    if (temp.length === 0) temp = [...options];
  }

  return shuffled;
};

/** Generates and memoizes the shuffled options
 * returns a function which will choose a random option from the shuffled array
 */
const chooseFromShuffled = () => {
  const options = shuffleOptions();

  return () => {
    const choice = Math.round(Math.random() * (options.length - 1));

    return options[choice];
  };
};

const getComputerChoice = chooseFromShuffled();

const playRound = (playerChoice, computerChoice) => {
  const beatedBy = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
  };

  let result = { playerChoice, computerChoice, msg: '' };

  const lowerCaseCompChoice = computerChoice.toLowerCase();
  const lowerCasePlayerChoice = playerChoice.toLowerCase();
  if (beatedBy[lowerCasePlayerChoice] === lowerCaseCompChoice) {
    result.msg = `You Win! ${playerChoice} beats ${computerChoice}`;
  } else if (beatedBy[lowerCaseCompChoice] === lowerCasePlayerChoice) {
    result.msg = `You Lose! ${computerChoice} beats ${playerChoice}`;
  } else {
    result.msg = `It's a tie! You both have chosen ${playerChoice}`;
  }

  return result;
};

const getPlayerChoice = () => {
  const validChoices = {
    rock: true,
    paper: true,
    scissors: true,
  };
  let playerChoice = prompt('Choose your move:').toLowerCase();
  while (!(playerChoice in validChoices)) {
    playerChoice = prompt(
      'Invalid option.\nChoose rock, paper or scissors:'
    ).toLowerCase();
  }

  return playerChoice;
};

const game = () => {
  const score = {
    player: 0,
    computer: 0,
  };
  let result = undefined;
  let playerChoice = undefined;
  let computerChoice = undefined;

  for (let i = 1; i <= 5; i++) {
    playerChoice = getPlayerChoice();
    computerChoice = getComputerChoice();
    result = playRound(playerChoice, computerChoice);

    if (result.match(/win/i)) {
      score.player++;
    } else if (result.match(/lose/i)) {
      score.computer++;
    }

    console.log(result);
  }

  return score;
};

const emphasizePlayerButtons = () => {
  const playerBtns = document.querySelectorAll('.player-btn');

  window.setTimeout(() => {
    let count = 300;
    playerBtns.forEach(btn => {
      btn.classList.add('btn-hover');

      window.setTimeout(() => {
        btn.classList.remove('btn-hover');
      }, 600 + count);
      count *= 2;
    });
  }, 1500);
};

const renderInstructions = () => {
  emphasizePlayerButtons();

  const instructionsArea = document.getElementById('instructions');
  window.setTimeout(() => {
    instructionsArea.classList.add('collapse');
    window.setTimeout(
      () => instructionsArea.setAttribute('style', 'display: none'),
      250
    );
  }, 3800);
};

const handleNameInput = () => {
  const nameInput = document.querySelector('#player-name-input');
  const playerName = nameInput.value;

  if (!playerName) {
    nameInput.classList.add('blink');
    window.setTimeout(() => {
      nameInput.setAttribute('placeholder', '');
    }, 200);

    window.setTimeout(() => {
      nameInput.classList.remove('blink');
      nameInput.setAttribute('placeholder', 'Type in your name');
    }, 400);
  } else {
    document.querySelectorAll('.player-name').forEach(el => {
      el.textContent = playerName;
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    document.querySelector('#welcome').classList.toggle('hidden');
    hiddenElements.forEach(el => el.classList.toggle('hidden'));

    renderInstructions();
  }
};

const initNameInputHandlers = () => {
  document
    .querySelector('#player-name-input')
    .addEventListener('change', handleNameInput);
  document.querySelector('#start').addEventListener('click', handleNameInput);
};

const printToConsole = (msg, type = 'play') => {
  const console = document.querySelector('#console');
  console.innerHTML = '';

  if (type === 'play') {
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    const parsedMsg = msg.match(/^(.+!)\s(.+)$/);
    p1.innerText = parsedMsg[1];
    p2.innerText = parsedMsg[2];

    console.appendChild(p1).appendChild(p2);
  } else if (type === 'msg') {
    const p = document.createElement('p');
    p.innerText = msg;
    console.appendChild(p);
  }
};

const getImagePath = (bgColor, choice) =>
  `./public/imgs/${choice.toLowerCase()}-${bgColor[0]}.png`;

const resetButtons = () => {
  const setBlueBackground = btn => {
    let src = btn.getAttribute('src');
    if (!/.+-b\.png$/.test(src)) {
      btn.setAttribute('src', src.replace(/-[rg]\./, '-b.'));
    }
  };

  document
    .querySelectorAll('.player-btn')
    .forEach(btn => setBlueBackground(btn));

  document
    .querySelectorAll('#computer-buttons img')
    .forEach(btn => setBlueBackground(btn));
};

const maxScore = (n = 5) => {
  const max = n;

  return () => max;
};

let getMaxScore = maxScore();

const resetScore = () => {
  document.getElementById('player-header').classList = '';
  document.getElementById('computer-header').classList = '';
  document.querySelectorAll('.total-score').forEach(e => (e.innerText = '0'));
};

const playAgain = () => {
  const continueArea = document.getElementById('play-again');
  continueArea.setAttribute('class', 'collapse');
  window.setTimeout(() => {
    continueArea.setAttribute('style', 'display: none');
  }, 200);

  resetScore();
  resetButtons();
  initPlayerButtonsHandlers();
  printToConsole("Let's go! Rock, Paper or Scissors?");
};

const endGame = player => {
  const playerName = player === 'computer' ? 'Computer' : 'You';
  printToConsole(`${playerName} won the game!`, 'msg');

  const continueArea = document.getElementById('play-again');
  continueArea.setAttribute('class', 'expand');
  window.setTimeout(() => {
    continueArea.removeAttribute('style');
  }, 500);

  document
    .getElementById('play-again-btn')
    .addEventListener('click', playAgain);
};

const incrementScore = player => {
  const adversary = {
    player: 'computer',
    computer: 'player',
  };

  let playerScore = document.querySelector(`#${player}-header .total-score`);
  playerScore.innerText = parseInt(playerScore.innerText) + 1;
  playerScore = parseInt(playerScore.innerText);

  const adversaryScore = parseInt(
    document.querySelector(`#${adversary[player]}-header .total-score`)
      .innerText
  );

  const playerHeader = document.querySelector(`#${player}-header`);
  const adversaryHeader = document.querySelector(
    `#${adversary[player]}-header`
  );

  if (playerScore > adversaryScore) {
    playerHeader.setAttribute('class', 'green-font');
    adversaryHeader.setAttribute('class', 'red-font');
  } else if (adversaryScore > playerScore) {
    adversaryHeader.setAttribute('class', 'green-font');
    playerHeader.setAttribute('class', 'red-font');
  } else {
    playerHeader.setAttribute('class', 'blue-font');
    adversaryHeader.setAttribute('class', 'blue-font');
  }

  if (playerScore === getMaxScore()) {
    document.querySelectorAll('.player-btn').forEach(btn => {
      btn.removeEventListener('click', handlePlayerBtnClick);
    });

    window.setTimeout(() => endGame(player), 2000);
  }
};

const changeImage = (player, color, choice) => {
  let element;
  if (player === 'player') {
    element = document.querySelector(`#${choice}`);
  } else if (player === 'computer') {
    element = document.querySelector(`#computer-buttons img[alt="${choice}"]`);
  }

  element.setAttribute('src', getImagePath(color, choice));
};

const handleWin = round => {
  incrementScore('player');
  changeImage('player', 'green', round.playerChoice);
  changeImage('computer', 'red', round.computerChoice);
};

const handleLose = round => {
  incrementScore('computer');
  changeImage('player', 'red', round.playerChoice);
  changeImage('computer', 'green', round.computerChoice);
};

const handleTie = round => {
  changeImage('player', 'red', round.playerChoice);
  changeImage('computer', 'red', round.computerChoice);
};

const handlePlayerBtnClick = event => {
  const playerChoice = event.target.id;
  const computerChoice = getComputerChoice();
  const round = playRound(playerChoice, computerChoice);

  const result = round.msg.match(/(win|lose|tie)/i)[0].toLowerCase();

  const resultHandlers = {
    win: handleWin,
    lose: handleLose,
    tie: handleTie,
  };

  printToConsole(round.msg);
  resetButtons();
  resultHandlers[result](round);
};

const initPlayerButtonsHandlers = () => {
  document.querySelectorAll('.player-btn').forEach(btn => {
    btn.addEventListener('click', handlePlayerBtnClick);
  });
};

const start = () => {
  initNameInputHandlers();
  initPlayerButtonsHandlers();
};

start();
