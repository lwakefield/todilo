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
function getAuthHeader (authToken) {
  return {Authorization: `Bearer ${authToken}`}
}

const Api = {
  endpoint: '',
  signup (username, password) {
    return post(`${this.endpoint}/users`, {username, password})
  },
  login (username, password) {
    return post(`${this.endpoint}/login`, {username, password})
  },
  newTask (token, task) {
    const userId = decodeJwt(token).claims.id
    return post(
      `${this.endpoint}/users/${userId}/tasks`, task, getAuthHeader(token)
    )
  },
  getAllTasks (token) {
    const userId = decodeJwt(token).claims.id
    return get(
      `${this.endpoint}/users/${userId}/tasks`, getAuthHeader(token)
    )
  }
}

export default Api
