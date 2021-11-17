from flask_sqlalchemy import SQLAlchemy
from ..db import db

class Dish(db.Model):
    __tablename__ = 'dish'
    id = db.Column(db.String(32), primary_key=True)
    name = db.Column(db.String(50))
    price = db.Column(db.Integer)

    def __repr__(self):
        return '<Dish %r>' % self.name
    #def __init__(self):