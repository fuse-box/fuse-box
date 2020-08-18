import _ = require('lodash');

export function isEmpty<T>(list: T[]): boolean {
    return !hasResults(list);
}

export function hasResults<T>(list: T[] | null): boolean {
    return typeof list === 'object' && !!list && list.length ? list.length > 0 : false;
}

export function assertResult<T>(result: T | null, idOrKey: number | string): void {
    if (result === null) {
        throw new Error(`${idOrKey}`);
    }
}

export function assertResults<T>(list: T[] | null, idOrKey: number | string | number[]): void {
    if (!hasResults(list)) {
        throw new Error(`${idOrKey}`);
    }
}

export function single<T>(list: T[]): T {
    if (hasResults(list)) {
        return list[0];
    } else {
        throw new Error();
    }
}

export function singleOrNull<T>(list: T[]): T | null {
    return hasResults(list) ? list[0] : null;
}

export function isPositive(num: number): boolean {
    return num >= 0;
}

export function pickNotUndefined<T>(obj: T, props: Array<keyof T>) {
    return _.pick(_.omitBy(obj, _.isUndefined), props);
}
