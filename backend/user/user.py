import base64
import json
from os import access
import urllib
from datetime import datetime

from flask import Blueprint, request,jsonify
from .models import User
from ..accessToken.models import AccessToken

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
        print('res_jssssssssssssssssssssssss')
        print(res_js)
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

@user.route('/searchUserinfo', methods=['GET', 'POST'])
def searchUserinfo():
    openid = request.args.get("openid")
    User_query = User.query.filter_by(id=openid)
    return_list=[]
    for User_query_index in User_query:
        print(User_query_index.to_json())
    
        return_list.append(User_query_index.to_json())
    return jsonify(return_list), 200


@user.route('/changeUserinfo', methods=['GET', 'POST'])
def changeUserinfo():
    data = request.json
    # print(data.get("nickName"))
    tar_user = User.query.filter(User.id == data.get("id")).first()
    # print(tar_user.gender)
    tar_user.nickname = data.get("nickname")
    tar_user.gender = data.get("gender")
    tar_user.is_in_school = data.get("is_in_school")
    if data.get("imgBase64"):
        print(data.get("imgBase64"))
        filename = tar_user.id + ".jpg"
        filepath = "backend/static/images/" + filename
        file = open(filepath, "wb")
        file.write(base64.b64decode(data.get("imgBase64")))
        file.close()
        tar_user.avatarUrl = "http://127.0.0.1:5000/static/images/" + filename
    else:
        print("无新头像")
    db.session.commit()
    return "ok", 200

@user.route('/user/changeLiked', methods=['GET', 'POST'])
def changeUserLike():
    openid = request.args.get("user_id")
    like_changed = request.args.get("like_changed")
    former_user_likes = User.query.filter(User.id == openid).first.liked_appraise
    print(like_changed)


    pass


@user.route('/getAccessToken', methods=['GET', 'POST'])
def getAccessToken():
    print('getting accessToken')
    appid = 'wxf14afe0de0f6f4e7'
    secret="dedff9f3f672f0b085e33b5293ffb036"
    url = "https://api.weixin.qq.com/cgi-bin/token"
    url += "?appid={}".format(appid)
    url += "&secret={}".format(secret)
    url += "&grant_type=client_credential"
    req = urllib.request.Request(url=url)
    res = urllib.request.urlopen(req)
    res = eval(bytes.decode(res.read()))
    access_token = res['access_token']
    print('AccessToken.first()')
    print(AccessToken.query().filter_by(id==1).first())
    for each in AccessToken.query(AccessToken.id==1).first():
        print(each)

    print('got accessToken')
    print(access_token)
    return 200