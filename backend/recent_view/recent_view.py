from flask import Blueprint, request, jsonify
from .models import Recent_view
from ..dish.models import Dish
from ..canteen.models import Canteen
from ..db import db
import datetime
import json

recent_view = Blueprint('recent_view', __name__)

@recent_view.route('/recent_view_test', methods=['GET', 'POST'])
def recent_view_example():
    recent_view_ = Recent_view.query.first()
    # print(recent_view_)
    return str(recent_view_.rank), 200

@recent_view.route('/add_recent_view', methods=['GET', 'POST'])
def add_recent_view():
    canteen_name = request.args.get('canteen_name')
    canteen_id = Canteen.query.filter_by(name=canteen_name).first().id
    dish_name = request.args.get('dish_name')
    dish_id = Dish.query.filter_by(name=dish_name, canteen_id=canteen_id).first().id
    user_id = request.args.get('user_id')
    rank = Recent_view.query.filter_by(user_id=user_id).count() + 1
    #print(f'rank:{rank}')
    new_recent_view_item = Recent_view()
    new_recent_view_item.user_id = user_id
    new_recent_view_item.dish_id = dish_id
    new_recent_view_item.rank = rank
    new_recent_view_item.time = datetime.datetime.now()
    db.session.add(new_recent_view_item)
    db.session.commit()
    return 'test', 200

@recent_view.route('/get_recent_view', methods=['GET', 'POST'])
def get_recent_view():
    user_id = request.args.get('user_id')
    recent_view_list = Recent_view.query.order_by(Recent_view.time.desc()).filter_by(user_id=user_id)
    return_list=[]
    for recent_view_list_item in recent_view_list:
        dish_detail = Dish.query.filter_by(id=recent_view_list_item.dish_id)
        for dish_detail_item in dish_detail:
            # print(dish_detail_item.to_json())
            canteen_detail = Canteen.query.filter_by(id=dish_detail_item.canteen_id)
            for canteen_detail_item in canteen_detail:
                # print(canteen_detail_item.to_json())
                return_list_item={
                'id':recent_view_list_item.id,
                'dish_name':dish_detail_item.name,
                'dish_image': dish_detail_item.img,
                'dish_cost':dish_detail_item.price,
                'dish_canteen':canteen_detail_item.name,
                'business_hours':canteen_detail_item.business_hours,
                'dish_comment':dish_detail_item.comment,
                'dish_canteen_on':'营业中'
                }
                # return_list_item = json.dumps(return_list_item, ensure_ascii=False)
                # print('return list item')
                # print(return_list_item)
                return_list.append(return_list_item)
    # print('list')
    # print(return_list)
    return jsonify(return_list), 200
