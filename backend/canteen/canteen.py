import base64
from flask import Blueprint, request, jsonify
from .models import Canteen
from ..db import db
from ..appraise.models import Appraise
from ..dish.models import Dish
from ..user.models import User
from ..config import ip_address
from math import radians, cos, sin, asin, sqrt
import json


canteen = Blueprint('canteen', __name__)

# 计算两个经纬度坐标之间的距离，单位米
def geodistance(lng1, lat1, lng2, lat2, ):
    # lng1, lat1 = (116.326157, 40.010952)
    lng1, lat1, lng2, lat2 = map(radians, [float(lng1), float(lat1), float(lng2), float(lat2)])  # 经纬度转换成弧度
    dlon = lng2 - lng1
    dlat = lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    distance = 2 * asin(sqrt(a)) * 6371 * 1000  # 地球平均半径，6371km
    return distance


@canteen.route('/canteen_test', methods=['GET', 'POST'])
def canteen_example():
    canteen_ = Canteen.query.first()
    return canteen_.name, 200


@canteen.route('/canteen/edit', methods=['POST'])
def edit_canteen():
    data = request.json
    canteen_id = data.get('canteen_id')
    name = data.get('name')
    location = data.get('location')
    business_hours = data.get('business_hours')
    payment = data.get('payment')
    img = data.get('img')
    canteen = Canteen.query.filter_by(id=canteen_id).first()
    canteen.name = name
    canteen.location = location
    canteen.business_hours = business_hours
    canteen.payment = payment
    img_list = data.get("img")
    url_list = ""
    for index, img in enumerate(img_list):
        filename = str(data.get('name')) + str(index) + ".jpg"
        filepath = "backend/static/images/" + filename
        file = open(filepath, "wb")
        file.write(base64.b64decode(img))
        file.close()
        url_list = url_list + "https://thuer-eat.whiteffire.cn:5000/static/images/" + filename + ","
    url_list = url_list[:-1]
    canteen.img = url_list
    db.session().commit()
    return 'success', 200


@canteen.route('/get_select_canteens', methods=['GET', 'POST'])
def get_select_canteens():
    """
    根据筛选条件返回餐厅
    get_new_lines:是利用当前条件继续读取数据，还是重新获得数据
    now_lines:当前数据条数

    条件: list
    distance:  0: 不限距离  1: <500m  2: <1km  3: <3km
    style:     0: 风格不限 1: 个人独享 2: 朋友小聚 3:宴请四方
    payment:   0: 支付方式不限 1:仅支持校园卡 2:可以使用支付宝
    sortby:    0: 智能排序 1: 好评优先 2: 距离优先
    
    """
    batch_size = 5  # 每次刷新的条数

    get_new_lines = request.args.get("get_new_lines")
    now_lines = int(request.args.get("now_lines"))
    distance = request.args.get("distance")
    style = request.args.get("style")
    payment = request.args.get("payment")
    sortby = request.args.get("sortby")
    lon = request.args.get("longitude")
    lat = request.args.get("latitude")

    limit = ""
    distance_limits = [0, 500, 1000, 3000]
    distance_limit = 0
    select_style = False

    if distance != "0":
        distance_limit = distance_limits[int(distance)]
    if payment != "0":
        limit += ".filter_by(payment={})".format(payment)
    if style != "0":
        select_style = True
    if limit == "":
        limit = ".all()"

    query_limit = "Canteen.query" + limit
    # print(query_limit)
    canteen_ = eval(query_limit)
    # print(canteen_)

    canteen_list = []
    for canteen in canteen_:
        if select_style:
            try:
                canteen_style = canteen.style.split(";")
            except:
                canteen_style = []
            if style not in canteen_style:
                continue

        if distance_limit != 0:
            if geodistance(lon, lat, canteen.longitude, canteen.latitude) > distance_limit:
                # print(canteen.name,geodistance(lon, lat, canteen.longitude, canteen.latitude))
                continue
        canteen_info = canteen.to_json()
        try:
            canteen_info['img'] = canteen.img.split(',')

        except:

            canteen_img = []
            canteen_img.append(canteen.img)
            canteen_info['img'] = canteen_img
        canteen_list.append(canteen_info)
    if get_new_lines == "false":
        canteen_list = canteen_list[:batch_size]
    else:
        canteen_list = canteen_list[now_lines:now_lines + batch_size]
    # print(canteen_list)
    # print(geodistance(lon, lat, canteen_list[0]['longitude'], canteen_list[0]['latitude']))
    canteen_json = jsonify(canteen_list)
    return canteen_json, 200


