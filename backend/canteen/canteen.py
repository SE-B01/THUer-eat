from flask import Blueprint
from .models import Canteen

canteen = Blueprint('canteen', __name__)

@canteen.route('/canteen_test', methods=['GET', 'POST'])
def canteen_example():
    canteen_ = Canteen.query.first()
    return canteen_.name, 200

@canteen.route('/get_all_canteens', methods=['GET', 'POST'])
def get_all_canteens():
    canteen_ = Canteen.query()
    # canteen_info_name = [canteen.name for canteen in canteen_]
    # canteen_info = {}
    # canteen_info['name'] = canteen_info_name
    print(canteen_)
    return canteen_, 200
    #return canteen_, 200