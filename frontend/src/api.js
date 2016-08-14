/* globals API_ENDPOINT */
import { request, plugins } from 'popsicle'
import { decodeJwt, hello } from './jwt'

function post (url, body, headers = {}) {
  return new Promise((resolve, reject) => {
    request({ method: 'POST', url, body, headers })
    .use(plugins.parse('json'))
    .then(v => resolve(v.body))
    .catch(reject)
  })
}
function get (url, headers = {}) {
  return new Promise((resolve, reject) => {
    request({ method: 'GET', url, headers })
    .use(plugins.parse('json'))
    .then(v => resolve(v.body))
    .catch(reject)
  })
}
function getAuthToken () {
  return localStorage.getItem('auth_token')
}
function getClaims () {
  const token = getAuthToken()
  if (!token) return undefined
  return decodeJwt(token).claims
}
function getAuthHeader () {
  return {Authorization: `Bearer ${getAuthToken()}`}
}

const Api = {
  endpoint: '',
  signup (username, password) {
    return post(`${this.endpoint}/users`, {username, password})
  },
  login (username, password) {
    return post(`${this.endpoint}/login`, {username, password})
  },
  newTask (task) {
    const userId = getClaims().id
    return post(
      `${this.endpoint}/users/${userId}/tasks`, task, getAuthHeader()
    )
  },
  getAllTasks () {
    const userId = getClaims().id
    return get(
      `${this.endpoint}/users/${userId}/tasks`, getAuthHeader()
    )
  }
}

export default Api
