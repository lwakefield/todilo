/* eslint-env mocha  */
/* global browser, expect */

const goHome = () => browser.url('localhost:8080')

describe('Todilo @watch', () => {
  it('loads root', () => {
    browser.url('localhost:8080')
    expect(browser.getTitle()).to.eql('Todilo')
    expect(browser.isExisting('h1*=Todos')).to.eql(true)
  })
})
