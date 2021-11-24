import json
import urllib
from flask import Blueprint, request
from .models import User
import sys
from . import models

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
    return res, 200
