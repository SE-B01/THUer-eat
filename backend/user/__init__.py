from .user import user

def init_app(app):
    app.register_blueprint(user)
    #app.register_blueprint(profile_bp)