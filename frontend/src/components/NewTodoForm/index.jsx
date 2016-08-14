import { h, Component } from 'preact'
import './style.css'

export default class NewTodoForm extends Component {
  render () {
    return (
      <form class='new-todo-form'>
        <input type="text" placeholder="What needs to be done?"/>
        <button>Add Todo</button>
      </form>
    )
  }
}
