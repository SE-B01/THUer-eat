from flask_sqlalchemy import SQLAlchemy
from ..db import db

class Collection(db.Model):
    __tablename__ = 'collection'
    id = db.Column(db.String(32), primary_key=True)
    user_id = db.Column(db.String(32))
    dish_id = db.Column(db.String(32))
    rank = db.Column(db.Integer)
    time = db.Column(db.DateTime)

    def __repr__(self):
        return '<Collection %r>' % self.id
    #def __init__(self):