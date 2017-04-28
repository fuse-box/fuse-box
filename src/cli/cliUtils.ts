import { execSync } from "child_process";

function inspector(message): string {
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

function getOpts(opts) {
  const exclude: Array<string> | any = [
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

// execSync, reserved in ts?
export default {
  execSyncStd,
  getOpts,
  inspector,
};
export {
  execSyncStd,
  getOpts,
  inspector,
};
