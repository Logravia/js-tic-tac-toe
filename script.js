const buttons = (function () {
  const squareList = document.querySelectorAll(".square");
  const reset = document.querySelector(".reset");

  return {squares: squareList.values(), reset: reset}
})();

const board = ( function () {
  const WIDTH = 3;
  const HEIGHT = 3;
  const EMPTY = undefined;

  let curToken = 'O';

  const initState = () => {
    return Array(WIDTH).fill().map(_e => Array(HEIGHT).fill(EMPTY));
  }

  let state = initState();

  const reset = () => {
    state = initState();
  }

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
    // TODO: gather diagonals programatically on any n*m board
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

  const _column = (rows, n) => rows.map(row => row[n]);

  return {state, reset, WIDTH, HEIGHT, win, tie, finished, putToken};
})();

let display = ( function (board) {
  const btns = document.querySelectorAll(".square")

  const update = () => {
    btnsIterable = btns.values();

    for (let y = 0; y < board.HEIGHT; y++) {
      for (let x = 0 ; x < board.WIDTH; x++) {
        btn = btnsIterable.next().value
        btn.textContent = board.state[y][x];
     }
    }
  }

  return {update}
})(board);

const input = (function (display, board) {

  const _reactToClick = (e) => {
    let btn = e.target;
    let x = parseInt(btn.getAttribute("x"));
    let y = parseInt(btn.getAttribute("y"));

    board.putToken(x, y);
    display.update();
    btn.setAttribute("disabled", "true");
  }

  const _labelBtn = (btn, x, y) => {
    btn.setAttribute("x", x);
    btn.setAttribute("y", y)
  }

  // Each button gets labeled (linked to an element in board.state) and added an event listener
  const _processBtns = ()=> {
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
