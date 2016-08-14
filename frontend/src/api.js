/* globals API_ENDPOINT */
import { request, plugins } from 'popsicle'

function post (url, body) {
  return new Promise((resolve, reject) => {
    request({ method: 'POST', url, body })
    .use(plugins.parse('json'))
    .then(v => resolve(v.body))
    .catch(reject)
  })
}

const Api = {
  endpoint: '',
  signup (username, password) {
    return post(`${this.endpoint}/users`, {username, password})
  },
  login (username, password) {
    return post(`${this.endpoint}/login`, {username, password})
  }
}

export default Api
