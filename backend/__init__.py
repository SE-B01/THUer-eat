from flask import Flask, url_for
from .config import *


def create_app(config_name='default'):
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:123456@152.136.200.218:3306/THUer-eat'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
    #config[config_name].init_app(app)
    from . import dish, canteen, appraise, collection, \
        recommend, feedback, user, recent_view, information,appraise_dish_mapping,accessToken, db

    db.init_app(app)
    dish.init_app(app)
    canteen.init_app(app)
    appraise.init_app(app)
    collection.init_app(app)
    user.init_app(app)
    feedback.init_app(app)
    recent_view.init_app(app)
    recommend.init_app(app)
    appraise_dish_mapping.init_app(app)
    information.init_app(app)
    accessToken.init_app(app)
    return app
