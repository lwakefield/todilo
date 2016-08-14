/* globals API_ENDPOINT */
import { request, plugins } from 'popsicle'
import { decodeJwt, hello } from './jwt'

function patch (url, body, headers = {}) {
  return new Promise((resolve, reject) => {
    request({ method: 'PATCH', url, body, headers })
    .use(plugins.parse('json'))
    .then(v => resolve(v.body))
    .catch(reject)
  })
}
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
    const claims = getClaims()
    return post(
      `${this.endpoint}/users/${claims.id}/tasks`, task, getAuthHeader()
    )
  },
  getAllTasks () {
    const claims = getClaims()
    return get(
      `${this.endpoint}/users/${claims.id}/tasks`, getAuthHeader()
    )
  },
  updateTask (id, task) {
    const claims = getClaims()
    return patch(
      `${this.endpoint}/users/${claims.id}/tasks/${id}`, task, getAuthHeader()
    )
  }
}

export default Api
