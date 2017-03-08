const { Log } = require("../dist/commonjs/Log");
const { execSync } = require("child_process");
const pkg = require("../package.json");

function inspector(message) {
  const util = require("util");
  let msg = util.inspect(message, {
    showHidden: true,
    depth: null,
    showProxy: true,
    maxArrayLength: 200,
    colors: true,
  });
  return msg;
}
const log = new Log({
  doLog: true,
});

function getOpts(opts) {
  const exclude = [
    "_eventsCount",
    "_name",
    "_events",
    "commands",
    "options",
    "_execs",
    "_allowUnknownOption",
    "_args",
    "_noHelp",
    "parent",
  ];
  const realOpts = {};
  const keys = Object.keys(opts)
    .filter(opt => !exclude.includes(opt));
  keys
    .forEach(opt => realOpts[opt] = opts[opt]);

  return { opts: realOpts, keys };
}

const execSyncStd = (cmd) => execSync(cmd, { stdio: "inherit" });

module.exports = {
  execSyncStd,
  execSync,
  pkg,
  log,
  getOpts,
  inspector,
};
