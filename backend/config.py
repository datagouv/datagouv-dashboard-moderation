import os


class Config:
    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'sqlite:///data.db'
    LOG_TO_STDOUT = os.environ.get('LOG_TO_STDOUT')


class Testing:
    TESTING = True
    DATABASE_URL = 'sqlite:///:memory:'
    SECRET_KEY = 'testing-secret-key'
