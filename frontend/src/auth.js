import Store from 'utils/store'

const auth = new Store({
  isAuthed: false,
  authToken: undefined,
  get claims () {
    if (!this.authToken) return undefined

    const [header, claims, sig] = this.authToken.split('.')
    return JSON.parse(atob(claims))
  }
}, {
  update () {
    this.authToken = localStorage.getItem('auth_token')
    this.isAuthed = !!this.authToken
  },
  setAuthToken (authToken) {
    if (!authToken) localStorage.removeItem('auth_token')
    else localStorage.setItem('auth_token', authToken)
    this.authToken = authToken
    this.isAuthed = !!authToken
  }
})

export default auth
