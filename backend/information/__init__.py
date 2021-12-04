from .information import information

def init_app(app):
    app.register_blueprint(information)