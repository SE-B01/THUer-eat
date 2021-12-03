from .recommend import recommend

def init_app(app):
    app.register_blueprint(recommend)