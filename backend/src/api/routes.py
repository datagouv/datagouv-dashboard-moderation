import requests
from flask import jsonify, abort, request, session, make_response

from src import table
from src.api import bp


ME_URL = 'https://demo.data.gouv.fr/api/1/me/'


@bp.route("/submit-token", methods=['POST'])
def submit_token():
    data = request.get_json(force=True)
    token = data['token']

    r = requests.get(ME_URL, headers={'Authorization': f'Bearer {token}'})
    if r.status_code != 200:
        return make_response((r.json(), r.status_code))
    user_data = r.json()

    if not 'admin' in user_data['roles']:
        return make_response(('Not enough priviledges', 403))

    user = table.find_one(uid=user_data['id'])
    if user is None:
        table.insert(dict(
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            email=user_data['email'],
            uid=user_data['id']))

    session['user_id'] = user_data['id']
    return {'message': 'success'}
