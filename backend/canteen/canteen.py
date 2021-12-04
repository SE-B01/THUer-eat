import base64

from flask import Blueprint, request, jsonify
from .models import Canteen
from ..db import db
from ..appraise.models import Appraise
from ..dish.models import Dish
from ..user.models import User
import json

canteen = Blueprint('canteen', __name__)


@canteen.route('/canteen_test', methods=['GET', 'POST'])
def canteen_example():
    canteen_ = Canteen.query.first()
    return canteen_.name, 200


@canteen.route('/get_select_canteens', methods=['GET', 'POST'])
def get_select_canteens():
    """
    根据筛选条件返回餐厅
    条件: list
    list[0]: distance:  0: 不限距离  1: <500m  2: <1km  3: <3km
    list[1]: style:     0: 风格不限 1: 个人独享 2: 朋友小聚 3:宴请四方
    list[2]: payment:   0: 支付方式不限 1:仅支持校园卡 2:可以使用支付宝
    list[3]: sortby:    0: 智能排序 1: 好评优先 2: 距离优先
    
    """
    distance = request.args.get("distance")
    style = request.args.get("distance")
    payment = request.args.get("payment")
    sortby = request.args.get("sortby")

    limit = ""
    distance_limits = [0, 500, 1000, 3000]

    # if distance != "0":
    #     distance_limit = distance_limits[int(distance)]
    if style != "0":
        limit += ".filter_by(style={})".format(style)
    if payment != "0":
        limit += ".filter_by(payment={})".format(payment)

    if limit == "":
        limit = ".all()"

    query_limit = "Canteen.query" + limit
    # print(query_limit)
    canteen_ = eval(query_limit)
    # print(canteen_)

    canteen_list = []
    for canteen in canteen_:
        # print(canteen.to_json())
        canteen_info = canteen.to_json()
        # print(canteen.img)
        try:
            canteen_info['img'] = canteen.img.split(',')
            print(canteen_info['img'])
        except:
            print(canteen_info['name'])
            canteen_img = []
            canteen_img.append(canteen.img)
            canteen_info['img'] = canteen_img
        canteen_list.append(canteen_info)
    canteen_json = jsonify(canteen_list)
    return canteen_json, 200

@canteen.route('/canteen/search', methods=['GET', 'POST'])
def get_search_canteen():
    text = request.args.get("text")
    # ca：数据库中目标食堂条目
    canteen_ = Canteen.query.filter(Canteen.name.like("%{}%".format(text)))

    canteen_list = []
    for canteen in canteen_:
        #print(canteen.to_json())
        canteen_info = canteen.to_json()
        #print(canteen.img)
        try:
            canteen_info['img'] = canteen.img.split(',')
            print(canteen_info['img'])
        except:
            print(canteen_info['name'])
            canteen_img = []
            canteen_img.append(canteen.img)
            canteen_info['img'] = canteen_img
        canteen_list.append(canteen_info)
    canteen_json = jsonify(canteen_list)
    return canteen_json, 200

@canteen.route('/canteen/get', methods=['GET', 'POST'])
def get_canteen_info():
    name = request.args.get("name")
    # ca：数据库中目标食堂条目
    ca = Canteen.query.filter(Canteen.name == name).first()
    starlist = ['gray', 'gray', 'gray', 'gray', 'gray']
    for i in range(0, ca.star):
        starlist[i] = 'yellow'
    ca_info = {"location": ca.location,
               "payment": ca.payment,
               "starlist": starlist,
               "business_hours": ca.business_hours,
               "cost": ca.cost,
               "latitude": ca.latitude,
               "longitude": ca.longitude,
               'image_list': ca.img
               }
    # ap：数据库中目标食堂对应评价列表
    ap = Appraise.query.filter(Appraise.canteen_id == ca.id).order_by(Appraise.time)
    ap_list = []
    for item in ap:
        # print(item)
        user_info = {}
        # print(item.user_id)
        user = User.query.filter(User.id == item.user_id).first()
        # print(user.nickname)
        user_info['avatar_url'] = user.avatarUrl
        user_info['name'] = user.nickname
        ap_list.append(
            {"user_id": item.user_id,
             "anonymous": item.anonymous,
             "img_list": item.img_list,
             "star": item.star,
             "comment": item.comment,
             "dish": item.dish,
             "cost": item.cost,
             "user_name": user.nickname,
             "user_avatar": user.avatarUrl
             })
    ca_info["ap_list"] = ap_list
    dish_list = Dish.query.filter(Dish.canteen_id == ca.id)
    dish_list_ = []
    for item in dish_list:
        dish_item = {}
        dish_item['name'] = item.name
        dish_item['image'] = item.img
        #print(item.name)
        dish_item['price'] = item.price
        dish_item['comment'] = item.comment
        dish_list_.append(dish_item)
    ca_info['dish_list'] = dish_list_
    return ca_info, 200
    # return canteen_, 200


