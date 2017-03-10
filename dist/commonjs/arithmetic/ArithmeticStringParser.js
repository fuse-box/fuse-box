"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var STATES;
(function (STATES) {
    STATES[STATES["PENDING"] = 0] = "PENDING";
    STATES[STATES["PLUS"] = 1] = "PLUS";
    STATES[STATES["MINUS"] = 2] = "MINUS";
    STATES[STATES["CONSUMING"] = 3] = "CONSUMING";
    STATES[STATES["EXCLUDING_DEPS"] = 4] = "EXCLUDING_DEPS";
    STATES[STATES["ENTRY_POINT"] = 5] = "ENTRY_POINT";
    STATES[STATES["ONLY_DEPS"] = 6] = "ONLY_DEPS";
})(STATES || (STATES = {}));
class PropParser {
    constructor(str) {
        this.str = str;
        this.excluding = {};
        this.including = {};
        this.depsOnly = {};
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
        if (!word) {
            this.reset();
            return;
        }
        let isEntry = this.has(STATES.ENTRY_POINT);
        if (this.has(STATES.ONLY_DEPS)) {
            this.depsOnly[word] = true;
        }
        else if (this.has(STATES.EXCLUDING_DEPS)) {
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
            if (char === "!") {
                this.standalone = false;
                return;
            }
            if (char === "^") {
                this.cache = false;
                return;
            }
            if (char === "+") {
                this.set(STATES.PLUS);
                return;
            }
            if (char === "-") {
                this.unset(STATES.PLUS);
                this.set(STATES.MINUS);
                return;
            }
            if (char === "~") {
                this.set(STATES.ONLY_DEPS);
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
            if (char === "~") {
                this.set(STATES.ONLY_DEPS);
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
        for (let i = 0; i < args.length; i++) {
            let name = args[i];
            if (!this.states.has(name)) {
                this.states.add(name);
            }
        }
    }
    clean(...args) {
        for (let i = 0; i < args.length; i++) {
            let name = args[i];
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
        for (let i = 0; i < args.length; i++) {
            let name = args[i];
            this.states.delete(name);
        }
    }
}
exports.PropParser = PropParser;
