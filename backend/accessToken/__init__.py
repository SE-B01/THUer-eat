from .accessToken import accessToken

def init_app(app):
    app.register_blueprint(accessToken)
    #app.register_blueprint(profile_bp)