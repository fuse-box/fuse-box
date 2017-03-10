"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const appRoot = require("app-root-path");
const path = require("path");
const pkg = require(path.join(appRoot.path, "package.json"));
exports.pkg = pkg;
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
exports.inspector = inspector;
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
exports.getOpts = getOpts;
const execSyncStd = (cmd) => child_process_1.execSync(cmd, { stdio: "inherit" });
exports.execSyncStd = execSyncStd;
exports.default = {
    execSyncStd,
    pkg,
    getOpts,
    inspector,
};
