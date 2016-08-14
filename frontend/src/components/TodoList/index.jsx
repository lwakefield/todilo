import { h, Component } from 'preact'
import './style.css'

import Todos from 'src/todos'
import Auth from 'src/auth'
import Api from 'src/api'

export default class TodoList extends Component {
  constructor () {
    super()
    this.state.todos = Todos.todos
  }
  componentWillMount () {
    Todos.subscribe((k, v) => this.setState(v))
    if (Auth.isAuthed) {
      Api.getAllTasks().then(v => Todos.dispatch('update', v))
    }
  }
  render () {
    return (
      <ul class="todo-list">
        { this.renderList() }
      </ul>
    )
  }
  renderList () {
    return this.state.todos.map(v => {
      const classes = v.completed ? 'todo todo-done' : 'todo'
      return (
        <li class={classes} key={v.id}>
          <label>
            <input type="checkbox" onChange={() => this.toggleComplete(v)}
            checked={v.completed}/>
            <span>{v.text}</span>
          </label>
        </li>
      )
    })
  }
  toggleComplete (todo) {
    const completed = !todo.completed
    Api.updateTask(todo.id, {completed})
    .then(v => Todos.dispatch('updateTodo', v))
  }
}
