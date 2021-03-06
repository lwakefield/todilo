#!/usr/bin/python

from flask import Flask, request, jsonify, Response
from sqlite3 import dbapi2 as sqlite3
import json
import bcrypt
import jwt
from functools import wraps
from flask_cors import CORS, cross_origin

from peewee import *
from playhouse.flask_utils import FlaskDB
from playhouse.shortcuts import model_to_dict

app = Flask(__name__)
CORS(app)
with open(app.root_path+'/config.json') as f:
    app.config.update(json.loads(f.read()))
db = FlaskDB(app)

class User(db.Model):
    username = CharField(unique=True)
    password = CharField()

class Todo(db.Model):
    text = TextField()
    user = ForeignKeyField(User)
    priority = IntegerField()
    completed = BooleanField(default=False)

@app.route('/users', methods=['POST'])
def signup():
    data = request.get_json(force=True)
    username = data['username']
    password = data['password'].encode('ascii')

    user = new_user(username, password)
    return jsonify(
        model_to_dict(user, exclude=[User.password])
    )
def new_user(username, password):
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
    return User.create(username=username, password=hashed_password)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json(force=True)
    username = data['username']
    password = data['password'].encode('ascii')

    auth_token = get_auth_token(username, password)
    if auth_token == None: return Response(status=401)

    return jsonify({ 'auth_token': auth_token })
def get_auth_token(username, password):
    user = User.get(User.username == username)
    hashed_password = user.password.encode('ascii')
    verified = bcrypt.hashpw(password, hashed_password) == hashed_password

    if not verified: return None

    return jwt.encode({
        'id': user.id, 'username': user.username
    }, app.config['secret'], algorithm='HS256')

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

def is_user(id):
    return int(get_auth()['id']) == int(id)

@app.route('/users/<id>', methods=['GET'])
@requires_auth
def get_user(id):
    if not is_user(id): return Response(status=401)

    user = User.get(User.id == id)
    return jsonify(
        model_to_dict(user, exclude=[User.password])
    )

@app.route('/users/<int:user_id>/tasks', methods=['POST'])
@requires_auth
def new_task(user_id):
    if not is_user(user_id): return Response(status=401)

    data = request.get_json(force=True)
    text = data['text']
    completed = data['completed'] if 'completed' in data else False

    user = User.get(User.id == user_id)
    priority = Todo.select(fn.Max(Todo.priority)).where(Todo.user == user_id).scalar()
    priority = 0 if priority == None else priority + 1
    todo = Todo.create(
        text=text,
        completed=completed,
        user=user,
        priority=priority)

    return jsonify(
        model_to_dict(todo, exclude=[Todo.user])
    )

@app.route('/users/<int:user_id>/tasks', methods=['GET'])
@requires_auth
def get_tasks(user_id):
    if not is_user(user_id): return Response(status=401)

    todos = (Todo.select()
    .where(Todo.user == user_id)
    .order_by(Todo.priority.asc()))

    return jsonify(
        [model_to_dict(t, exclude=[Todo.user]) for t in todos]
    )

@app.route('/users/<int:user_id>/tasks', methods=['PATCH'])
@requires_auth
def update_tasks(user_id):
    if not is_user(user_id): return Response(status=401)

    data = request.get_json(force=True)
    if isinstance(data, list):
        for v in data:
            if not v['id']: continue
            Todo.update(**v).where(Todo.user == user_id, Todo.id == v['id']).execute()
    elif isinstance(data, dict):
        Todo.update(**data).where(Todo.user == user_id).execute()

    return get_tasks(user_id)


@app.route('/users/<int:user_id>/tasks/<int:todo_id>', methods=['GET'])
@requires_auth
def get_task(user_id, todo_id):
    if not is_user(user_id): return Response(status=401)

    todo = Todo.get(Todo.id == todo_id)
    if todo.user_id != user_id: return Response(status=401)
    return jsonify(model_to_dict(todo))

@app.route('/users/<int:user_id>/tasks/<int:todo_id>', methods=['PATCH'])
@requires_auth
def update_task(user_id, todo_id):
    if not is_user(user_id): return Response(status=401)
    todo = Todo.get(Todo.id == todo_id)
    if todo.user_id != user_id: return Response(status=401)

    data = request.get_json(force=True)
    Todo.update(**data).where(Todo.id == todo_id).execute()

    updated_data = model_to_dict(todo)
    updated_data.update(data)
    return jsonify(updated_data)

@app.route('/users/<int:user_id>/tasks/<int:todo_id>', methods=['DELETE'])
@requires_auth
def delete_task(user_id, todo_id):
    if not is_user(user_id): return Response(status=401)
    todo = Todo.get(Todo.id == todo_id)
    if todo.user_id != user_id: return Response(status=401)

    todo.delete_instance()

    return jsonify()

def main():
    init_db()
    from gevent.wsgi import WSGIServer
    http_server = WSGIServer(('', 5000), app)
    http_server.serve_forever()

def init_db():
    if app.config['env'] in ['testing', 'development']:
        db.database.drop_tables([User, Todo], safe=True)
    db.database.create_tables([User, Todo], safe=True)

if __name__ == '__main__':
    main()
