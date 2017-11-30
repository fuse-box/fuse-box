import { utils } from "realm-utils";
import { isClass } from '../Utils';
export let SparkyCurrentContext;

export class SparkyContextClass {
    constructor(public target: any) {}
}
export function SparkyContext(
    target:
        () => { [key: string]: any } |
            (new () => any) |
            { [key: string]: any }
) {
    if (utils.isPlainObject(target)) {
        SparkyCurrentContext = target;
    } else if (isClass(target)) {
        const Class: any = target;
        SparkyCurrentContext = new Class();
    } else if (utils.isFunction(target)) {
        SparkyCurrentContext = target();
    }
    return new SparkyContextClass(SparkyCurrentContext);
}