from flask import Blueprint, jsonify, request, session
from .models import Dish
from ..canteen.models import Canteen
from ..user.models import User
from ..appraise.models import Appraise

dish = Blueprint('dish', __name__)

def test_dataset():
    dish_ = Dish.query.first()
    #print(dish_.name)
    return dish_.name

@dish.route('/get_select_dishes', methods=['GET', 'POST'])
def get_select_dishes():
    dish_ = Dish.query.all()
    dish_list = []
    for dish in dish_:
        canteen_name = Canteen.query.filter(Canteen.id == dish.canteen_id).first().name
        print(canteen_name)
        dish_list.append(dish.to_json(canteen_name))
    dish_json = jsonify(dish_list)
    return dish_json, 200

@dish.route('/dish/search', methods=['GET', 'POST'])
def get_search_dish():
    text = request.args.get("text")

    dish_ = Dish.query.filter(Dish.name.like("%{}%".format(text)))

    dish_list = []
    for dish in dish_:
        canteen_name = Canteen.query.filter(Canteen.id == dish.canteen_id).first().name
        dish_info = dish.to_json(canteen_name)
        dish_list.append(dish_info)
    dish_json = jsonify(dish_list)
    return dish_json, 200


@dish.route('/dish/get', methods=['GET', 'POST'])
def get_dish():
    canteen_name = request.args.get("canteen_name")
    #canteen_id = Canteen.query.filter_by(name=canteen_name).first().id
    canteen = Canteen.query.filter_by(name=canteen_name).first()
    canteen_id = canteen.id
    canteen_address = canteen.location
    canteen_buisness_hours = canteen.business_hours
    dish_name = request.args.get("dish_name")
    dish = Dish.query.filter_by(name=dish_name, canteen_id=canteen_id).first()
    user_id = dish.user_id
    user = User.query.filter_by(id=user_id).first()
    #print(f'dish_name: {dish_name}')
    appraise_list = Appraise.query.filter(
        Appraise.dish.like('%' + dish_name + '%')
    ).all()
    appraise_list_res = []
    for item in appraise_list:
        appraise = {}
        user_id = item.user_id
        #print(f'user_id:{user_id}')
        user = User.query.filter_by(id=user_id).first()
        appraise['user_nickname'] = user.nickname
        appraise['user_avatar'] = user.avatarUrl
        appraise['comment'] = item.comment

        appraise_list_res.append(appraise)

    #print(dish.name)
    #print(f'appraise_list:{appraise_list}')
    return dish.to_json(canteen_name, canteen_address, canteen_buisness_hours,
                        user.nickname, user.avatarUrl, appraise_list_res), 200

@dish.route('/', methods=['GET', 'POST'])
def index():
    res = test_dataset()
    return res, 200