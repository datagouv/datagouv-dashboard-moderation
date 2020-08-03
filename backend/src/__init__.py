import os

import dataset
from flask import Flask
from flask_cors import CORS


cors = CORS(resources={r"/api/*": {"origins": "http://localhost:8080"}})
db = dataset.connect(os.getenv('DATABASE_URL', 'sqlite:///data.db'))
users_table = db["users"]
datasets_table = db["datasets"]


def create_app():
    app = Flask(__name__,
            static_folder="../../dist/static",
            template_folder="../../dist")

    app.secret_key = 'yourwillneverguess'
    
    cors.init_app(app)

    from src.main import bp as main_bp
    app.register_blueprint(main_bp)

    from src.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
