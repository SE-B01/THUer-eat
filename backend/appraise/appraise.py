from flask import Blueprint, request
from .models import Appraise
import json

appraise = Blueprint('appraise', __name__)

@appraise.route('/appraise_test', methods=['GET', 'POST'])
def appraise_example():
    #appraise_ = Appraise.query.first()
    #appraise_dish_json = '{"appraise": ' + appraise_.dish + '}'
    #return json.loads(appraise_dish_json), 200

    args = request.args.get('test')
    print(args)
    return args, 200