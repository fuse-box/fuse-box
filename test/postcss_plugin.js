const should = require("should");
const build = require(`../dist/commonjs/index.js`);
const getTestEnv = require("./fixtures/lib").getTestEnv;
const PostCssPlugin = build.PostCSS;
const RawPlugin = build.RawPlugin;
const postcss = require("postcss");

const pluginA = postcss.plugin("AllBlocks", function(options) {
    return function(css) {
        css.walkRules(function(rule) {
            rule.walkDecls(function(decl, i) {
                if (decl.prop === "display") {
                    decl.value = "block";
                }
            });
        });
    };
});

const pluginB = postcss.plugin("IdToClass", function(options) {
    return function(css) {
        css.walkRules(function(rule) {
            if (rule.selector && rule.selector[0] === "#") {
                rule.selector = "." + rule.selector.slice(1);
            }
        });
    };
});

const style = `
    .grid {
        display: grid;
    }
    #moon {
        color: #555;
    }
`;

describe("PostCssPlugin", () => {

    it("Smoke test", () => {
        return getTestEnv({ "style.css": style }, ">style.css", {
            plugins: [
                [PostCssPlugin(), RawPlugin()],
            ],
        }).then(root => {
            let result = root.FuseBox.import("./style.css");
            should.ok(result);
        });
    });

    it("No plugins should output unmodified input", () => {
        return getTestEnv({ "style.css": style }, ">style.css", {
            plugins: [
                [PostCssPlugin(), RawPlugin()],
            ],
        }).then(root => {
            let result = root.FuseBox.import("./style.css");
            result.should.equal(style);
        }).catch((e) => {
            console.log(e);
        });

    });

    it("Single test plugin", () => {
        return getTestEnv({ "style.css": style }, ">style.css", {
            plugins: [
                [PostCssPlugin([pluginA]), RawPlugin()],
            ],
        }).then(root => {
            let result = root.FuseBox.import("./style.css");
            result.should.containEql("display: block");
        });
    });

    it("Several plugins", () => {
        return getTestEnv({ "style.css": style }, ">style.css", {
            plugins: [
                [PostCssPlugin([pluginA, pluginB]), RawPlugin()],
            ],
        }).then(root => {
            let result = root.FuseBox.import("./style.css");
            result.should.containEql("display: block");
            result.should.not.containEql("#moon");
            result.should.containEql(".moon");
        });
    });

});
