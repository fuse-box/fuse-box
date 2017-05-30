const appRoot = require("app-root-path");
import * as path from "path";
const PROJECT_ROOT = process.env.FUSEBOX_DIST_ROOT || path.join(__dirname, "../../");

const MAIN_FILE = require.main.filename;
if (MAIN_FILE.indexOf("gulp.js") > -1 && !process.env.PROJECT_ROOT) {
    console.warn("FuseBox wasn't able to detect your project root! You are running gulp!")
    console.warn("Please set process.env.PROJECT_ROOT");
}
export class Configuration {
    public NODE_MODULES_DIR = process.env.PROJECT_NODE_MODULES || path.join(appRoot.path, "node_modules");
    public FUSEBOX_ROOT = PROJECT_ROOT;
    public FUSEBOX_MODULES = path.join(PROJECT_ROOT, "modules");
    public TEMP_FOLDER = process.env.FUSEBOX_TEMP_FOLDER || path.join(appRoot.path, ".fusebox");
    public PROJECT_FOLDER = appRoot.path;
    public PROJECT_ROOT = process.env.PROJECT_ROOT || path.dirname(MAIN_FILE);
    public FUSEBOX_VERSION = process.env.FUSEBOX_VERSION || require(path.join(PROJECT_ROOT, "package.json")).version;
}
export let Config = new Configuration();
