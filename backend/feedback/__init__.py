from .feedback import feedback

def init_app(app):
    app.register_blueprint(feedback)