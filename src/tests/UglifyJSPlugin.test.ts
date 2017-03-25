import { BundleProducer } from "../core/BundleProducer";
import { FuseBox } from "../index";
import { should } from "fuse-test-runner";
import { Bundle } from "../core/Bundle";
import { createEnv } from "./stubs/TestEnvironment";
import { UglifyJSPlugin } from "../plugins/UglifyJSPlugin";
const getTestEnv = require("./fixtures/lib").getTestEnv;

const file = `
var longVar = 'str1';
var longVar2 = 'str2';

module.exports = function () {return longVar + ' ' + longVar2;}
`;

export class UglifyJSPluginTest {
  "Should return compressed js 1"() {
      return getTestEnv({
          "index.js": file,
      }, ">index.js", { plugins: [UglifyJSPlugin()] }).then(root => {
          let result = root.FuseBox.import("./index.js");
          should(result()).findString("str1 str2");
          return true;
      });
  }

  "Should return __compressed__ js 2"() {
      return getTestEnv({
          "index.js": file,
      }, ">index.js", {
          plugins: [UglifyJSPlugin()],
          globals: { default: "__compressed__" },
      }).then((root) => {
          let result = root.FuseBox.import("./index.js");
          should(("__compressed__" in root)).beTrue();
          should(root.__compressed__().findString("str1 str2");
          return true;
      });
  }
}
