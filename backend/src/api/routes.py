import requests
from marshmallow import Schema, fields, ValidationError
from flask import jsonify, abort, request, session, make_response

from src import db
from src.api import bp
from src.api.auth import login_required


ME_URL = 'https://demo.data.gouv.fr/api/1/me/'


class LoginSchema(Schema):
    token = fields.Str(required=True)


class DatasetSchema(Schema):
    uid = fields.Str(required=True)
    read = fields.Boolean()


@bp.route('/submit-token', methods=['POST'])
def submit_token():
    data = request.get_json(force=True) or {}

    errors = LoginSchema().validate(data)
    if errors:
        return make_response((errors, 400))
    token = data['token']

    r = requests.get(ME_URL, headers={'Authorization': f'Bearer {token}'})
    if r.status_code != 200:
        return make_response((r.json(), r.status_code))
    user_data = r.json()

    if not 'admin' in user_data['roles']:
        return make_response(('Not enough priviledges', 403))

    user = db["users"].find_one(uid=user_data['id'])
    if user is None:
        db["users"].insert(dict(
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            email=user_data['email'],
            uid=user_data['id']))

    session['user_id'] = user_data['id']
    return {'message': 'success'}


@bp.route('/datasets', methods=['POST'])
@login_required
def mark_as_read(user):
    data = request.get_json(force=True) or {}
    try:
        dataset = DatasetSchema().load(data)
    except ValidationError as err:
        return make_response((err.message, 400))
    db["datasets"].insert(dataset)
    return make_response(('success', 201))


@bp.route('/datasets/<dataset_id>', methods=['GET'])
@login_required
def get_dataset(user, dataset_id):
    dataset = db["datasets"].find_one(uid=dataset_id)
    if dataset is None:
        return make_response(('Dataset not found', 404))
    schema = DatasetSchema()
    result = schema.dump(dataset)
    return make_response((result, 200))
