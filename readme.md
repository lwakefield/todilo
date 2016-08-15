# TicTail Todo

This is my solution to the TicTail coding challenge. It meets the specs provided in the initial README and it provides a design as close to pixel perfect as possible. This being said, there are a number of features that I would like to see added to the application and it is far from what *I* would call complete.

This repo contains both the code for the frontend and the backend, and are labelled as such.

Because there is a frontend and a backend to worry about, the setup is a little longer than I would normally like.

For the backend:

```
cd backend
pip install pyjwt peewee flask flask-cors gevent
./app.py
# A server should now be running on http://localhost:5000
```

For the frontend:

```
cd frontend
npm install
npm run dev
# A server should now be running on http://localhost:8080
```

## The Vision

I unfortunately do not have a time for the full implementation, but the vision was to implement the solution with a ['serverless'](http://martinfowler.com/bliki/Serverless.html) architecture, built on AWS:

- frontend is statically hosted on S3 so loading the page is fast.
- backend is hosted on a Lambda container, behind an API gateway. This means the backend is 100% horizontally scalable.

## Frontend

This solution uses [Preact](https://github.com/developit/preact) (a fast 3kB alternative to React), with my own custom Flux-like Store solution (check out `frontend/src/utils/store.js`). I tried to minimize dependencies as much as possible so the only other 3rd party library I pulled in was `sortablejs` to assist in the dragging/reordering of elements.

This solution uses WebPack to package the final build.

[Mocha](https://mochajs.org/)+[chai](http://chaijs.com/) are used for unit testing.
[Chimp](https://chimp.readme.io/) is used for e2e testing.
Note that for both of these, we need a backend available and running on `localhost:5000`

Otherwise, there is little novel code on the frontend! The final build (including CSS) is ~30kB minified and gzipped.

## Backend

The backend is running [Flask](flask.pocoo.org). Please note that I have never used Flask before. The backend can be run by `./backend/app.py` on port `5000` by default. I used [peewee](http://docs.peewee-orm.com/) for the ORM, though I wish I hadn't (I ran into a number of issues / lack of documentation).

For development, I am using an SQLite database (it gets cleared every time you restart the app). Though this can easily be extended to another database language since we are using peewee.

## Design considerations

Really the only design consideration was the authentication. I decided to use [JSON Web Tokens (JWT)](https://jwt.io/) for authentication. This is a form of stateless authentication, where the server does not need to know about who is currently authenticated. To login, the client passes credentials to the server, the server authenticates and returns a JWT. Whenever the client needs to access an route which requires auth, the client passes the request with the `Authorization: Bearer <TOKEN_HERE>` header.

# Design Specs

Below, are the living specs that I have been using to build the application.
There is no real format.

We are only interested in a single store, Todos.
We do want authentication.

1. Online Functionality
2. Offline Functionality

We will use JWT for authentication.
We aim to have our frontend and backend separated.

The intended architecture is something like this:

S3 Hosted Frontend <----> API <----> Database

## API

Our API will be restful and stateless (JWT).
We will prefer HTTP status codes instead of inventing our own message system.

We need to account for order/priority of tasks.

### Non-authenticated

POST /users - create a new user
POST /login - attempt to authenticate a user. if successful, return the created
  JWT

### Authenticated

GET /users/:id - return a user if the authenticated user matches

The following paths are associated with a user.
There is some internal conflict about laying paths like this as opposed to
`/tasks` that returns tasks for the authenticated user.
I want to leave the option for paths for say `/group/:id/tasks` and having a
path `/tasks` makes assumptions about the data that you want.

GET /user/:id/tasks - return tasks
POST /user/:id/tasks - create a new task and return the created task
PATCH /user/:id/tasks - make a bulk change to all tasks
DELETE /user/:id/tasks - delete all tasks

GET /user/:id/tasks/:id - return a task
PATCH /user/:id/tasks/:id - update a task and return the updated task
DELETE /user/:id/tasks/:id/ - delete a task

## Frontend

This is what I want the markup to look like.

<app>
  <header>
    <h1>Todos</h1>
  </header>

  <new-todo/>
  <todo-list/>

  <footer>
  </footer>
</app>

## Todo

- [ ] - http://docs.peewee-orm.com/projects/flask-peewee/en/latest/rest-api.html
- There is no list of exceptions in the PeeWee docs?
- [ ] Tasks should be named Todos instead
- [x] Title should be 'Todilo'
- [x] Todos should have a priority
- [ ] Error messages
- [ ] Messages store
- [x] Show message when there are no todos
- [x] Load todos on login
- [ ] Make sure config isn't set to dev when you deploy
