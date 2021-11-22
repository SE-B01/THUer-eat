from flask import Blueprint, jsonify
from .models import Dish

dish = Blueprint('dish', __name__)

def test_dataset():
    dish_ = Dish.query.first()
    #print(dish_.name)
    return dish_.name

@dish.route('/get_select_dishes', methods=['GET', 'POST'])
def get_select_dishes():
    dish_ = Dish.query.all()
    dish_list = []
    for dish in dish_:
        dish_list.append(dish.to_json())
    dish_json = jsonify(dish_list)
    return dish_json, 200

@dish.route('/', methods=['GET', 'POST'])
def index():
    res = test_dataset()
    return res, 200