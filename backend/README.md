<br />
<p align="center">

  <h3 align="center">Backend du dashboard de modération pour data.gouv.fr</h3>

  <p align="center">
    <br />
    <a href="https://github.com/etalab/datagouv-dashboard-moderation/issues">Remonter un problème</a>
  </p>
</p>

### Dépendances

* [Python 3.7](https://www.python.org/downloads/release/python-370/)
* [Flask-migrate](https://github.com/miguelgrinberg/flask-migrate/)
* [Flask-sqlalchemy](https://github.com/pallets/flask-sqlalchemy)
* [Marshmallow](https://github.com/marshmallow-code/marshmallow)
* [Requests](https://github.com/psf/requests)
* [Requests-mock](https://github.com/jamielennox/requests-mock)
* [Pytest](https://github.com/pytest-dev/pytest/)

## Mise en place

### Installation

Installer les dépendances
```sh
python3 -m venv python_env
source python_env/bin/activate
pip install -r requirements.txt
```
Créer la base de données
```sh
flask db init
```
Générer les migrations
```sh
flask db migrate
```
Appliquer les migrations
```sh
flask db upgrade
```
Lancer le serveur de développement
```sh
export FLASK_APP=app.py
flask run
```
