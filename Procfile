web: gunicorn --chdir backend app:app
release: cd backend && flask db migrate && flask db upgrade
