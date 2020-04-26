// Variable declaration
// Board initialization
var initializeBoard;
var stopGame = false;

// Player declaration
const Player = 'O';
const Com = 'X';

//maping the win combination
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
];

// pull all the cell/spot in variable
const cells = document.querySelectorAll('.cell');

// Start the game
startGame();

// Start game function, initialize a new board and clear all conditioning format
function startGame() {
  document.getElementById('window-message').style.display = 'none';
  document.getElementById('replay').style.display = 'none';
  initializeBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick);
    stopGame = false;
  }

  //make the game started randomly by player or com with 50% probability
  let random = Math.random();
  if (random < 0.5) {
    turn(bestSpot(), Com);
  }
}

//Turn click function so after player click computer will automatically chose the best spot and only allow select the empty spot
function turnClick(square) {
  if (typeof initializeBoard[square.target.id] == 'number') {
    turn(square.target.id, Player);
    if (!stopGame && !checkTie()) turn(bestSpot(), Com);
  } else {
    document.getElementById('window-message').style.display = 'block';
    document.getElementById('window-message').style.color = 'red';
    document.getElementById('close').style.display = 'block';
    document.getElementById('message').innerText = 'Select empty spot!';
    checkTie();
  }
}

//the turn function is mark the spot to the player and update the status of the board array also call check if there is a winner
function turn(squareId, player) {
  initializeBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(initializeBoard, player);
  if (gameWon) gameOver(gameWon);
}

// pull out all the empty spot
function emptySpot() {
  return initializeBoard.filter(s => typeof s == 'number');
}

// chose the empty spot base on the spot available randomly
function bestSpot() {
  let randPos = 0;
  let spot = emptySpot().length;
  do {
    randPos = Math.floor(Math.random() * 10);
  } while (randPos > spot - 1);
  return emptySpot()[randPos];
}

//check if there is a winner after turn
function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(el => plays.indexOf(el) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

// check if the game is tie
function checkTie() {
  if (emptySpot().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = 'blue';
      cells[i].removeEventListener('click', turnClick);
    }
    declareWinner('Tie!');
    return true;
  }
  return false;
}

//decide the winner
function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == Player ? 'green' : 'red';
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(gameWon.player == Player ? 'You win!' : 'You lose!');
}

//declare the winner and stop the game
function declareWinner(who) {
  document.getElementById('window-message').style.display = 'block';
  document.getElementById('window-message').style.color = 'black';
  document.getElementById('replay').style.display = 'block';
  document.getElementById('message').innerText = who;
  stopGame = true;
}

//hide message box
function hideMessage() {
  document.getElementById('window-message').style.display = 'none';
  document.getElementById('close').style.display = 'none';
}
