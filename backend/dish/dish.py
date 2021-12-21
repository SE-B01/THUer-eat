import base64

from flask import Blueprint, jsonify, request, session
from .models import Dish
from ..canteen.models import Canteen
from ..db import db
from ..user.models import User
from ..appraise.models import Appraise
import datetime

dish = Blueprint('dish', __name__)


def test_dataset():
    dish_ = Dish.query.first()
    # print(dish_.name)
    return dish_.name


@dish.route('/get_select_dishes', methods=['GET', 'POST'])
def get_select_dishes():
    """
    根据筛选条件返回菜品
    get_new_lines:是利用当前条件继续读取数据，还是重新获得数据
    now_lines:当前数据条数

    条件: list
    distance:  0: 不限距离  1: <500m  2: <1km  3: <3km
    favor:     0: 口味不限 1: 清淡口味 2: 香辣口味 3:大鱼大肉
    price:   0:价格不限 1:0-10元 2:10-50元 3:50元以上
    sortby:    0: 智能排序 1: 好评优先 2: 新菜优先
    
    """
    batch_size = 5 # 每次刷新的条数

    get_new_lines = request.args.get("get_new_lines")
    now_lines = int(request.args.get("now_lines"))
    distance = request.args.get("distance")
    favor = request.args.get("favor")
    price = int(request.args.get("price"))
    sortby = request.args.get("sortby")

    limit = ""
    distance_limits = [0, 500, 1000, 3000]
    price_limits = [0,10,50]

    # if distance != "0":
    #     distance_limit = distance_limits[int(distance)]
    # if favor != "0":
    #     limit += ".filter_by(favor={})".format())
    if price != 0:
        if price != 3:
            limit += ".filter(Dish.price>{}).filter(Dish.price<={})".format(price_limits[price-1], price_limits[price])
        else:
            limit += ".filter(Dish.price>{})".format(price_limits[price-1])

    if limit == "":
        limit = ".all()"

    query_limit = "Dish.query" + limit

    dish_ = eval(query_limit)

    dish_list = []
    for dish in dish_:
        canteen_name = Canteen.query.filter(Canteen.id == dish.canteen_id).first().name
        dish_list.append(dish.to_json(canteen_name))
    if get_new_lines == "false":
        dish_list = dish_list[:batch_size]
    else:
        dish_list = dish_list[now_lines:now_lines + batch_size]
    dish_json = jsonify(dish_list)
    return dish_json, 200


@dish.route('/dish/search', methods=['GET', 'POST'])
def get_search_dish():
    batch_size = 10 # 每次刷新的条数

    get_new_lines = request.args.get("get_new_lines")
    now_lines = int(request.args.get("now_lines"))
    text = request.args.get("text")

    dish_ = Dish.query.filter(Dish.name.like("%{}%".format(text)))

    dish_list = []
    for dish in dish_:
        canteen_name = Canteen.query.filter(Canteen.id == dish.canteen_id).first().name
        dish_info = dish.to_json(canteen_name)
        dish_list.append(dish_info)
    if get_new_lines == "false":
        dish_list = dish_list[:batch_size]
    else:
        dish_list = dish_list[now_lines:now_lines + batch_size]
    dish_json = jsonify(dish_list)
    return dish_json, 200


@dish.route('/dish/get', methods=['GET', 'POST'])
def get_dish():
    canteen_name = request.args.get("canteen_name")
    # canteen_id = Canteen.query.filter_by(name=canteen_name).first().id
    canteen = Canteen.query.filter_by(name=canteen_name).first()
    canteen_id = canteen.id
    canteen_address = canteen.location
    canteen_buisness_hours = canteen.business_hours
    dish_name = request.args.get("dish_name")
    dish = Dish.query.filter_by(name=dish_name, canteen_id=canteen_id).first()
    user_id = dish.user_id
    user = User.query.filter_by(id=user_id).first()
    # print(f'dish_name: {dish_name}')
    appraise_list = Appraise.query.filter(
        Appraise.dish.like('%' + dish_name + '%')
    ).all()
    appraise_list_res = []
    for item in appraise_list:
        if not item.is_publish:
            continue
        appraise = {}
        if item.anonymous:
            appraise['user_avatar'] = "../../images/icons/user-unlogin.png"
            appraise['user_nickname'] = "匿名用户"
        else:
            user_id = item.user_id
        # print(f'user_id:{user_id}')
            user = User.query.filter_by(id=user_id).first()
            appraise['user_nickname'] = user.nickname
            appraise['user_avatar'] = user.avatarUrl
        appraise['comment'] = item.comment

        appraise_list_res.append(appraise)

    # print(dish.name)
    # print(f'appraise_list:{appraise_list}')
    return dish.to_json(canteen_name, canteen_address, canteen_buisness_hours,
                        user.nickname, user.avatarUrl, appraise_list_res), 200


