from flask import Blueprint
from .models import Feedback

feedback = Blueprint('feedback', __name__)

@feedback.route('/', methods=['GET', 'POST'])
def index():
    feedback_ = Feedback.query.first()
    return feedback_.content, 200