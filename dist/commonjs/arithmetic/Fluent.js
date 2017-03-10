"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function strIncludesAnyOf(string, strings, delimiter = false) {
    if (delimiter && typeof strings === "string" && strings.includes(","))
        strings = strings.split(",");
    for (let i = 0, len = strings.length; i < len; i++)
        if (string.includes(strings[i]))
            return true;
    return false;
}
exports.strIncludesAnyOf = strIncludesAnyOf;
class FluentBundle {
    constructor(name, fluentInstance) {
        this.name = name;
        this.fluentInstance = fluentInstance;
        this.cmds = [];
        this.str = "";
        this.noDeps = false;
    }
    finishBundle() {
        return this.fluentInstance;
    }
    addCmd(cmd, bundle) {
        this.cmds.push({
            bundle,
            cmd: "execute",
        });
        return this;
    }
    and(cmd) {
        this.str += cmd;
        return this;
    }
    noCache() {
        this.str = `^ ` + this.str;
        return this;
    }
    noApi() {
        this.str = `! ` + this.str;
        return this;
    }
    execute(bundle) {
        this.addCmd("execute", bundle);
        if (this.noDeps)
            this.str += `\n >[${bundle}]`;
        else
            this.str += `\n >${bundle}`;
        return this;
    }
    add(bundle) {
        this.addCmd("add", bundle);
        if (this.noDeps)
            this.str += `\n +[${bundle}]`;
        else
            this.str += `\n +${bundle}`;
        return this;
    }
    include(dep) {
        this.str += `\n +${dep}`;
        return this;
    }
    exclude(dep) {
        this.str += `\n -${dep}`;
        return this;
    }
    ignore(dep) {
        this.str += `\n -${dep}`;
        return this;
    }
    onlyDeps() {
        this.useOnlyDeps = true;
        this.str += `\n ~`;
        return this;
    }
    ignoreDeps() {
        this.noDeps = true;
        return this;
    }
    excludeDeps() {
        this.noDeps = true;
        return this;
    }
    deps(bool) {
        this.noDeps = !bool;
        return this;
    }
    includeDeps() {
        this.noDeps = false;
        return this;
    }
}
exports.FluentBundle = FluentBundle;
class Fluent {
    constructor() {
        this.bundled = {};
    }
    static init() {
        return new Fluent();
    }
    reset() {
        this.bundled = {};
        return this;
    }
    startBundle(name) {
        this.bundled[name] = new FluentBundle(name, this);
        return this.bundled[name];
    }
    finish() {
        const keys = Object.keys(this.bundled);
        let instructions = {};
        if (keys.length > 1) {
            keys.forEach(key => {
                const instruction = this.bundled[key];
                instructions[key] = instruction.str;
            });
        }
        else {
            instructions = this.bundled[keys[0]].str;
        }
        return instructions;
    }
    static isArithmetic(str) {
        if (strIncludesAnyOf(str, "[,>,],+[,-,**,^,~,!", ","))
            return true;
        return false;
    }
}
exports.Fluent = Fluent;
exports.default = Fluent;
