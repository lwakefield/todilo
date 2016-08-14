import { h, Component } from 'preact'
import NewTodoForm from 'components/NewTodoForm'
import TodoList from 'components/TodoList'
import './style.css'

export default class App extends Component {
  render () {
    return (
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
    )
  }
}
