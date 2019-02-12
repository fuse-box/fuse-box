import { JSONPlugin } from "../src";
import { createEnv } from "./_helpers/OldEnv";

describe("HeavyNodeModules", () => {
	it("Should bundle cheerio", () => {
		return createEnv({
			project: {
				files: {
					"index.js": `
								var cheerio = require("cheerio");
							let $ = cheerio.load('<h2 class="title">Hello world</h2>')
							$('h2.title').text('Hello there!')
							$('h2').addClass('welcome')
							exports.str = $.html();
					`,
				},
				plugins: [JSONPlugin()],
				instructions: "index.js",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			expect(out).toEqual({ str: '<h2 class="title welcome">Hello there!</h2>' });
		});
	});

	it("Should bundle babel-generator", () => {
		return createEnv({
			project: {
				files: {
					"index.js": `
							var generator = require('babel-generator');
							exports.data = generator;
					`,
				},
				plugins: [JSONPlugin()],
				instructions: "index.js",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			expect(out.data.CodeGenerator).toBeTruthy();
		});
	});

	it("Should partially require problematic module from core-js", () => {
		return createEnv({
			project: {
				files: {
					"index.js": `
                exports.data = require("core-js/library/fn/symbol");
           `,
				},
				plugins: [JSONPlugin()],
				instructions: "index.js",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index");
			expect(out.data.keyFor).toBeTruthy();
		});
	});
});
