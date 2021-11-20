from flask_sqlalchemy import SQLAlchemy
from ..db import db
import uuid

class Dish(db.Model):
    __tablename__ = 'dish'
    id = db.Column(db.String(32), primary_key=True)
    name = db.Column(db.String(50))
    price = db.Column(db.Integer)
    canteen_id = db.Column(db.String(32)) # potential foreign key
    comment = db.Column(db.String(50))
    def __repr__(self):
        return '<Dish %r>' % self.name

    def __init__(self):
        self.id = str(uuid.uuid4()).replace("-", "")

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'canteen_id': self.canteen_id,
            'comment':self.comment
        }