from flask import Flask, request, jsonify, Response
from sqlite3 import dbapi2 as sqlite3
import json
import bcrypt
import jwt
from functools import wraps

from peewee import *
from playhouse.flask_utils import FlaskDB
from playhouse.shortcuts import model_to_dict

app = Flask(__name__)
with open(app.root_path+'/config.json') as f:
    app.config.update(json.loads(f.read()))
db = FlaskDB(app)

class User(db.Model):
    username = CharField(unique=True)
    password = CharField()

class Todo(db.Model):
    text = TextField()
    user = ForeignKeyField(User, related_name='todos')
    completed = BooleanField(default=False)

@app.route('/users', methods=['POST'])
def signup():
    data = request.get_json(force=True)
    username = data['username']
    password = data['password'].encode('ascii')

    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
    user = User.create(username=username, password=hashed_password)

    return jsonify(
        model_to_dict(user, exclude=[User.password])
    )

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json(force=True)
    username = data['username']
    password = data['password'].encode('ascii')

    user = User.get(User.username == username)
    hashed_password = user.password.encode('ascii')
    verified = bcrypt.hashpw(password, hashed_password) == hashed_password
    if not verified: return Response(status=401)

    auth_token = jwt.encode({
        'id': user.id, 'username': user.username
    }, app.config['secret'], algorithm='HS256')
    return jsonify({
        'auth_token': auth_token
    })

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_token = request.headers['Authorization'].replace('Bearer ', '')
        try:
            get_auth()
            return f(*args, **kwargs)
        except jwt.InvalidTokenError:
            return Response(status=401)
    return decorated

def get_auth():
    auth_token = request.headers['Authorization'].replace('Bearer ', '')
    return jwt.decode(auth_token, app.config['secret'])

@app.route('/users/<id>', methods=['GET'])
@requires_auth
def getUser(id):
    if int(get_auth()['id'] )!= int(id): return Response(status=401)

    user = User.get(User.id == id)
    return jsonify(
        model_to_dict(user, exclude=[User.password])
    )

def main():
    init_db()
    app.run(debug=True)

def init_db():
    if app.config['env'] in ['testing', 'development']:
        db.database.drop_tables([User, Todo], safe=True)
    db.database.create_tables([User, Todo], safe=True)

if __name__ == '__main__':
    main()
