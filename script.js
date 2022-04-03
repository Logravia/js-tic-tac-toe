let board = ( function () {
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
