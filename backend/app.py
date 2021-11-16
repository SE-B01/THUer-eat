from flask import Flask
from flask_cors import *
from flask import request, jsonify
import json

app = Flask(__name__)


@app.route('/')
def hello_world():
    data = [{'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5}]
    return json.dumps(data)
    #return 'Hello World!'

@app.route('/test')
def test():
    #param = request.get_json()
    param  = request.args.get('test')
    print(f'param: {param}')
    return 'Hello World!'

if __name__ == '__main__':
    app.run()
