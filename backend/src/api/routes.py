from flask import jsonify

from src import table
from src.api import bp


@bp.route("/data")
def api():
    return jsonify(list(table.all()))
