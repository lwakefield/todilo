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
    session.signup()
    expect(browser.isExisting(`div*=Hi ${session.user}`)).to.eql(true)
  })
  it('logs out', () => {
    expect(browser.isExisting('button*=logout')).to.eql(true)
    browser.click('button*=logout')
    expect(browser.localStorage('GET', 'auth_token').value).to.eql(null)
    expect(browser.isExisting('button=login')).to.eql(true)
  })
  it('logs in', () => {
    session.login()
    expect(browser.isExisting(`div*=Hi ${session.user}`)).to.eql(true)
  })
  it('adds a task', () => {
    let text = session.addTask()
    expect(browser.isExisting(`li*=${text}`)).to.eql(true)
  })
  const extractTaskCount = v => parseInt(v.match(/\d+/)[0])
  it('completes a task', () => {
    let count = session.itemsLeftCount
    session.toggleTask(0)
    let td = browser.getCssProperty(`span*=${session.tasks[0]}`, 'text-decoration')
    expect(td.value).to.eql('line-through')
    expect(session.itemsLeftCount).to.eql(count - 1)
  })
  it('uncompletes a task', () => {
    let count = session.itemsLeftCount
    session.toggleTask(0)
    let td = browser.getCssProperty(`span*=${session.tasks[0]}`, 'text-decoration')
    expect(td.value).to.eql('none')
    expect(session.itemsLeftCount).to.eql(count + 1)
  })
  it('completes all tasks', () => {
    session.addTask()
    session.addTask()
    session.addTask()
    session.addTask()
    browser.click('button=Mark all as complete')
    session.tasks.forEach(v => {
      let td = browser.getCssProperty(`span*=${v}`, 'text-decoration').value
      expect(td).to.eql('line-through')
    })
  })
})

const session = {
  tasks: [],
  signup () {
    const [user, pass] = [randStr(), randStr()]
    this.user = user
    this.pass = pass
    browser.setValue('input[name="username"]', user)
    browser.setValue('input[name="password"]', pass)
    browser.click('button=signup')
    browser.waitUntil(() => {
      return !browser.isExisting('button=signup')
    }, 5000)
  },
  login () {
    browser.setValue('input[name="username"]', this.user)
    browser.setValue('input[name="password"]', this.pass)
    browser.click('button=login')
    browser.waitUntil(() => {
      return !browser.isExisting('button=login')
    }, 5000)
  },
  addTask () {
    let text = randStr()
    browser.setValue('#new-todo-form input', text)
    browser.click('#new-todo-form button')
    this.tasks.push(text)
    browser.waitUntil(() => {
      return browser.isExisting(`li*=${text}`)
    }, 5000)
    return text
  },
  toggleTask (id) {
    let el = browser.element(`li*=${this.tasks[0]}`)
    let span = browser.element(`span*=${this.tasks[0]}`)
    let td = span.getCssProperty('text-decoration').value
    el.element('label').click()
    browser.waitUntil(() => {
      return span.getCssProperty('text-decoration').value !== td
    }, 5000)
  },
  get itemsLeftText () {
    return browser.getText('span*=items left')
  },
  get itemsLeftCount () {
    return parseInt(this.itemsLeftText.match(/\d+/)[0])
  }
}
