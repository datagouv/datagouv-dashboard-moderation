import os
import tempfile

import pytest
import dataset

from src import create_app


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
    table = db["mod_db"]

    yield table

    os.close(db_fd)
    os.unlink(db_path)
