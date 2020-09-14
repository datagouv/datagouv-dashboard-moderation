import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

from config import Config

db = SQLAlchemy()
migrate = Migrate()


cors = CORS(resources={
  r"/api/*": {
    "origins": 
      [
        "http://localhost:8080",
        "https://datagouv-tdb-moderation-demo.netlify.app"
      ]
    }
  })


def create_app(config_class=Config):
    app = Flask(__name__,
                static_folder="../../dist/static",
                template_folder="../../dist"
                )

    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)

    cors.init_app(app)

    from src.main import bp as main_bp
    app.register_blueprint(main_bp)

    from src.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app


from src import models
