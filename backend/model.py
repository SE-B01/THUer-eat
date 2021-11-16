from flask_sqlalchemy import SQLAlchemy
from app import db

"""
class Canteen(db.Model):
    __tablename__ = 'canteen'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    users = db.relationship('User', backref='role', lazy='dynamic')

    def __repr__(self):
        return '<Role %r>' % self.name
"""

class Dish(db.Model):
    __tablename__ = 'dish'
    id = db.Column(db.String(32), primary_key=True)
    name = db.Column(db.String(50))
    price = db.Column(db.Integer)

    def __repr__(self):
        return '<Dish %r>' % self.name
    #def __init__(self):
