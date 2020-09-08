import pytest
import requests_mock

from src import create_app, db

from config import Testing


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


@pytest.fixture
def app():
    """Creates a new app instance."""
    app = create_app(config_class=Testing)
    with app.app_context():
        db.create_all()

    yield app

    with app.app_context():
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


class AuthActions(object):
    def __init__(self, client):
        self._client = client

    def login(self):
        with requests_mock.Mocker() as m:
            m.get('https://demo.data.gouv.fr/api/1/me/', json=RESPONSE_DICT)
            return self._client.post(
                '/api/submit-token',
                json={'token': 'oauth-fake-token'},
                headers={'content-type': 'application/json'}
                )


@pytest.fixture
def auth(client):
    return AuthActions(client)
