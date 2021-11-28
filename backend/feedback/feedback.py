from flask import Blueprint, request
from .models import Feedback, db
from datetime import datetime

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