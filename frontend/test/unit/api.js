/* eslint-env mocha */
import { expect } from 'chai'
import Api from '../../src/api'
Api.endpoint = 'http://localhost:5000'

const randStr = () => Math.random().toString(36).slice(2)

describe('Api', () => {
  it('can signup', done => {
    Api.signup(randStr(), randStr())
    .then(v => {
      expect(v).to.have.property('username')
      expect(v).to.have.property('id')
      done()
    })
  })
  it('can login', done => {
    const [username, password] = [randStr(), randStr()]
    Api.signup(username, password)
    .then(() => Api.login(username, password))
    .then(v => {
      expect(v).to.have.property('auth_token')
      done()
    })
  })
})
