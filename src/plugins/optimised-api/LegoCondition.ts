import {Chainable, ChainedMap, ChainedSet} from '../../modules/flip-chain'

export class Conditional extends ChainedMap {
  public name(name: string): Conditional {
    return this.set('name', name.trim())
  }

  public line(line: number): Conditional {
    return this.set('line', line)
  }

  public isNested(): boolean {
    return this.parent !== null
  }

  /**
   * @desc get root parent,
   *       then split & check each name to ensure enabled,
   *       ...dun
   * @return {boolean}
   */
  public isEnabled(): boolean {
    let parent = this.parent
    while (parent && parent.parent) {
      parent = parent.parent
    }

    const namespace = this.get('name').split('.')
    const enabled = namespace
      .filter(name => parent.get('conditions')[name])
      .length === namespace.length

    return enabled
  }
}

/**
 * @classdesc build on demand
 *            set conditionals, an object with keys to enable
 *            .start condition names, make into conditionals
 *            .add lines of code
 *            .end conditions
 */
export class LegoCondition extends ChainedMap {
  protected conditionals: ChainedSet
  protected result: ChainedSet
  protected current: undefined | false | Conditional

  constructor(parent: any) {
    super(parent)

    // setup the children, just tell them the className for debugging
    this.result = new ChainedSet(this.className)
    this.conditionals = new ChainedSet(this.className)
  }

  public conditions(conditions: Object): LegoCondition {
    return this.set('conditions', conditions)
  }

  /**
   * @desc when we have a current conditional, append the new name
   *       otherwise, use the provided conditional
   *       @modifies this.current
   *       @modifies this.conditionals
   * @see Conditional.isEnabled&.name
   * @param  {string} name
   * @return {LegoCondition} @chainable
   */
  public start(name: string): LegoCondition {
    let namespace = name
    if (this.current) {
      namespace = this.current.get('name') + '.' + name
    }

    const condition = new Conditional(this.current || this)
    condition.name(namespace)

    this.current = condition
    this.conditionals.add(condition)

    return this
  }

  /**
   * @desc calls .end on this.current,
   *       when it has a parent, go back up,
   *       otherwise, null
   *       @modifies this.current
   * @param  {string} name
   * @return {LegoCondition} @chainable
   */
  public end(name: string): LegoCondition {
    this.current = this.current.end()
    if (this.current === this) this.current = false

    return this
  }

  /**
   * @desc when there is a conditional... check it
   *       when no conditional...
   *       Unconditional Love...
   *       is a condition outside of all conditions
   *
   * @param  {string} line
   * @return {LegoCondition} @chainable
   */
  public add(line: string): LegoCondition {
    if (this.current) {
      if (this.current.isEnabled()) {
        this.result.add(line)
      }
    }
    else {
      this.result.add(line)
    }

    return this
  }

  public toString(): string {
    return this.result.values().join('\n')
  }
}
