import os

import dataset
from flask import Flask
from flask_cors import CORS

from config import Config


db = None
cors = CORS(resources={r"/api/*": {"origins": "http://localhost:8080"}})


def create_app(config_class=Config):
    app = Flask(__name__,
            static_folder="../../dist/static",
            template_folder="../../dist"
            )

    app.config.from_object(config_class)

    global db
    db = dataset.connect(app.config['DATABASE_URL'])
    
    cors.init_app(app)

    from src.main import bp as main_bp
    app.register_blueprint(main_bp)

    from src.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
