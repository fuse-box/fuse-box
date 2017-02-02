const postcss = require("postcss");
const fs = require("fs");
const contents = fs.readFileSync(__dirname + "/ts/jstree.css").toString();;


const a = `"hello.jpg"`;

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
}
const cssResource = postcss.plugin('css-resource', function(opts) {
    opts = opts || {};

    // Work with options here

    return function(css, result) {
        css.walkDecls(declaration => {
            if (declaration.prop) {
                if (declaration.prop.indexOf("background") === 0) {
                    let re = /url\((.*?)\)/g;
                    let match;
                    while (match = re.exec(declaration.value)) {
                        const value = match[1];
                        const url = extractValue(value);
                        if (typeof opts.fn === "function") {
                            let result = opts.fn(url);
                            if (typeof result === "string") {
                                declaration.value = declaration.value.replace(match[0],
                                    `url(${JSON.stringify(result)})`)
                            }
                        }
                    }
                }
            }
        });

    };
});

postcss([cssResource({
        fn: (url) => {
            console.log("url", url);
            return url + "pukka.gif"
        }
    })])
    .process(contents)
    .then(result => {
        console.log(result.css);
    });