import { h, Component } from 'preact'
import styles from './styles'

import Api from 'src/api'
import Auth from 'src/auth'

export default class LoginSignupForm extends Component {
  render () {
    return (
      <form class={styles.form} onSubmit={e => e.preventDefault()}>
        <input type="text" placeholder="user79" name="username"
          ref={v => { this.username = v }}/>
        <input type="password" placeholder="mysecretpassword" name="password"
          ref={v => { this.password = v }}/>
        <button onClick={() => this.login()}>login</button>
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
      this.username.value = ''
      this.password.value = ''
      Auth.dispatch('setAuthToken', v.auth_token)
    })
  }
  login () {
    const [user, pass] = [this.username.value, this.password.value]
    Api.login(user, pass)
    .then(v => {
      this.username.value = ''
      this.password.value = ''
      Auth.dispatch('setAuthToken', v.auth_token)
    })
  }
}
