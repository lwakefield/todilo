import { h, Component } from 'preact'
import styles from './styles'

import LoginSignupForm from 'components/LoginSignupForm'

import Auth from 'src/auth'

export default class TopBar extends Component {
  componentWillMount () {
    Auth.subscribe((k, v) => { this.setState(v) })
    Auth.dispatch('update')
  }
  render () {
    return (
      <div class={styles.topbar}>
      {this.state.isAuthed
        ? this.renderLoggedIn()
        : <LoginSignupForm/> }
        </div>
    )
  }
  renderLoggedIn () {
    return <div>
      <span>Hi {this.state.claims.username} </span>
      <button class={styles.button} onClick={() => this.logout()}>logout</button>
    </div>
  }
  logout () {
    Auth.dispatch('setAuthToken', undefined)
  }
}
