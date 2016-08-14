import Store from 'utils/store'

const todos = new Store({
  todos: []
}, {
  update (data) {
    this.todos = data
  },
  addTodo (todo) {
    this.todos.push(todo)
  }
})

export default todos
