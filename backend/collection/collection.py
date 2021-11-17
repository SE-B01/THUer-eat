from flask import Blueprint
from .models import Collection

collection = Blueprint('collection', __name__)

@collection.route('/collection_test', methods=['GET', 'POST'])
def collection_example():
    collection_ = Collection.query.first()
    print(collection_)
    return str(collection_.rank), 200