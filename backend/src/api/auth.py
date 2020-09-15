from functools import wraps

from flask import session, make_response

from src.models import User


def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            print(f'session : {session}')
            print(session.__dict__)
            user_id = session['user_id']
        except KeyError:
            print('login_required > KEY ERROR \n')
            return make_response(('Unauthorized', 401))
        user = User.query.filter_by(dgf_id=user_id).first()
        if user is None:
            print('login_required > USER IS NONE \n')
            return make_response(('Unauthorized', 401))
        return func(user, *args, **kwargs)
    return wrapper
