from flask import render_template

from src.main import bp


@bp.route("/", defaults={"path": ""})
# allows routing in vuejs
@bp.route("/<path:path>")
def index(path):
    return render_template("index.html")
