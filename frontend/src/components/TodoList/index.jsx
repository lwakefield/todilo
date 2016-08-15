import { h, Component } from 'preact'
import styles from './styles'

import Todos from 'src/todos'
import Auth from 'src/auth'
import Api from 'src/api'
import Sortable from 'sortablejs'

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
      <ul class={styles.list} ref={v => this.initSortable(v)}>
        { this.renderList() }
      </ul>
    )
  }
  initSortable (ul) {
    // eslint-disable-next-line
    new Sortable(ul, {
      draggable: `.${styles['list-item']}`,
      handle: `.${styles.handle}`,
      onEnd: e => {
        let start = e.oldIndex < e.newIndex ? e.oldIndex : e.newIndex
        let end = e.oldIndex > e.newIndex ? e.oldIndex : e.newIndex
        // We get the chunk that we need to update, and copy with concat
        let todoChunk = this.state.todos.slice(start, end + 1).concat()

        // Apply the movement
        let from = e.oldIndex < e.newIndex ? 0 : todoChunk.length - 1
        let to = e.oldIndex > e.newIndex ? 0 : todoChunk.length - 1
        todoChunk.splice(to, 0, todoChunk.splice(from, 1)[0])

        // Get the updates to be made
        const priorities = todoChunk
        .map(v => v.priority)
        .sort((a, b) => a - b)
        const updates = todoChunk.map((v, k) => {
          return {id: v.id, priority: priorities[k]}
        })

        Api.bulkUpdate(updates)
        .then(v => Todos.dispatch('update', v))
      }
    })
  }
  renderList () {
    if (!this.state.todos.length) {
      return (
        <li class={styles['nothing-here']}>
          Get started by adding something todo...
        </li>
      )
    }
    return this.state.todos.map(v => {
      return (
        <li class={styles['list-item']} key={v.id}>
          <label>
            <input type="checkbox" onChange={() => this.toggleComplete(v)}
            checked={v.completed}/>
            <span class={v.completed ? styles.done : ''}>{v.text}</span>
          </label>
          <span class={styles.handle}>↕</span>
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
