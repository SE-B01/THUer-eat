from flask_sqlalchemy import SQLAlchemy
from ..db import db

class Appraise_dish_mapping(db.Model):
    __tablename__ = 'appraise_dish_mapping'
    id = db.Column(db.String(32), primary_key=True)
    dish_id = db.Column(db.String(32))
    appraise_id = db.Column(db.String(32))
    user_id = db.Column(db.String(32))
    
    def __repr__(self):
        return '<Appraise_dish_mapping %r>' % self.id

    def __init__(self):
        self.id = str(uuid.uuid4()).replace("-", "")

    def to_json(self):
        return {
            'id': self.id,
            'dish_id': self.dish_id,
            'appraise_id': self.appraise_id,
            'user_id': self.user_id
        }