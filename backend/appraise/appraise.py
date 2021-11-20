from datetime import datetime
from ..canteen.models import Canteen
from ..dish.models import Dish
from flask import Blueprint, request
from .models import Appraise, db
import json
from ..db import db

appraise = Blueprint('appraise', __name__)


# 前端 -> 后端
@appraise.route('/appraise_test', methods=['GET', 'POST'])
def appraise_example():
    # appraise_ = Appraise.query.first()
    # appraise_dish_json = '{"appraise": ' + appraise_.dish + '}'
    # return json.loads(appraise_dish_json), 200

    args = request.args.get('test')
    print(args)
    return args, 200


@appraise.route('/appraise/publish', methods=['GET', 'POST'])
def get_appraise():
    # appraise_ = Appraise.query.first()
    # appraise_dish_json = '{"appraise": ' + appraise_.dish + '}'
    # return json.loads(appraise_dish_json), 200
    # new_appraise = request.get_data()
    data = request.json  # 获取 JOSN 数据
    ap = Appraise()
    ap.comment = data.get('comment')
    ap.dish = data.get('dish')
    ap.star = data.get('star')
    ap.time = datetime.now()
    ap.comment = data.get('comment')
    ap.img_list = data.get('imgList')
    ap.user_id = data.get('user_id')
    ap.cost = data.get('cost')
    ap.canteen_id = data.get('canteen_id')
    ap.anonymous = data.get('anonymous')
    ap.is_publish = data.get('is_publish')
    db.session.add(ap)
    db.session.commit()
    # data = data.get('obj')
    # print(type(new_appraise))
    print(type(data.get('time')))
    return "ok", 200


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
