from flask import Flask
from flask_cors import *
from flask import request, jsonify
import json
from flask_sqlalchemy import SQLAlchemy
#from model import Dish
#from test import test_database
#from model import *
#from model import Dish


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:123456@152.136.200.218:3306/THUer-eat'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)

@app.route('/')
def hello_world():
    test_database()
    data = [{'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5}]
    return json.dumps(data)
    #return 'Hello World!'

@app.route('/test')
def test():
    #param = request.get_json()
    param  = request.args.get('test')
    print(f'param: {param}')
    return 'Hello World!'

class Dish(db.Model):
    __tablename__ = 'dish'
    id = db.Column(db.String(32), primary_key=True)
    name = db.Column(db.String(50))
    price = db.Column(db.Integer)

    def __repr__(self):
        return '<Dish %r>' % self.name
    #def __init__(self):

def test_database():
    dish = Dish.query.first()
    print(dish.name)
    return dish

if __name__ == '__main__':
    app.run()
