/* eslint-env mocha  */
/* global browser, expect */

const randStr = () => Math.random().toString(36).slice(2)

describe('Todilo @watch', () => {
  before(() => {
    try {
      browser.localStorage('DELETE', 'auth_token')
    } catch (e) {}
  })
  it('loads root', () => {
    browser.url('localhost:8080')
    expect(browser.getTitle()).to.eql('Todilo')
    expect(browser.isExisting('h1*=Todos')).to.eql(true)
  })
  const [user, pass] = [randStr(), randStr()]
  it('signs up', () => {
    expect(browser.isExisting('button=signup')).to.eql(true)
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
  it('logs out', () => {
    expect(browser.isExisting('button*=logout')).to.eql(true)
    browser.click('button*=logout')
    expect(browser.localStorage('GET', 'auth_token').value).to.eql(null)
    expect(browser.isExisting('.login-signup-form')).to.eql(true)
  })
  it('logs in', () => {
    browser.setValue('input[name="username"]', user)
    browser.setValue('input[name="password"]', pass)
    browser.click('button=login')
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
