from flask_sqlalchemy import SQLAlchemy
from ..db import db
import uuid

class Image_(db.Model):
    __tablename__ = 'image_'
    id = db.Column(db.String(32), primary_key=True)
    img = db.Column(db.Text)
    img_name = db.Column(db.String(32))

    def __repr__(self):
        return '<Image_ %r>' % self.id

    def __init__(self):
        self.id = str(uuid.uuid4()).replace("-", "")
