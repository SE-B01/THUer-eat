import uuid

from flask_sqlalchemy import SQLAlchemy
from ..db import db
import uuid


class AccessToken(db.Model):
    __tablename__ = 'accessToken'

    id = db.Column(db.String(32),primary_key=True)
    update_time = db.Column(db.DateTime)
    token = db.Column(db.String(255))
    

    def __repr__(self):
        return '<AccessToken %r>' % self.id

    def __init__(self):
        self.id = str(uuid.uuid4()).replace("-", "")

    def to_json(self):
        return {
            'id': self.id,
            'update_time': self.update_time,
            'token': self.token,
        }


