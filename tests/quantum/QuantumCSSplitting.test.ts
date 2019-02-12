import { FuseTestEnv } from "../_helpers/stubs/FuseTestEnv";
import { WebIndexPlugin, SassPlugin, CSSPlugin, QuantumPlugin } from "../../src";

const genericFiles = {
	"index.ts": `
	console.log("foobar");
		import "./main.scss";
		async function main(){
			await import("./foobar")
		}

		setTimeout(() => {
			main();
		},200}
`,
	"foobar.ts": `
		import "./foobar.scss"
`,
	"foobar.scss": `
		h1 {
			color:blue;
		}
`,
	"main.scss": `
		body {
			background-color:red;
		}
`,
};
async function quantumEnv(conf, fn: (window: any, env: FuseTestEnv) => any) {
	const config = {
		...conf,
		...{
			plugins: [
				WebIndexPlugin(),
				[SassPlugin(), CSSPlugin()],
				CSSPlugin(),
				QuantumPlugin({
					treeshake: true,
					css: true,
					target: "browser",
				}),
			],
		},
	};
	const test = await FuseTestEnv.create({
		testFolder: conf.test && "_current_test",
		project: config,
	}).simple(">index.ts", conf.bundle);

	return test.browser(async (window, env) => {
		return fn(window, env);
	});
}

describe("QuantumCSSSplittingTest", () => {
	it("Should import a css file", () => {
		return quantumEnv(
			{
				files: {
					"index.ts": `
							import "./main.css";
				`,
					"main.css": `
						body: {
							background-color:red;
					}
				`,
				},
			},
			async (window, env) => {
				window.$fsx.r(0);

				env.fileShouldExist("styles.css");
				const index = env.getDistContent("index.html");

				expect(index).toContain(`<link rel="stylesheet" href="/styles.css"/>`);
			},
		);
	});

	it("Should import a css file with hashing", () => {
		return quantumEnv(
			{
				hash: true,
				files: {
					"index.ts": `
							import "./main.css";
				`,
					"main.css": `
						body {
							background-color:red;
					}
				`,
				},
			},
			async (window, env) => {
				window.$fsx.r(0);
				env.fileShouldExist("8e150ec1-styles.css");
				const index = env.getDistContent("index.html");
				expect(index).toContain(`<link rel="stylesheet" href="/8e150ec1-styles.css"/>`);
			},
		);
	});

	it("Should load a sass file with sourcemaps", () => {
		return quantumEnv(
			{
				sourceMaps: true,
				files: {
					"index.ts": `
							import "./main.scss";
				`,
					"main.scss": `
						body {
							background-color:red;
					}
				`,
				},
			},
			async (window, env) => {
				window.$fsx.r(0);
				env.fileShouldExist("styles.css");
				env.fileShouldExist("styles.css.map");
				const index = env.getDistContent("index.html");
				expect(index).toContain(`<link rel="stylesheet" href="/styles.css"/>`);
			},
		);
	});

	it("Should dynamically split css file", () => {
		return quantumEnv(
			{
				sourceMaps: true,
				files: genericFiles,
			},
			async (window, env) => {
				env.fileShouldExist("styles.css");
				env.fileShouldExist("styles.css.map");
				env.fileShouldExist("ea9fe601.css");

				const styles = env.getDistContent("styles.css");
				expect(styles).toContain("body");
				expect(styles).not.toContain("h1");

				const splitCSS = env.getDistContent("ea9fe601.css");
				expect(splitCSS).toContain("h1");
				expect(splitCSS).not.toContain("body");

				// env.fileShouldExist("styles.css.map");
				const index = env.getDistContent("index.html");
				expect(index).toContain(`<link rel="stylesheet" href="/styles.css"/>`);
				expect(index).not.toContain(`ea9fe601.css`);

				const tags = await window.loadLinkTags();

				expect(tags).toEqual(["/styles.css"]);

				await env.delay(200);
				const newTags = await window.loadLinkTags();
				expect(newTags).toEqual(["/styles.css", "ea9fe601.css"]);
			},
		);
	});

	it("Should dynamically split css file (different folder without slash)", () => {
		return quantumEnv(
			{
				sourceMaps: true,
				bundle: bundle => {
					bundle.splitConfig({ dest: "chunks" });
				},
				files: genericFiles,
			},
			async (window, env) => {
				env.fileShouldExist("styles.css");
				env.fileShouldExist("styles.css.map");
				env.fileShouldExist("chunks/ea9fe601.css");
				env.fileShouldExist("chunks/ea9fe601.css.map");
				env.fileShouldExist("chunks/ea9fe601.js");
				await env.delay(500);
				const newTags = await window.loadLinkTags();
				expect(newTags).toEqual(["/styles.css", "chunks/ea9fe601.css"]);
			},
		);
	});

	it("Should dynamically split css file (different folder with slash)", () => {
		return quantumEnv(
			{
				sourceMaps: true,
				bundle: bundle => {
					bundle.splitConfig({ dest: "/chunks" });
				},
				files: genericFiles,
			},
			async (window, env) => {
				env.fileShouldExist("styles.css");
				env.fileShouldExist("styles.css.map");
				env.fileShouldExist("chunks/ea9fe601.css");
				env.fileShouldExist("chunks/ea9fe601.css.map");
				env.fileShouldExist("chunks/ea9fe601.js");
				await env.delay(300);
				const newTags = await window.loadLinkTags();
				expect(newTags).toEqual(["/styles.css", "/chunks/ea9fe601.css"]);
			},
		);
	});

	it("Should dynamically split css file (different folder with slash) + hashing!", () => {
		return quantumEnv(
			{
				sourceMaps: true,

				hash: true,
				bundle: bundle => {
					bundle.splitConfig({ dest: "/chunks" });
				},
				files: genericFiles,
			},
			async (window, env) => {
				await env.delay(300);
				env.fileShouldExist("6009cf7a-styles.css");
				env.fileShouldExist("styles.css.map");
				env.fileShouldExist("chunks/dcbf7349-ea9fe601.css");
				env.fileShouldExist("chunks/ea9fe601.css.map");
				env.fileShouldExist("chunks/b19fd844-ea9fe601.js");
			},
		);
	});
});
