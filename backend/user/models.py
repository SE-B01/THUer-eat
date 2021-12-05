from flask_sqlalchemy import SQLAlchemy
from ..db import db
import uuid


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.String(32), primary_key=True)
    avatarUrl = db.Column(db.String)
    gender = db.Column(db.Integer)
    is_admin = db.Column(db.BOOLEAN)
    nickname = db.Column(db.String(50))
    is_in_school = db.Column(db.Integer)
    liked_appraise = db.Column(db.String)

    def __repr__(self):
        return '<User %r>' % self.nickname


    # def __init__(self):
    #     self.id = str(uuid.uuid4()).replace("-", "")
    
    def to_json(self):
        return {
            'id': self.id,
            'avatarUrl': self.avatarUrl,
            'gender': self.gender,
            'is_admin': self.is_admin,
            'nickname': self.nickname,
            'is_in_school': self.is_in_school
        }