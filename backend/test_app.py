import os
import unittest
import tempfile
import json
from json import loads, dumps
import random
import string

import app
from app import User, Todo, new_user, get_auth_token

def rand_str(n):
    all_chars = string.ascii_uppercase + string.ascii_lowercase + string.digits
    return ''.join(random.choice(all_chars) for _ in range(n))

class FlaskrTestCase(unittest.TestCase):

    def setUp(self):
        app.app.config['env'] = 'testing'
        app.app.config['TESTING'] = True
        self.app = app.app.test_client()
        with app.app.app_context():
            app.init_db()

    def tearDown(self):
        pass

    def test_signup(self):
        user = { 'username': rand_str(16), 'password': rand_str(16) }
        res = self.app.post('/users', data=dumps(user))
        assert res.status_code == 200
        data = loads(res.data)
        assert data['username'] == user['username']
        assert 'password' not in data
        assert 'id' in data

        assert User.get(User.id == data['id']) != None

    def new_user(self):
        username = rand_str(16)
        password = rand_str(16)
        user = new_user(username, password)
        return {'id': user.id, 'username': username, 'password': password}

    def test_login(self):
        user = self.new_user()
        res = self.app.post('/login', data=dumps({
            'username': user['username'],
            'password': user['password']
        }))
        assert res.status_code == 200
        data = loads(res.data)
        assert data['auth_token'] != None

    def test_login_with_wrong_auth(self):
        user = self.new_user()
        fake_user = {
            'username': user['username'],
            'password': 'fake'
        }
        res = self.app.post('/login', data=dumps(fake_user))
        assert res.status_code == 401

    def new_session(self):
        user = self.new_user()
        auth_token = get_auth_token(user['username'], user['password'])
        return (auth_token, user)

    def test_get_user(self):
        auth_token, user = self.new_session()

        res = self.app.get('/users/{0}'.format(user['id']),
            headers={'Authorization': 'Bearer {0}'.format(auth_token)})
        assert res.status_code == 200
        data = loads(res.data)
        assert data['id'] == user['id']
        assert data['username'] == user['username']

    def test_get_user_with_wrong_auth(self):
        _, user = self.new_session()
        fake_auth_token, _ = self.new_session()
        res = self.app.get('/users/{0}'.format(user['id']),
            headers={'Authorization': 'Bearer {0}'.format(fake_auth_token)})
        assert res.status_code == 401

    def test_new_task(self):
        auth_token, user = self.new_session()
        todo = {'text': 'hello world'}
        res = self.app.post('/users/{0}/tasks'.format(user['id']),
            headers={'Authorization': 'Bearer {0}'.format(auth_token)},
            data=dumps(todo))
        assert res.status_code == 200
        data = loads(res.data)
        assert data['id'] != None
        assert data['text'] == 'hello world'
        assert data['completed'] == False

        assert Todo.get(Todo.id == data['id']) != None

    def give_task(self, user_id):
        user = User.get(User.id == user_id)
        text = rand_str(16)
        todo = Todo.create(text=text, user=user)
        return {'id': todo.id, 'text': text}

    def test_get_tasks(self):
        auth_token, user = self.new_session()
        tasks = [
            self.give_task(user['id']),
            self.give_task(user['id']),
            self.give_task(user['id'])
        ]

        res = self.app.get('/users/{0}/tasks'.format(user['id']),
            headers={'Authorization': 'Bearer {0}'.format(auth_token)})

        assert res.status_code == 200
        data = loads(res.data)
        assert data[0] != None
        assert data[1] != None
        assert data[2] != None

    def test_get_task(self):
        auth_token, user = self.new_session()
        todo = self.give_task(user['id'])

        res = self.app.get(
            '/users/{0}/tasks/{1}'.format(user['id'], todo['id']),
            headers={'Authorization': 'Bearer {0}'.format(auth_token)})

        assert res.status_code == 200
        data = loads(res.data)
        assert data['id'] == todo['id']
        assert data['text'] == todo['text']

    def test_get_task_with_wrong_auth(self):
        _, user = self.new_session()
        todo = self.give_task(user['id'])

        fake_auth_token, fake_user = self.new_session()

        res = self.app.get(
            '/users/{0}/tasks/{1}'.format(fake_user['id'], todo['id']),
            headers={'Authorization': 'Bearer {0}'.format(fake_auth_token)})

        assert res.status_code == 401

    def test_update_task(self):
        auth_token, user = self.new_session()
        todo = self.give_task(user['id'])
        new_text = rand_str(16)

        res = self.app.patch('/users/{0}/tasks/{1}'.format(user['id'], todo['id']),
            headers={'Authorization': 'Bearer {0}'.format(auth_token)},
            data=dumps({'text': new_text, 'completed': True}))

        assert res.status_code == 200
        # data = loads(res.data)
        # assert data['text'] == new_text
        # assert data['completed'] == True

        updated_todo = Todo.get(Todo.id == todo['id'])
        assert updated_todo.text == new_text
        assert updated_todo.completed == True

if __name__ == '__main__':
    unittest.main()
