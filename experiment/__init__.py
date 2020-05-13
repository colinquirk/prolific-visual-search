from .app import app, init_db


def getApp():
    return app


init_db()
