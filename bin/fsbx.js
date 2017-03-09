const path = require("path");
const root = path.join(__dirname, "../");
process.env.FUSEBOX_DIST_ROOT = root;
process.env.PROJECT_NODE_MODULES = path.join(root, "node_modules");
require("../dist/commonjs/cli/CommandLine.js");
