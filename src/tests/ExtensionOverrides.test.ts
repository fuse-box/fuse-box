import { should } from "fuse-test-runner";
import { FuseTestEnv } from "./stubs/FuseTestEnv";
import { ExtensionOverrides } from "../core/ExtensionOverrides";
import { File } from "../core/File";
import { ModuleCollection } from "../core/ModuleCollection";
import { WorkFlowContext } from "../core/WorkFlowContext";

export class ExtensionOverridesTest {
  "Should create an instance and set overrides if they are valid"() {
    const extensionOverrides = new ExtensionOverrides(['.foo.ts', '.foo.css']);

    should(extensionOverrides.overrides).deepEqual(['.foo.ts', '.foo.css']);
  }

  "Should create an instance and not set overrides if they are invalid"() {
    const extensionOverrides = new ExtensionOverrides(['not-valid.ts', '.foo.css']);

    should(extensionOverrides.overrides).deepEqual(['.foo.css']);
  }

  "Should allow adding additional overrides"() {
    const extensionOverrides = new ExtensionOverrides(['.foo.ts']);

    should(extensionOverrides.overrides).deepEqual(['.foo.ts']);

    extensionOverrides.add('.foo.css');

    should(extensionOverrides.overrides).deepEqual(['.foo.ts', '.foo.css']);
  }

  "Should not update a File's path info if the file does not belong to the project"() {
    const extensionOverrides = new ExtensionOverrides(['.foo.ts']);
    const file = new File(new WorkFlowContext(), {
      absPath: 'some/fake/abs/path/index.ts'
    });

    extensionOverrides.setOverrideFileInfo(file);

    should(file.info.absPath).equal('some/fake/abs/path/index.ts');
    should(file.hasExtensionOverride).equal(false);
  }

  "Should update a File's path info if an override matches"() {
    return FuseTestEnv.create({
        project: {
          extensionOverrides: ['.foo.ts'],
          files: {
              "index.ts": `export {getMessage} from './hello'`,
              "hello.ts": `export function getMessage() { return 'I should not be included'; }`,
              "hello.foo.ts": `export function getMessage() { return 'I should be included'; }`
          }
        }
      }).simple().then((env) => env.browser((window) => {
        should(window.FuseBox.import("./index").getMessage()).equal('I should be included');
      }));
  }



  // TODO: MOVE THESE TO PLUGIN TEST FILES
  //
  // "Should allow overrides of .ts extensions"() {
  //   return FuseTestEnv.create({
  //       project: {
  //         extensionOverrides: ['.foo.ts']
  //         files: {
  //             "index.ts": `export {getMessage} from './hello'`,
  //             "hello.ts": `export function getMessage() { return 'I should not be included'; }`,
  //             "hello.foo.ts": `export function getMessage() { return 'I should be included'; }`
  //         }
  //       }
  //     }).simple().then((env) => env.browser((window) => {
  //       should(window.FuseBox.import("./index").getMessage()).equal('I should be included');
  //     }));
  // }
  //
  // "Should not affect normal .css file resolution"() {
  //   return FuseTestEnv.create({
  //       project: {
  //         plugins: [CSSPlugin()]
  //         files: {
  //             "index.ts": `import './main.css'`,
  //             "main.css": `html { background: red; }`
  //         }
  //       }
  //     }).simple().then((env) => env.browser((window) => {
  //       should(window.document.querySelectorAll('style')).haveLength(1);
  //       should(window.document.querySelector('style').attributes.id.value).equal("main-css");
  //     }));
  // }
  //
  // "Should allow overrides of .css extensions"() {
  //   return FuseTestEnv.create({
  //       project: {
  //         plugins: [CSSPlugin()],
  //         extensionOverrides: ['.foo.css'],
  //         files: {
  //             "index.ts": `import './main.css'`,
  //             "main.css": `html { background: red; }`
  //             "main.foo.css": `html { background: blue; }`
  //         }
  //       }
  //     }).simple().then((env) => env.browser((window) => {
  //       should(window.document.querySelectorAll('style')).haveLength(1);
  //       should(window.document.querySelector('style').attributes.id.value).equal("main-css");
  //       should(window.document.querySelector('style').innerHTML).equal('html { background: blue; }');
  //     }));
  // }
  //
  // "Should not affect normal .less file resolution"() {
  //   return FuseTestEnv.create({
  //       project: {
  //         plugins: [CSSPlugin()]
  //         files: {
  //             "index.ts": `import './main.css'`,
  //             "main.css": `html { background: red; }`
  //         }
  //       }
  //     }).simple().then((env) => env.browser((window) => {
  //       should(window.document.querySelectorAll('style')).haveLength(1);
  //       should(window.document.querySelector('style').attributes.id.value).equal("main-css");
  //     }));
  // }
  //
  // "Should allow overrides of .css extensions"() {
  //   return FuseTestEnv.create({
  //       project: {
  //         plugins: [CSSPlugin()],
  //         extensionOverrides: ['.foo.css'],
  //         files: {
  //             "index.ts": `import './main.css'`,
  //             "main.css": `html { background: red; }`
  //             "main.foo.css": `html { background: blue; }`
  //         }
  //       }
  //     }).simple().then((env) => env.browser((window) => {
  //       should(window.document.querySelectorAll('style')).haveLength(1);
  //       should(window.document.querySelector('style').attributes.id.value).equal("main-css");
  //       should(window.document.querySelector('style').innerHTML).equal('html { background: blue; }');
  //     }));
  // }
}
