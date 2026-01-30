'use strict';

/* global Game */

const game = new Game();

const cells = Array.from(document.querySelectorAll('.field-cell'));
const scoreEl = document.querySelector('.game-score');
const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const valueClassPrefix = 'field-cell--';
let hasMoved = false;

const statesEqual = (stateA, stateB) => {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (stateA[row][col] !== stateB[row][col]) {
        return false;
      }
    }
  }

  return true;
};

const renderBoard = () => {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value ? String(value) : '';

    Array.from(cell.classList)
      .filter((className) => className.startsWith(valueClassPrefix))
      .forEach((className) => cell.classList.remove(className));

    if (value) {
      cell.classList.add(`${valueClassPrefix}${value}`);
    }
  });

  scoreEl.textContent = game.getScore() ? String(game.getScore()) : '';
};

const showStatusMessage = () => {
  const gameStatus = game.getStatus();

  messageStart.classList.toggle('hidden', gameStatus !== 'idle');
  messageWin.classList.toggle('hidden', gameStatus !== 'win');
  messageLose.classList.toggle('hidden', gameStatus !== 'lose');
};

const setButtonToStart = () => {
  button.classList.remove('restart');
  button.classList.add('start');
  button.textContent = 'Start';
};

const setButtonToRestart = () => {
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
};

const handleMove = (direction) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const beforeMove = game.getState();

  if (direction === 'left') {
    game.moveLeft();
  }

  if (direction === 'right') {
    game.moveRight();
  }

  if (direction === 'up') {
    game.moveUp();
  }

  if (direction === 'down') {
    game.moveDown();
  }

  const afterMove = game.getState();

  if (!hasMoved && !statesEqual(beforeMove, afterMove)) {
    hasMoved = true;
    setButtonToRestart();
  }

  renderBoard();
  showStatusMessage();
};

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    hasMoved = false;
  } else {
    game.restart();
    hasMoved = false;
    setButtonToStart();
  }

  renderBoard();
  showStatusMessage();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    handleMove('left');
  }

  if (e.key === 'ArrowRight') {
    handleMove('right');
  }

  if (e.key === 'ArrowUp') {
    handleMove('up');
  }

  if (e.key === 'ArrowDown') {
    handleMove('down');
  }
});

renderBoard();
showStatusMessage();
