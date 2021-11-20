from flask_sqlalchemy import SQLAlchemy
from ..db import db

class Canteen(db.Model):
    __tablename__ = 'canteen'
    id = db.Column(db.String(32), primary_key=True)
    name = db.Column(db.String(50))
    location = db.Column(db.String(50))
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)
    payment = db.Column(db.Integer, default=1)
    star = db.Column(db.Integer, default=0)
    business_hours = db.Column(db.String(50))
    img = db.Column(db.String(100))
    cost = db.Column(db.Integer)

    def __repr__(self):
        return '<Canteen %r>' % self.name
    #def __init__(self):