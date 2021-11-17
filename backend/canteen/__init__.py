from .canteen import canteen

def init_app(app):
    app.register_blueprint(canteen)
    #app.register_blueprint(profile_bp)