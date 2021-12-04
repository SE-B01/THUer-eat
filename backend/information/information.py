from flask import Blueprint, request
from .models import Information, db
from datetime import datetime

information = Blueprint('information', __name__)

@information.route('/information_test', methods=['GET', 'POST'])
def index():

    # print(feedback_.content)
    return 'test', 200