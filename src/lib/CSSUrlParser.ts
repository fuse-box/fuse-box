export class CSSUrlParser {
    constructor() { }

    private static extractValue(input: string) {
        const first = input.charCodeAt(0);
        const last = input.charCodeAt(input.length - 1);
        if (first === 39 || first === 34) {
            input = input.slice(1);
        }
        if (last === 39 || last === 34) {
            input = input.slice(0, -1);
        }
        if (/data:/.test(input)) {
            return;
        }
        return input;
    };

    public static walk(contents: string, fn: (value: string) => string): string {
        const re = /url\(([^\)]+)\)/gm;
        return contents.replace(re, (match, data, offset, input_string) => {
            const value = this.extractValue(data);
            if (typeof value === 'undefined') {
                return match;
            }
            
            const replaced = value && fn(value);
            if (typeof replaced === "string") {
                return `url("${replaced}")`
            } else {
                return replaced;
            }
        });
    }
}
