from flask_sqlalchemy import SQLAlchemy
from ..db import db
import uuid

class Recent_view(db.Model):
    __tablename__ = 'recent_view'
    id = db.Column(db.String(32), primary_key=True)
    user_id = db.Column(db.String(32))
    dish_id = db.Column(db.String(32))
    rank = db.Column(db.Integer)
    time = db.Column(db.DateTime)

    def __repr__(self):
        return '<Recent_view %r>' % self.id

    def __init__(self):
        self.id = str(uuid.uuid4()).replace("-", "")