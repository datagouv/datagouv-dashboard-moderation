web: gunicorn --chdir backend app:app
release: flask db init && flask db migrate && flask db upgrade
