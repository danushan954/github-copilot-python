import copy

from sudoku_logic import count_solutions, generate_puzzle


def test_count_solutions_returns_unique_solution_without_mutating_input():
    board = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ]
    original = copy.deepcopy(board)

    assert count_solutions(board, limit=2) == 1
    assert count_solutions(board, limit=1) == 1
    assert board == original


def test_generate_puzzle_has_exactly_one_solution():
    puzzle, _ = generate_puzzle('easy')

    assert count_solutions(puzzle, limit=2) == 1
