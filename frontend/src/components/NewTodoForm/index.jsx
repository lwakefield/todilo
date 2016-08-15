import { h, Component } from 'preact'
import './style.css'

import Api from 'src/api'
import Todos from 'src/todos'

export default class NewTodoForm extends Component {
  render () {
    return (
      <form id="new-todo-form" class='new-todo-form' onClick={e => e.preventDefault()}>
        <input type="text" placeholder="What needs to be done?"
          ref={v => { this.todo = v }}/>
        <button onClick={() => this.newTodo()}>Add Todo</button>
      </form>
    )
  }
  newTodo () {
    Api.newTask({text: this.todo.value})
    .then(v => {
      Todos.dispatch('addTodo', v)
      this.todo.value = ''
    })
  }
}
