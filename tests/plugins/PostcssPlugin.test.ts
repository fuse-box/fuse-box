import { CSSPlugin, PostCSS } from "../../src";
import { createEnv } from "../_helpers/OldEnv";
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

describe("PostcssPluginTest", () => {
	it("Should be unmodified with no plugins", () => {
		return setup({
			plugins: [[PostCSS(), CSSPlugin({})]],
		}).then(result => {
			const out = result.projectContents.toString();
			expect(out).toContain(`display: grid;`);
		});
	});

	it("Should execute single plugin", () => {
		return setup({
			plugins: [[PostCSS([changeDisplayPlugin]), CSSPlugin({})]],
		}).then(result => {
			const out = result.projectContents.toString();
			expect(out).toContain(`display: block`);
		});
	});

	it("Should execute several plugins", () => {
		return setup({
			plugins: [[PostCSS([changeDisplayPlugin, idToClassPlugin]), CSSPlugin({})]],
		}).then(result => {
			const out = result.projectContents.toString();
			expect(out).toContain(`display: block`);
			expect(out).not.toContain(`#moon`);
			expect(out).toContain(`.moon`);
		});
	});

	it("Should execute several plugins (legacy option)", () => {
		return setup({
			plugins: [[PostCSS([changeDisplayPlugin], { plugins: [idToClassPlugin] }), CSSPlugin({})]],
		}).then(result => {
			const out = result.projectContents.toString();
			expect(out).toContain(`display: block`);
			expect(out).not.toContain(`#moon`);
			expect(out).toContain(`.moon`);
		});
	});

	it("Should execute several plugins (legacy option 2)", () => {
		return setup({
			plugins: [[PostCSS({ plugins: [changeDisplayPlugin, idToClassPlugin] }), CSSPlugin({})]],
		}).then(result => {
			const out = result.projectContents.toString();
			expect(out).toContain(`display: block`);
			expect(out).not.toContain(`#moon`);
			expect(out).toContain(`.moon`);
		});
	});

	it("Should be able to pass options to postcss", () => {
		return setup({
			plugins: [[PostCSS([urlPlugin], { from: "./somedir" }), CSSPlugin({})]],
			styleContent: `
        body {
            background-image: url("paper.gif");
        }
      `,
		}).then(result => {
			const out = result.projectContents.toString();
			expect(out).toContain(`background-image: url(\\"./somedir/paper.gif\\")`);
		});
	});
});

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
