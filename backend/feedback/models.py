from flask_sqlalchemy import SQLAlchemy
from ..db import db
import uuid

class Feedback(db.Model):
    __tablename__ = 'feedback'
    id = db.Column(db.String(32), primary_key=True)
    content = db.Column(db.Text)
    time = db.Column(db.DateTime)

    def __repr__(self):
        return '<Feedback %r>' % self.id

    def __init__(self):
        self.id = str(uuid.uuid4()).replace("-", "")