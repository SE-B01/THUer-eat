import uuid
from flask_sqlalchemy import SQLAlchemy
from ..db import db

class Information(db.Model):
    __tablename__ = 'information'
    id = db.Column(db.Integer, primary_key=True)
    create_time = db.Column(db.DateTime)
    update_time = db.Column(db.DateTime)
    responser = db.Column(db.String(255))
    user = db.Column(db.String(255))
    informations = db.Column(db.String(255))

    def __repr__(self):
        return '<Information %r>' % self.id

    def __init__(self):
        self.id = str(uuid.uuid4()).replace("-", "")

    def to_json(self):
        return {
            'id': self.id,
            'create_time': self.create_time,
            'update_time': self.update_time,
            'responser': self.responser,
            'user': self.user,
            'informatinos': self.informations
        }