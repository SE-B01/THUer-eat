from flask import Blueprint
from .models import Recent_view

recent_view = Blueprint('recent_view', __name__)

@recent_view.route('/recent_view_test', methods=['GET', 'POST'])
def recent_view_example():
    recent_view_ = Recent_view.query.first()
    print(recent_view_)
    return str(recent_view_.rank), 200
