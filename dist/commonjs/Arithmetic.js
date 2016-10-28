"use strict";
const glob = require("glob");
const realm_utils_1 = require("realm-utils");
const path = require("path");
var STATES;
(function (STATES) {
    STATES[STATES["PENDING"] = 0] = "PENDING";
    STATES[STATES["PLUS"] = 1] = "PLUS";
    STATES[STATES["MINUS"] = 2] = "MINUS";
    STATES[STATES["CONSUMING"] = 3] = "CONSUMING";
    STATES[STATES["EXCLUDING_DEPS"] = 4] = "EXCLUDING_DEPS";
    STATES[STATES["ENTRY_POINT"] = 5] = "ENTRY_POINT";
})(STATES || (STATES = {}));
class PropParser {
    constructor(str) {
        this.str = str;
        this.excluding = {};
        this.including = {};
        this.entry = {};
        this.states = new Set();
        this.index = -1;
        this.word = [];
        this.reset();
    }
    reset() {
        this.empty();
        this.word = [];
        this.set(STATES.PENDING);
        this.set(STATES.PLUS);
    }
    tokenReady() {
        let word = this.word.join("");
        let isEntry = this.has(STATES.ENTRY_POINT);
        if (this.has(STATES.EXCLUDING_DEPS)) {
            if (this.has(STATES.MINUS)) {
                this.excluding[word] = false;
            }
            else {
                if (isEntry) {
                    this.entry[word] = false;
                }
                this.including[word] = false;
            }
        }
        else {
            if (this.has(STATES.MINUS)) {
                this.excluding[word] = true;
            }
            else {
                if (isEntry) {
                    this.entry[word] = true;
                }
                this.including[word] = true;
            }
        }
        return this.reset();
    }
    receive(char, last) {
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
            }
            else {
                this.word.push(char);
            }
            if (last) {
                return this.tokenReady();
            }
        }
    }
    next() {
        this.index += 1;
        return this.str[this.index];
    }
    parse() {
        for (let i = 0; i < this.str.length; i++) {
            this.receive(this.str[i], i === this.str.length - 1);
        }
    }
    empty() {
        this.states = new Set();
    }
    set(...args) {
        for (let i = 0; i < arguments.length; i++) {
            let name = arguments[i];
            if (!this.states.has(name)) {
                this.states.add(name);
            }
        }
    }
    clean(...args) {
        for (let i = 0; i < arguments.length; i++) {
            let name = arguments[i];
            this.states.delete(name);
        }
    }
    has(name) {
        return this.states.has(name);
    }
    once(name) {
        let valid = this.states.has(name);
        if (valid) {
            this.states.delete(name);
        }
        return valid;
    }
    unset(...args) {
        for (let i = 0; i < arguments.length; i++) {
            let name = arguments[i];
            this.states.delete(name);
        }
    }
}
exports.PropParser = PropParser;
class BundleData {
    constructor(homeDir, including, excluding, entry) {
        this.homeDir = homeDir;
        this.including = including;
        this.excluding = excluding;
        this.entry = entry;
    }
    shouldIgnore(name) {
        return this.excluding.has(name);
    }
    shouldIgnoreDependencies(name) {
        if (this.including.has(name)) {
            return this.including.get(name).deps === false;
        }
    }
    shouldIgnoreNodeModules(asbPath) {
        if (this.including.has(asbPath)) {
            return this.including.get(asbPath).deps === false;
        }
        return false;
    }
}
exports.BundleData = BundleData;
class Arithmetic {
    static parse(str) {
        let parser = new PropParser(str);
        parser.parse();
        return parser;
    }
    static getFiles(parser, homeDir) {
        let collect = (list) => {
            let data = new Map();
            return realm_utils_1.each(list, (withDeps, filePattern) => {
                if (filePattern.match(/^[a-z0-9_-]+$/i)) {
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
        };
        return realm_utils_1.chain(class extends realm_utils_1.Chainable {
            setIncluding() {
                return collect(parser.including);
            }
            setExcluding() {
                return collect(parser.excluding);
            }
            setEntry() {
                let keys = Object.keys(parser.entry);
                if (keys.length) {
                    return keys[0];
                }
            }
        }
        ).then(result => {
            return new BundleData(homeDir, result.including, result.excluding, result.entry);
        });
    }
}
exports.Arithmetic = Arithmetic;
