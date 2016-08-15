/* eslint-env mocha */
import { expect } from 'chai'
import Api from '../../src/api'
Api.endpoint = 'http://localhost:5000'

const randStr = () => Math.random().toString(36).slice(2)
const localStorage = {
  data: {},
  getItem (key) { return this.data[key] },
  setItem (key, val) { this.data[key] = val }
}
global.localStorage = localStorage

describe('Api', () => {
  it('can signup', done => {
    Api.signup(randStr(), randStr())
    .then(v => {
      expect(v).to.have.property('username')
      expect(v).to.have.property('id')
      done()
    })
  })
  let authToken
  it('can login', done => {
    const [username, password] = [randStr(), randStr()]
    Api.signup(username, password)
    .then(() => Api.login(username, password))
    .then(v => {
      expect(v).to.have.property('auth_token')
      localStorage.setItem('auth_token', v.auth_token)
      done()
    })
  })
  it('can create a task', done => {
    Api.newTask({text: 'hello world'})
    .then(v => {
      expect(v).to.have.property('id')
      expect(v).to.have.property('text')
      expect(v).to.have.property('completed')
      done()
    })
  })
  it('can list all tasks', done => {
    Api.getAllTasks()
    .then(v => {
      expect(v).to.be.a('array')
      done()
    })
  })
  it('can complete all tasks', done => {
    Promise.all([
      Api.newTask({text: 'hello world'}),
      Api.newTask({text: 'hello world'}),
      Api.newTask({text: 'hello world'})
    ]).then(v => Api.completeAll())
    .then(v => {
      v.forEach(v1 => expect(v1.completed).to.be.eql(true))
      done()
    })
  })
})
