from flask import Blueprint, request, jsonify
from .models import Recent_view
from ..dish.models import Dish
from ..canteen.models import Canteen
from ..db import db
import datetime
import json
from ..db import db

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
    search = Recent_view.query.filter_by(dish_id=dish_id, user_id=user_id).first()
    if search:
        return 'already exists', 200
    rank = Recent_view.query.filter_by(user_id=user_id).count() + 1
    # print(f'rank:{rank}')
    new_recent_view_item = Recent_view()
    new_recent_view_item.user_id = user_id
    new_recent_view_item.dish_id = dish_id
    new_recent_view_item.rank = rank
    new_recent_view_item.time = datetime.datetime.now()
    db.session.add(new_recent_view_item)
    db.session.commit()
    return 'success', 200


@recent_view.route('/get_recent_view', methods=['GET', 'POST'])
def get_recent_view():
    user_id = request.args.get('user_id')
    recent_view_list = Recent_view.query.order_by(Recent_view.time.desc()).filter_by(user_id=user_id).all()
    print('ttttttttttttttttttttttt')
    print(recent_view_list)
    return_list = []
    for recent_view_list_item in recent_view_list:
        try:
            dish_item = Dish.query.filter_by(id=recent_view_list_item.dish_id).first()
            #print(f'recent_dish_id: {recent_view_list_item.dish_id}')
            #print(f'dish_item: {dish_item.name}')
            canteen_item = Canteen.query.filter_by(id=dish_item.canteen_id).first()
            business_hours = canteen_item.business_hours
            dateTime_now = datetime.datetime.now()
            str_dateTime_now = datetime.datetime.strftime(dateTime_now,'%Y-%m-%d')
            canteen_on='未营业'
            for business_hours_item in business_hours.split(';'):
                str_begintime=str_dateTime_now+'-'+business_hours_item.split('-')[0]
                str_endtime = str_dateTime_now+'-'+business_hours_item.split('-')[1]
                # print('str_begintime')
                # print(str_begintime)
                beginTime = datetime.datetime.strptime(str_begintime,'%Y-%m-%d-%H:%M')
                endTime = datetime.datetime.strptime(str_endtime,'%Y-%m-%d-%H:%M')
                # print('dateTime_now>itemTime')
                # print(dateTime_now>itemTime)
                # print('itemTime')
                # print(itemTime)
                if dateTime_now<=endTime and dateTime_now>=beginTime:
                    canteen_on='营业中'
            return_list_item = {
                'id': recent_view_list_item.id,
                'dish_name': dish_item.name,
                'dish_image': dish_item.img,
                'dish_cost': dish_item.price,
                'dish_canteen': canteen_item.name,
                'business_hours': canteen_item.business_hours,
                'dish_comment': dish_item.comment,
                'dish_canteen_on': canteen_on
            }
            return_list.append(return_list_item)
        except:
            pass

    return jsonify(return_list), 200


@recent_view.route('/recent_view_delete', methods=['GET', 'POST'])
def recent_view_delete():
    user_id = request.args.get('user_id')
    recent_view_id = request.args.get('recent_view_id')
    print(user_id)
    print(recent_view_id)
    Recent_view_list = Recent_view.query.filter_by(id=recent_view_id, user_id=user_id)
    for each in Recent_view_list:
        print(each.to_json())
        db.session.delete(each)
        db.session.commit()
        db.session.close()
    return_list = ['success']
    return jsonify(return_list), 200