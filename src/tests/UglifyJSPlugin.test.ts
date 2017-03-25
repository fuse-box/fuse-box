import { BundleProducer } from "../core/BundleProducer";
import { FuseBox } from "../index";
import { should } from "fuse-test-runner";
import { Bundle } from "../core/Bundle";
import { createEnv } from "./stubs/TestEnvironment";
import { UglifyJSPlugin } from "../plugins/UglifyJSPlugin";

export class UglifyJSPluginTest {
  "Should return compressed js 1"() {
    return createEnv({
        modules: {
            files: {
                "index.ts": `
                var longVar = 'str1';
                var longVar2 = 'str2';
                module.exports = function () {return longVar + ' ' + longVar2;}
                `,
            },
            plugins: [UglifyJSPlugin()],
            instructions: ">index.ts",
        },
    }).then((result) => {
        const out = result.project.FuseBox.import("./index");
        const contents = result.projectContents.toString();
        should(result()).findString("str1 str2");
    });
  }

  "Should return __compressed__ js 2"() {
      return createEnv({
          modules: {
              files: {
                  "index.ts": `
                  var longVar = 'str1';
                  var longVar2 = 'str2';
                  module.exports = function () {return longVar + ' ' + longVar2;}
                  `,
              },
              globals: { default: "__compressed__" },
              plugins: [UglifyJSPlugin()],
              instructions: ">index.ts",
          },
      }).then((result) => {
          const out = result.project.FuseBox.import("./index");
          should(("__compressed__" in root)).beTrue();
          should(root.__compressed__().findString("str1 str2");
      });
  }
}
