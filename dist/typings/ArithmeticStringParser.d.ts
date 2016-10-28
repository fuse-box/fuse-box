export declare class PropParser {
    str: any;
    excluding: {};
    including: {};
    entry: {};
    private states;
    private index;
    private word;
    constructor(str: any);
    reset(): void;
    tokenReady(): void;
    receive(char: string, last: boolean): void;
    next(): any;
    parse(): void;
    empty(): void;
    set(...args: any[]): void;
    clean(...args: any[]): void;
    has(name: any): boolean;
    once(name: any): boolean;
    unset(...args: any[]): void;
}
