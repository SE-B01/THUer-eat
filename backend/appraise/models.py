from flask_sqlalchemy import SQLAlchemy
from ..db import db

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

    def __repr__(self):
        return '<Appraise %r>' % self.id
    #def __init__(self):