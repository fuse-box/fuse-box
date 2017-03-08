// > index.js [**/*.js] - Bundle everything without dependencies, and execute index.js
// [lib/*.js] +path +fs - Bundle all files in lib folder, ignore node modules except for path and fs
// [**/*.js] - Bundle everything without dependencies
// **/*.js - Bundle everything with dependencies
// **/*.js -path - Bundle everything with dependencies except for module path
//
// + adds a package / file
// - excludes a package / file
// ! Removes the loader API from a bundle
// ^ Disables cache

import { ArithmeticStr } from "../Types";

/**
 * @example
 * can is in canada, so true.
 * strIncludesAnyOf('canada', ['eh', 'can'])
 */
function strIncludesAnyOf(string: any, strings: any, delimiter: boolean | string = false): boolean {
    if (delimiter && typeof strings === "string" && strings.includes(","))
        strings = strings.split(",");

    for (let i = 0, len = strings.length; i < len; i++)
        if (string.includes(strings[i])) return true;
    return false;
}

class FluentBundle {
    public cmds: Array<Object> = [];
    public str: string = "";
    public arithmetics: string;
    public noDeps: boolean = false;
    public useOnlyDeps: boolean;

    constructor(public name: string, public fluentInstance: Fluent) {}

    public finishBundle() {
        return this.fluentInstance;
    }
    public addCmd(cmd: any, bundle: any) {
        this.cmds.push({
            bundle,
            cmd: "execute",
        });
        return this;
    }

  // raw cmd
    public and(cmd: any) {
        this.str += cmd;
        return this;
    }

    public noCache() {
        this.str = `^ ` + this.str;
        return this;
    }

    public noApi() {
        this.str = `! ` + this.str;
        return this;
    }

    // should add support to make it not need to take in the bundle
    public execute(bundle: any) {
        this.addCmd("execute", bundle);
        if (this.noDeps)
            this.str += `\n >[${bundle}]`;
        else

        this.str += `\n >${bundle}`;
        return this;
    }
    public add(bundle: string) {
        this.addCmd("add", bundle);
        if (this.noDeps)
            this.str += `\n +[${bundle}]`;
        else
            this.str += `\n +${bundle}`;

        return this;
    }
    public include(dep: string) {
        this.str += `\n +${dep}`;
        return this;
    }
    public exclude(dep: string) {
        this.str += `\n -${dep}`;
        return this;
    }
    public ignore(dep: string) {
        this.str += `\n -${dep}`;
        return this;
    }

    // aka, vendors
    public onlyDeps() {
        this.useOnlyDeps = true;
        this.str += `\n ~`;
        return this;
    }

    // same
    public ignoreDeps() {
        this.noDeps = true;
        return this;
    }
    public excludeDeps() {
        this.noDeps = true;
        return this;
    }
    public deps(bool: boolean) {
        // if true, we do not ignore
        // if false, we do ignore
        this.noDeps = !bool;
        return this;
    }
    public includeDeps() {
        this.noDeps = false;
        return this;
    }
}

class Fluent {
    public bundled: Object = {};

    static init() {
        return new Fluent();
    }

    public reset() {
        this.bundled = {};
        return this;
    }

    // name is also output place if multiple
    public startBundle(name: string) {
        this.bundled[name] = new FluentBundle(name, this);
        return this.bundled[name];
    }

    public finish() {
        const keys = Object.keys(this.bundled);
        let instructions = {};
        if (keys.length > 1) {
            keys.forEach(key => {
                const instruction = this.bundled[key];
                instructions[key] = instruction.str;
            });
        } else {
            instructions = this.bundled[keys[0]].str;
        }
        return instructions;
    }

    public static isArithmetic(str: ArithmeticStr): boolean {
        if (strIncludesAnyOf(str, "[,>,],+[,-,**,^,~,!", ",")) return true;
        return false;
    }
}

export { Fluent, FluentBundle, strIncludesAnyOf };
export default Fluent;
