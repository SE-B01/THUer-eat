from flask import Blueprint, jsonify
from .models import Dish
from ..canteen.models import Canteen

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
        canteen_name = Canteen.query.filter(Canteen.id == dish.canteen_id).first().name
        print(canteen_name)
        dish_list.append(dish.to_json(canteen_name))
    dish_json = jsonify(dish_list)
    return dish_json, 200

@dish.route('/', methods=['GET', 'POST'])
def index():
    res = test_dataset()
    return res, 200