import proxy from './proxy'

/**
 * Store is a base class to implement a Flux like architecture.
 * Dispatching a mutation will call all relatvent listeners, as well as any
 * subscriptions that are attached.
 *
 * We would ideally like the state to be immutable. Instead we just plead
 * ignorant. If someone sets the state without calling dispatch, it is their own
 * problem.
 */
export default class Store {
  constructor (state, mutations) {
    this.subscriptions = []
    this.listeners = {}
    this.state = state
    this.mutations = mutations

    proxy(this, this.state)
  }

  dispatch (action, ...args) {
    let mutation = this.mutations[action]
    if (!mutation) throw 'Mutation does not exist'

    let res = mutation.call(this, ...args)

    this._emit(action, res)
    for (let sub of this.subscriptions) sub(action, this.state)
  }

  _emit (action, res) {
    let listeners = this.listeners[action]
    if (!listeners) return

    // TODO: I think looping over undefined works, or doesn't break
    for (let listener of listeners) {
      listener(res)
    }
  }

  subscribe (sub) {
    this.subscriptions.push(sub)
  }

  unsubscribe (sub) {
    this.subscriptions[action] = this.subscriptions.filter(v => v !== sub)
  }

  on (action, listener) {
    let listeners = this.listeners[action]
    if (!listeners) listeners = []
    listeners.push(listener)
    this.listeners[action] = listeners
  }

  off (action, listener) {
    let listeners = this.listeners[action]
    if (!listeners) return
    this.listeners[action] = listeners.filter(v => v !== listener)
  }
}
