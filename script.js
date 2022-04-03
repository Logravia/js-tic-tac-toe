// Holds references to buttons and button-squares
// Has methods allowing reset and locking of squares.
const buttons = (function () {
  const squareList = document.querySelectorAll(".square");
  const resetBtn = document.querySelector(".reset");

  const lockSqrs = () => {squareList.forEach(btn => btn.setAttribute("disabled", "true"))}
  const reset = () => {
    squareList.forEach(btn => btn.removeAttribute("disabled") );
  }
  return {squareList, resetBtn, reset, lockSqrs}
})();

// Contains the state of the board, e.g. where tokens have been put.
// Allows the placement of tokens,
// Allows to determine whether the game has been won, finished or ended in a tie.
const board = ( function () {
  const WIDTH = 3;
  const HEIGHT = 3;
  const EMPTY = undefined;

  let curToken = 'O';

  const initState = () => {
    return Array(WIDTH).fill().map(_e => Array(HEIGHT).fill(EMPTY));
  }

  const reset = () => {
    state.forEach(row => row.fill(EMPTY));
  }

  let state = initState();

  const putToken = (x, y) => {
    curToken = curToken == "X" ? "O" : "X";
    state[y][x] = curToken;
  }

  const win = () => {
    return _horizontalWin() || _verticalWin() || _diagonalWin();
  }

  const tie = () => {
    return finished() && !win();
  }

  const finished = () => {
    return state.flat().every(sq => sq !== EMPTY);
  }

  const _allEqual = (row) => {
    return row.every(sq => sq === row[0] && sq !== EMPTY)
  }

  const _horizontalWin = (board = state) => {
    for (row of board) {
      if (_allEqual(row)) {return true;}
    }
    return false;
  }

  const _verticalWin = () => {
    for (let i = 0; i < state.length; i++) {
      col = _column(state, i);
      if (_allEqual(col)){return true;}
    }
    return false;
  }

  const _diagonalWin = () => {
    diagonals = [
      [state[0][0],
      state[1][1],
      state[2][2]],
      [state[0][2],
      state[1][1],
      state[2][0]]
    ]
    return _horizontalWin(diagonals);
  }

  // returns nth column from a 2D array.
  const _column = (rows, n) => rows.map(row => row[n]);

  return {state, reset, WIDTH, HEIGHT, win, tie, finished, putToken};
})();

// Sets the value of squares by reading the state of the board.
// Sets victory, tie messages to the page.
const display = ( function (board) {
  const btns = document.querySelectorAll(".square")

  const update = () => {
    btnsIterable = btns.values();

    for (let y = 0; y < board.HEIGHT; y++) {
      for (let x = 0 ; x < board.WIDTH; x++) {
        let btn = btnsIterable.next().value
        btn.textContent = board.state[y][x];
     }
    }
  }

  const victoryMsg = () => {
    console.log("Win!");
  }

  const tieMsg = () => {
    console.log("Tie!");
  }

  return {update, victoryMsg, tieMsg}
})(board);

// Deals with resetting the game, ordering display to put up messages on win or tie.
const game = (function(board, display, buttons) {
  const reset = () => {
    board.reset();
    buttons.reset();
    display.update();
  }

  const checkState = () => {
    if (board.win()) { display.victoryMsg(); buttons.lockSqrs(); }
    if (board.tie()) { display.tieMsg() }
  }

  return {reset, checkState}
})(board, display, buttons);

// Sets up button connection the state of the board.
// Informs other objects of button clicks e.g. informs game that reset button has been pressed.
// Or board that square button at x,y has been pressed.
const input = (function (display, board, game) {

  // What to do when player clicks on a square
  const _tokenPlacement = (e) => {
    let btn = e.target;
    let x = parseInt(btn.getAttribute("x"));
    let y = parseInt(btn.getAttribute("y"));

    board.putToken(x, y);
    display.update();
    game.checkState();
    btn.setAttribute("disabled", "true");
  }

  // To identify which button has been pressed
  const _labelBtn = (btn, x, y) => {
    btn.setAttribute("x", x);
    btn.setAttribute("y", y)
  }

  const _setUpResetBtn = () => {
    resetBtn = document.querySelector(".reset");
    resetBtn.addEventListener("click", game.reset);
  }

  // Each button gets labeled and assigned an event listener
  const _processSqrBtns = ()=> {
    let btns = document.querySelectorAll(".square").values();

    // Each button corresponds to an element in board[y][x]
    for (let y = 0; y < board.HEIGHT; y++) {
      for (let x = 0 ; x < board.WIDTH; x++) {
       btn = btns.next().value;
       _labelBtn(btn, x, y);
       btn.addEventListener("click", _tokenPlacement);
     }
    }
  }

  _processSqrBtns();
  _setUpResetBtn();

})(display, board, game);

const Player = (name) => {
  let score = 0;
  return {name, score}
}
