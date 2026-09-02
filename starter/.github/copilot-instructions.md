# Copilot Instructions

## Stack
Flask backend (Python 3.11+), vanilla HTML/CSS/JS frontend, no build step.
Top 10 scoreboard lives in browser localStorage, not the backend.

## Style
- Python: PEP8, type hints, docstrings on non-trivial functions
- JS: ES6+, const/let, small pure functions
- Comment WHY not WHAT for non-obvious logic (esp. uniqueness checking)
- Never fail silently — return explicit error responses from Flask routes

## Structure
sudoku_logic.py   -> all game/puzzle logic, no Flask imports
app.py            -> routes only, thin, calls sudoku_logic
static/js/        -> board.js, timer.js, scoreboard.js, theme.js (separate files)
static/css/       -> base.css, board.css, theme.css, responsive.css
tests/            -> pytest, one file per module

## Testing
pytest + Flask test client. Every route needs a test. Puzzle generation
needs a test asserting exactly one solution per difficulty.