import Store from 'utils/store'
import Auth from 'src/auth'

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
Auth.subscribe((k, v) => {
  if (!v.isAuthed) {
    todos.dispatch('update', [])
  }
})

export default todos
