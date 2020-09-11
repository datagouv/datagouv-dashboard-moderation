web: gunicorn --chdir backend app:app
release: cd backend && flask db init && flask db migrate && flask db upgrade
