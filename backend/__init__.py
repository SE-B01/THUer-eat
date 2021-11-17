from flask import Flask
from .config import *

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:123456@152.136.200.218:3306/THUer-eat'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
    #config[config_name].init_app(app)
    from . import dish, db, user
    db.init_app(app)
    dish.init_app(app)
    user.init_app(app)

    return app