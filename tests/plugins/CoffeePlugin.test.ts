import { CoffeePlugin, RawPlugin } from "../../src";
import { createEnv } from "../_helpers/OldEnv";
import { FuseTestEnv } from "../_helpers/stubs/FuseTestEnv";

const coffeeFileSource = `class Demo
                                           demo: ->
                                            "hello"
`;

describe("CoffeePluginTest", () => {
	it("Should return compiled CoffeScript code", () => {
		return createEnv({
			project: {
				files: {
					"app.coffee": coffeeFileSource,
				},
				plugins: [[CoffeePlugin({}), RawPlugin()]],
				instructions: ">app.coffee",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./app.coffee");
			expect(out).toEqual(`var Demo;

Demo = (function() {
  function Demo() {}

  Demo.prototype.demo = function() {
    return "hello";
  };

  return Demo;

})();
`);
		});
	});

	it("Should handle options", () => {
		return createEnv({
			project: {
				files: {
					"app.coffee": coffeeFileSource,
				},
				plugins: [
					[
						CoffeePlugin({
							bare: false,
						}),
						RawPlugin(),
					],
				],
				instructions: ">app.coffee",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./app.coffee");
			expect(out).toEqual(`(function() {
  var Demo;

  Demo = (function() {
    function Demo() {}

    Demo.prototype.demo = function() {
      return "hello";
    };

    return Demo;

  })();

}).call(this);
`);
		});
	});

	it("Should allow extension overrides", () => {
		return FuseTestEnv.create({
			project: {
				extensionOverrides: [".foo.coffee"],
				plugins: [CoffeePlugin({})],
				files: {
					"hello.coffee": `module.exports = getMessage: -> 'I should not be included'`,
					"hello.foo.coffee": `module.exports = getMessage: -> 'I should be included'`,
				},
			},
		})
			.simple(">hello.coffee")
			.then(env =>
				env.browser(window => {
					expect(window.FuseBox.import("./hello.coffee").getMessage()).toEqual("I should be included");
				}),
			);
	});
});
