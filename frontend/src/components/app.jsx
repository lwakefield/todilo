import { h, Component } from 'preact'
import NewTodoForm from 'components/NewTodoForm'
import TodoList from 'components/TodoList'
import LoginSignupForm from 'components/LoginSignupForm'
import TopBar from 'components/TopBar'
import styles from './styles'

import Api from 'src/api'
import Todos from 'src/todos'
import Auth from 'src/auth'

export default class App extends Component {
  constructor () {
    super()
    this.state.todos = Todos.todos
  }
  componentWillMount () {
    Todos.subscribe((k, v) => { this.setState(v) })
    Auth.subscribe((k, v) => { this.setState(v) })
  }
  render () {
    let tasksRemaining = this.state.todos.filter(v => !v.completed).length
    return (
      <div>
        <TopBar />
        <div class={styles.app}>
          <div class={!this.state.isAuthed ? styles.blur : ''}>
            <header class={styles.header}>
              <h1>Todos</h1>
            </header>
            <NewTodoForm/>
            <TodoList/>
            <footer class={styles.footer}>
              <span>{tasksRemaining} items left</span>
              <button class={styles.button}
                onClick={() => this.completeAll()}>Mark all as complete</button>
            </footer>
          </div>
          { this.renderOverlay() }
        </div>
      </div>
    )
  }
  renderOverlay () {
    if (this.state.isAuthed) return null

    return <div class={styles.overlay}>Login to get started</div>
  }
  completeAll () {
    Api.completeAll()
    .then(v => Todos.dispatch('update', v))
  }
}
