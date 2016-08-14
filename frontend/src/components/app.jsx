import { h, Component } from 'preact'
import NewTodoForm from 'components/NewTodoForm'
import TodoList from 'components/TodoList'
import './style.css'

import Api from 'src/api'
import Auth from 'src/auth'

export default class App extends Component {
  constructor () {
    super()
    this.state.isAuthed = Auth.isAuthed
  }
  componentWillMount () {
    Auth.subscribe((k, v) => { this.setState(v) })
    Auth.dispatch('update')
  }
  render () {
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
            <span>2 items left</span>
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

    return (
      <form class="login-signup-form" onSubmit={e => e.preventDefault()}>
        <input type="text" placeholder="user79" name="username"
          ref={v => { this.username = v }}/>
        <input type="password" placeholder="mysecretpassword" name="password"
          ref={v => { this.password = v }}/>
        <button>login</button>
        <span>/</span>
        <button onClick={() => this.signup()}>signup</button>
      </form>
    )
  }
  signup () {
    const [user, pass] = [this.username.value, this.password.value]
    Api.signup(user, pass)
    .then(() => Api.login(user, pass))
    .then(v => {
      Auth.dispatch('setAuthToken', v.auth_token)
    })
  }
  logout () {
    Auth.dispatch('setAuthToken', undefined)
  }
}
