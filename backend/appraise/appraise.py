import tarfile
from datetime import datetime

from user.models import User
from ..canteen.models import Canteen
from ..appraise_dish_mapping.models import Appraise_dish_mapping
from ..dish.models import Dish
from flask import Blueprint, request
from .models import Appraise, db, Image
import json
from ..db import db
import os
import base64

appraise = Blueprint('appraise', __name__)


# 前端 -> 后端
@appraise.route('/appraise_test', methods=['GET', 'POST'])
def appraise_example():
    # appraise_ = Appraise.query.first()
    # appraise_dish_json = '{"appraise": ' + appraise_.dish + '}'
    # return json.loads(appraise_dish_json), 200
    return 'test', 200


@appraise.route('/appraise/publish', methods=['GET', 'POST'])
def publish_appraise():
    data = request.json  # 获取 JOSN 数据
    # ap：新建一条评价数据
    ap = Appraise()
    ap.comment = data.get('comment')
    ap.dish = ""
    for dish in data.get('dish'):
        dish_id = Dish.query.filter(Dish.name == dish, Dish.canteen_id == data.get('canteen_id')).first().id
        # print(dish_id)
        ad_map = Appraise_dish_mapping()
        ad_map.dish_id = dish_id
        ad_map.user_id = data.get('user_id')
        ad_map.appraise_id = ap.id
        db.session.add(ad_map)
        ap.dish = ap.dish + dish + ","
    ap.dish = ap.dish[:-1]
    ap.star = data.get('star')
    ap.time = datetime.now()
    ap.comment = data.get('comment')
    img_list = data.get('imgList')
    url_list = ""
    for index, img in enumerate(img_list):
        print(index)
        print(type(index))
        filename = str(data.get('user_id')) + "_" + datetime.now().strftime('%Y_%m_%d_%H_%M_%S') + "_" + str(index)+ ".jpg"
        filepath = "backend/static/images/"+filename
        file = open(filepath, "wb")
        file.write(base64.b64decode(img))
        file.close()
        url_list = url_list + '"http://127.0.0.1:5000/static/images/' + filename + '",'
    url_list = url_list[:-1]
    ap.img_list = url_list
    ap.user_id = str(data.get('user_id'))
    ap.cost = data.get('cost')
    ap.canteen_id = data.get('canteen_id')
    ap.anonymous = data.get('anonymous')
    ap.is_publish = data.get('is_publish')
    db.session.add(ap)
    db.session.commit()
    return "发表成功", 200


@appraise.route('/appraise/get', methods=['GET', 'POST'])
def get_canteen_info():
    canteen_name = request.args.get('canteen_name')  # 获取 JOSN 数据
    # ca:餐厅信息
    ca = Canteen.query.filter(Canteen.name == canteen_name).first()
    print(ca.id)
    # di: 菜品列表
    di = Dish.query.filter(Dish.canteen_id == ca.id)
    dish_list = []
    for dish in di:
        dish_list.append([dish.name, 0, "gray"])
    print(dish_list)
    canteen_info = {'id': ca.id, 'dish': dish_list}
    return canteen_info, 200

@appraise.route('/appraise/get_all', methods=['GET', 'POST'])
def get_all_appraise():
    """
    获得评价广场的所有评论
    暂时按照好评数排序

    """
    user_id = request.args.get("user_id")
    appraise = Appraise.query.all()
    liked_apprase = User.query.filtered(User.id == user_id)

    pass
    

