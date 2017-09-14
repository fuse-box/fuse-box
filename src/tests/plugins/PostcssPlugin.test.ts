import { createEnv } from "../stubs/TestEnvironment";
import { should } from "fuse-test-runner";
import { CSSPlugin } from "../../plugins/stylesheet/CSSplugin";
import { PostCSS } from "../../plugins/stylesheet/PostCSSPlugin";
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

export class PostcssPluginTest {
    "Should be unmodified with no plugins"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./style.css") }`,
                    "style.css": style
                },
                plugins: [[PostCSS(), CSSPlugin({})]],
                instructions: "index.ts",
            },
        }).then((result) => {
            const out = result.projectContents.toString();
            should(out).findString(`display: grid;`);
        });
    }

    "Single plugin"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./style.css") }`,
                    "style.css": style
                },
                plugins: [[PostCSS([pluginA]), CSSPlugin({})]],
                instructions: "index.ts",
            },
        }).then((result) => {
            const out = result.projectContents.toString();
            should(out).findString(`display: block`);
        });
    }

    "Several plugins"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./style.css") }`,
                    "style.css": style
                },
                plugins: [[PostCSS([pluginA, pluginB]), CSSPlugin({})]],
                instructions: "index.ts",
            },
        }).then((result) => {
            const out = result.projectContents.toString();
            should(out).findString(`display: block`);
            should(out).notFindString(`#moon`);
            should(out).findString(`.moon`);
        });
    }
}
