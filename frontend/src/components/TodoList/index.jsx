import { h, Component } from 'preact'
import styles from './styles'

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
      <ul class={styles.list}>
        { this.renderList() }
      </ul>
    )
  }
  renderList () {
    return this.state.todos.map(v => {
      return (
        <li class={styles['list-item']} key={v.id}>
          <label>
            <input type="checkbox" onChange={() => this.toggleComplete(v)}
            checked={v.completed}/>
            <span class={v.completed ? styles.done : ''}>{v.text}</span>
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
