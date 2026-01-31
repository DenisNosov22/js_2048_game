'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    this.initialState = this._cloneState(
      initialState || this._createEmptyState(),
    );
    this.state = this._cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this._move('left');
  }

  moveRight() {
    this._move('right');
  }

  moveUp() {
    this._move('up');
  }

  moveDown() {
    this._move('down');
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this._cloneState(this.state);
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this._addRandomTile();
    this._addRandomTile();
    this._updateStatus();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this._cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  _createEmptyState() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  _cloneState(state) {
    return state.map((row) => [...row]);
  }

  _getEmptyCells(state) {
    const empty = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!state[row][col]) {
          empty.push([row, col]);
        }
      }
    }

    return empty;
  }

  _addRandomTile() {
    const empty = this._getEmptyCells(this.state);

    if (!empty.length) {
      return false;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.state[row][col] = value;

    return true;
  }

  _mergeLine(line) {
    const nonZero = line.filter(Boolean);
    const result = [];
    let scoreGain = 0;

    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        const merged = nonZero[i] * 2;

        result.push(merged);
        scoreGain += merged;
        i += 1;
      } else {
        result.push(nonZero[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return { line: result, scoreGain };
  }

  _statesEqual(stateA, stateB) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (stateA[row][col] !== stateB[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  _move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this._cloneState(this.state);
    let totalScoreGain = 0;

    if (direction === 'left' || direction === 'right') {
      for (let row = 0; row < 4; row++) {
        const current = [...this.state[row]];
        const line = direction === 'right' ? current.reverse() : current;
        const { line: merged, scoreGain } = this._mergeLine(line);
        const finalLine = direction === 'right' ? merged.reverse() : merged;

        this.state[row] = finalLine;
        totalScoreGain += scoreGain;
      }
    } else {
      for (let col = 0; col < 4; col++) {
        const current = [];

        for (let row = 0; row < 4; row++) {
          current.push(this.state[row][col]);
        }

        const line = direction === 'down' ? current.reverse() : current;
        const { line: merged, scoreGain } = this._mergeLine(line);
        const finalLine = direction === 'down' ? merged.reverse() : merged;

        for (let row = 0; row < 4; row++) {
          this.state[row][col] = finalLine[row];
        }

        totalScoreGain += scoreGain;
      }
    }

    if (this._statesEqual(prevState, this.state)) {
      this._updateStatus();

      return;
    }

    this.score += totalScoreGain;
    this._addRandomTile();
    this._updateStatus();
  }

  _hasAvailableMoves() {
    if (this._getEmptyCells(this.state).length) {
      return true;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = this.state[row][col];

        if (row < 3 && this.state[row + 1][col] === value) {
          return true;
        }

        if (col < 3 && this.state[row][col + 1] === value) {
          return true;
        }
      }
    }

    return false;
  }

  _updateStatus() {
    if (this.state.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (!this._hasAvailableMoves()) {
      this.status = 'lose';

      return;
    }

    this.status = 'playing';
  }

  // Add your own methods here
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Game;
} else if (typeof window !== 'undefined') {
  window.Game = Game;
}
