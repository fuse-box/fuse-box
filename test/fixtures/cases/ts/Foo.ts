import { Hello } from "./Hello";
console.log(Hello);
export class Foo {
    constructor() { }
}

export class Boo {
    constructor() { }
}

/**
 *
 *
 * @enum {number}
 */
enum STATES {
    /**
     *
     */
    PENDING,
    /**
     *
     */
    PLUS,
    /**
     *
     */
    MINUS,
    /**
     *
     */
    CONSUMING,
    /**
     *
     */
    EXCLUDING_DEPS,
    /**
     *
     */
    ENTRY_POINT
}
/**
 *
 *
 * @export
 * @class PropParser
 */
export class PropParser {
    /**
     *
     *
     *
     * @memberOf PropParser
     */
    public excluding = {};
    /**
     *
     *
     *
     * @memberOf PropParser
     */
    public including = {};
    /**
     *
     *
     *
     * @memberOf PropParser
     */
    public entry = {};
    /**
     *
     *
     * @private
     *
     * @memberOf PropParser
     */
    private states = new Set<any>();
    /**
     *
     *
     * @private
     * @type {*}
     * @memberOf PropParser
     */
    private index: any = -1;
    /**
     *
     *
     * @private
     *
     * @memberOf PropParser
     */
    private word = [];
    /**
     * Creates an instance of PropParser.
     *
     * @param {any} str
     *
     * @memberOf PropParser
     */
    constructor(public str) {
        this.reset();
    }
    /**
     *
     *
     *
     * @memberOf PropParser
     */
    public reset() {
        this.empty();
        this.word = [];
        this.set(STATES.PENDING);
        this.set(STATES.PLUS);
    }
    /**
     *
     *
     * @returns
     *
     * @memberOf PropParser
     */
    public tokenReady() {
        let word = this.word.join("");
        let isEntry = this.has(STATES.ENTRY_POINT);
        if (this.has(STATES.EXCLUDING_DEPS)) {
            if (this.has(STATES.MINUS)) {
                this.excluding[word] = false;
            } else {
                if (isEntry) {
                    this.entry[word] = false;
                }
                this.including[word] = false;

            }
        } else {
            if (this.has(STATES.MINUS)) {
                this.excluding[word] = true;
            } else {
                if (isEntry) {
                    this.entry[word] = true;
                }
                this.including[word] = true;

            }
        }
        return this.reset();
    }
    /**
     *
     *
     * @param {string} char
     * @param {boolean} last
     * @returns
     *
     * @memberOf PropParser
     */
    public receive(char: string, last: boolean) {
        if (this.has(STATES.PENDING)) {
            if (char === "+") {
                this.set(STATES.PLUS);
                return;
            }
            if (char === "-") {
                this.unset(STATES.PLUS);
                this.set(STATES.MINUS);
                return;
            }

            if (char === ">") {
                this.set(STATES.ENTRY_POINT);
                return;
            }
            if (!char.match(/\s/)) {
                this.set(STATES.CONSUMING);
            }
        }
        if (this.has(STATES.CONSUMING)) {
            this.unset(STATES.PENDING);
            if (char === "[") {
                this.set(STATES.EXCLUDING_DEPS);
                return;
            }
            if (char === "]") {
                return this.tokenReady();
            }
            if (char.match(/\s/)) {
                if (!this.has(STATES.EXCLUDING_DEPS)) {
                    return this.tokenReady();
                }
            } else {
                this.word.push(char);
            }
            if (last) {
                return this.tokenReady();
            }
        }

    }

    /**
     *
     *
     * @returns
     *
     * @memberOf PropParser
     */
    public next() {
        this.index += 1;
        return this.str[this.index];
    }
    /**
     *
     *
     *
     * @memberOf PropParser
     */
    public parse() {
        for (let i = 0; i < this.str.length; i++) {
            this.receive(this.str[i], i === this.str.length - 1);
        }
    }
    /**
     *
     *
     *
     * @memberOf PropParser
     */
    public empty() {
        this.states = new Set<any>();
    }
    /**
     *
     *
     * @param {any} args
     *
     * @memberOf PropParser
     */
    public set(...args) {
        for (let i = 0; i < arguments.length; i++) {
            let name = arguments[i];
            if (!this.states.has(name)) {
                this.states.add(name);
            }
        }
    }
    /**
     *
     *
     * @param {any} args
     *
     * @memberOf PropParser
     */
    public clean(...args) {
        for (let i = 0; i < arguments.length; i++) {
            let name = arguments[i];
            this.states.delete(name);
        }
    }
    /**
     *
     *
     * @param {any} name
     * @returns
     *
     * @memberOf PropParser
     */
    public has(name) {
        return this.states.has(name);
    }
    /**
     *
     *
     * @param {*} name
     * @returns
     *
     * @memberOf PropParser
     */
    public once(name: any) {
        let valid = this.states.has(name);
        if (valid) {
            this.states.delete(name);
        }
        return valid;
    }
    /**
     *
     *
     * @param {any} args
     *
     * @memberOf PropParser
     */
    public unset(...args) {
        for (let i = 0; i < arguments.length; i++) {
            let name = arguments[i];
            this.states.delete(name);
        }
    }
}