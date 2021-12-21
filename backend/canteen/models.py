import uuid

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
    img = db.Column(db.String(1000))
    cost = db.Column(db.Integer)
    style = db.Column(db.String(50))

    def __repr__(self):
        return '<Canteen %r>' % self.name

    # def __init__(self):
    #     self.id = str(uuid.uuid4()).replace("-", "")

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'longitude': self.longitude,
            'latitude': self.latitude,
            'payment': self.payment,
            'star': self.star,
            'business_hours': self.business_hours,
            #'img': img_list,
            'cost': self.cost,
            'style': self.style
        }
