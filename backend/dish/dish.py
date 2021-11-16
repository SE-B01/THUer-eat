from flask import Blueprint
from .models import Dish
import sys
from . import models

dish = Blueprint('dish', __name__)

def test_dataset():
    dish = Dish.query.first()
    print(dish.name)
    return dish.name

@dish.route('/', methods=['GET', 'POST'])
def index():
    res = test_dataset()
    return res, 200