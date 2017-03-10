import { ArithmeticStr } from "../Types";
/**
 * @example
 * can is in canada, so true.
 * strIncludesAnyOf('canada', ['eh', 'can'])
 */
declare function strIncludesAnyOf(string: any, strings: any, delimiter?: boolean | string): boolean;
declare class FluentBundle {
    name: string;
    fluentInstance: Fluent;
    cmds: Array<Object>;
    str: string;
    arithmetics: string;
    noDeps: boolean;
    useOnlyDeps: boolean;
    constructor(name: string, fluentInstance: Fluent);
    finishBundle(): Fluent;
    addCmd(cmd: any, bundle: any): this;
    and(cmd: any): this;
    noCache(): this;
    noApi(): this;
    execute(bundle: any): this;
    add(bundle: string): this;
    include(dep: string): this;
    exclude(dep: string): this;
    ignore(dep: string): this;
    onlyDeps(): this;
    ignoreDeps(): this;
    excludeDeps(): this;
    deps(bool: boolean): this;
    includeDeps(): this;
}
declare class Fluent {
    bundled: Object;
    static init(): Fluent;
    reset(): this;
    startBundle(name: string): any;
    finish(): {};
    static isArithmetic(str: ArithmeticStr): boolean;
}
export { Fluent, FluentBundle, strIncludesAnyOf };
export default Fluent;
