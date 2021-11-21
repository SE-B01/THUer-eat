from flask import Blueprint, request
from .models import Canteen
from ..appraise.models import Appraise
from ..dish.models import Dish

canteen = Blueprint('canteen', __name__)


@canteen.route('/canteen_test', methods=['GET', 'POST'])
def canteen_example():
    canteen_ = Canteen.query.first()
    return canteen_.name, 200


@canteen.route('/get_all_canteens', methods=['GET', 'POST'])
def get_all_canteens():
    canteen_ = Canteen.query()
    # canteen_info_name = [canteen.name for canteen in canteen_]
    # canteen_info = {}
    # canteen_info['name'] = canteen_info_name
    print(canteen_)
    return canteen_, 200
    # return canteen_, 200


@canteen.route('/canteen/get', methods=['GET', 'POST'])
def get_canteen_info():
    name = request.args.get("name")
    # ca：数据库中目标食堂条目
    ca = Canteen.query.filter(Canteen.name == name).first()
    starlist = ['gray', 'gray', 'gray', 'gray', 'gray']
    for i in range(0, ca.star):
        starlist[i] = 'yellow'
    ca_info = {"location": ca.location, "payment": ca.payment, "starlist": starlist,
               "business_hours": ca.business_hours, "cost": ca.cost}
    # ap：数据库中目标食堂对应评价列表
    ap = Appraise.query.filter(Appraise.canteen_id == ca.id).order_by(Appraise.time)
    ap_list = []
    for item in ap:
        #print(item)
        ap_list.append(
            {"user_id": item.user_id, "anonymous": item.anonymous, "img_list": item.img_list, "star": item.star,
             "comment": item.comment, "dish": item.dish, "cost": item.cost})
    ca_info["ap_list"] = ap_list
    canteen = Canteen.query.filter(Canteen.name == name).first()
    dish_list = Dish.query.filter(Dish.canteen_id == canteen.id)
    dish_list_ = []
    for item in dish_list:
        dish_item = {}
        dish_item['name'] = item.name
        print(item.name)
        dish_item['price'] = item.price
        dish_item['comment'] = item.comment
        dish_list_.append(dish_item)
    ca_info['dish_list'] = dish_list_
    return ca_info, 200
    # return canteen_, 200
