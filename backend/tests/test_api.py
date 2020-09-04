import requests_mock

from tests.conftest import RESPONSE_DICT, RESPONSE_DICT_NON_ADMIN


def test_submit_token(client, app):
    with requests_mock.Mocker() as m:
        m.get('https://demo.data.gouv.fr/api/1/me/', json=RESPONSE_DICT)
        response = client.post(
            '/api/submit-token',
            json={'token': 'oauth-fake-token'},
            headers={'content-type': 'application/json'}
            )
    assert response.status_code == 200
    assert 'Set-Cookie' in response.headers


def test_submit_token_non_admin(client, app):
    with requests_mock.Mocker() as m:
        m.get('https://demo.data.gouv.fr/api/1/me/', json=RESPONSE_DICT_NON_ADMIN)
        response = client.post(
            '/api/submit-token',
            json={'token': 'oauth-fake-token'},
            headers={'content-type': 'application/json'}
            )
    assert response.status_code == 403


def test_submit_object_as_read(client, app, auth):
    auth.login()
    response = client.post(
        '/api/objects',
        json={'uid': 'datasetfakeuid', 'read': True},
        headers={'content-type': 'application/json'}
        )
    assert response.status_code == 201


def test_get_non_existent_object(client, app, auth):
    auth.login()
    response = client.get(
        '/api/objects/dumdatasetuid4test',
        headers={'content-type': 'application/json'}
        )
    assert response.status_code == 404


def test_get_object(client, app, auth):
    auth.login()

    response = client.post(
        '/api/datasets',
        json={'uid': 'datasetfakeuid', 'read': True},
        headers={'content-type': 'application/json'}
        )
    assert response.status_code == 201

    response = client.get(
        '/api/datasets/datasetfakeuid',
        headers={'content-type': 'application/json'}
        )
    assert response.status_code == 200
    assert response.json['uid'] == 'datasetfakeuid'
    assert response.json['read'] == True
