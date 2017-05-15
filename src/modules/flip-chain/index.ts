// import deepmerge from 'deepmerge'
const isArr = Array.isArray
function deepmerge(obj1, obj2) {
  const type1 = typeof obj1
  const type2 = typeof obj2
  const types = [type1, type2]

  if (['null', 'undefined', 'NaN'].includes(type1)) return obj2
  if (['null', 'undefined', 'NaN'].includes(type2)) return obj1

  switch (types) {
    case ['string', 'string']: return [obj1, obj2]
    case isArr(obj1) && type2 === 'string': return obj1.concat([obj2])
    case type1 === 'string' && isArr(obj2): return obj2.concat([obj1])
    default: return Object.assign(obj1, obj2)
  }
}


/**
 * @type {Chainable}
 * @property {Chainable | any} parent
 */
export class Chainable {
  /**
   * @param {Chainable | any} parent
   */
  constructor(parent: any) {
    this.parent = parent
  }

  /**
   * @since 0.4.0
   * @see Chainable.parent
   * @return {Chainable | any}
   */
  end(): Chainable | any {
    return this.parent
  }

  /**
   * @since 0.5.0
   * @see ChainedMap.store
   * @return {number}
   */
  get length(): number {
    return this.store.size
  }

  /**
   * @since 0.3.0
   * @return {Chainable}
   */
  clear(): Chainable {
    this.store.clear()
    return this
  }

  /**
   * @since 0.3.0
   * @description calls .delete on this.store.map
   * @param {string | any} key
   * @return {Chainable}
   */
  delete(key: any): Chainable {
    this.store.delete(key)
    return this
  }

  /**
   * @since 0.3.0
   * @param {any} value
   * @return {boolean}
   */
  has(value: any): boolean {
    return this.store.has(value)
  }
}



export class ChainedMap extends Chainable {

  /**
   * @param {ChainedMap | Chainable | any} parent
   */
  constructor(parent) {
    super(parent)
    this.store = new Map()
    this.className = this.constructor.name
  }

  /**
   * checks each property of the object
   * calls the chains accordingly
   *
   * @param {Object} obj
   * @return {Chainable}
   */
  from(obj) {
    Object.keys(obj).forEach(key => {
      const fn = this[key]
      const value = obj[key]

      if (this[key] && this[key] instanceof Chainable) {
        return this[key].merge(value)
      }
      else if (typeof this[key] === 'function') {
        return this[key](value)
      }
      else {
        this.set(key, value)
      }
    })
    return this
  }

  /**
   * @description
   *   clears the map,
   *   goes through this properties,
   *   calls .clear if they are instanceof Chainable or Map
   *
   * @return {ChainedMap}
   */
  clear() {
    this.store.clear()
    Object.keys(this).forEach(key => {
      if (key === 'inspect') return
      if (this[key] instanceof Chainable) this[key].clear()
      if (this[key] instanceof Map) this[key].clear()
    })
    return this
  }

  /**
   * @description spreads the entries from ChainedMap.store (Map)
   * @return {Object}
   */
  entries() {
    const entries = [...this.store]
    if (!entries.length) {
      return null
    }
    return entries.reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {})
  }

  /**
   * @description spreads the entries from ChainedMap.store.values
   * @return {Array<any>}
   */
  values() {
    return [...this.store.values()]
  }

  /**
   * @param  {any} key
   * @return {any}
   */
  get(key) {
    return this.store.get(key)
  }

  /**
   * @description sets the value using the key on store
   * @see ChainedMap.store
   * @param {any} key
   * @param {any} value
   * @return {ChainedMap}
   */
  set(key, value) {
    this.store.set(key, value)
    return this
  }

  /**
   * @description concats an array `value` in the store with the `key`
   * @see ChainedMap.store
   * @param {any} key
   * @param {Array<any>} value
   * @return {ChainedMap}
   */
  concat(key, value) {
    if (!Array.isArray(value)) value = [value]
    this.store.set(key, this.store.get(value).concat(value))
    return this
  }

  /**
   * @description appends the string value to the current value at the `key`
   * @see ChainedMap.concat
   * @param {any} key
   * @param {string | Array} value
   * @return {ChainedMap}
   */
  append(key, value) {
    let existing = this.store.get(value)

    if (Array.isArray(existing)) {
      existing.push(value)
    }
    else {
      existing += value
    }

    this.store.set(key, existing)

    return this
  }

  /**
   * @description merges an object with the current store
   * @see deepmerge
   * @param {Object} obj
   * @return {ChainedMap}
   */
  merge(obj) {
    Object.keys(obj).forEach(key => {
      const value = obj[key]
      if (this[key] && this[key] instanceof Chainable) {
        return this[key].merge(value)
      }

      if (this.shorthands.includes(key)) {
        const existing = this.get(key)
        if (existing) {
          const merged = deepmerge(existing, value)
          return this[key](merged)
        }

        return this[key](value)
      }

      return this.set(key, value)
    })

    return this
  }

  /**
   * @description
   *  goes through the maps,
   *  and the map values,
   *  reduces them to array
   *  then to an object using the reduced values
   *
   * @param {Object} obj
   * @return {Object}
   */
  clean(obj) {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key]
      if (value === undefined) return acc
      if (Array.isArray(value) && !value.length) return acc
      if (
        Object.prototype.toString.call(value) === '[object Object]' &&
        Object.keys(value).length === 0
      ) {
        return acc
      }

      acc[key] = value

      return acc
    }, {})
  }

  /**
   * @description
   *  when the condition is true,
   *  trueBrancher is called,
   *  else, falseBrancher is called
   *
   * @param  {boolean} condition
   * @param  {Function} [trueBrancher=Function.prototype]
   * @param  {Function} [falseBrancher=Function.prototype]
   * @return {ChainedMap}
   */
  when(
    condition,
    trueBrancher = Function.prototype,
    falseBrancher = Function.prototype
  ) {
    if (condition) {
      trueBrancher(this)
    }
    else {
      falseBrancher(this)
    }

    return this
  }
}


/**
 * @type {Set}
 */
export class ChainedSet extends Chainable {

  /**
   * @param {ChainedSet | Chainable | any} parent
   */
  constructor(parent) {
    super(parent)
    this.store = new Set()
  }

  /**
   * @param {any} value
   * @return {ChainedSet}
   */
  add(value) {
    this.store.add(value)
    return this
  }

  /**
   * @description inserts the value at the beginning of the Set
   * @param {any} value
   * @return {ChainedSet}
   */
  prepend(value) {
    this.store = new Set([value, ...this.store])
    return this
  }

  /**
   * @return {Array<any>}
   */
  values() {
    return [...this.store]
  }

  /**
   * @param {Array | Set} arr
   * @return {ChainedSet}
   */
  merge(arr) {
    this.store = new Set([...this.store, ...arr])
    return this
  }

  /**
   * @override
   * @return {ChainedSet}
   */
  clear() {
    this.store.clear()
    return this
  }

  /**
   * @override
   * @param {any} value
   * @return {ChainedSet}
   */
  delete(value) {
    this.store.delete(value)
    return this
  }

  /**
   * @override
   * @param {any} value
   * @return {boolean}
   */
  has(value) {
    return this.store.has(value)
  }
}
