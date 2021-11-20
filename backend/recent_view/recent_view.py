from flask import Blueprint, request, jsonify
from .models import Recent_view
from ..dish.models import Dish
from ..canteen.models import Canteen
import json

recent_view = Blueprint('recent_view', __name__)

@recent_view.route('/recent_view_test', methods=['GET', 'POST'])
def recent_view_example():
    recent_view_ = Recent_view.query.first()
    print(recent_view_)
    return str(recent_view_.rank), 200

@recent_view.route('/latest_review', methods=['GET', 'POST'])
def get_recent_view():
    user_id = request.args.get('user_id')
    recent_view_list = Recent_view.query.order_by(Recent_view.time.desc()).filter_by(user_id=user_id)
    return_list=[]
    for recent_view_list_item in recent_view_list:
        dish_detail = Dish.query.filter_by(id=recent_view_list_item.dish_id)
        for dish_detail_item in dish_detail:
            print(dish_detail_item.to_json())
            canteen_detail = Canteen.query.filter_by(id=dish_detail_item.canteen_id)
            for canteen_detail_item in canteen_detail:
                print(canteen_detail_item.to_json())
                return_list_item={
                'id':recent_view_list_item.id,
                'dish_name':dish_detail_item.name,
                'dish_cost':dish_detail_item.price,
                'dish_canteen':canteen_detail_item.name,
                'business_hours':canteen_detail_item.business_hours,
                'dish_comment':dish_detail_item.comment,
                'dish_canteen_on':'营业中'
                }
                # return_list_item = json.dumps(return_list_item, ensure_ascii=False)
                print('return list item')
                print(return_list_item)
                return_list.append(return_list_item)
    print('list')
    print(return_list)
    return jsonify(return_list), 200
