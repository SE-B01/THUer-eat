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
    information_list = Information.query.order_by(Information.update_time.desc()).filter_by(user=user_id).all()
    return_list=[]
    print('哈哈哈哈哈哈哈哈')
    print(user_id)
    for information_list_item in information_list:
        print('information_list_item',information_list_item)
        canteen = Canteen.query.filter_by(id=information_list_item.responser).first()
        create_time=information_list_item.create_time.strftime("%Y/%m/%d")
        update_time=information_list_item.update_time.strftime("%Y/%m/%d")
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
            'update_time': update_time,
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

@information.route('/reply_feedback', methods=['GET', 'POST'])
def reply_feedback():
    content_ = request.args.get('content')
    feedbackid = request.args.get('feedbackid')
    userid = request.args.get('userid')
    print(content_)
    print(feedbackid)
    print(userid)
    feedback_item = Feedback.query.filter_by(id=feedbackid).first()
    information = Information()
    information.informations = content_
    information.create_time = feedback_item.time
    information.update_time = datetime.now()
    information.user = feedback_item.userid
    information.responser=1
    information.feedbackid=feedbackid
    db.session.add(information)
    db.session.commit()

    feedback_item.processed=1
    db.session.commit()
    return "success", 200