@canteen.route('/canteen/search', methods=['GET', 'POST'])
def get_search_canteen():
    batch_size = 10  # 每次刷新的条数

    get_new_lines = request.args.get("get_new_lines")
    now_lines = int(request.args.get("now_lines"))
    text = request.args.get("text")
    # ca：数据库中目标食堂条目
    canteen_ = Canteen.query.filter(Canteen.name.like("%{}%".format(text)))

    canteen_list = []
    for canteen in canteen_:
        # print(canteen.to_json())
        canteen_info = canteen.to_json()
        # print(canteen.img)
        try:
            canteen_info['img'] = canteen.img.split(',')
            # print(canteen_info['img'])
        except:
            # print(canteen_info['name'])
            canteen_img = []
            canteen_img.append(canteen.img)
            canteen_info['img'] = canteen_img
        canteen_list.append(canteen_info)
    if get_new_lines == "false":
        canteen_list = canteen_list[:batch_size]
    else:
        canteen_list = canteen_list[now_lines:now_lines + batch_size]
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
    ca_info = {"id": ca.id,
               "location": ca.location,
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
        if not item.is_publish:
            continue
        # print(item)
        user_info = {}
        # print(item.user_id)
        if item.anonymous:
            user_info["avatar"] = "../../images/icons/user-unlogin.png"
            user_info["name"] = "匿名用户"
        else:
            user = User.query.filter(User.id == item.user_id).first()
        # print(user.nickname)
            user_info['avatar'] = user.avatarUrl
            user_info['name'] = user.nickname
        img_list = None
        hidden = False
        if item.img_list == '':
            img_list = None
        else:
            hidden = True
            try:
                img_list = item.img_list.split(',')
                img_list = img_list[0]
            except:
                img_list = item.img_list
                # img_list = []
                # img_list.append(item.img_list)
                pass
        # print(f'hidden: {hidden}, img_list: {img_list}')
        ap_list.append(
            {
            "id": item.id,
            "user_id": item.user_id,
            "anonymous": item.anonymous,
            "hidden": hidden,
            "img_list": img_list,
            #"star": item.star,
            "comment": item.comment,
            "like": item.like,
            #"dish": item.dish,
            #"cost": item.cost,
            "user_name": user_info["name"],
            "user_avatar": user_info["avatar"]
             })
    ca_info["ap_list"] = ap_list
    dish_list = Dish.query.filter(Dish.canteen_id == ca.id)
    dish_list_ = []
    for item in dish_list:
        dish_item = {}
        dish_item['name'] = item.name
        dish_item['image'] = item.img
        # print(item.name)
        dish_item['price'] = item.price
        dish_item['comment'] = item.comment
        canteen_id = item.canteen_id
        dish_item['canteen'] = Canteen.query.filter(Canteen.id == canteen_id).first().name
        # print(f"canteen: {dish_item['canteen']}")
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
        markers['markers'].append(marker)
    return markers, 200


@canteen.route('/canteen/get_byid', methods=['GET', 'POST'])
def get_canteen_byid():
    canteen_id = request.args.get("id")
    # ca：数据库中目标食堂条目
    canteen_name = Canteen.query.filter(Canteen.id == canteen_id).first().name
    canteen_name = canteen_name.split("-")[0]
    print(canteen_name)
    canteen_ = Canteen.query.filter(Canteen.name.like("%{}%".format(canteen_name)))
    canteen_list = []
    for canteen in canteen_:
        # print(canteen.to_json())
        canteen_info = canteen.to_json()
        # print(canteen.img)
        try:
            canteen_info['img'] = canteen.img.split(',')
            # print(canteen_info['img'])
        except:
            # print(canteen_info['name'])
            canteen_img = []
            canteen_img.append(canteen.img)
            canteen_info['img'] = canteen_img
        canteen_list.append(canteen_info)
    canteen_json = jsonify(canteen_list)
    return canteen_json, 200


@canteen.route('/canteen/add', methods=['GET', 'POST'])
def add_canteen():
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
        url_list = url_list + "https://thuer-eat.whiteffire.cn:5000/static/images/" + filename + ","
    url_list = url_list[:-1]
    new_canteen.img = url_list
    db.session.add(new_canteen)
    db.session.commit()
    print(len(data.get("img")))
    return "ok", 200
