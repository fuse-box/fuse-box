const glob = require("glob");
import { each, chain, Chainable } from "realm-utils";
import * as path from "path";
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

export interface IBundleInformation {
    deps: boolean;
    nodeModule?: boolean;
}
/**
 * BundleData
 */
export class BundleData {
    constructor(public homeDir: string,
        public including: Map<string, IBundleInformation>,
        public excluding: Map<string, IBundleInformation>, public entry?: string) {

    }
    public shouldIgnore(name: string) {
        return this.excluding.has(name);
    }

    public shouldIgnoreDependencies(name: string) {
        if (this.including.has(name)) {
            return this.including.get(name).deps === false;
        }
    }

    public shouldIgnoreNodeModules(asbPath: string) {
        if (this.including.has(asbPath)) {
            return this.including.get(asbPath).deps === false;
        }
        return false;
    }
}

/**
 *
 *
 * @export
 * @class Arithmetic
 */
export class Arithmetic {
    /**
     *
     *
     * @static
     * @param {string} str
     * @returns
     *
     * @memberOf Arithmetic
     */
    public static parse(str: string): PropParser {
        let parser = new PropParser(str);
        parser.parse();
        return parser;
    }

    public static getFiles(parser: PropParser, homeDir: string) {

        let collect = (list) => {
            let data = new Map<string, IBundleInformation>();
            return each(list, (withDeps, filePattern) => {
                if (filePattern.match(/^[a-z0-9_-]+$/i)) { // check for a valid node module name
                    data.set(filePattern, {
                        deps: withDeps,
                        nodeModule: true,
                    });
                    return;
                }
                let fp = path.join(homeDir, filePattern);

                if (!filePattern.match(/\.js$/)) {
                    fp += ".js";
                }
                return new Promise((resolve, reject) => {
                    glob(fp, (err, files) => {
                        for (let i = 0; i < files.length; i++) {
                            data.set(files[i], {
                                deps: withDeps
                            });

                        }
                        return resolve();
                    });
                });
            }).then(x => {
                return data;
            });
        }

        return chain(class extends Chainable {
            public setIncluding() {
                return collect(parser.including);
            }
            public setExcluding() {
                return collect(parser.excluding);
            }

            public setEntry() {
                let keys = Object.keys(parser.entry);
                if (keys.length) {
                    return keys[0];
                }
            }
        }).then(result => {
            return new BundleData(homeDir, result.including, result.excluding, result.entry);
        });


    }
}
