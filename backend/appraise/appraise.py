import tarfile
from datetime import datetime

from ..user.models import User
from ..canteen.models import Canteen
from ..appraise_dish_mapping.models import Appraise_dish_mapping
from ..dish.models import Dish
from flask import Blueprint, request, jsonify
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
def getAllAppraise():
    """
    获得评价广场的所有评论
    暂时按照好评数排序
    之后可能考虑综合从发表时间、好评数排序
    """
    batch_size = 20 # 每次刷新的条数

    get_new_lines = request.args.get("get_new_lines")
    now_lines = int(request.args.get("now_lines"))

    openid = request.args.get("user_id")
    appraise_ = Appraise.query.order_by(db.desc(Appraise.like)).all()
    liked_apprase_ = User.query.filter(User.id == openid).first().liked_appraise
    try:
        #liked_appraise用 ";" 分隔
        liked_appraise_list = liked_apprase_.split(";")
        
    except:
        liked_appraise_list = []

    appraise_list = []
    for appraise in appraise_:
        appraise_info = appraise.to_json()
        this_canteen = Canteen.query.filter(Canteen.id == appraise_info["canteen_id"]).first().name
        appraise_info["canteen_name"] = this_canteen
        try:
            appraise_info['img'] = appraise.img_list.split(',')[0]

        except:

            appraise_info["img"] = []

        if appraise_info["anonymous"]:
            appraise_info["avatar"] = "../../images/icons/user-unlogin.png"
            appraise_info["user_name"] = "匿名用户"
        else:
            this_user = User.query.filter(User.id == appraise_info["user_id"]).first()
            try: #这里赶紧把数据库里面user_id不对的删了
                appraise_info["avatar"] = this_user.avatarUrl
                appraise_info["user_name"] = this_user.nickname
            except:
                appraise_info["avatar"] = ""
                appraise_info["user_name"] = "匿名用户"
        if appraise_info["id"] in liked_appraise_list:
            appraise_info['isClick'] = True
        else:
            appraise_info['isClick'] = False
        appraise_list.append(appraise_info)
    
    if get_new_lines == "false":
        appraise_list = appraise_list[:batch_size]
    else:
        appraise_list = appraise_list[now_lines:now_lines + batch_size]


    appraise_json = jsonify(appraise_list)
    return appraise_json, 200

@appraise.route('/appraise/get_detail', methods=['GET', 'POST'])
def getDetailAppraise():
    """
    获得评论详情
    """
    openid = request.args.get("user_id")
    appraise_id = request.args.get("appraise_id")
    appraise_ = Appraise.query.filter(Appraise.id == appraise_id).first()
    liked_apprase_ = User.query.filter(User.id == openid).first().liked_appraise
    try:
        #liked_appraise用 ";" 分隔
        liked_appraise_list = liked_apprase_.split(";")
        
    except:
        liked_appraise_list = []


    appraise_info = appraise_.to_json()
    this_canteen = Canteen.query.filter(Canteen.id == appraise_info["canteen_id"]).first().name
    appraise_info["canteen_name"] = this_canteen
    try:
        appraise_info['img_list'] = appraise_.img_list.split(',')

    except:
        appraise_info["img_list"] = []

    if appraise_info["anonymous"]:
        appraise_info["avatar"] = "../../images/icons/user-unlogin.png"
        appraise_info["user_name"] = "匿名用户"
    else:
        this_user = User.query.filter(User.id == appraise_info["user_id"]).first()
        try: #这里赶紧把数据库里面user_id不对的删了
            appraise_info["avatar"] = this_user.avatarUrl
            appraise_info["user_name"] = this_user.nickname
        except:
            appraise_info["avatar"] = ""
            appraise_info["user_name"] = "匿名用户"

    if appraise_info["id"] in liked_appraise_list:
        appraise_info['isClick'] = True
    else:
        appraise_info['isClick'] = False

    appraise_json = jsonify(appraise_info)
    return appraise_json, 200

@appraise.route('/appraise/changeLiked', methods=['GET', 'POST'])
def changeUserLike():
    openid = request.args.get("user_id")
    like_changed_list = request.args.get("like_changed").split(";")
    target_user = User.query.filter(User.id == openid).first()
    target_user_likes = target_user.liked_appraise
    try:#如果当前用户有liked_appraise
        target_user_likes_list = target_user_likes.split(";")
        for like_changed in like_changed_list:
            target_appraise = Appraise.query.filter(Appraise.id == like_changed).first()
            if like_changed in target_user_likes_list:
                target_user_likes_list.remove(like_changed)
                target_appraise.like = target_appraise.like - 1
            else:
                target_user_likes_list.append(like_changed)
                target_appraise.like = target_appraise.like + 1
        target_user_likes = ";".join(target_user_likes_list)

    except:#如果当前用户liked_appraise is NULL
        target_user_likes = ";".join(like_changed_list)
        for like_changed in like_changed_list:
            target_appraise = Appraise.query.filter(Appraise.id == like_changed).first()
            target_appraise.like = target_appraise.like + 1

    
    target_user.liked_appraise = target_user_likes

    db.session.commit()
    
    return "ok", 200

