import { createEnv } from "./../stubs/TestEnvironment";
import { should } from "fuse-test-runner";
import { BublePlugin } from "../../plugins/js-transpilers/BublePlugin";
// import forofStub from "../stubs/buble/for-of";

function strip(str: string): string {
  return str.replace(/[\n\r\t\s_-]+/gmi, '')
}

export class BublePluginTest {
    "Should bundle es6 with Buble"(): Promise {
        const forofStub = [{
          description: 'transpiles for-of with array assumption with `transforms.dangerousForOf`',
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
        }]
        const tests = forofStub.map(stub => {
          const {input, output, options} = stub
          return createEnv({
              project: {
                  files: {"index.ts": input},
                  plugins: [BublePlugin(options)],
                  instructions: "! index.ts",
              },
          }).then(result => {
              const js = result.projectContents.toString();
              should(strip(js)).findString(strip(output));
          });
        })

        return Promise.all(tests)
    }
}
