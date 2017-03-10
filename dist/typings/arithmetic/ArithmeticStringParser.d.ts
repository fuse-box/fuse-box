/**
 *
 *
 * @export
 * @class PropParser
 */
export declare class PropParser {
    str: any;
    excluding: {};
    including: {};
    depsOnly: {};
    standalone: boolean;
    entry: {};
    cache: boolean;
    /**
     *
     *
     * @private
     *
     * @memberOf PropParser
     */
    private states;
    /**
     *
     *
     * @private
     * @type {*}
     * @memberOf PropParser
     */
    private index;
    /**
     *
     *
     * @private
     *
     * @memberOf PropParser
     */
    private word;
    /**
     * Creates an instance of PropParser.
     *
     * @param {any} str
     *
     * @memberOf PropParser
     */
    constructor(str: any);
    /**
     *
     *
     *
     * @memberOf PropParser
     */
    reset(): void;
    /**
     *
     *
     * @returns
     *
     * @memberOf PropParser
     */
    tokenReady(): void;
    /**
     *
     *
     * @param {string} char
     * @param {boolean} last
     * @returns
     *
     * @memberOf PropParser
     */
    receive(char: string, last: boolean): void;
    /**
     *
     *
     * @returns
     *
     * @memberOf PropParser
     */
    next(): any;
    /**
     *
     *
     *
     * @memberOf PropParser
     */
    parse(): void;
    /**
     *
     *
     *
     * @memberOf PropParser
     */
    empty(): void;
    /**
     *
     *
     * @param {any} args
     *
     * @memberOf PropParser
     */
    set(...args: any[]): void;
    /**
     *
     *
     * @param {any} args
     *
     * @memberOf PropParser
     */
    clean(...args: any[]): void;
    /**
     *
     *
     * @param {any} name
     * @returns
     *
     * @memberOf PropParser
     */
    has(name: any): boolean;
    /**
     *
     *
     * @param {*} name
     * @returns
     *
     * @memberOf PropParser
     */
    once(name: any): boolean;
    /**
     *
     *
     * @param {any} args
     *
     * @memberOf PropParser
     */
    unset(...args: any[]): void;
}
