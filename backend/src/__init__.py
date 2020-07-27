import os

import dataset
from flask import Flask
from flask_cors import CORS


cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:8080"}})
db = dataset.connect(os.getenv('DATABASE_URL', 'sqlite:///data.db'))
table = db["mod_db"]

sqlite:///:memory
def create_app():
    app = Flask(__name__,
            static_folder="../../dist/static",
            template_folder="../../dist")

    cors.init_app(app)

    from src.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
