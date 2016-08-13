import os
import unittest
import tempfile
import json
from json import loads, dumps
import random
import string

import app
from app import User, Todo

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

    def signup(self):
        user_data = {
            'username': rand_str(16),
            'password': rand_str(16)
        }
        rv = self.app.post('/users', data=dumps(user_data))
        return (user_data, rv)

    def test_signup(self):
        user_data, rv = self.signup()
        assert rv.status_code == 200
        data = loads(rv.data)
        assert data['username'] == user_data['username']
        assert 'password' not in data
        assert 'id' in data

        user = User.get(User.id == data['id'])
        assert user is not None

    def login(self, data):
         return self.app.post('/login', data=dumps(data))

    def test_login(self):
        user_data, rv = self.signup()
        rv = self.login(user_data)
        assert rv.status_code == 200
        data = loads(rv.data)
        assert data['auth_token'] != None

        fake_user = {
            'username': user_data['username'],
            'password': 'fake'
        }
        rv = self.app.post('/login', data=dumps(fake_user))
        assert rv.status_code == 401

    def test_get_user(self):
        user_data, r = self.signup()
        user_id = loads(r.data)['id']
        r = self.login(user_data)
        auth_token = loads(r.data)['auth_token']

        res = self.app.get('/users/{0}'.format(user_id),
            headers={'Authorization': 'Bearer {0}'.format(auth_token)})
        assert res.status_code == 200
        data = loads(res.data)
        assert data['id'] == user_id
        assert data['username'] == user_data['username']

        fake_user_data, r = self.signup()
        r = self.login(fake_user_data)
        auth_token = loads(r.data)['auth_token']
        res = self.app.get('/users/{0}'.format(user_id),
            headers={'Authorization': 'Bearer {0}'.format(auth_token)})
        assert res.status_code == 401

if __name__ == '__main__':
    unittest.main()
