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
    Todos.subscribe((k, v) => { this.setState(v) })
    if (Auth.isAuthed) {
      Api.getAllTasks().then(v => Todos.dispatch('update', v))
    }
  }
  render () {
    return (
      <ul class="todo-list">
        { this.renderList() }
        <li class="todo">
          <label>
            <input type="checkbox"/>
            <span>Discuss report with John</span>
          </label>
        </li>
        <li class="todo todo-done">
          <label>
            <input type="checkbox" checked="true"/>
            <span>Get a haircut</span>
          </label>
        </li>
        <li class="todo todo-done">
          <label>
            <input type="checkbox" checked="true"/>
            <span>Pay electricity bill</span>
          </label>
        </li>
        <li class="todo">
          <label>
            <input type="checkbox"/>
            <span>Check gym hours</span>
          </label>
        </li>
      </ul>
    )
  }
  renderList () {
    return this.state.todos.map(v => {
      return (
        <li class="todo" key={v.id}>
          <label>
            <input type="checkbox"/>
            <span>{v.text}</span>
          </label>
        </li>
      )
    })
  }
}
