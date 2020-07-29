import pytest
import requests_mock


RESPONSE_DICT = {
    "id": "6bc3675b6f5552333090",
    "email": "john.doe@data.gouv.fr",
    "first_name": "John",
    "last_name": "Doe",
    "roles": ["admin"]
}


RESPONSE_DICT_NON_ADMIN = {
    "id": "6bc3675b6f5552333090",
    "email": "john.doe@data.gouv.fr",
    "first_name": "John",
    "last_name": "Doe",
    "roles": []
}


def test_submit_token(client, app, db):
    with requests_mock.Mocker() as m:
        m.get('https://demo.data.gouv.fr/api/1/me/', json=RESPONSE_DICT)
        response = client.post(
            '/api/submit-token',
            json={'token': 'oauth-fake-token'},
            headers={'content-type': 'application/json'}
            )
    assert response.status_code == 200
    assert 'Set-Cookie' in response.headers


def test_submit_token_non_admin(client, app, db):
    with requests_mock.Mocker() as m:
        m.get('https://demo.data.gouv.fr/api/1/me/', json=RESPONSE_DICT_NON_ADMIN)
        response = client.post(
            '/api/submit-token',
            json={'token': 'oauth-fake-token'},
            headers={'content-type': 'application/json'}
            )
    assert response.status_code == 403
