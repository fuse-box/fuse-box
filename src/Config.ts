
const appRoot = require("app-root-path");
import * as path from "path";
const PROJECT_ROOT = path.join(__dirname, "../../");
export class Configuration {
    public NODE_MODULES_DIR = path.join(appRoot.path, "node_modules");
    public FUSEBOX_MODULES = path.join(PROJECT_ROOT, "modules");
    public TEMP_FOLDER = path.join(appRoot.path, ".fusebox");
    public PROJECT_FOLDER = appRoot.path;
    public FUSEBOX_VERSION = require(path.join(PROJECT_ROOT, "package.json")).version;
}
export let Config = new Configuration();