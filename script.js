// Holds references and utility methods relating to game elements such the squares where tokens can be placed,
// Reset button, input element values etc
const gameElements = (function () {
  const squareList = document.querySelectorAll(".square");
  const resetBtn = document.querySelector(".reset");
  const title = document.querySelector(".title");
  const playerNames = () => {
    let p1Name = document.querySelector("#p1").value
    let p2Name = document.querySelector("#p2").value
    return {"X": p1Name, "O": p2Name}
  }

  const lockSqrs = () => {squareList.forEach(btn => btn.setAttribute("disabled", "true"))}
  const resetSqrs = () => {
    squareList.forEach(btn => btn.removeAttribute("disabled"));
  }
  return {squareList, resetBtn, resetSqrs, lockSqrs, playerNames, title}
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
    curToken = 'O';
  }

  const getCurToken = () => curToken;

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

  return {state, reset, WIDTH, HEIGHT, win, tie, finished, putToken, getCurToken};
})();

// Sets the value of squares by reading the state of the board.
// Sets victory, tie messages to the page.
const display = ( function (board, inputElements) {
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

  const setMsg = (text) => {
    inputElements.title.textContent = text;
  }

  const victoryMsg = () => {
    playerName = inputElements.playerNames()[board.getCurToken()];
    setMsg(playerName + " won!")
  }

  const tieMsg = () => {
    setMsg("Tie")
  }

  const reset = () => {
    update();
    setMsg("Tic-Tac-Toe")
  }

  return {update, victoryMsg, tieMsg, reset}
})(board, gameElements);

// Deals with resetting the game, ordering display to put up messages on win or tie.
const game = (function(board, display, gameElements) {
  const reset = () => {
    board.reset();
    gameElements.resetSqrs();
    display.reset();
  }

  const checkState = () => {
    if (board.win()) { display.victoryMsg(); gameElements.lockSqrs(); }
    if (board.tie()) { display.tieMsg() }
  }

  return {reset, checkState}
})(board, display, gameElements);

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
