// Board rendering, cell input, New Game, and Check Solution logic.
// Timer, scoreboard, and theme concerns live in their own files
// (timer.js, scoreboard.js, theme.js) so this file stays focused on
// the board itself.

const SIZE = 9;
let puzzle = [];
let hintsUsed = 0;
function createBoardElement() {
  const boardDiv = document.getElementById('sudoku-board');
  boardDiv.innerHTML = '';
  for (let i = 0; i < SIZE; i++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'sudoku-row';
    for (let j = 0; j < SIZE; j++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.className = 'sudoku-cell';
      input.dataset.row = i;
      input.dataset.col = j;
      input.dataset.box = Math.floor(i / 3) * 3 + Math.floor(j / 3); 
      input.addEventListener('input', (e) => {
        const val = e.target.value.replace(/[^1-9]/g, '');
        e.target.value = val;
        e.target.classList.toggle('filled', val !== '');
      });
      rowDiv.appendChild(input);
    }
    boardDiv.appendChild(rowDiv);
  }
}

function renderPuzzle(puz) {
  puzzle = puz;
  createBoardElement();
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = puzzle[i][j];
      const inp = inputs[idx];
      if (val !== 0) {
        inp.value = val;
        inp.disabled = true;
        inp.classList.add('prefilled');
        inp.classList.add('filled');
      } else {
        inp.value = '';
        inp.disabled = false;
        inp.classList.remove('prefilled');
        inp.classList.remove('filled');
      }
    }
  }
}

async function newGame() {
  const difficulty = document.getElementById('difficulty').value;
  const res = await fetch(`/new?difficulty=${difficulty}`);
  const data = await res.json();
  renderPuzzle(data.puzzle);
  document.getElementById('message').innerText = '';
  hintsUsed = 0;
  // Hook for timer.js (Phase 7) — no-op until that file defines it.
  if (typeof resetTimer === 'function') resetTimer();
  if (typeof startTimer === 'function') startTimer();
}

function getCurrentBoard() {
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  const board = [];
  for (let i = 0; i < SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < SIZE; j++) {
      const idx = i * SIZE + j;
      const val = inputs[idx].value;
      board[i][j] = val ? parseInt(val, 10) : 0;
    }
  }
  return board;
}

async function checkSolution() {
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  const board = getCurrentBoard();
  const res = await fetch('/check', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({board})
  });
  const data = await res.json();
  const msg = document.getElementById('message');
  if (data.error) {
    msg.style.color = '#d32f2f';
    msg.innerText = data.error;
    return;
  }
  const incorrect = new Set(data.incorrect.map(x => x[0]*SIZE + x[1]));
  for (let idx = 0; idx < inputs.length; idx++) {
    const inp = inputs[idx];
    if (inp.disabled) continue;
    inp.className = 'sudoku-cell';
    if (incorrect.has(idx)) {
      inp.className = 'sudoku-cell incorrect';
    }
  }
  if (incorrect.size === 0) {
    msg.style.color = '#388e3c';
    msg.innerText = 'Congratulations! You solved it!';

    // Hooks for timer.js / scoreboard.js — no-ops until those files
    // define them.
    if (typeof stopTimer === 'function') stopTimer();
    if (typeof addScore === 'function') {
      const name = prompt('New score! Enter your name:', 'Player');
      if (name) {
        addScore({
          name,
          time: typeof getElapsedFormatted === 'function'
          ? getElapsedFormatted()
          : '',
          difficulty: document.getElementById('difficulty').value,
          hints: hintsUsed,
        });
      }
    }
  } else {
    msg.style.color = '#d32f2f';
    msg.innerText = 'Some cells are incorrect.';
  }
}

async function useHint() {
  const boardDiv = document.getElementById('sudoku-board');
  const inputs = boardDiv.getElementsByTagName('input');
  const board = getCurrentBoard();

  const res = await fetch('/hint', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({board})
  });
  const data = await res.json();

  if (data.error) {
    const msg = document.getElementById('message');
    msg.style.color = '#d32f2f';
    msg.innerText = data.error;
    return;
  }

  const idx = data.row * SIZE + data.col;
  const inp = inputs[idx];
  inp.value = data.value;
  inp.disabled = true;
  inp.className = 'sudoku-cell prefilled hinted filled';
  hintsUsed += 1;
}

// Wire buttons
window.addEventListener('load', () => {
  document.getElementById('new-game').addEventListener('click', newGame);
  document.getElementById('check-solution').addEventListener('click', checkSolution);
  document.getElementById('hint-btn').addEventListener('click', useHint);
  // initialize
  newGame();
});
