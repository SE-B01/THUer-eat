from flask import Blueprint
from .models import Canteen

canteen = Blueprint('canteen', __name__)

@canteen.route('/canteen_test', methods=['GET', 'POST'])
def canteen_example():
    canteen_ = Canteen.query.first()
    return canteen_.name, 200