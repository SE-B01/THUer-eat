import json

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
