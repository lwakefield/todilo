import Store from 'utils/store'

const todos = new Store({
  todos: []
}, {
  update (data) {
    this.todos = data
  },
  addTodo (todo) {
    this.todos.push(todo)
  },
  updateTodo (todo) {
    const index = this.todos.findIndex(v => v.id === todo.id)
    this.todos[index] = todo
  }
})

export default todos
