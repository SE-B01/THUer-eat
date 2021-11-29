from .test_image import test_image

def init_app(app):
    app.register_blueprint(test_image)