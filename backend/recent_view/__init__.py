from .recent_view import recent_view

def init_app(app):
    app.register_blueprint(recent_view)