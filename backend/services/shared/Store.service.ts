import { IConnectionProcess } from '../../tools/interfaces/Common.interface'

class Store {
  private static instance: Store
  state: Map<string, IConnectionProcess> = new Map()

  static getInstance(): Store {
    if (this.instance) {
      return this.instance
    }

    this.instance = new Store()
    return this.instance
  }
}

/* const store = Store.getInstance()

const handler: ProxyHandler<any> = {
  set(target, prop, receiver) {
    const logger = new Logger()
    logger.info(target)
    logger.info(prop)
    logger.info(receiver)
    return true
  }
}

new Proxy(store, handler) */

export default Store
