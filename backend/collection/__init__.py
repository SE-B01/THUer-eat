from .collection import collection

def init_app(app):
    app.register_blueprint(collection)
    #app.register_blueprint(profile_bp)