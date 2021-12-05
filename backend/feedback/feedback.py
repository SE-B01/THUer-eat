from flask import Blueprint, request,jsonify
from .models import Feedback, db
from datetime import datetime
from ..user.models import User
feedback = Blueprint('feedback', __name__)

@feedback.route('/feedback_test', methods=['GET', 'POST'])
def index():
    feedback_ = Feedback.query.first()
    # print(feedback_.content)
    return feedback_.content, 200

@feedback.route('/new_feedback', methods=['GET', 'POST'])
def new_feedback():
    content_ = request.args.get('content')
    # print(content_)
    feedback = Feedback()
    feedback.content = content_
    feedback.time = datetime.now()
    db.session.add(feedback)
    db.session.commit()
    return "success", 200

@feedback.route('/get_feedback', methods=['GET', 'POST'])
def get_recent_view():
    user_id = request.args.get('user_id')
    feedback_list = Feedback.query.order_by(Feedback.time.desc()).all()
    
    return_list=[]
    for feedback_list_item in feedback_list:
        try:
            feedback_time=feedback_list_item.time.strftime("%Y/%m/%d")
            user_item = User.query.filter_by(id=feedback_list_item.userid).first()
            if feedback_list_item.processed==0:
                done='未反馈'
            else:
                done='已反馈'
            return_list_item = {
                'name': user_item.nickname,
                'id': feedback_list_item.id,
                'contents': feedback_list_item.content,
                'time': feedback_time,
                'done':done
            }
            return_list.append(return_list_item)
        except Exception as err:
            print(err)
            continue
    return jsonify(return_list), 200