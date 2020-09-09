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


def test_submit_new_object(client, app, auth):
    auth.login()
    response = client.post(
        '/api/objects',
        json={
            'dgf_id': 'objectfakeuid',
            'read': True,
            'suspicious': False,
            'deleted': False,
            'dgf_type': 'dataset'
            },
        headers={'content-type': 'application/json'}
        )
    assert response.status_code == 201
    assert response.json['object_id'] == 1


def test_get_non_existent_object(client, app, auth):
    auth.login()
    response = client.get('/api/objects/dumobjectuid4test')
    assert response.status_code == 404


def test_get_object(client, app, auth):
    auth.login()

    response = client.post(
        '/api/objects',
        json={
            'dgf_id': 'objectfakeuid',
            'read': True,
            'suspicious': False,
            'deleted': False,
            'dgf_type': 'dataset'
            },
        headers={'content-type': 'application/json'}
        )
    object_id = response.json['object_id']
    assert response.status_code == 201
    assert object_id == 1

    response = client.get(f'/api/objects/{object_id}')
    assert response.status_code == 200
    assert response.json['dgf_id'] == 'objectfakeuid'
    assert response.json['read'] == True
    assert response.json['suspicious'] == False
    assert response.json['deleted'] == False
    assert response.json['dgf_type'] == 'dataset'


def test_update_object(client, app, auth):
    auth.login()

    response = client.post(
        '/api/objects',
        json={
            'dgf_id': 'objectfakeuid',
            'read': True,
            'suspicious': False,
            'deleted': False,
            'dgf_type': 'dataset'
            },
        headers={'content-type': 'application/json'}
        )
    object_id = response.json['object_id']
    assert response.status_code == 201
    assert object_id == 1

    response = client.put(
        f'/api/objects/{object_id}',
        json={
            'read': False,
            'suspicious': True,
            'deleted': True,
            },
        headers={'content-type': 'application/json'}
        )
    assert response.status_code == 200

    response = client.get(f'/api/objects/{object_id}')
    assert response.status_code == 200
    assert response.json['dgf_id'] == 'objectfakeuid'
    assert response.json['read'] == False
    assert response.json['suspicious'] == True
    assert response.json['deleted'] == True
    assert response.json['dgf_type'] == 'dataset'


def test_delete_object(client, app, auth):
    auth.login()

    response = client.post(
        '/api/objects',
        json={
            'dgf_id': 'objectfakeuid',
            'read': True,
            'suspicious': False,
            'deleted': False,
            'dgf_type': 'dataset'
            },
        headers={'content-type': 'application/json'}
        )
    object_id = response.json['object_id']
    assert response.status_code == 201
    assert object_id == 1

    response = client.delete(f'/api/objects/{object_id}')
    assert response.status_code == 200

    response = client.get(f'/api/objects/{object_id}')
    assert response.status_code == 404


def test_comment_object(client, app, auth):
    auth.login()

    response = client.post(
        '/api/objects',
        json={
            'dgf_id': 'objectfakeuid',
            'read': True,
            'suspicious': False,
            'deleted': False,
            'dgf_type': 'dataset'
            },
        headers={'content-type': 'application/json'}
        )
    object_id = response.json['object_id']
    assert response.status_code == 201
    assert object_id == 1

    response = client.post(
        f'/api/objects/{object_id}/comments',
        json={
            'content': 'fakecontent'
            },
        headers={'content-type': 'application/json'}
        )
    assert response.status_code == 201

    response = client.get(f'/api/objects/{object_id}')
    object_data = response.json
    assert object_data['dgf_id'] == 'objectfakeuid'
    assert object_data['read'] == True
    assert object_data['suspicious'] == False
    assert object_data['deleted'] == False
    assert object_data['dgf_type'] == 'dataset'
    assert len(object_data['comments']) == 1
    assert object_data['comments'][0]['content'] == 'fakecontent'


def test_delete_comment(client, app, auth):
    auth.login()

    response = client.post(
        '/api/objects',
        json={
            'dgf_id': 'objectfakeuid',
            'read': True,
            'suspicious': False,
            'deleted': False,
            'dgf_type': 'dataset'
            },
        headers={'content-type': 'application/json'}
        )
    object_id = response.json['object_id']
    assert response.status_code == 201
    assert object_id == 1

    response = client.post(
        f'/api/objects/{object_id}/comments',
        json={
            'content': 'fakecontent'
            },
        headers={'content-type': 'application/json'}
        )
    assert response.status_code == 201

    response = client.get(f'/api/objects/{object_id}')
    object_data = response.json
    assert object_data['dgf_id'] == 'objectfakeuid'
    assert len(object_data['comments']) == 1
    assert object_data['comments'][0]['content'] == 'fakecontent'

    comment_id = object_data['comments'][0]['id']

    response = client.delete(f'/api/objects/{object_id}/comments/{comment_id}')
    assert response.status_code == 200

    response = client.get(f'/api/objects/{object_id}')
    object_data = response.json
    assert object_data['dgf_id'] == 'objectfakeuid'
    assert len(object_data['comments']) == 0
