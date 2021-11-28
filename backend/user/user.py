import json
import urllib
from flask import Blueprint, request,jsonify
from .models import User
import sys
from . import models
from ..db import db
user = Blueprint('user', __name__)


def test_dataset():
    user = User.query.first()
    print(user.nickname)
    return user.nickname


@user.route('/user', methods=['GET', 'POST'])
def index():
    res = test_dataset()
    test = str(request.args.get("text"))
    print(test)
    return res, 200

@user.route('/getUserId', methods=['GET', 'POST'])
def getUserId():
    appid = request.args.get("appid")
    code = request.args.get("code")
    secret="dedff9f3f672f0b085e33b5293ffb036"
    url = "https://api.weixin.qq.com/sns/jscode2session"
    url += "?appid={}".format(appid)
    url += "&secret={}".format(secret)
    url += "&js_code={}".format(code)
    url += "&grant_type=authorization_code"
    url += "&connect_redirect=1"
    req = urllib.request.Request(url=url)
    res = urllib.request.urlopen(req)
    res = res.read()
    try:
        res_js = json.loads(res)
    except Exception as err:
        return res, 500
    # print('user-info-res')
    # print(res_js["openid"])
    # print('user-info-res-end')
    User_query = User.query.filter_by(id=res_js['openid'])
    print('User_query-begin')
    count_User_query_index = 0
    for User_query_index in User_query:
        print(User_query_index.to_json())
        count_User_query_index = 1
    print('User_query-end')
    return_list = []
    return_list.append(res_js)
    return_list.append(count_User_query_index)
    print(return_list)
    return jsonify(return_list), 200

@user.route('/insertUserinfo', methods=['GET', 'POST'])
def insertUserinfo():
    nickName = request.args.get("nickName")
    avatarUrl = request.args.get("avatarUrl")
    userInfo = json.loads(request.args.get("userInfo"))
    openid = request.args.get('openid')
    print('nickName',nickName)
    print('avatarUrl',avatarUrl)
    print('userInfo',userInfo)
    print('openid',openid)
    newuser=User( id=openid,avatarUrl=avatarUrl,gender=userInfo['gender'],is_admin=0,nickname=nickName,is_in_school=0)
    db.session.add(newuser)
    db.session.commit()
    db.session.close()
    return_list=['success']
    return jsonify(return_list), 200