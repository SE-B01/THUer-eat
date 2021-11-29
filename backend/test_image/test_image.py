from flask import Blueprint, request, jsonify, url_for
from .models import Image_
from ..dish.models import Dish
from ..db import db
from ..canteen.models import Canteen
import json
#import pymysql
import base64

test_image = Blueprint('test_image', __name__)

@test_image.route('/test_img', methods=['GET', 'POST'])
def get_test_image():
    img = Image_.query.first()
   #print(test_img.img)
    return img.img, 200

@test_image.route('/get_image', methods=['GET', 'POST'])
def obtain_image():
    canteen_imgs = Canteen.query.first().img
    #img_base64 = request.args.get('image_base64')
    #url_for('static', filename='images/' +　img_name)
    #print(img_name)
    #print(f'img_name:{img_name}')
    #print(type(img_base64))
    #with open('/static/images/' + img_name, 'rb') as img_f:
    #    img_stream = base64.b64encode(img_f.read())
    #   s = img_stream.decode()
    #return jsonify({img: '127.0.0.1:5000/'})
    images = '{"images": ' + canteen_imgs + '}'
    return json.loads(images), 200
    #return jsonify({'images': canteen_imgs}), 200
