def test_home_page(client):
    response = client.get('/')
    assert response.status_code == 200


def test_new_game_easy_returns_puzzle(client):
    response = client.get('/new?difficulty=easy')

    assert response.status_code == 200
    data = response.get_json()
    assert 'puzzle' in data
    assert len(data['puzzle']) == 9


def test_new_game_invalid_difficulty_returns_400(client):
    response = client.get('/new?difficulty=bogus')

    assert response.status_code == 400


def test_hint_returns_first_mismatch_for_zero_board(client):
    new_response = client.get('/new?difficulty=easy')
    assert new_response.status_code == 200

    board = [[0 for _ in range(9)] for _ in range(9)]
    hint_response = client.post('/hint', json={'board': board})

    assert hint_response.status_code == 200
    data = hint_response.get_json()
    assert set(data) >= {'row', 'col', 'value'}
    assert 0 <= data['row'] < 9
    assert 0 <= data['col'] < 9
    assert 1 <= data['value'] <= 9

