import { h, Component } from 'preact'
import NewTodoForm from 'components/NewTodoForm'
import TodoList from 'components/TodoList'
import LoginSignupForm from 'components/LoginSignupForm'
import './style.css'

import Api from 'src/api'
import Auth from 'src/auth'
import Todos from 'src/todos'

export default class App extends Component {
  constructor () {
    super()
    this.state.isAuthed = Auth.isAuthed
    this.state.todos = Todos.todos
  }
  componentWillMount () {
    Auth.subscribe((k, v) => { this.setState(v) })
    Auth.dispatch('update')
    Todos.subscribe((k, v) => { this.setState(v) })
  }
  render () {
    let tasksRemaining = this.state.todos.filter(v => !v.completed).length
    return (
      <div>
        <div className="top-left">
          { this.renderTop() }
        </div>
        <div class="app">
          <header class="app-header">
            <h1>Todos</h1>
          </header>
          <NewTodoForm/>
          <TodoList/>
          <footer class="app-footer">
            <span>{tasksRemaining} items left</span>
            <button class="complete-all-btn">Mark all as complete</button>
          </footer>
        </div>
      </div>
    )
  }
  renderTop () {
    if (this.state.isAuthed) {
      return <div>
        <span>Hi {this.state.claims.username} </span>
        <button onClick={() => this.logout()}>logout</button>
      </div>
    }

    return <LoginSignupForm/>
  }
  logout () {
    Auth.dispatch('setAuthToken', undefined)
  }
}
