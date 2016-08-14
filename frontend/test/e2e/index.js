/* eslint-env mocha  */
/* global browser, expect */

const randStr = () => Math.random().toString(36).slice(2)

describe('Todilo @watch', () => {
  before(() => {
    browser.localStorage('DELETE', 'auth_token')
  })
  it('loads root', () => {
    browser.url('localhost:8080')
    expect(browser.getTitle()).to.eql('Todilo')
    expect(browser.isExisting('h1*=Todos')).to.eql(true)
  })
  it('signs up', () => {
    expect(browser.isExisting('button=signup')).to.eql(true)
    const [user, pass] = [randStr(), randStr()]
    browser.setValue('input[name="username"]', user)
    browser.setValue('input[name="password"]', pass)
    browser.click('button=signup')
    browser.waitUntil(() => {
      return !!browser.localStorage('GET', 'auth_token')
    }, 5000)
    browser.waitUntil(() => {
      return !browser.isExisting('form.login-signup-form')
    }, 5000)
    expect(browser.isExisting('form.login-signup-form')).to.eql(false)
    expect(browser.isExisting(`.top-left*=Hi ${user}`)).to.eql(true)
  })
})
