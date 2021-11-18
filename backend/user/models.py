from flask_sqlalchemy import SQLAlchemy
from ..db import db


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.String(32), primary_key=True)
    avatarUrl = db.Column(db.String)
    gender = db.Column(db.Integer)
    is_admin = db.Column(db.BOOLEAN)
    nickname = db.Column(db.String(50))
    is_in_school = db.Column(db.BOOLEAN)

    def __repr__(self):
        return '<User %r>' % self.name
    # def __init__(self):
