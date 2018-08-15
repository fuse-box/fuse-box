import { createEnv } from "../stubs/TestEnvironment";
import { should } from "fuse-test-runner";
import { CSSPlugin } from "../../plugins/stylesheet/CSSplugin";
import { PostCSS } from "../../plugins/stylesheet/PostCSSPlugin";

const postcss = require("postcss");

const changeDisplayPlugin = postcss.plugin("ChangeDisplayPlugin", function(options) {
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

// This is essentially how the url plugin works
// It requires the global postcss options to be passed through ("from", "to")
const urlPlugin = postcss.plugin("UrlPlugin", function(options) {
	return function(css, result) {
		let opts = result.opts;
		css.walkRules(function(rule) {
			rule.walkDecls(function(decl) {
				let pattern = /(url\(\s*['"]?)([^"')]+)(["']?\s*\))/g;

				if (pattern.test(decl.value)) {
					decl.value = decl.value.replace(pattern, (matched, before, url, after) => {
						const newUrl = opts.from + "/" + url;
						return `${before}${newUrl}${after}`;
					});
				}
			});
		});
	};
});

const idToClassPlugin = postcss.plugin("IdToClass", function(options) {
	return function(css) {
		css.walkRules(function(rule) {
			if (rule.selector && rule.selector[0] === "#") {
				rule.selector = "." + rule.selector.slice(1);
			}
		});
	};
});

export class PostcssPluginTest {
	"Should be unmodified with no plugins"() {
		return setup({
			plugins: [[PostCSS(), CSSPlugin({})]],
		}).then(result => {
			const out = result.projectContents.toString();
			should(out).findString(`display: grid;`);
		});
	}

	"Should execute single plugin"() {
		return setup({
			plugins: [[PostCSS([changeDisplayPlugin]), CSSPlugin({})]],
		}).then(result => {
			const out = result.projectContents.toString();
			should(out).findString(`display: block`);
		});
	}

	"Should execute several plugins"() {
		return setup({
			plugins: [[PostCSS([changeDisplayPlugin, idToClassPlugin]), CSSPlugin({})]],
		}).then(result => {
			const out = result.projectContents.toString();
			should(out).findString(`display: block`);
			should(out).notFindString(`#moon`);
			should(out).findString(`.moon`);
		});
	}

	"Should execute several plugins (legacy option)"() {
		return setup({
			plugins: [[PostCSS([changeDisplayPlugin], { plugins: [idToClassPlugin] }), CSSPlugin({})]],
		}).then(result => {
			const out = result.projectContents.toString();
			should(out).findString(`display: block`);
			should(out).notFindString(`#moon`);
			should(out).findString(`.moon`);
		});
	}

	"Should execute several plugins (legacy option 2)"() {
		return setup({
			plugins: [[PostCSS({ plugins: [changeDisplayPlugin, idToClassPlugin] }), CSSPlugin({})]],
		}).then(result => {
			const out = result.projectContents.toString();
			should(out).findString(`display: block`);
			should(out).notFindString(`#moon`);
			should(out).findString(`.moon`);
		});
	}

	"Should be able to pass options to postcss"() {
		return setup({
			plugins: [[PostCSS([urlPlugin], { from: "./somedir" }), CSSPlugin({})]],
			styleContent: `
        body {
            background-image: url("paper.gif");
        }
      `,
		}).then(result => {
			const out = result.projectContents.toString();
			should(out).findString(`background-image: url(\\"./somedir/paper.gif\\")`);
		});
	}
}

const style = `
    .grid {
        display: grid;
    }
    #moon {
        color: #555;
    }
`;

function setup({ plugins, styleContent = style }) {
	return createEnv({
		project: {
			files: {
				"index.ts": `exports.style = require("./style.css")`,
				"style.css": styleContent,
			},
			plugins: plugins,
			instructions: "index.ts",
		},
	});
}
