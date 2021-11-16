from .dish import dish

def init_app(app):
    app.register_blueprint(dish)
    #app.register_blueprint(profile_bp)