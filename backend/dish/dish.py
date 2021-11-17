from flask import Blueprint
from .models import Dish

dish = Blueprint('dish', __name__)

def test_dataset():
    dish_ = Dish.query.first()
    #print(dish_.name)
    return dish_.name

@dish.route('/', methods=['GET', 'POST'])
def index():
    res = test_dataset()
    return res, 200