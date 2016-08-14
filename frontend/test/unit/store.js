import { expect } from 'chai'

import Store from '../../src/store'

describe('Store', () => {
  let store
  beforeEach(() => {
    store = new Store({
      messages: []
    }, {
      addMessage (message) {
        this.messages.push(message)
      }
    })
  })
  it('instantiates correctly', () => {
    expect(store).to.have.property('listeners')
    expect(store).to.have.property('state')
    expect(store).to.have.property('mutations')
    expect(store).to.have.property('messages')
  })
  it('mutations work', () => {
    store.dispatch('addMessage', 'hello')
    expect(store.messages).to.eql(['hello'])
    expect(store.state.messages).to.eql(['hello'])
  })
  it('listeners work', () => {
    let count = 0
    store.on('addMessage', () => count++)
    store.dispatch('addMessage', 'hello')
    expect(count).to.eql(1)
  })
  it('deregisters listeners', () => {
    let count = 0
    function incr () { count++ }
    store.on('addMessage', incr)
    store.dispatch('addMessage', 'hello')
    expect(count).to.eql(1)
    store.off('addMessage', incr)
    store.dispatch('addMessage', 'world')
    expect(count).to.eql(1)
  })
  it('subscribes', () => {
    let mutation
    let state
    store.subscribe((m,s) => {
      mutation = m
      state = s
    })
    store.dispatch('addMessage', 'hello')
    expect(mutation).to.eql('addMessage')
    expect(state).to.eql({messages: ['hello']})
  })
})
