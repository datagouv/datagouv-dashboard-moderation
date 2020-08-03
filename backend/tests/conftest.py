import os
import tempfile

import pytest
import dataset
import requests_mock

from src import create_app


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
    app = create_app()
    app.testing = True

    return app


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def db():
    """Creates and configure a new DB instance for each test."""

    db_fd, db_path = tempfile.mkstemp()

    db = dataset.connect(f'sqlite:///{db_path}')

    yield db

    os.close(db_fd)
    os.unlink(db_path)


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