@dish.route('/', methods=['GET', 'POST'])
def index():
    res = test_dataset()
    return res, 200


@dish.route('/dish/add', methods=['GET', 'POST'])
def add_dish():
    data = request.json
    # print(data)
    new_dish = Dish()
    new_dish.name = data.get("name")
    new_dish.canteen_id = data.get("canteen_id")
    new_dish.price = data.get("price")
    img = data.get("img")[0]
    filename = str(data.get('canteen_id')) + "_" + str(data.get("name")) + ".jpg"
    filepath = "backend/static/images/" + filename
    file = open(filepath, "wb")
    file.write(base64.b64decode(img))
    file.close()
    new_dish.img = "http://127.0.0.1:5000/static/images/" + filename
    new_dish.user_id = 0
    new_dish.comment = ""
    db.session.add(new_dish)
    db.session.commit()
    return "ok", 200

@dish.route('/dish/edit', methods=['GET', 'POST'])
def edit_dish():
    data = request.json
    print(data)
    tar_dish = Dish.query.filter(Dish.id == data.get("id")).first()
    print(tar_dish.name)
    tar_dish.name = data.get("name")
    tar_dish.price = data.get("price")
    img = data.get("img")[0]
    filename = str(data.get('canteen_id')) + "_" + str(data.get("name")) + ".jpg"
    filepath = "backend/static/images/" + filename
    file = open(filepath, "wb")
    file.write(base64.b64decode(img))
    file.close()
    tar_dish.img = "http://127.0.0.1:5000/static/images/" + filename
    db.session.commit()
    return "ok", 200

@dish.route('/remind_dish', methods=['GET', 'POST'])
def remind_dish():   
    print('remindinggggggggggg')
    user_id = request.args.get("user_id")
    dish_id = request.args.get("dish_id")
    business_hours = request.args.get("business_hours")
    print("business_hours")
    print(business_hours)
    print('dish_id')
    dateTime_now = datetime.datetime.now()
    str_dateTime_now = datetime.datetime.strftime(dateTime_now,'%Y-%m-%d')
    remindtime = None
    earlytime = None # 第一次开的时间
    for business_hours_item in business_hours.split(';'):
        str_begintime=str_dateTime_now+'-'+business_hours_item.split('-')[0]
        # print('str_begintime')
        # print(str_begintime)
        itemTime = datetime.datetime.strptime(str_begintime,'%Y-%m-%d-%H:%M')
        # print('dateTime_now>itemTime')
        # print(dateTime_now>itemTime)
        # print('itemTime')
        # print(itemTime)
        if dateTime_now<itemTime:
            if not remindtime:# not None,本质remindtime is None
                remindtime = itemTime
            else:
                if remindtime>itemTime: # 提醒的是最早的时间
                    remindtime=itemTime
                else:
                    pass
        if not earlytime:
            earlytime=itemTime
        else:
            if itemTime<earlytime:
                earlytime=itemTime
            else:
                pass
    if not remindtime:# 说明今天不行，往后推一天
        if earlytime:
            remindtime=earlytime+datetime.timedelta(days=1)
    # print('remindtime')
    # print(remindtime)
    # print('earlytime')
    # print(earlytime)
    print((remindtime-datetime.datetime.now()).seconds)
    return jsonify((remindtime-datetime.datetime.now()).seconds),'200'
    # print(dish_id)
    # tar_dish = Dish.query.filter(Dish.id == dish_id).first()
    # print('dishhhhhh')

    # print(tar_dish.name)
    
    # tar_dish.name = data.get("name")
    # tar_dish.price = data.get("price")
    # img = data.get("img")[0]
    # filename = str(data.get('canteen_id')) + "_" + str(data.get("name")) + ".jpg"
    # filepath = "backend/static/images/" + filename
    # file = open(filepath, "wb")
    # file.write(base64.b64decode(img))
    # file.close()
    # tar_dish.img = "http://127.0.0.1:5000/static/images/" + filename
    # db.session.commit()
    # return "ok", 200