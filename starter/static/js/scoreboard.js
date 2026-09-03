const SCOREBOARD_KEY = 'sudoku_top10';

function parseTimeToSeconds(timeString) {
  if (typeof timeString !== 'string') return Number.MAX_SAFE_INTEGER;
  const [minutes, seconds] = timeString.split(':').map(Number);
  if (Number.isNaN(minutes) || Number.isNaN(seconds)) {
    return Number.MAX_SAFE_INTEGER;
  }
  return minutes * 60 + seconds;
}

function getScores() {
  try {
    const raw = localStorage.getItem(SCOREBOARD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (error) {
    return [];
  }
}

function addScore(entry) {
  const scores = getScores();
  scores.push(entry);
  scores.sort((a, b) => parseTimeToSeconds(a.time) - parseTimeToSeconds(b.time));
  const topScores = scores.slice(0, 10);
  localStorage.setItem(SCOREBOARD_KEY, JSON.stringify(topScores));
  renderScoreboard();
}

function renderScoreboard() {
  const scores = getScores();
  const rows = document.getElementById('scoreboard-body');
  if (!rows) return;

  rows.innerHTML = '';

  scores.forEach((entry, index) => {
    const row = document.createElement('tr');

    const rank = document.createElement('td');
    const name = document.createElement('td');
    const time = document.createElement('td');
    const difficulty = document.createElement('td');
    const hints = document.createElement('td');

    rank.dataset.label = 'Rank';
    name.dataset.label = 'Name';
    time.dataset.label = 'Time';
    difficulty.dataset.label = 'Level';
    hints.dataset.label = 'Hints';

    rank.textContent = String(index + 1);
    name.textContent = entry.name || 'Player';
    time.textContent = entry.time || '00:00';
    difficulty.textContent = entry.difficulty || 'medium';
    hints.textContent = entry.hints ?? 0;

    row.appendChild(rank);
    row.appendChild(name);
    row.appendChild(time);
    row.appendChild(difficulty);
    row.appendChild(hints);

    rows.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', renderScoreboard);
