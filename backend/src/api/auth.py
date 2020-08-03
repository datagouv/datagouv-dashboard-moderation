from functools import wraps

from flask import session, make_response

from src import users_table


def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            user_id = session['user_id']
        except KeyError:
            return make_response(('Unauthorized', 401))
        user = users_table.find_one(uid=user_id)
        if user is None:
            return make_response(('Unauthorized', 401))
        return func(user, *args, **kwargs)
    return wrapper
