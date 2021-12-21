from flask import Blueprint, request, jsonify
from .models import Collection
from ..dish.models import Dish
from ..canteen.models import Canteen
from ..collection.models import Collection
from ..db import db
import datetime
collection = Blueprint('collection', __name__)

@collection.route('/collection_test', methods=['GET', 'POST'])
def collection_example():
    collection_ = Collection.query.first()
    # print(collection_)
    return str(collection_.rank), 200

@collection.route('/add_collection', methods=['GET', 'POST'])
def add_collection():
    user_id = request.args.get('user_id')
    canteen_name = request.args.get('canteen_name')
    dish_name = request.args.get('dish_name')
    dish_id = Dish.query.filter_by(name=dish_name).first().id
    search = Collection.query.filter_by(dish_id=dish_id, user_id=user_id).first()
    if search:
        return 'already exists', 200
    rank = Collection.query.filter_by(user_id=user_id).count() + 1
    # print(f'rank:{rank}')
    new_collection = Collection()
    new_collection.user_id = user_id
    new_collection.dish_id = dish_id
    new_collection.rank = rank
    new_collection.time = datetime.datetime.now()
    db.session.add(new_collection)
    db.session.commit()
    return 'success', 200

@collection.route('/get_collection', methods=['GET', 'POST'])
def get_collection():
    user_id = request.args.get('user_id')
    collection_list = Collection.query.order_by(Collection.rank.desc() ).filter_by(user_id=user_id)
    return_list=[]
    for collection_list_item in collection_list:
        dish_detail = Dish.query.filter_by(id=collection_list_item.dish_id)
        for dish_detail_item in dish_detail:
            # print(dish_detail_item.to_json())
            canteen_detail = Canteen.query.filter_by(id=dish_detail_item.canteen_id)
            for canteen_detail_item in canteen_detail:
                print(canteen_detail_item.to_json())
                return_list_item={
                'id':collection_list_item.id,
                'dish_id':dish_detail_item.id,
                'dish_name':dish_detail_item.name,
                'dish_cost':dish_detail_item.price,
                'dish_image':dish_detail_item.img,
                'dish_canteen':canteen_detail_item.name,
                'business_hours':canteen_detail_item.business_hours,
                'dish_comment':dish_detail_item.comment,
                'dish_canteen_on':'营业中',
                'dish_rank':collection_list_item.rank
                }
                # return_list_item = json.dumps(return_list_item, ensure_ascii=False)
                # print('return list item')
                # print(return_list_item)
                return_list.append(return_list_item)
    # print('list')
    # print(return_list)
    return jsonify(return_list), 200

@collection.route('/collection_delete', methods=['GET', 'POST'])
def collection_delete():
    
    user_id = request.args.get('user_id')
    collection_id = request.args.get('collection_id')
    print(user_id)
    print(collection_id)
    Collection_list = Collection.query.filter_by(id=collection_id,user_id=user_id)
    for each in Collection_list:
        print(each.to_json())
        db.session.delete(each)
        db.session.commit()
        db.session.close()
    return_list=['success']
    return jsonify(return_list), 200