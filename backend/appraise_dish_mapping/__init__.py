from .appraise_dish_mapping import appraise_dish_mapping

def init_app(app):
    app.register_blueprint(appraise_dish_mapping)
    #app.register_blueprint(profile_bp)