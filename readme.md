# TicTail Todo

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
