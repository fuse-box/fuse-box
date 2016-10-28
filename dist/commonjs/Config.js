"use strict";
const appRoot = require("app-root-path");
const path = require("path");
const PROJECT_ROOT = path.join(__dirname, "../../");
class Configuration {
    constructor() {
        this.ASSETS_DIR = path.join(PROJECT_ROOT, "assets");
        this.NODE_MODULES_DIR = path.join(appRoot.path, "node_modules");
        this.LOCAL_LIBS = path.join(PROJECT_ROOT, "assets/libs");
        this.TEMP_FOLDER = path.join(PROJECT_ROOT, ".tmp");
    }
}
exports.Configuration = Configuration;
exports.Config = new Configuration();
