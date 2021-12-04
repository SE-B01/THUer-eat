from flask import Blueprint, request, jsonify
from .models import Information, db
from datetime import datetime
from ..canteen.models import Canteen
from ..feedback.models import Feedback
information = Blueprint('information', __name__)

@information.route('/information_test', methods=['GET', 'POST'])
def index():

    # print(feedback_.content)
    return 'test', 200

@information.route('/get_information', methods=['GET', 'POST'])
def get_information():
    user_id = request.args.get('user_id')
    information_list = Information.query.order_by(Information.create_time.desc()).filter_by(user=user_id).all()
    return_list=[]
    print('哈哈哈哈哈哈哈哈')
    print(user_id)
    for information_list_item in information_list:
        print('information_list_item',information_list_item)
        canteen = Canteen.query.filter_by(id=information_list_item.responser).first()
        create_time=information_list_item.create_time.strftime("%Y/%m/%d")
        print('feedback')
        print()
        try:
            feedback=Feedback.query.filter_by(id=information_list_item.feedbackid).first()
            feedback=feedback.content
        except Exception as err:
            print(err)
            feedback=''
        print('feedback')
        print(feedback)
        return_list_item = {
            'id': information_list_item.id,
            'create_time': create_time,
            'update_time': information_list_item.update_time,
            'informations': information_list_item.informations,
            'responder': canteen.name,
            'responder_image':canteen.img.split(',')[0],
            'feedback':feedback
        }
        return_list.append(return_list_item)
    print('list')
    print(return_list)

    return jsonify(return_list), 200

@information.route('/information_delete', methods=['GET', 'POST'])
def information_delete():
    user_id = request.args.get('user_id')
    information_id = request.args.get('information_id')
    print(user_id)
    print(information_id)
    Information_list = Information.query.filter_by(id=information_id,user=user_id)
    for each in Information_list:
        print(each.to_json())
        db.session.delete(each)
        db.session.commit()
        db.session.close()
    return_list=['success']
    return jsonify(return_list), 200