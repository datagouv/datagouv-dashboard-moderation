import os
import tempfile

import pytest


@pytest.fixture
def app():
    """Creates a new app instance."""
    app = create_app()

    return app


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def db():
    """Creates and configure a new DB instance for each test."""

    db_fd, db_path = tempfile.mkstemp()

    db = dataset.connect(db_path)
    table = db["mod_db"]

    yield table

    os.close(db_fd)
    os.unlink(db_path)
