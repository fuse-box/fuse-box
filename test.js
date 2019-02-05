const { join } = require("path");
const { argv, env } = require("process");
const { FuseBox } = require("fuse-box");

const defaultTestFileMask = "*.test.ts";
const projectRoot = __dirname;

/*
 * Definition of environment variables required to run tests in the node
 * environment.
 */
env.DYNAMIC_IMPORTS_DISABLED = true;
env.FUSE_TEST_TIMEOUT = 5000;
env.FUSEBOX_DIST_ROOT = projectRoot;
env.FUSEBOX_VERSION = "2.4.0";
env.LOGGING = false;
env.PROJECT_NODE_MODULES = join(projectRoot, "node_modules");
env.SPARKY_LOG = false;

/*
 * A --file flag can be used to override a default test mask.
 */
const maybeFileFlag = argv[2];
const fileFlag =
  typeof maybeFileFlag === "string" && maybeFileFlag.match(/^--file=(.*)/);

const testFileMask = fileFlag === false ? defaultTestFileMask : fileFlag[1];

const fuse = FuseBox.init({
  homeDir: "src",
  target: "server@esnext",
  log: false,
  dynamicImportsEnabled: false,
  output: ".fusebox/$name.js",
  cache: false,
});

fuse.bundle("fusebox").test(`[**/${testFileMask}]`);
