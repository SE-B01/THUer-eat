import uuid

from flask_sqlalchemy import SQLAlchemy
from ..db import db
import uuid


class Appraise(db.Model):
    __tablename__ = 'appraise'

    id = db.Column(db.String(32), primary_key=True)
    img_list = db.Column(db.Text)
    anonymous = db.Column(db.SmallInteger, default=1)
    comment = db.Column(db.Text)
    dish = db.Column(db.Text)
    like = db.Column(db.Integer, default=0)
    star = db.Column(db.Integer)
    time = db.Column(db.DateTime)
    canteen_id = db.Column(db.String(32))
    user_id = db.Column(db.String(32))
    cost = db.Column(db.Integer)
    is_publish = db.Column(db.BOOLEAN)

    def __repr__(self):
        return '<Appraise %r>' % self.id

    def __init__(self):
        self.id = str(uuid.uuid4()).replace("-", "")

    def to_json(self):
        return {
            'id': self.id,
            'img_list': self.img_list,
            'anonymous': self.anonymous,
            'comment': self.comment,
            'dish': self.dish,
            'like': self.like,
            'star': self.star,
            'time': self.time,
            'canteen_id': self.canteen_id,
            'user_id': self.user_id,
            'cost': self.cost,
            'is_publish': self.is_publish,
        }