# NOTE: rejected the first draft here — it had no early exit, so
# checking uniqueness on a near-empty board could take a long time,
# and it mutated the caller's board directly. This version copies
# the board and stops as soon as it finds 2 solutions, since we only
# need to know "is it exactly 1".


import copy
import random

SIZE = 9
EMPTY = 0
DIFFICULTY_CLUES = {
    'easy': 40,
    'medium': 32,
    'hard': 24,
}


def deep_copy(board):
    return copy.deepcopy(board)

def create_empty_board():
    return [[EMPTY for _ in range(SIZE)] for _ in range(SIZE)]

def is_safe(board, row, col, num):
    # Check row and column
    for x in range(SIZE):
        if board[row][x] == num or board[x][col] == num:
            return False
    # Check 3x3 box
    start_row = row - row % 3
    start_col = col - col % 3
    for i in range(3):
        for j in range(3):
            if board[start_row + i][start_col + j] == num:
                return False
    return True

def fill_board(board):
    for row in range(SIZE):
        for col in range(SIZE):
            if board[row][col] == EMPTY:
                possible = list(range(1, SIZE + 1))
                random.shuffle(possible)
                for candidate in possible:
                    if is_safe(board, row, col, candidate):
                        board[row][col] = candidate
                        if fill_board(board):
                            return True
                        board[row][col] = EMPTY
                return False
    return True

def remove_cells(board, clues):
    cells = [(r, c) for r in range(SIZE) for c in range(SIZE)]
    random.shuffle(cells)
    clues_remaining = SIZE * SIZE

    for row, col in cells:
        if clues_remaining <= clues:
            break

        backup = board[row][col]
        board[row][col] = EMPTY
        if count_solutions(board, limit=2) != 1:
            board[row][col] = backup
        else:
            clues_remaining -= 1


def count_solutions(board, limit=2):
    if limit <= 0:
        return 0

    working_board = deep_copy(board)
    solution_count = 0

    def backtrack():
        nonlocal solution_count

        if solution_count >= limit:
            return

        for row in range(SIZE):
            for col in range(SIZE):
                if working_board[row][col] == EMPTY:
                    for num in range(1, SIZE + 1):
                        if is_safe(working_board, row, col, num):
                            working_board[row][col] = num
                            backtrack()
                            working_board[row][col] = EMPTY

                            if solution_count >= limit:
                                return
                    return

        solution_count += 1

    backtrack()
    return solution_count


def generate_puzzle(difficulty='easy'):
    if difficulty not in DIFFICULTY_CLUES:
        raise ValueError(f"Invalid difficulty: {difficulty}. Expected one of {sorted(DIFFICULTY_CLUES)}")

    clues = DIFFICULTY_CLUES[difficulty]
    board = create_empty_board()
    fill_board(board)
    solution = deep_copy(board)
    remove_cells(board, clues)
    puzzle = deep_copy(board)
    return puzzle, solution

