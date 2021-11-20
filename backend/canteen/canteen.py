from flask import Blueprint, request
from .models import Canteen
from ..appraise.models import Appraise

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
def get_canteen():
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
        print(item)
        ap_list.append(
            {"user_id": item.user_id, "anonymous": item.anonymous, "img_list": item.img_list, "star": item.star,
             "comment": item.comment, "dish": item.dish, "cost": item.cost})
    ca_info["ap_list"] = ap_list
    return ca_info, 200
    # return canteen_, 200
