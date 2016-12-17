
const appRoot = require("app-root-path");
import * as path from "path";
const PROJECT_ROOT = path.join(__dirname, "../../");
export class Configuration {
    public ASSETS_DIR = path.join(PROJECT_ROOT, "assets");
    public NODE_MODULES_DIR = path.join(appRoot.path, "node_modules");
    public LOCAL_LIBS = path.join(PROJECT_ROOT, "assets/libs");
    public TEMP_FOLDER = path.join(appRoot.path, ".fusebox");
    public PROJECT_FOLDER = appRoot.path;
    public FUSEBOX_VERSION = require(path.join(PROJECT_ROOT, "package.json")).version;
}
export let Config = new Configuration();