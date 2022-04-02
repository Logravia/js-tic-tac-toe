let board = ( function () {
  const WIDTH = 3;
  const HEIGHT = 3;
  const EMPTY = undefined;

  const initState = () => {
    return Array(WIDTH).fill().map(_e => Array(HEIGHT).fill(EMPTY));
  }

  let state = initState();

  function putToken(x, y, token) { state[y][x] = token; }

  const win = () => {
    return _horizontalWin() || _verticalWin()
  }

  const tie = () => {
    return !unfinished() && !win();
  }

  const unfinished = () => {
    return !state.flat().every(sq => sq !== EMPTY);
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

  const _column = (arr, n) => arr.map(x => x[n]);

  const _verticalWin = () => {
    for (let i = 0; i < state.length; i++) {
      col = _column(state, i);
      if (_allEqual(col)){return true;}
    }
    return false;
  }

  return {state, win, tie, unfinished, putToken};
})();

board.state[0][0] = 1
board.state[0][1] = 2
board.state[0][2] = 1
board.state[1][0] = 1
board.state[2][0] = 1

console.log(board.state)
console.log(board.win())
