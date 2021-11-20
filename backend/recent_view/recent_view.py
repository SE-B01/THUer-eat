from flask import Blueprint, request, jsonify
from .models import Recent_view

recent_view = Blueprint('recent_view', __name__)

@recent_view.route('/recent_view_test', methods=['GET', 'POST'])
def recent_view_example():
    recent_view_ = Recent_view.query.first()
    print(recent_view_)
    return str(recent_view_.rank), 200

@recent_view.route('/latest_review', methods=['GET', 'POST'])
def get_recent_view():
    user_id = request.args.get('user_id')
    print(user_id)
    recent_view_list = Recent_view.query.order_by(Recent_view.time.desc()).filter_by(user_id=user_id)

    recent_view_list = [x.to_json() for x in recent_view_list]
    print(recent_view_list)
    return jsonify(recent_view_list), 200