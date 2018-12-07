import { should } from "fuse-test-runner";

import { QuantumPlugin } from "../../index";
import { FuseTestEnv } from "../../tests/stubs/FuseTestEnv";

export class DefinedExpressionsTest {
	"Should elimate a single defined expression (current)"() {
		return FuseTestEnv.create({
			testFolder: "_current_test",
			project: {
				files: {
					"index.ts": `
                        if( foo === 'bar' ){
                            console.log("i am foo bar");
                        }  else {
                            console.log("i am not foo bar");
                        }
                    `,
				},
				plugins: [
					QuantumPlugin({
						target: "server",
						definedExpressions: { foo: "bar" },
					}),
				],
			},
		})
			.simple()
			.then(test =>
				test.browser((window, env) => {
					const app = env.getScript("app.js");
					app.shouldNotFindString(`foo === 'bar'`);
					app.shouldFindString("i am foo bar");
					app.shouldNotFindString("i am not foo bar");
				}),
			);
	}

	"Should elimate a single defined expression (alternate)"() {
		return FuseTestEnv.create({
			testFolder: "_current_test",
			project: {
				files: {
					"index.ts": `
	                    if( foo === 'bar' ){
	                        console.log("i am foo bar");
	                    }  else {
	                        console.log("i am not foo bar");
	                    }
	                `,
				},
				plugins: [
					QuantumPlugin({
						target: "server",
						definedExpressions: { foo: "11" },
					}),
				],
			},
		})
			.simple()
			.then(test =>
				test.browser((window, env) => {
					const app = env.getScript("app.js");
					app.shouldNotFindString(`foo === 'bar'`);
					app.shouldNotFindString("i am foo bar");
					app.shouldFindString("i am not foo bar");
				}),
			);
	}

	"Should elimate a member defined expression (current)"() {
		return FuseTestEnv.create({
			testFolder: "_current_test",
			project: {
				files: {
					"index.ts": `
	                    if( foo.bar === 'bar' ){
	                        console.log("i am foo bar");
	                    }  else {
	                        console.log("i am not foo bar");
	                    }
	                `,
				},
				plugins: [
					QuantumPlugin({
						target: "server",
						definedExpressions: { "foo.bar": "bar" },
					}),
				],
			},
		})
			.simple()
			.then(test =>
				test.browser((window, env) => {
					const app = env.getScript("app.js");
					app.shouldNotFindString(`foo.bar === 'bar'`);
					app.shouldFindString("i am foo bar");
					app.shouldNotFindString("i am not foo bar");
				}),
			);
	}

	"Should elimate a member defined expression (alternate)"() {
		return FuseTestEnv.create({
			testFolder: "_current_test",
			project: {
				files: {
					"index.ts": `
	                    if( foo.bar === 'bar' ){
	                        console.log("i am foo bar");
	                    }  else {
	                        console.log("i am not foo bar");
	                    }
	                `,
				},
				plugins: [
					QuantumPlugin({
						target: "server",
						definedExpressions: { "foo.bar": "11" },
					}),
				],
			},
		})
			.simple()
			.then(test =>
				test.browser((window, env) => {
					const app = env.getScript("app.js");
					app.shouldNotFindString(`foo.bar === 'bar'`);
					app.shouldNotFindString("i am foo bar");
					app.shouldFindString("i am not foo bar");
				}),
			);
	}
}