@canteen.route('/canteen/map_get', methods=['GET', 'POST'])
def get_canteen_location():
    markers = {'markers': []}
    ca = Canteen.query.all()
    for item in ca:
        marker = {'id': int(item.id), 'title': item.name, 'latitude': item.latitude, 'longitude': item.longitude}
        print(marker)
        markers['markers'].append(marker)
    return markers, 200


@canteen.route('/canteen/get_byid', methods=['GET', 'POST'])
def get_canteen_byid():
    tar_id = request.args.get("id")
    # ca：数据库中目标食堂条目
    ca = Canteen.query.filter(Canteen.id == tar_id).first()
    starlist = ['gray', 'gray', 'gray', 'gray', 'gray']
    for i in range(0, ca.star):
        starlist[i] = 'yellow'
    ca_info = {"name": ca.name, "location": ca.location, "payment": ca.payment, "starlist": starlist,
               "business_hours": ca.business_hours, "cost": ca.cost, "latitude": ca.latitude, "longitude": ca.longitude}
    # ap：数据库中目标食堂对应评价列表
    ap = Appraise.query.filter(Appraise.canteen_id == tar_id).order_by(Appraise.time)
    ap_list = []
    for item in ap:
        # print(item)
        ap_list.append(
            {"user_id": item.user_id, "anonymous": item.anonymous, "img_list": item.img_list, "star": item.star,
             "comment": item.comment, "dish": item.dish, "cost": item.cost})
    ca_info["ap_list"] = ap_list
    dish_list = Dish.query.filter(Dish.canteen_id == tar_id)
    dish_list_ = []
    for item in dish_list:
        dish_item = {}
        dish_item['name'] = item.name
        print(item.name)
        dish_item['price'] = item.price
        dish_item['comment'] = item.comment
        canteen_id = item.canteen_id
        #dish_item['canteen'] = Canteen.query.filter(id==canteen_id).first().name
        #print(f"canteen:{dish_item['canteen']}")
        dish_list_.append(dish_item)
    ca_info['dish_list'] = dish_list_
    return ca_info, 200


@canteen.route('/canteen/add', methods=['GET', 'POST'])
def add_canteen_location():
    data = request.json
    new_canteen = Canteen()
    new_id = int(Canteen.query.order_by(db.desc(Canteen.id)).first().id) + 1
    new_canteen.id = str(new_id)
    new_canteen.name = data.get("name")
    new_canteen.latitude = data.get("latitude")
    new_canteen.longitude = data.get("longitude")
    new_canteen.location = data.get("location")
    new_canteen.business_hours = data.get("business_hours")
    new_canteen.payment = int(data.get("payment"))
    new_canteen.star = 5
    img_list = data.get("img")
    url_list = ""
    for index, img in enumerate(img_list):
        filename = str(data.get('name')) + str(index) + ".jpg"
        filepath = "backend/static/images/" + filename
        file = open(filepath, "wb")
        file.write(base64.b64decode(img))
        file.close()
        url_list = url_list + "http://127.0.0.1:5000/static/images/" + filename + ","
    url_list = url_list[:-1]
    new_canteen.img = url_list
    db.session.add(new_canteen)
    db.session.commit()
    print(len(data.get("img")))
    return "ok", 200
