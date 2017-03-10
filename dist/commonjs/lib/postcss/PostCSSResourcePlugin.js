"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postcss = require("postcss");
const extractValue = (input) => {
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
exports.PostCSSResourcePlugin = postcss.plugin("css-resource", function (opts) {
    opts = opts || {};
    return (css, result) => {
        css.walkDecls(declaration => {
            if (declaration.prop) {
                if (declaration.prop.indexOf("background") === 0 || declaration.prop.indexOf("src") === 0) {
                    let re = /url\((.*?)\)/g;
                    let match;
                    while (match = re.exec(declaration.value)) {
                        const value = match[1];
                        const url = extractValue(value);
                        if (typeof opts.fn === "function" && url) {
                            const result = opts.fn(url);
                            if (typeof result === "string") {
                                declaration.value = declaration.value.replace(match[0], `url("${result}")`);
                            }
                        }
                    }
                }
            }
        });
    };
});
