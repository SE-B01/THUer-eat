from flask import Blueprint, request, jsonify
from .models import Image_
from ..dish.models import Dish
from ..db import db
from ..canteen.models import Canteen
import json
#import pymysql
#import base64

test_image = Blueprint('test_image', __name__)

@test_image.route('/test_img', methods=['GET', 'POST'])
def get_test_image():
    img = Image_.query.first()
   #print(test_img.img)
    return img.img, 200

@test_image.route('/get_image', methods=['GET', 'POST'])
def obtain_image():
    img_base64 = request.args.get('image_base64')
    img_name = request.args.get('image_name')
    print(f'img_name:{img_name}')
    #print(type(img_base64))
    new_image = Image_()
    new_image.img = img_base64
    new_image.img_name = img_name
    db.session.add(new_image)
    db.session.commit()
    return 'success', 200
