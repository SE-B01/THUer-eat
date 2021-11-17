from .appraise import appraise

def init_app(app):
    app.register_blueprint(appraise)
    #app.register_blueprint(profile_bp)