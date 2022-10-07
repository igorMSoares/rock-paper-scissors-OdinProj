const getComputerChoice = () => {
  const options = ['rock', 'paper', 'scissors'];

  const choice = Math.round(Math.random() * 2);
  return options[choice];
};

const playRound = (playerChoice, computerChoice) => {
  const beatedBy = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
  };

  playerChoice = playerChoice.toLowerCase();
  computerChoice = computerChoice.toLowerCase();
  let result = '';

  if (beatedBy[playerChoice] === computerChoice) {
    result = `You Win! ${playerChoice} beats ${computerChoice}`;
  } else if (beatedBy[computerChoice] === playerChoice) {
    result = `You Lose! ${computerChoice} beats ${playerChoice}`;
  } else {
    result = `That's a tie! You both have chosen: ${playerChoice}`;
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

console.log(game());
