import { BublePlugin } from "../../src";
import { createEnv } from "../_helpers/OldEnv";
// import forofStub from "../stubs/buble/for-of";

function strip(str: string): string {
	return str.replace(/[\n\r\t\s_-]+/gim, "");
}

describe("Buble Plugin", () => {
	it("Should bundle es6 with Buble", () => {
		const forofStub = [
			{
				description: "transpiles for-of with array assumption with `transforms.dangerousForOf`",
				options: { transforms: { dangerousForOf: true } },

				input: `
      			for ( let member of array ) {
      				doSomething( member );
      			}`,

				output: `
      			for ( var i = 0, array1 = array; i < array1.length; i ++ ) {
      				var member = array1[i];

      				doSomething( member );
      			}`,
			},
		];
		const tests = forofStub.map(stub => {
			const { input, output, options } = stub;
			return createEnv({
				project: {
					files: { "index.ts": input },
					plugins: [BublePlugin(options)],
					instructions: "! index.ts",
				},
			}).then(result => {
				const js = result.projectContents.toString();
				expect(strip(js)).toContain(strip(output));
			});
		});

		return Promise.all(tests);
	});
});
