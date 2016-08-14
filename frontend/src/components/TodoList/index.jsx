import { h, Component } from 'preact'
import './style.css'

export default class TodoList extends Component {
  render () {
    return (
      <ul class="todo-list">
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
}
