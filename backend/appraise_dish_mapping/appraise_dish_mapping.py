from flask import Blueprint, request, jsonify
from ..appraise.models import Appraise
from ..dish.models import Dish
from ..user.models import User
import json

appraise_dish_mapping = Blueprint('appraise_dish_mapping', __name__)

@appraise_dish_mapping.route('/add_appraise_dish_mapping', methods=['GET', 'POST'])
def add_appraise_dish_mapping():

    return 'test', 200