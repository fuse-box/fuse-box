(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("cli/CommandLine.js", function(exports, require, module, __filename, __dirname){ 
/* fuse:injection: */ var process = require("process");
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const fsbx = require("../index");
const cliUtils_1 = require("./cliUtils");
const docs_1 = require("./docs");
program
    .version(cliUtils_1.pkg.version);
const pluginProgram = program.command("plugins");
pluginProgram.option("-d, --docs", "documentation for the plugin");
pluginProgram.option("-c, --code", "code for the plugin");
pluginProgram.option("-a, --all", "everything about the plugin");
pluginProgram.option("-g, --github", "github link to the plugin");
pluginProgram.option("-t, --tests", "test code for the plugins");
for (const index in docs_1.plugins) {
    const pluginName = docs_1.plugins[index];
    pluginProgram.option("--" + pluginName);
}
pluginProgram
    .action(function (options) {
    const { keys } = cliUtils_1.getOpts(options);
    keys.forEach(name => {
        const Plugin = fsbx[name];
        const plugin = Plugin();
        const inspected = cliUtils_1.inspector(plugin);
        if (options.all || options.code) {
            let contents = docs_1.codeFor("plugins/" + name + ".ts");
            contents = cliUtils_1.inspector(contents.split("\n"));
            console.log(contents);
        }
        cliUtils_1.log.echo(docs_1.githubSrcFor(name));
        cliUtils_1.log.echo(docs_1.docsLinkFor(name));
        cliUtils_1.log.echo(docs_1.findDocsFor(name));
        console.log(inspected);
    });
});
program.on("--help", () => {
    cliUtils_1.execSyncStd(`node ${__dirname + "/CommandLine"} arithmetics --help`);
    cliUtils_1.execSyncStd(`node ${__dirname + "/CommandLine"} plugins --help`);
    cliUtils_1.execSyncStd(`node ${__dirname + "/CommandLine"} fuse --help`);
});
program
    .command("arithmetics")
    .option("-i, --include", "+ adds a package / file")
    .option("-e, --exclude, --ignore", "- excludes a package / file")
    .option("-c, --cache", "use caching (default)")
    .option("-C, --nocache", "^ disables the cache")
    .option("-a, --noapi", "! removes the wrapping fusebox")
    .option("-x, --execute", "> executes the index")
    .option("-b, --bundle", "[glob] bundles with no dependencies")
    .option("-g, --glob", "**/*, [**/*.js], http://www.globtester.com/")
    .option("-p, --parse", "pass in a string, parse it (use quotes, --parse='magic here')")
    .action(function (name, options) {
    console.log("eh?");
});
const { Builder } = require("./ConfigGatherer");
const config = new Builder(fsbx);
program
    .command("step")
    .action(function (name, options) {
    config.stepper();
});
program
    .command("init")
    .action(function (name, options) {
    config.init();
});
program.parse(process.argv);

});
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReplacePlugin_1 = require("./plugins/ReplacePlugin");
exports.ReplacePlugin = ReplacePlugin_1.ReplacePlugin;
var VuePlugin_1 = require("./plugins/VuePlugin");
exports.VuePlugin = VuePlugin_1.VuePlugin;
var ImageBase64Plugin_1 = require("./plugins/images/ImageBase64Plugin");
exports.ImageBase64Plugin = ImageBase64Plugin_1.ImageBase64Plugin;
var CSSResourcePlugin_1 = require("./plugins/stylesheet/CSSResourcePlugin");
exports.CSSResourcePlugin = CSSResourcePlugin_1.CSSResourcePlugin;
var HotReloadPlugin_1 = require("./plugins/HotReloadPlugin");
exports.HotReloadPlugin = HotReloadPlugin_1.HotReloadPlugin;
var EnvPlugin_1 = require("./plugins/EnvPlugin");
exports.EnvPlugin = EnvPlugin_1.EnvPlugin;
var ConcatPlugin_1 = require("./plugins/ConcatPlugin");
exports.ConcatPlugin = ConcatPlugin_1.ConcatPlugin;
var StylusPlugin_1 = require("./plugins/stylesheet/StylusPlugin");
exports.StylusPlugin = StylusPlugin_1.StylusPlugin;
var PostCSSPlugin_1 = require("./plugins/stylesheet/PostCSSPlugin");
exports.PostCSS = PostCSSPlugin_1.PostCSS;
var TypeScriptHelpers_1 = require("./plugins/TypeScriptHelpers");
exports.TypeScriptHelpers = TypeScriptHelpers_1.TypeScriptHelpers;
var SVGPlugin_1 = require("./plugins/images/SVGPlugin");
exports.SVGPlugin = SVGPlugin_1.SVGPlugin;
var BabelPlugin_1 = require("./plugins/js-transpilers/BabelPlugin");
exports.BabelPlugin = BabelPlugin_1.BabelPlugin;
var CoffeePlugin_1 = require("./plugins/js-transpilers/CoffeePlugin");
exports.CoffeePlugin = CoffeePlugin_1.CoffeePlugin;
var LESSPlugin_1 = require("./plugins/stylesheet/LESSPlugin");
exports.LESSPlugin = LESSPlugin_1.LESSPlugin;
var CSSplugin_1 = require("./plugins/stylesheet/CSSplugin");
exports.CSSPlugin = CSSplugin_1.CSSPlugin;
var HTMLplugin_1 = require("./plugins/HTMLplugin");
exports.HTMLPlugin = HTMLplugin_1.HTMLPlugin;
var JSONplugin_1 = require("./plugins/JSONplugin");
exports.JSONPlugin = JSONplugin_1.JSONPlugin;
var BannerPlugin_1 = require("./plugins/BannerPlugin");
exports.BannerPlugin = BannerPlugin_1.BannerPlugin;
var SassPlugin_1 = require("./plugins/stylesheet/SassPlugin");
exports.SassPlugin = SassPlugin_1.SassPlugin;
var UglifyJSPlugin_1 = require("./plugins/UglifyJSPlugin");
exports.UglifyJSPlugin = UglifyJSPlugin_1.UglifyJSPlugin;
var SourceMapPlainJsPlugin_1 = require("./plugins/SourceMapPlainJsPlugin");
exports.SourceMapPlainJsPlugin = SourceMapPlainJsPlugin_1.SourceMapPlainJsPlugin;
var RawPlugin_1 = require("./plugins/RawPlugin");
exports.RawPlugin = RawPlugin_1.RawPlugin;
var Fluent_1 = require("./arithmetic/Fluent");
exports.Fluent = Fluent_1.Fluent;
var FuseBox_1 = require("./core/FuseBox");
exports.FuseBox = FuseBox_1.FuseBox;

});
___scope___.file("plugins/ReplacePlugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReplacePluginClass {
    constructor(options) {
        this.options = options;
        this.test = /.*/;
    }
    ;
    transform(file) {
        for (let key in this.options) {
            if (this.options.hasOwnProperty(key)) {
                file.contents = file.contents.replace(key, this.options[key]);
            }
        }
    }
}
exports.ReplacePluginClass = ReplacePluginClass;
exports.ReplacePlugin = (options) => {
    return new ReplacePluginClass(options);
};

});
___scope___.file("plugins/VuePlugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let vueCompiler;
class VuePluginClass {
    constructor(opts) {
        this.test = /\.vue$/;
        this.opts = opts || {};
    }
    init(context) {
        context.allowExtension(".vue");
    }
    transform(file) {
        const context = file.context;
        if (context.useCache) {
            let cached = context.cache.getStaticCache(file);
            if (cached) {
                file.isLoaded = true;
                if (cached.sourceMap) {
                    file.sourceMap = cached.sourceMap;
                }
                file.analysis.skip();
                file.analysis.dependencies = cached.dependencies;
                file.contents = cached.contents;
                return;
            }
        }
        file.loadContents();
        if (!vueCompiler) {
            vueCompiler = require("vue-template-compiler");
        }
        let result = vueCompiler.parseComponent(file.contents, this.opts);
        if (result.template && result.template.type === "template") {
            let html = result.template.content;
            let jsContent = result.script.content;
            const ts = require("typescript");
            const jsTranspiled = ts.transpileModule(jsContent, file.context.getTypeScriptConfig());
            const tsResult = `var View = require('vue/dist/vue.js');
var _p = {};
var _v = function(exports){${jsTranspiled.outputText}};
_p.template = ${JSON.stringify(html)};
let _e = {}; _v(_e); _p = Object.assign(_e.default, _p)
module.exports ={render : function(el){_p.el = el; return new View(_p)}}
            `;
            file.contents = tsResult;
            file.analysis.parseUsingAcorn();
            file.analysis.analyze();
            if (context.useCache) {
                context.emitJavascriptHotReload(file);
                context.cache.writeStaticCache(file, file.sourceMap);
            }
        }
    }
}
exports.VuePluginClass = VuePluginClass;
;
exports.VuePlugin = (opts) => {
    return new VuePluginClass(opts);
};

});
___scope___.file("plugins/images/ImageBase64Plugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const SVG2Base64_1 = require("../../lib/SVG2Base64");
const base64Img = require("base64-img");
class ImageBase64PluginClass {
    constructor() {
        this.test = /\.(gif|png|jpg|jpeg|svg)$/i;
    }
    init(context) {
        context.allowExtension(".gif");
        context.allowExtension(".png");
        context.allowExtension(".jpg");
        context.allowExtension(".jpeg");
        context.allowExtension(".svg");
    }
    transform(file) {
        const context = file.context;
        const cached = context.cache.getStaticCache(file);
        if (cached) {
            file.isLoaded = true;
            file.contents = cached.contents;
        }
        else {
            const ext = path.extname(file.absPath);
            if (ext === ".svg") {
                file.loadContents();
                let content = SVG2Base64_1.SVG2Base64.get(file.contents);
                file.contents = `module.exports = ${JSON.stringify(content)}`;
                return;
            }
            file.isLoaded = true;
            const data = base64Img.base64Sync(file.absPath);
            file.contents = `module.exports = ${JSON.stringify(data)}`;
            context.cache.writeStaticCache(file, undefined);
        }
    }
}
exports.ImageBase64PluginClass = ImageBase64PluginClass;
;
exports.ImageBase64Plugin = () => {
    return new ImageBase64PluginClass();
};

});
___scope___.file("lib/SVG2Base64.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SVG2Base64 {
    static get(content) {
        content = content.replace(/"/g, "'");
        content = content.replace(/\s+/g, " ");
        content = content.replace(/[{}\|\\\^~\[\]`"<>#%]/g, (match) => {
            return "%" + match[0].charCodeAt(0).toString(16).toUpperCase();
        });
        return "data:image/svg+xml;charset=utf8," + content.trim();
    }
}
exports.SVG2Base64 = SVG2Base64;

});
___scope___.file("plugins/stylesheet/CSSResourcePlugin.js", function(exports, require, module, __filename, __dirname){ 
/* fuse:injection: */ var Buffer = require("buffer").Buffer;
/* fuse:injection: */ var process = require("process");
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../../Utils");
const path = require("path");
const realm_utils_1 = require("realm-utils");
const fs = require("fs");
const PostCSSResourcePlugin_1 = require("../../lib/postcss/PostCSSResourcePlugin");
const SVG2Base64_1 = require("../../lib/SVG2Base64");
const base64Img = require("base64-img");
const postcss = require("postcss");
const IMG_CACHE = {};
let resourceFolderChecked = false;
const copyFile = (source, target) => {
    return new Promise((resolve, reject) => {
        fs.exists(source, (exists) => {
            if (!exists) {
                return resolve();
            }
            let rd = fs.createReadStream(source);
            rd.on("error", (err) => {
                return reject(err);
            });
            let wr = fs.createWriteStream(target);
            wr.on("error", (err) => {
                return reject(err);
            });
            wr.on("close", (ex) => {
                return resolve();
            });
            rd.pipe(wr);
        });
    });
};
const generateNewFileName = (str) => {
    let s = str.split("node_modules");
    const ext = path.extname(str);
    if (s[1]) {
        str = s[1];
    }
    let hash = 0;
    let i;
    let chr;
    let len;
    if (str.length === 0) {
        return hash.toString() + ext;
    }
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    let fname = hash.toString() + ext;
    if (fname.charAt(0) === "-") {
        fname = "_" + fname.slice(1);
    }
    return fname;
};
class CSSResourcePluginClass {
    constructor(opts) {
        this.test = /\.css$/;
        this.resolveFn = (p) => path.join("/css-resources", p);
        opts = opts || {};
        if (opts.dist) {
            this.distFolder = Utils_1.ensureDir(opts.dist);
        }
        if (opts.inline) {
            this.inlineImages = opts.inline;
        }
        if (realm_utils_1.utils.isFunction(opts.resolve)) {
            this.resolveFn = opts.resolve;
        }
    }
    init(context) {
        context.allowExtension(".css");
    }
    createResouceFolder(file) {
        if (resourceFolderChecked === false) {
            resourceFolderChecked = true;
            if (this.distFolder) {
                return;
            }
            let outFilePath = Utils_1.ensureUserPath(file.context.outFile);
            let outFileDir = path.dirname(outFilePath);
            this.distFolder = Utils_1.ensureDir(path.join(outFileDir, "css-resources"));
        }
    }
    transform(file) {
        file.loadContents();
        let contents = file.contents;
        if (this.distFolder) {
            this.createResouceFolder(file);
        }
        const currentFolder = file.info.absDir;
        const files = {};
        const tasks = [];
        return postcss([PostCSSResourcePlugin_1.PostCSSResourcePlugin({
                fn: (url) => {
                    let urlFile = path.resolve(currentFolder, url);
                    urlFile = urlFile.replace(/[?\#].*$/, "");
                    if (this.inlineImages) {
                        if (IMG_CACHE[urlFile]) {
                            return IMG_CACHE[urlFile];
                        }
                        if (!fs.existsSync(urlFile)) {
                            file.context.debug("CSSResourcePlugin", `Can't find file ${urlFile}`);
                            return;
                        }
                        const ext = path.extname(urlFile);
                        let fontsExtensions = {
                            ".woff": "application/font-woff",
                            ".woff2": "application/font-woff2",
                            ".eot": "application/vnd.ms-fontobject",
                            ".ttf": "application/x-font-ttf",
                            ".otf": "font/opentype",
                        };
                        if (fontsExtensions[ext]) {
                            let content = new Buffer(fs.readFileSync(urlFile)).toString("base64");
                            return `data:${fontsExtensions[ext]};charset=utf-8;base64,${content}`;
                        }
                        if (ext === ".svg") {
                            let content = SVG2Base64_1.SVG2Base64.get(fs.readFileSync(urlFile).toString());
                            IMG_CACHE[urlFile] = content;
                            return content;
                        }
                        let result = base64Img.base64Sync(urlFile);
                        IMG_CACHE[urlFile] = result;
                        return result;
                    }
                    if (this.distFolder) {
                        let newFileName = generateNewFileName(urlFile);
                        if (!files[urlFile]) {
                            let newPath = path.join(this.distFolder, newFileName);
                            tasks.push(copyFile(urlFile, newPath));
                            files[urlFile] = true;
                        }
                        return this.resolveFn(newFileName);
                    }
                },
            })]).process(contents).then(result => {
            file.contents = result.css;
            return Promise.all(tasks);
        });
    }
}
exports.CSSResourcePluginClass = CSSResourcePluginClass;
exports.CSSResourcePlugin = (options) => {
    return new CSSResourcePluginClass(options);
};

});
___scope___.file("Utils.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const fsExtra = require("fs-extra");
const appRoot = require("app-root-path");
const MBLACKLIST = [
    "freelist",
    "sys",
];
exports.Concat = require("concat-with-sourcemaps");
function contains(array, obj) {
    return array && array.indexOf(obj) > -1;
}
exports.contains = contains;
function replaceAliasRequireStatement(requireStatement, aliasName, aliasReplacement) {
    requireStatement = requireStatement.replace(aliasName, aliasReplacement);
    requireStatement = path.normalize(requireStatement);
    return requireStatement;
}
exports.replaceAliasRequireStatement = replaceAliasRequireStatement;
function write(fileName, contents) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, contents, (e) => {
            if (e) {
                return reject(e);
            }
            return resolve();
        });
    });
}
exports.write = write;
function camelCase(str) {
    let DEFAULT_REGEX = /[-_]+(.)?/g;
    function toUpper(match, group1) {
        return group1 ? group1.toUpperCase() : "";
    }
    return str.replace(DEFAULT_REGEX, toUpper);
}
exports.camelCase = camelCase;
function parseQuery(qstr) {
    let query = new Map();
    let a = qstr.split("&");
    for (let i = 0; i < a.length; i++) {
        let b = a[i].split("=");
        query.set(decodeURIComponent(b[0]), decodeURIComponent(b[1] || ""));
    }
    return query;
}
exports.parseQuery = parseQuery;
function ensureUserPath(userPath) {
    if (!path.isAbsolute(userPath)) {
        userPath = path.join(appRoot.path, userPath);
    }
    userPath = path.normalize(userPath);
    let dir = path.dirname(userPath);
    fsExtra.ensureDirSync(dir);
    return userPath;
}
exports.ensureUserPath = ensureUserPath;
function ensureDir(userPath) {
    if (!path.isAbsolute(userPath)) {
        userPath = path.join(appRoot.path, userPath);
    }
    userPath = path.normalize(userPath);
    fsExtra.ensureDirSync(userPath);
    return userPath;
}
exports.ensureDir = ensureDir;
function string2RegExp(obj) {
    let escapedRegEx = obj
        .replace(/\*/g, "@")
        .replace(/[.?*+[\]-]/g, "\\$&")
        .replace(/@/g, "\\w{1,}", "i");
    if (escapedRegEx.indexOf("$") === -1) {
        escapedRegEx += "$";
    }
    return new RegExp(escapedRegEx);
}
exports.string2RegExp = string2RegExp;
function removeFolder(userPath) {
    fsExtra.removeSync(userPath);
}
exports.removeFolder = removeFolder;
function replaceExt(npath, ext) {
    if (typeof npath !== "string") {
        return npath;
    }
    if (npath.length === 0) {
        return npath;
    }
    if (/\.[a-z0-9]+$/i.test(npath)) {
        return npath.replace(/\.[a-z0-9]+$/i, ext);
    }
    else {
        return npath + ext;
    }
}
exports.replaceExt = replaceExt;
function extractExtension(str) {
    const result = str.match(/\.([a-z0-9]+)\$?$/);
    if (!result) {
        throw new Error(`Can't extract extension from string ${str}`);
    }
    return result[1];
}
exports.extractExtension = extractExtension;
function ensureFuseBoxPath(input) {
    return input.replace(/\\/g, "/");
}
exports.ensureFuseBoxPath = ensureFuseBoxPath;
function ensurePublicExtension(url) {
    let ext = path.extname(url);
    if (ext === ".ts") {
        url = replaceExt(url, ".js");
    }
    if (ext === ".tsx") {
        url = replaceExt(url, ".jsx");
    }
    return url;
}
exports.ensurePublicExtension = ensurePublicExtension;
function getBuiltInNodeModules() {
    const process = global.process;
    return Object.keys(process.binding("natives")).filter(m => {
        return !/^_|^internal|\//.test(m) && MBLACKLIST.indexOf(m) === -1;
    });
}
exports.getBuiltInNodeModules = getBuiltInNodeModules;
function findFileBackwards(target, limitPath) {
    let [found, reachedLimit] = [false, false];
    let filename = path.basename(target);
    let current = path.dirname(target);
    let iterations = 0;
    const maxIterations = 10;
    while (found === false && reachedLimit === false) {
        let targetFilePath = path.join(current, filename);
        if (fs.existsSync(targetFilePath)) {
            return targetFilePath;
        }
        if (limitPath === current) {
            reachedLimit = true;
        }
        current = path.join(current, "..");
        iterations++;
        if (iterations > maxIterations) {
            reachedLimit = true;
        }
    }
}
exports.findFileBackwards = findFileBackwards;
function walk(dir, options) {
    var defaults = {
        recursive: false,
    };
    options = Object.assign(defaults, options);
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + "/" + file;
        var stat = fs.statSync(file);
        if (options.recursive) {
            if (stat && stat.isDirectory())
                results = results.concat(walk(file));
            else
                results.push(file);
        }
        else if (stat && stat.isFile()) {
            results.push(file);
        }
    });
    return results;
}
exports.walk = walk;

});
___scope___.file("lib/postcss/PostCSSResourcePlugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postcss = require("postcss");
const extractValue = (input) => {
    const first = input.charCodeAt(0);
    const last = input.charCodeAt(input.length - 1);
    if (first === 39 || first === 34) {
        input = input.slice(1);
    }
    if (last === 39 || last === 34) {
        input = input.slice(0, -1);
    }
    if (/data:/.test(input)) {
        return;
    }
    return input;
};
exports.PostCSSResourcePlugin = postcss.plugin("css-resource", function (opts) {
    opts = opts || {};
    return (css, result) => {
        css.walkDecls(declaration => {
            if (declaration.prop) {
                if (declaration.prop.indexOf("background") === 0 || declaration.prop.indexOf("src") === 0) {
                    let re = /url\((.*?)\)/g;
                    let match;
                    while (match = re.exec(declaration.value)) {
                        const value = match[1];
                        const url = extractValue(value);
                        if (typeof opts.fn === "function" && url) {
                            const result = opts.fn(url);
                            if (typeof result === "string") {
                                declaration.value = declaration.value.replace(match[0], `url("${result}")`);
                            }
                        }
                    }
                }
            }
        });
    };
});

});
___scope___.file("plugins/HotReloadPlugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HotReloadPluginClass {
    constructor(opts = {}) {
        this.dependencies = ["fusebox-hot-reload"];
        this.port = "";
        this.uri = "";
        if (opts.port) {
            this.port = opts.port;
        }
        if (opts.uri) {
            this.uri = opts.uri;
        }
    }
    init() { }
    bundleEnd(context) {
        context.source.addContent(`FuseBox.import("fusebox-hot-reload").connect(${this.port}, ${JSON.stringify(this.uri)})`);
    }
}
exports.HotReloadPluginClass = HotReloadPluginClass;
;
exports.HotReloadPlugin = (opts) => {
    return new HotReloadPluginClass(opts);
};

});
___scope___.file("plugins/EnvPlugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EnvPluginClass {
    constructor(env) {
        this.env = env;
    }
    bundleStart(context) {
        context.source.addContent(`var __process_env__ = ${JSON.stringify(this.env)};`);
    }
}
exports.EnvPluginClass = EnvPluginClass;
exports.EnvPlugin = (banner) => {
    return new EnvPluginClass(banner);
};

});
___scope___.file("plugins/ConcatPlugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConcatPluginClass {
    constructor(opts = {}) {
        this.delimiter = "\n";
        this.test = /\.txt$/;
        if ("ext" in opts) {
            this.ext = opts.ext;
        }
        if ("name" in opts) {
            this.bundleName = opts.name;
        }
        if ("delimiter" in opts) {
            this.delimiter = opts.delimiter;
        }
    }
    init(context) {
        if (this.ext) {
            context.allowExtension(this.ext);
        }
    }
    transform(file) {
        file.loadContents();
        let context = file.context;
        let fileGroup = context.getFileGroup(this.bundleName);
        if (!fileGroup) {
            fileGroup = context.createFileGroup(this.bundleName, file.collection, this);
        }
        fileGroup.addSubFile(file);
        file.alternativeContent = `module.exports = require("./${this.bundleName}")`;
    }
    transformGroup(group) {
        let contents = [];
        group.subFiles.forEach(file => {
            contents.push(file.contents);
        });
        let text = contents.join(this.delimiter);
        group.contents = `module.exports = ${JSON.stringify(text)}`;
    }
}
exports.ConcatPluginClass = ConcatPluginClass;
;
exports.ConcatPlugin = (opts) => {
    return new ConcatPluginClass(opts);
};

});
___scope___.file("plugins/stylesheet/StylusPlugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let stylus;
class StylusPluginClass {
    constructor(options) {
        this.test = /\.styl$/;
        this.options = options || {};
    }
    init(context) {
        context.allowExtension(".styl");
    }
    transform(file) {
        const context = file.context;
        const options = Object.assign({}, this.options);
        const sourceMapDef = {
            comment: false,
            sourceRoot: file.info.absDir,
        };
        file.loadContents();
        if (!stylus)
            stylus = require("stylus");
        options.filename = file.info.fuseBoxPath;
        if ("sourceMapConfig" in context) {
            options.sourcemap = Object.assign({}, sourceMapDef, this.options.sourcemap || {});
        }
        return new Promise((res, rej) => {
            const renderer = stylus(file.contents, options);
            return renderer.render((err, css) => {
                if (err)
                    return rej(err);
                if (renderer.sourcemap) {
                    file.sourceMap = JSON.stringify(renderer.sourcemap);
                }
                file.contents = css;
                return res(css);
            });
        });
    }
}
exports.StylusPluginClass = StylusPluginClass;
exports.StylusPlugin = (options) => {
    return new StylusPluginClass(options);
};

});
___scope___.file("plugins/stylesheet/PostCSSPlugin.js", function(exports, require, module, __filename, __dirname){ 
/* fuse:injection: */ var process = require("process");
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let postcss;
class PostCSSPluginClass {
    constructor(processors, opts) {
        this.processors = processors;
        this.opts = opts;
        this.test = /\.css$/;
        this.dependencies = [];
        this.opts = this.opts || {};
        this.processors = this.processors || [];
    }
    init(context) {
        context.allowExtension(".css");
    }
    transform(file) {
        file.loadContents();
        if (!postcss) {
            postcss = require("postcss");
        }
        return postcss(this.processors)
            .process(file.contents, this.opts)
            .then(result => {
            file.contents = result.css;
            return result.css;
        });
    }
}
exports.PostCSSPluginClass = PostCSSPluginClass;
exports.PostCSS = (processors, opts) => {
    return new PostCSSPluginClass(processors, opts);
};

});
___scope___.file("plugins/TypeScriptHelpers.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./../Config");
const fs = require("fs");
const path = require("path");
class TypeScriptHelpersClass {
    constructor(opts) {
        this.test = /\.tsx?$/;
        this.registeredHelpers = new Map();
        opts = opts || {};
        let folder = path.join(Config_1.Config.FUSEBOX_MODULES, "fuse-typescript-helpers");
        let files = fs.readdirSync(folder);
        files.forEach(fileName => {
            let contents = fs.readFileSync(path.join(folder, fileName)).toString();
            let name = fileName.replace(/\.js/, "");
            this.registeredHelpers.set(name, contents);
        });
    }
    init(context) {
        context.setItem("ts_helpers", new Set());
    }
    bundleEnd(context) {
        let helpers = context.getItem("ts_helpers");
        helpers.forEach(name => {
            let contents = this.registeredHelpers.get(name);
            context.source.addContent(contents);
        });
    }
    transform(file) {
        let patchDecorate = false;
        if (file.collection.name !== file.context.defaultPackageName) {
            return;
        }
        let helpers = file.context.getItem("ts_helpers");
        this.registeredHelpers.forEach((cont, name) => {
            let regexp = new RegExp(name, "gm");
            if (regexp.test(file.contents)) {
                if (name === "__decorate") {
                    patchDecorate = true;
                    if (file.headerContent && file.headerContent.indexOf("var __decorate = __fsbx_decorate(arguments)") === 0) {
                        patchDecorate = false;
                    }
                }
                if (!helpers.has(name)) {
                    helpers.add(name);
                }
            }
        });
        if (patchDecorate) {
            file.addHeaderContent("var __decorate = __fsbx_decorate(arguments)");
        }
    }
}
exports.TypeScriptHelpersClass = TypeScriptHelpersClass;
exports.TypeScriptHelpers = () => {
    return new TypeScriptHelpersClass({});
};

});
___scope___.file("Config.js", function(exports, require, module, __filename, __dirname){ 
/* fuse:injection: */ var process = require("process");
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appRoot = require("app-root-path");
const path = require("path");
const PROJECT_ROOT = process.env.FUSEBOX_DIST_ROOT || path.join(__dirname, "../../");
class Configuration {
    constructor() {
        this.NODE_MODULES_DIR = process.env.PROJECT_NODE_MODULES || path.join(appRoot.path, "node_modules");
        this.FUSEBOX_MODULES = path.join(PROJECT_ROOT, "modules");
        this.TEMP_FOLDER = path.join(appRoot.path, ".fusebox");
        this.PROJECT_FOLDER = appRoot.path;
        this.FUSEBOX_VERSION = process.env.FUSEBOX_VERSION || require(path.join(PROJECT_ROOT, "package.json")).version;
    }
}
exports.Configuration = Configuration;
exports.Config = new Configuration();

});
___scope___.file("plugins/images/SVGPlugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SVGSimplePlugin {
    constructor() {
        this.test = /\.svg$/;
    }
    init(context) {
        context.allowExtension(".svg");
    }
    transform(file) {
        file.loadContents();
        let content = file.contents;
        content = content.replace(/"/g, "'");
        content = content.replace(/\s+/g, " ");
        content = content.replace(/[{}\|\\\^~\[\]`"<>#%]/g, (match) => {
            return "%" + match[0].charCodeAt(0).toString(16).toUpperCase();
        });
        let data = "data:image/svg+xml;charset=utf8," + content.trim();
        file.contents = `module.exports = ${JSON.stringify(data)}`;
    }
}
exports.SVGSimplePlugin = SVGSimplePlugin;
;
exports.SVGPlugin = () => {
    return new SVGSimplePlugin();
};

});
___scope___.file("plugins/js-transpilers/BabelPlugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const appRoot = require("app-root-path");
let babelCore;
class BabelPluginClass {
    constructor(opts) {
        this.test = /\.(j|t)s(x)?$/;
        this.limit2project = true;
        this.config = {};
        this.configPrinted = false;
        let babelRcConfig;
        let babelRcPath = path.join(appRoot.path, `.babelrc`);
        if (fs.existsSync(babelRcPath)) {
            babelRcConfig = fs.readFileSync(babelRcPath).toString();
            if (babelRcConfig)
                babelRcConfig = JSON.parse(babelRcConfig);
        }
        opts = opts || {};
        this.config = opts.config ? opts.config : babelRcConfig;
        if (opts.test !== undefined) {
            this.test = opts.test;
        }
        if (opts.limit2project !== undefined) {
            this.limit2project = opts.limit2project;
        }
    }
    init(context) {
        this.context = context;
        context.allowExtension(".jsx");
    }
    transform(file, ast) {
        if (!babelCore) {
            babelCore = require("babel-core");
        }
        if (this.configPrinted === false) {
            file.context.debug("BabelPlugin", `\n\tConfiguration: ${JSON.stringify(this.config)}`);
            this.configPrinted = true;
        }
        if (this.context.useCache) {
            let cached = this.context.cache.getStaticCache(file);
            if (cached) {
                if (cached.sourceMap) {
                    file.sourceMap = cached.sourceMap;
                }
                file.analysis.skip();
                file.analysis.dependencies = cached.dependencies;
                file.contents = cached.contents;
                return;
            }
        }
        if (this.limit2project === false || file.collection.name === file.context.defaultPackageName) {
            let result;
            try {
                result = babelCore.transform(file.contents, this.config);
            }
            catch (e) {
                file.analysis.skip();
                console.error(e);
                return;
            }
            if (result.ast) {
                file.analysis.loadAst(result.ast);
                let sourceMaps = result.map;
                file.context.setCodeGenerator((ast) => {
                    const result = babelCore.transformFromAst(ast);
                    sourceMaps = result.map;
                    return result.code;
                });
                file.contents = result.code;
                file.analysis.analyze();
                if (sourceMaps) {
                    sourceMaps.file = file.info.fuseBoxPath;
                    sourceMaps.sources = [file.info.fuseBoxPath];
                    file.sourceMap = JSON.stringify(sourceMaps);
                }
                if (this.context.useCache) {
                    this.context.emitJavascriptHotReload(file);
                    this.context.cache.writeStaticCache(file, file.sourceMap);
                }
            }
        }
    }
}
exports.BabelPluginClass = BabelPluginClass;
;
exports.BabelPlugin = (opts) => {
    return new BabelPluginClass(opts);
};

});
___scope___.file("plugins/js-transpilers/CoffeePlugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let coffee;
class CoffeePluginClass {
    constructor(options) {
        this.test = /\.coffee$/;
        this.options = Object.assign({}, {
            bare: true,
            sourceMap: false,
            sourceRoot: "",
            literate: false,
            filename: false,
            sourceFiles: false,
            generatedFile: false,
        }, options);
    }
    init(context) {
        context.allowExtension(".coffee");
    }
    transform(file) {
        file.loadContents();
        if (!coffee) {
            coffee = require("coffee-script");
        }
        return new Promise((res, rej) => {
            try {
                let options = Object.assign({}, this.options, {
                    filename: file.absPath,
                });
                file.contents = coffee.compile(file.contents, options);
                res(file.contents);
            }
            catch (err) {
                rej(err);
            }
        });
    }
}
exports.CoffeePluginClass = CoffeePluginClass;
exports.CoffeePlugin = (options = {}) => {
    return new CoffeePluginClass(options);
};

});
___scope___.file("plugins/stylesheet/LESSPlugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let less;
class LESSPluginClass {
    constructor(options) {
        this.test = /\.less$/;
        this.options = options || {};
    }
    init(context) {
        context.allowExtension(".less");
    }
    transform(file) {
        const context = file.context;
        const options = Object.assign({}, this.options);
        file.loadContents();
        const sourceMapDef = {
            sourceMapBasepath: ".",
            sourceMapRootpath: file.info.absDir,
        };
        if (!less) {
            less = require("less");
        }
        options.filename = file.info.fuseBoxPath;
        if ("sourceMapConfig" in context) {
            options.sourceMap = Object.assign({}, sourceMapDef, options.sourceMap || {});
        }
        return less.render(file.contents, options).then(output => {
            if (output.map) {
                file.sourceMap = output.map;
            }
            file.contents = output.css;
        });
    }
}
exports.LESSPluginClass = LESSPluginClass;
exports.LESSPlugin = (opts) => {
    return new LESSPluginClass(opts);
};

});
___scope___.file("plugins/stylesheet/CSSplugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const Config_1 = require("./../../Config");
const realm_utils_1 = require("realm-utils");
const CSSPluginDeprecated_1 = require("./CSSPluginDeprecated");
const Utils_1 = require("../../Utils");
class CSSPluginClass {
    constructor(opts) {
        this.test = /\.css$/;
        this.raw = false;
        this.minify = false;
        opts = opts || {};
        this.opts = opts;
        if (opts.raw !== undefined) {
            this.raw = opts.raw;
        }
        if (opts.write) {
            this.writeOptions = opts.write;
        }
        if (opts.minify !== undefined) {
            this.minify = opts.minify;
        }
        if (opts.serve !== undefined) {
            this.serve = opts.serve;
        }
    }
    init(context) {
        context.allowExtension(".css");
    }
    bundleStart(context) {
        let lib = path.join(Config_1.Config.FUSEBOX_MODULES, "fsbx-default-css-plugin", "index.js");
        context.source.addContent(fs.readFileSync(lib).toString());
    }
    inject(file, options, alternative) {
        const resolvedPath = realm_utils_1.utils.isFunction(options.inject)
            ? options.inject(file.info.fuseBoxPath) : file.info.fuseBoxPath;
        const result = options.inject !== false ? `__fsbx_css("${resolvedPath}");` : "";
        if (alternative) {
            file.alternativeContent = result;
        }
        else {
            file.contents = result;
        }
    }
    transformGroup(group) {
        const debug = (text) => group.context.debugPlugin(this, text);
        debug(`Start group transformation on "${group.info.fuseBoxPath}"`);
        let concat = new Utils_1.Concat(true, "", "\n");
        group.subFiles.forEach(file => {
            debug(`  -> Concat ${file.info.fuseBoxPath}`);
            concat.add(file.info.fuseBoxPath, file.contents, file.generateCorrectSourceMap());
        });
        let options = group.groupHandler.opts || {};
        const cssContents = concat.content;
        if (options.outFile) {
            let outFile = Utils_1.ensureUserPath(options.outFile);
            const bundleDir = path.dirname(outFile);
            const sourceMapsName = path.basename(outFile) + ".map";
            concat.add(null, `/*# sourceMappingURL=${sourceMapsName} */`);
            debug(`Writing ${outFile}`);
            return Utils_1.write(outFile, concat.content).then(() => {
                this.inject(group, options);
                group.context.sourceChangedEmitter.emit({
                    type: "css-file",
                    content: "",
                    path: group.info.fuseBoxPath,
                });
                const sourceMapsFile = Utils_1.ensureUserPath(path.join(bundleDir, sourceMapsName));
                return Utils_1.write(sourceMapsFile, concat.sourceMap);
            });
        }
        else {
            debug(`Inlining ${group.info.fuseBoxPath}`);
            const safeContents = JSON.stringify(cssContents.toString());
            group.contents = `__fsbx_css("${group.info.fuseBoxPath}", ${safeContents});`;
        }
        group.context.sourceChangedEmitter.emit({
            type: "css",
            content: cssContents.toString(),
            path: group.info.fuseBoxPath,
        });
    }
    transform(file) {
        if (file.hasSubFiles()) {
            return;
        }
        const debug = (text) => file.context.debugPlugin(this, text);
        file.loadContents();
        let contents;
        let filePath = file.info.fuseBoxPath;
        let context = file.context;
        file.contents = this.minify ? this.minifyContents(file.contents) : file.contents;
        if (this.opts.group) {
            const bundleName = this.opts.group;
            let fileGroup = context.getFileGroup(bundleName);
            if (!fileGroup) {
                fileGroup = context.createFileGroup(bundleName, file.collection, this);
            }
            fileGroup.addSubFile(file);
            debug(`  grouping -> ${bundleName}`);
            const chainExports = file.getProperty("exports");
            file.alternativeContent = `module.exports = ${chainExports && contents ? chainExports : "require('./" + bundleName + "')"}`;
            return;
        }
        let outFileFunction;
        if (this.opts.outFile !== undefined) {
            if (!realm_utils_1.utils.isFunction(this.opts.outFile)) {
                context.fatal(`Error in CSSConfig. outFile is expected to be a function that resolves a path`);
            }
            else {
                outFileFunction = this.opts.outFile;
            }
        }
        if (outFileFunction) {
            const userPath = Utils_1.ensureUserPath(outFileFunction(file.info.fuseBoxPath));
            file.alternativeContent = "";
            this.inject(file, this.opts, true);
            return Utils_1.write(userPath, file.contents).then(() => {
                if (file.sourceMap) {
                    const fileDir = path.dirname(userPath);
                    const sourceMapPath = path.join(fileDir, path.basename(userPath) + ".map");
                    return Utils_1.write(sourceMapPath, file.sourceMap);
                }
            });
        }
        else {
            let safeContents = JSON.stringify(file.contents);
            let serve = false;
            if (this.writeOptions) {
                const writeResult = CSSPluginDeprecated_1.CSSPluginDeprecated.writeOptions(this.writeOptions, file);
                if (writeResult) {
                    return writeResult;
                }
            }
            else {
                file.sourceMap = undefined;
            }
            if (this.serve) {
                if (realm_utils_1.utils.isFunction(this.serve)) {
                    let userResult = this.serve(file.info.fuseBoxPath, file);
                    if (realm_utils_1.utils.isString(userResult)) {
                        filePath = userResult;
                        serve = true;
                    }
                }
            }
            if (serve) {
                file.alternativeContent = `__fsbx_css("${filePath}")`;
            }
            else {
                file.context.sourceChangedEmitter.emit({
                    type: "css",
                    content: file.contents,
                    path: file.info.fuseBoxPath,
                });
                file.alternativeContent = `__fsbx_css("${filePath}", ${safeContents});`;
            }
        }
    }
    minifyContents(contents) {
        return contents.replace(/\s{2,}/g, " ").replace(/\t|\r|\n/g, "").trim();
    }
}
exports.CSSPluginClass = CSSPluginClass;
exports.CSSPlugin = (opts) => {
    return new CSSPluginClass(opts);
};

});
___scope___.file("plugins/stylesheet/CSSPluginDeprecated.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const realm_utils_1 = require("realm-utils");
const Utils_1 = require("../../Utils");
const path = require("path");
class CSSPluginDeprecated {
    static writeOptions(opts, file) {
        if (!realm_utils_1.utils.isPlainObject(opts)) {
            opts = {};
        }
        if (file.context.outFile) {
            let base = path.dirname(file.context.outFile);
            let projectPath = Utils_1.replaceExt(file.info.fuseBoxPath, ".css");
            let newPath = Utils_1.ensureUserPath(path.join(base, projectPath));
            let initialContents = file.contents;
            file.contents = `__fsbx_css("${projectPath}")`;
            let tasks = [];
            if (file.sourceMap) {
                let sourceMapFile = projectPath + ".map";
                initialContents += `\n/*# sourceMappingURL=${sourceMapFile} */`;
                let souceMapPath = Utils_1.ensureUserPath(path.join(base, sourceMapFile));
                let initialSourceMap = file.sourceMap;
                file.sourceMap = undefined;
                tasks.push(new Promise((resolve, reject) => {
                    fs.writeFile(souceMapPath, initialSourceMap, (err, res) => {
                        if (err) {
                            return reject(err);
                        }
                        return resolve();
                    });
                }));
            }
            tasks.push(new Promise((resolve, reject) => {
                fs.writeFile(newPath, initialContents, (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                });
            }));
            return Promise.all(tasks);
        }
    }
}
exports.CSSPluginDeprecated = CSSPluginDeprecated;

});
___scope___.file("plugins/HTMLplugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FuseBoxHTMLPlugin {
    constructor(opts = {}) {
        this.useDefault = true;
        this.test = /\.html$/;
        if (opts.useDefault !== undefined) {
            this.useDefault = opts.useDefault;
        }
    }
    init(context) {
        context.allowExtension(".html");
    }
    transform(file) {
        let context = file.context;
        if (context.useCache) {
            let cached = context.cache.getStaticCache(file);
            if (cached) {
                file.isLoaded = true;
                file.contents = cached.contents;
                return;
            }
        }
        file.loadContents();
        if (this.useDefault) {
            file.contents = `module.exports.default =  ${JSON.stringify(file.contents)}`;
        }
        else {
            file.contents = `module.exports =  ${JSON.stringify(file.contents)}`;
        }
        if (context.useCache) {
            context.emitJavascriptHotReload(file);
            context.cache.writeStaticCache(file, file.sourceMap);
        }
    }
}
exports.FuseBoxHTMLPlugin = FuseBoxHTMLPlugin;
;
exports.HTMLPlugin = (opts) => {
    return new FuseBoxHTMLPlugin(opts);
};

});
___scope___.file("plugins/JSONplugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FuseBoxJSONPlugin {
    constructor() {
        this.test = /\.json$/;
    }
    init(context) {
        context.allowExtension(".json");
    }
    transform(file) {
        file.loadContents();
        file.contents = `module.exports = ${file.contents || {}};`;
    }
}
exports.FuseBoxJSONPlugin = FuseBoxJSONPlugin;
;
exports.JSONPlugin = () => {
    return new FuseBoxJSONPlugin();
};

});
___scope___.file("plugins/BannerPlugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BannerPluginClass {
    constructor(banner) {
        this.test = /\.js$/;
        this.banner = banner || "";
    }
    preBundle(context) {
        context.source.addContent(this.banner);
    }
}
exports.BannerPluginClass = BannerPluginClass;
exports.BannerPlugin = (banner) => {
    return new BannerPluginClass(banner);
};

});
___scope___.file("plugins/stylesheet/SassPlugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const appRoot = require("app-root-path");
const Config_1 = require("../../Config");
let sass;
class SassPluginClass {
    constructor(options) {
        this.test = /\.scss$/;
        this.options = options || {};
    }
    init(context) {
        context.allowExtension(".scss");
    }
    transform(file) {
        file.loadContents();
        if (!file.contents) {
            return;
        }
        if (!sass) {
            sass = require("node-sass");
        }
        const defaultMacro = {
            "$homeDir": file.context.homeDir,
            "$appRoot": appRoot.path,
            "~": Config_1.Config.NODE_MODULES_DIR + "/",
        };
        const options = Object.assign({
            data: file.contents,
            sourceMap: true,
            outFile: file.info.fuseBoxPath,
            sourceMapContents: true,
        }, this.options);
        options.includePaths = [];
        if (typeof this.options.includePaths !== "undefined") {
            this.options.includePaths.forEach((path) => {
                options.includePaths.push(path);
            });
        }
        options.macros = Object.assign(defaultMacro, this.options.macros || {});
        if (this.options.importer === true) {
            options.importer = (url, prev, done) => {
                if (/https?:/.test(url)) {
                    return done({ url });
                }
                for (let key in options.macros) {
                    if (options.macros.hasOwnProperty(key)) {
                        url = url.replace(key, options.macros[key]);
                    }
                }
                done({ file: path.normalize(url) });
            };
        }
        options.includePaths.push(file.info.absDir);
        return new Promise((resolve, reject) => {
            return sass.render(options, (err, result) => {
                if (err) {
                    return reject(err);
                }
                file.sourceMap = result.map && result.map.toString();
                file.contents = result.css.toString();
                return resolve();
            });
        });
    }
}
exports.SassPluginClass = SassPluginClass;
exports.SassPlugin = (options) => {
    return new SassPluginClass(options);
};

});
___scope___.file("plugins/UglifyJSPlugin.js", function(exports, require, module, __filename, __dirname){ 
/* fuse:injection: */ var process = require("process");
/* fuse:injection: */ var Buffer = require("buffer").Buffer;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BundleSource_1 = require("../BundleSource");
class UglifyJSPluginClass {
    constructor(options) {
        this.options = options || {};
    }
    postBundle(context) {
        const mainOptions = {
            fromString: true,
        };
        const UglifyJs = require("uglify-js");
        const concat = context.source.getResult();
        const source = concat.content.toString();
        const sourceMap = concat.sourceMap;
        const newSource = new BundleSource_1.BundleSource(context);
        context.source = newSource;
        const newConcat = context.source.getResult();
        if ("sourceMapConfig" in context) {
            if (context.sourceMapConfig.bundleReference) {
                mainOptions.inSourceMap = JSON.parse(sourceMap);
                mainOptions.outSourceMap = context.sourceMapConfig.bundleReference;
            }
        }
        let timeStart = process.hrtime();
        const result = UglifyJs.minify(source, Object.assign({}, this.options, mainOptions));
        let took = process.hrtime(timeStart);
        let bytes = Buffer.byteLength(result.code, "utf8");
        context.log.echoBundleStats("Bundle (Uglified)", bytes, took);
        newConcat.add(null, result.code, result.map || sourceMap);
    }
}
exports.UglifyJSPluginClass = UglifyJSPluginClass;
exports.UglifyJSPlugin = (options) => {
    return new UglifyJSPluginClass(options);
};

});
___scope___.file("BundleSource.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./Utils");
const Config_1 = require("./Config");
const path = require("path");
const fs = require("fs");
class BundleSource {
    constructor(context) {
        this.context = context;
        this.standalone = false;
        this.concat = new Utils_1.Concat(true, "", "\n");
    }
    init() {
        this.concat.add(null, "(function(FuseBox){FuseBox.$fuse$=FuseBox;");
    }
    annotate(comment) {
        if (this.context.rollupOptions) {
            this.collectionSource.add(null, comment);
        }
    }
    createCollection(collection) {
        this.collectionSource = new Utils_1.Concat(true, collection.name, "\n");
    }
    addContentToCurrentCollection(data) {
        if (this.collectionSource) {
            this.collectionSource.add(null, data);
        }
    }
    startCollection(collection) {
        let conflicting = {};
        if (collection.conflictingVersions) {
            collection.conflictingVersions.forEach((version, name) => {
                conflicting[name] = version;
            });
        }
        this.collectionSource.add(null, `FuseBox.pkg("${collection.name}", ${JSON.stringify(conflicting)}, function(___scope___){`);
        this.annotate(`/* fuse:start-collection "${collection.name}"*/`);
    }
    endCollection(collection) {
        let entry = collection.entryFile ? collection.entryFile.info.fuseBoxPath : "";
        if (entry) {
            this.collectionSource.add(null, `return ___scope___.entry = "${entry}";`);
        }
        this.collectionSource.add(null, "});");
        this.annotate(`/* fuse:end-collection "${collection.name}"*/`);
        let key = collection.info ? `${collection.info.name}@${collection.info.version}` : "default";
        this.concat.add(`packages/${key}`, this.collectionSource.content, key !== undefined ? this.collectionSource.sourceMap : undefined);
        return this.collectionSource.content.toString();
    }
    addContent(data) {
        this.concat.add(null, data);
    }
    addFile(file) {
        if (file.info.isRemoteFile || file.notFound
            || file.collection && file.collection.acceptFiles === false) {
            return;
        }
        this.collectionSource.add(null, `___scope___.file("${file.info.fuseBoxPath}", function(exports, require, module, __filename, __dirname){
${file.headerContent ? file.headerContent.join("\n") : ""}`);
        this.annotate(`/* fuse:start-file "${file.info.fuseBoxPath}"*/`);
        this.collectionSource.add(null, file.alternativeContent !== undefined ? file.alternativeContent : file.contents, file.sourceMap);
        this.annotate(`/* fuse:end-file "${file.info.fuseBoxPath}"*/`);
        this.collectionSource.add(null, "});");
    }
    finalize(bundleData) {
        let entry = bundleData.entry;
        const context = this.context;
        if (entry) {
            entry = Utils_1.ensurePublicExtension(entry);
        }
        let mainEntry;
        if (context.serverBundle) {
            this.concat.add(null, `FuseBox.isServer = true;`);
        }
        if (context.globals) {
            let data = [];
            for (let key in context.globals) {
                if (context.globals.hasOwnProperty(key)) {
                    let alias = context.globals[key];
                    let item = {};
                    item.alias = alias;
                    item.pkg = key;
                    if (key === context.defaultPackageName && entry) {
                        mainEntry = item.pkg = `${key}/${entry}`;
                        entry = undefined;
                    }
                    data.push(item);
                }
            }
            this.concat.add(null, `FuseBox.expose(${JSON.stringify(data)});`);
        }
        if (entry) {
            mainEntry = `${context.defaultPackageName}/${entry}`;
            this.concat.add(null, `\nFuseBox.import("${mainEntry}");`);
        }
        if (mainEntry) {
            this.concat.add(null, `FuseBox.main("${mainEntry}");`);
        }
        if (context.defaultPackageName !== "default") {
            this.concat.add(null, `FuseBox.defaultPackageName = ${JSON.stringify(context.defaultPackageName)};`);
        }
        this.concat.add(null, "})");
        if (context.standaloneBundle) {
            let fuseboxLibFile = path.join(Config_1.Config.FUSEBOX_MODULES, "fuse-box-loader-api", "fusebox.min.js");
            if (this.context.customAPIFile) {
                fuseboxLibFile = Utils_1.ensureUserPath(this.context.customAPIFile);
            }
            let wrapper = fs.readFileSync(fuseboxLibFile).toString();
            this.concat.add(null, `(${wrapper})`);
        }
        else {
            this.concat.add(null, "(FuseBox)");
        }
        if (this.context.sourceMapConfig) {
            if (this.context.sourceMapConfig.bundleReference) {
                this.concat.add(null, `//# sourceMappingURL=${this.context.sourceMapConfig.bundleReference}`);
            }
        }
    }
    getResult() {
        return this.concat;
    }
}
exports.BundleSource = BundleSource;

});
___scope___.file("plugins/SourceMapPlainJsPlugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const acorn = require("acorn");
const SourceMap = require("source-map");
class SourceMapPlainJsPluginClass {
    constructor(options) {
        this.test = /\.js$/;
        this.ext = ".js";
        options = options || {};
        if ("test" in options)
            this.test = options.test;
        if ("ext" in options)
            this.ext = options.ext;
    }
    init(context) {
        this.context = context;
        context.allowExtension(this.ext);
    }
    transform(file) {
        const tokens = [];
        if (this.context.useCache) {
            const cached = this.context.cache.getStaticCache(file);
            if (cached) {
                if (cached.sourceMap) {
                    file.sourceMap = cached.sourceMap;
                }
                file.analysis.skip();
                file.analysis.dependencies = cached.dependencies;
                file.contents = cached.contents;
                return true;
            }
        }
        file.loadContents();
        if ("sourceMapConfig" in this.context) {
            file.makeAnalysis({ onToken: tokens });
            file.sourceMap = this.getSourceMap(file, tokens);
        }
        else {
            file.makeAnalysis();
        }
    }
    getSourceMap(file, tokens) {
        const fileContent = file.contents;
        const filePath = file.info.fuseBoxPath;
        const smGenerator = new SourceMap.SourceMapGenerator({ file: filePath });
        tokens.some(token => {
            if (token.type.label === "eof")
                return true;
            const lineInfo = acorn.getLineInfo(fileContent, token.start);
            const mapping = {
                original: lineInfo,
                generated: lineInfo,
                source: filePath,
                name: false,
            };
            if (token.type.label === "name")
                mapping.name = token.value;
            smGenerator.addMapping(mapping);
        });
        smGenerator.setSourceContent(filePath, fileContent);
        return JSON.stringify(smGenerator.toJSON());
    }
}
exports.SourceMapPlainJsPluginClass = SourceMapPlainJsPluginClass;
exports.SourceMapPlainJsPlugin = (options) => {
    return new SourceMapPlainJsPluginClass(options);
};

});
___scope___.file("plugins/RawPlugin.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const realm_utils_1 = require("realm-utils");
const Utils_1 = require("../Utils");
class RawPluginClass {
    constructor(options) {
        this.test = /.*/;
        if (realm_utils_1.utils.isPlainObject(options)) {
            if ("extensions" in (options || {}))
                this.extensions = options.extensions;
        }
        if (realm_utils_1.utils.isArray(options)) {
            this.extensions = [];
            options.forEach(str => {
                this.extensions.push("." + Utils_1.extractExtension(str));
            });
            this.test = Utils_1.string2RegExp(options.join("|"));
        }
    }
    init(context) {
        if (Array.isArray(this.extensions)) {
            return this.extensions.forEach(ext => context.allowExtension(ext));
        }
    }
    transform(file) {
        const context = file.context;
        if (context.useCache) {
            let cached = context.cache.getStaticCache(file);
            if (cached) {
                file.isLoaded = true;
                file.analysis.skip();
                file.contents = cached.contents;
                return;
            }
        }
        file.loadContents();
        file.contents = `module.exports = ${JSON.stringify(file.contents)}`;
        if (context.useCache) {
            context.emitJavascriptHotReload(file);
            context.cache.writeStaticCache(file, file.sourceMap);
        }
    }
}
exports.RawPluginClass = RawPluginClass;
exports.RawPlugin = (options) => {
    return new RawPluginClass(options);
};

});
___scope___.file("arithmetic/Fluent.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function strIncludesAnyOf(string, strings, delimiter = false) {
    if (delimiter && typeof strings === "string" && strings.includes(","))
        strings = strings.split(",");
    for (let i = 0, len = strings.length; i < len; i++)
        if (string.includes(strings[i]))
            return true;
    return false;
}
exports.strIncludesAnyOf = strIncludesAnyOf;
class FluentBundle {
    constructor(name, fluentInstance) {
        this.name = name;
        this.fluentInstance = fluentInstance;
        this.cmds = [];
        this.str = "";
        this.noDeps = false;
    }
    finishBundle() {
        return this.fluentInstance;
    }
    addCmd(cmd, bundle) {
        this.cmds.push({
            bundle,
            cmd: "execute",
        });
        return this;
    }
    and(cmd) {
        this.str += cmd;
        return this;
    }
    noCache() {
        this.str = `^ ` + this.str;
        return this;
    }
    noApi() {
        this.str = `! ` + this.str;
        return this;
    }
    execute(bundle) {
        this.addCmd("execute", bundle);
        if (this.noDeps)
            this.str += `\n >[${bundle}]`;
        else
            this.str += `\n >${bundle}`;
        return this;
    }
    add(bundle) {
        this.addCmd("add", bundle);
        if (this.noDeps)
            this.str += `\n +[${bundle}]`;
        else
            this.str += `\n +${bundle}`;
        return this;
    }
    include(dep) {
        this.str += `\n +${dep}`;
        return this;
    }
    exclude(dep) {
        this.str += `\n -${dep}`;
        return this;
    }
    ignore(dep) {
        this.str += `\n -${dep}`;
        return this;
    }
    onlyDeps() {
        this.useOnlyDeps = true;
        this.str += `\n ~`;
        return this;
    }
    ignoreDeps() {
        this.noDeps = true;
        return this;
    }
    excludeDeps() {
        this.noDeps = true;
        return this;
    }
    deps(bool) {
        this.noDeps = !bool;
        return this;
    }
    includeDeps() {
        this.noDeps = false;
        return this;
    }
}
exports.FluentBundle = FluentBundle;
class Fluent {
    constructor() {
        this.bundled = {};
    }
    static init() {
        return new Fluent();
    }
    reset() {
        this.bundled = {};
        return this;
    }
    startBundle(name) {
        this.bundled[name] = new FluentBundle(name, this);
        return this.bundled[name];
    }
    finish() {
        const keys = Object.keys(this.bundled);
        let instructions = {};
        if (keys.length > 1) {
            keys.forEach(key => {
                const instruction = this.bundled[key];
                instructions[key] = instruction.str;
            });
        }
        else {
            instructions = this.bundled[keys[0]].str;
        }
        return instructions;
    }
    static isArithmetic(str) {
        if (strIncludesAnyOf(str, "[,>,],+[,-,**,^,~,!", ","))
            return true;
        return false;
    }
}
exports.Fluent = Fluent;
exports.default = Fluent;

});
___scope___.file("core/FuseBox.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const process = require("process");
const Config_1 = require("./../Config");
const realm_utils_1 = require("realm-utils");
const Utils_1 = require("./../Utils");
const ShimCollection_1 = require("./../ShimCollection");
const Server_1 = require("./../devServer/Server");
const JSONplugin_1 = require("./../plugins/JSONplugin");
const PathMaster_1 = require("./PathMaster");
const WorkflowContext_1 = require("./WorkflowContext");
const CollectionSource_1 = require("./../CollectionSource");
const Arithmetic_1 = require("./../arithmetic/Arithmetic");
const ModuleCollection_1 = require("./ModuleCollection");
const BundleTestRunner_1 = require("../BundleTestRunner");
const HeaderImport_1 = require("../analysis/HeaderImport");
const MagicalRollup_1 = require("../rollup/MagicalRollup");
const appRoot = require("app-root-path");
class FuseBox {
    constructor(opts) {
        this.opts = opts;
        this.context = new WorkflowContext_1.WorkFlowContext();
        this.collectionSource = new CollectionSource_1.CollectionSource(this.context);
        opts = opts || {};
        let homeDir = appRoot.path;
        if (opts.homeDir) {
            homeDir = path.isAbsolute(opts.homeDir) ? opts.homeDir : path.join(appRoot.path, opts.homeDir);
        }
        if (opts.debug !== undefined) {
            this.context.debugMode = opts.debug;
        }
        this.context.debugMode = opts.debug !== undefined ? opts.debug : Utils_1.contains(process.argv, "--debug");
        if (opts.modulesFolder) {
            this.context.customModulesFolder =
                path.isAbsolute(opts.modulesFolder)
                    ? opts.modulesFolder : path.join(appRoot.path, opts.modulesFolder);
        }
        if (opts.transformTypescript) {
            this.context.transformTypescript = opts.transformTypescript;
        }
        if (opts.tsConfig) {
            this.context.tsConfig = opts.tsConfig;
        }
        if (opts.serverBundle !== undefined) {
            this.context.serverBundle = opts.serverBundle;
        }
        this.context.plugins = opts.plugins || [JSONplugin_1.JSONPlugin()];
        if (opts.package) {
            if (realm_utils_1.utils.isPlainObject(opts.package)) {
                const packageOptions = opts.package;
                this.context.defaultPackageName = packageOptions.name || "default";
                this.context.defaultEntryPoint = packageOptions.main;
            }
            else {
                this.context.defaultPackageName = opts.package;
            }
        }
        if (opts.cache !== undefined) {
            this.context.useCache = opts.cache ? true : false;
        }
        if (opts.log !== undefined) {
            this.context.doLog = opts.log ? true : false;
        }
        if (opts.alias) {
            const aliases = [];
            for (const key in opts.alias) {
                if (opts.alias.hasOwnProperty(key)) {
                    if (path.isAbsolute(key)) {
                        this.context.fatal(`Can't use absolute paths with alias "${key}"`);
                    }
                    aliases.push({ expr: new RegExp(`^(${key})(/|$)`), replacement: opts.alias[key] });
                }
            }
            this.context.aliasCollection = aliases;
            this.context.experimentalAliasEnabled = true;
        }
        if (realm_utils_1.utils.isPlainObject(opts.autoImport)) {
            for (let varName in opts.autoImport) {
                const pkgName = opts.autoImport[varName];
                HeaderImport_1.nativeModules.add(new HeaderImport_1.HeaderImport(varName, pkgName));
            }
        }
        if (opts.globals) {
            this.context.globals = opts.globals;
        }
        if (opts.shim) {
            this.context.shim = opts.shim;
        }
        if (opts.standalone !== undefined) {
            this.context.standaloneBundle = opts.standalone;
        }
        if (opts.ignoreGlobal) {
            this.context.ignoreGlobal = opts.ignoreGlobal;
        }
        if (opts.rollup) {
            this.context.rollupOptions = opts.rollup;
        }
        if (opts.customAPIFile) {
            this.context.customAPIFile = opts.customAPIFile;
        }
        if (opts.outFile) {
            this.context.outFile = Utils_1.ensureUserPath(opts.outFile);
        }
        if (opts.sourceMap) {
            this.context.sourceMapConfig = opts.sourceMap;
            this.context.log.echoWarning("sourceMap is deprecated. Use { sourcemaps : true } instead");
        }
        if (opts.sourcemaps) {
            const sourceMapOptions = {};
            let projectSourcMaps = false;
            let vendorSourceMaps = false;
            if (opts.sourcemaps === true) {
                projectSourcMaps = true;
            }
            if (realm_utils_1.utils.isPlainObject(opts.sourcemaps)) {
                if (opts.sourcemaps.project) {
                    projectSourcMaps = true;
                }
                if (opts.sourcemaps.vendor === true) {
                    vendorSourceMaps = true;
                }
            }
            const mapsName = path.basename(this.context.outFile) + ".map";
            const mapsOutFile = path.join(path.dirname(this.context.outFile), mapsName);
            if (projectSourcMaps) {
                sourceMapOptions.outFile = mapsOutFile;
                sourceMapOptions.bundleReference = mapsName;
            }
            sourceMapOptions.vendor = vendorSourceMaps;
            this.context.sourceMapConfig = sourceMapOptions;
        }
        this.context.setHomeDir(homeDir);
        if (opts.cache !== undefined) {
            this.context.setUseCache(opts.cache);
        }
        this.virtualFiles = opts.files;
        this.context.initCache();
        this.compareConfig(this.opts);
    }
    static init(opts) {
        return new FuseBox(opts);
    }
    triggerPre() {
        this.context.triggerPluginsMethodOnce("preBundle", [this.context]);
    }
    triggerStart() {
        this.context.triggerPluginsMethodOnce("bundleStart", [this.context]);
    }
    triggerEnd() {
        this.context.triggerPluginsMethodOnce("bundleEnd", [this.context]);
    }
    triggerPost() {
        this.context.triggerPluginsMethodOnce("postBundle", [this.context]);
    }
    bundle(str, bundleReady) {
        if (realm_utils_1.utils.isString(str)) {
            return this.initiateBundle(str, bundleReady);
        }
        if (realm_utils_1.utils.isPlainObject(str)) {
            let items = str;
            return realm_utils_1.each(items, (bundleStr, outFile) => {
                let newConfig = Object.assign({}, this.opts, { outFile });
                let fuse = FuseBox.init(newConfig);
                return fuse.initiateBundle(bundleStr);
            });
        }
    }
    compareConfig(config) {
        if (!this.context.useCache)
            return;
        const mainStr = fs.readFileSync(require.main.filename, "utf8");
        if (this.context.cache) {
            const configPath = path.resolve(this.context.cache.cacheFolder, "config.json");
            if (fs.existsSync(configPath)) {
                const storedConfigStr = fs.readFileSync(configPath, "utf8");
                if (storedConfigStr !== mainStr)
                    this.context.nukeCache();
            }
            fs.writeFile(configPath, mainStr, () => { });
        }
    }
    devServer(str, opts) {
        let server = new Server_1.Server(this);
        return server.start(str, opts);
    }
    process(bundleData, bundleReady) {
        let bundleCollection = new ModuleCollection_1.ModuleCollection(this.context, this.context.defaultPackageName);
        bundleCollection.pm = new PathMaster_1.PathMaster(this.context, bundleData.homeDir);
        if (bundleData.typescriptMode) {
            this.context.tsMode = true;
            bundleCollection.pm.setTypeScriptMode();
        }
        let self = this;
        return bundleCollection.collectBundle(bundleData).then(module => {
            return realm_utils_1.chain(class extends realm_utils_1.Chainable {
                constructor() {
                    super(...arguments);
                    this.globalContents = [];
                }
                setDefaultCollection() {
                    return bundleCollection;
                }
                addDefaultContents() {
                    return self.collectionSource.get(this.defaultCollection).then((cnt) => {
                        self.context.log.echoDefaultCollection(this.defaultCollection, cnt);
                    });
                }
                addNodeModules() {
                    return realm_utils_1.each(self.context.nodeModules, (collection) => {
                        if (collection.cached || (collection.info && !collection.info.missing)) {
                            return self.collectionSource.get(collection).then((cnt) => {
                                self.context.log.echoCollection(collection, cnt);
                                if (!collection.cachedName && self.context.useCache) {
                                    self.context.cache.set(collection.info, cnt);
                                }
                                this.globalContents.push(cnt);
                            });
                        }
                    });
                }
                format() {
                    return {
                        contents: this.globalContents,
                    };
                }
            }).then(result => {
                let self = this;
                const rollup = this.handleRollup();
                if (rollup) {
                    self.context.source.finalize(bundleData);
                    rollup().then(() => {
                        self.context.log.end();
                        this.triggerEnd();
                        this.triggerPost();
                        this.context.writeOutput(bundleReady);
                        return self.context.source.getResult();
                    });
                }
                else {
                    self.context.log.end();
                    this.triggerEnd();
                    self.context.source.finalize(bundleData);
                    this.triggerPost();
                    this.context.writeOutput(bundleReady);
                    return self.context.source.getResult();
                }
            });
        });
    }
    handleRollup() {
        if (this.context.rollupOptions) {
            return () => {
                let rollup = new MagicalRollup_1.MagicalRollup(this.context);
                return rollup.parse();
            };
        }
        else {
            return false;
        }
    }
    addShims() {
        let shim = this.context.shim;
        if (shim) {
            for (let name in shim) {
                if (shim.hasOwnProperty(name)) {
                    let data = shim[name];
                    if (data.exports) {
                        let shimedCollection = ShimCollection_1.ShimCollection.create(this.context, name, data.exports);
                        this.context.addNodeModule(name, shimedCollection);
                        if (data.source) {
                            let source = Utils_1.ensureUserPath(data.source);
                            let contents = fs.readFileSync(source).toString();
                            this.context.source.addContent(contents);
                        }
                    }
                }
            }
        }
    }
    test(str = "**/*.test.ts", opts) {
        opts = opts || {};
        opts.reporter = opts.reporter || "fuse-test-reporter";
        opts.exit = true;
        const clonedOpts = Object.assign({}, this.opts);
        const testBundleFile = path.join(Config_1.Config.TEMP_FOLDER, "tests", encodeURIComponent(this.opts.outFile));
        clonedOpts.outFile = testBundleFile;
        str += ` +fuse-test-runner ${opts.reporter} -ansi`;
        return FuseBox.init(clonedOpts).bundle(str, () => {
            const bundle = require(testBundleFile);
            let runner = new BundleTestRunner_1.BundleTestRunner(bundle, opts);
            return runner.start();
        });
    }
    initiateBundle(str, bundleReady) {
        this.context.reset();
        this.triggerPre();
        this.context.source.init();
        this.addShims();
        this.triggerStart();
        let parser = Arithmetic_1.Arithmetic.parse(str);
        let bundle;
        return Arithmetic_1.Arithmetic.getFiles(parser, this.virtualFiles, this.context.homeDir).then(data => {
            bundle = data;
            if (bundle.tmpFolder) {
                this.context.homeDir = bundle.tmpFolder;
            }
            if (bundle.standalone !== undefined) {
                this.context.debug("Arithmetic", `Override standalone ${bundle.standalone}`);
                this.context.standaloneBundle = bundle.standalone;
            }
            if (bundle.cache !== undefined) {
                this.context.debug("Arithmetic", `Override cache ${bundle.cache}`);
                this.context.useCache = bundle.cache;
            }
            return this.process(data, bundleReady);
        }).then((contents) => {
            bundle.finalize();
            return contents;
        }).catch(e => {
            console.log(e.stack || e);
        });
    }
}
exports.FuseBox = FuseBox;

});
___scope___.file("ShimCollection.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleCollection_1 = require("./core/ModuleCollection");
const File_1 = require("./core/File");
class ShimCollection {
    static create(context, name, exports) {
        let entryInfo = {
            isNodeModule: false,
            fuseBoxPath: "index.js",
        };
        let entryFile = new File_1.File(context, entryInfo);
        entryFile.isLoaded = true;
        entryFile.analysis.skip();
        entryFile.contents = `module.exports = ${exports}`;
        let collection = new ModuleCollection_1.ModuleCollection(context, name, {
            missing: false,
        });
        collection.dependencies.set(name, entryFile);
        collection.setupEntry(entryFile);
        return collection;
    }
}
exports.ShimCollection = ShimCollection;

});
___scope___.file("core/ModuleCollection.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const File_1 = require("./File");
const PathMaster_1 = require("./PathMaster");
const Utils_1 = require("../Utils");
const realm_utils_1 = require("realm-utils");
class ModuleCollection {
    constructor(context, name, info) {
        this.context = context;
        this.name = name;
        this.info = info;
        this.nodeModules = new Map();
        this.traversed = false;
        this.acceptFiles = true;
        this.dependencies = new Map();
        this.entryResolved = false;
        this.cached = false;
        this.conflictingVersions = new Map();
        this.toBeResolved = [];
        this.delayedResolve = false;
    }
    setupEntry(file) {
        if (this.dependencies.has(file.info.absPath)) {
            this.dependencies.set(file.info.absPath, file);
        }
        file.isNodeModuleEntry = true;
        this.entryFile = file;
    }
    resolveEntry(shouldIgnoreDeps) {
        if (this.entryFile && !this.entryResolved) {
            this.entryResolved = true;
            return this.resolve(this.entryFile, shouldIgnoreDeps);
        }
    }
    initPlugins() {
        this.context.plugins.forEach(plugin => {
            if (realm_utils_1.utils.isArray(plugin) && realm_utils_1.utils.isString(plugin[0])) {
                plugin.splice(0, 1, Utils_1.string2RegExp(plugin[0]));
            }
            else {
                if (realm_utils_1.utils.isString(plugin.test)) {
                    plugin.test = Utils_1.string2RegExp(plugin.test);
                }
            }
        });
        this.context.triggerPluginsMethodOnce("init", [this.context], (plugin) => {
            if (plugin.dependencies) {
                plugin.dependencies.forEach(mod => {
                    this.toBeResolved.push(new File_1.File(this.context, this.pm.init(mod)));
                });
            }
        });
    }
    resolveDepsOnly(depsOnly) {
        return realm_utils_1.each(depsOnly, (withDeps, modulePath) => {
            let file = new File_1.File(this.context, this.pm.init(modulePath));
            return this.resolve(file);
        }).then(() => {
            this.dependencies = new Map();
        });
    }
    collectBundle(data) {
        this.bundle = data;
        this.delayedResolve = true;
        this.initPlugins();
        if (this.context.defaultEntryPoint) {
            this.entryFile = File_1.File.createByName(this, Utils_1.ensurePublicExtension(this.context.defaultEntryPoint));
        }
        return this.resolveDepsOnly(data.depsOnly).then(() => {
            return realm_utils_1.each(data.including, (withDeps, modulePath) => {
                let file = new File_1.File(this.context, this.pm.init(modulePath));
                return this.resolve(file);
            })
                .then(() => this.context.resolve())
                .then(() => this.transformGroups())
                .then(() => {
                return this.context.useCache ? this.context.cache.resolve(this.toBeResolved) : this.toBeResolved;
            }).then(toResolve => {
                return realm_utils_1.each(toResolve, (file) => this.resolveNodeModule(file));
            })
                .then(() => this.context.resolve())
                .then(() => this.context.cache.buildMap(this))
                .catch(e => {
                this.context.nukeCache();
                console.error(e);
            });
        });
    }
    resolveNodeModule(file) {
        let info = file.info.nodeModuleInfo;
        if (this.context.isShimed(info.name)) {
            return;
        }
        let collection;
        let moduleName = `${info.name}@${info.version}`;
        if (!this.context.hasNodeModule(moduleName)) {
            collection = new ModuleCollection(this.context, info.custom ? moduleName : info.name, info);
            collection.pm = new PathMaster_1.PathMaster(this.context, info.root);
            if (info.entry) {
                collection.setupEntry(new File_1.File(this.context, collection.pm.init(info.entry)));
            }
            this.context.addNodeModule(moduleName, collection);
        }
        else {
            collection = this.context.getNodeModule(moduleName);
        }
        if (info.custom) {
            this.conflictingVersions.set(info.name, info.version);
        }
        this.nodeModules.set(moduleName, collection);
        return file.info.nodeModuleExplicitOriginal && collection.pm
            ? collection.resolve(new File_1.File(this.context, collection.pm.init(file.info.absPath)))
            : collection.resolveEntry();
    }
    transformGroups() {
        const promises = [];
        this.context.fileGroups.forEach((group, name) => {
            this.dependencies.set(group.info.fuseBoxPath, group);
            if (group.groupHandler) {
                if (realm_utils_1.utils.isFunction(group.groupHandler.transformGroup)) {
                    promises.push(new Promise((resolve, reject) => {
                        const result = group.groupHandler.transformGroup(group);
                        if (realm_utils_1.utils.isPromise(result)) {
                            return result.then(resolve).catch(reject);
                        }
                        return resolve();
                    }));
                }
            }
        });
        return Promise.all(promises);
    }
    resolve(file, shouldIgnoreDeps) {
        file.collection = this;
        if (this.bundle) {
            if (this.bundle.fileBlackListed(file)) {
                return;
            }
            if (shouldIgnoreDeps === undefined) {
                shouldIgnoreDeps = this.bundle.shouldIgnoreNodeModules(file.getCrossPlatormPath());
            }
        }
        if (file.info.isNodeModule) {
            if (this.context.isGlobalyIgnored(file.info.nodeModuleName)) {
                return;
            }
            if (shouldIgnoreDeps || this.bundle && this.bundle.shouldIgnore(file.info.nodeModuleName)) {
                return;
            }
            return this.delayedResolve
                ? this.toBeResolved.push(file)
                : this.resolveNodeModule(file);
        }
        else {
            if (this.dependencies.has(file.absPath)) {
                return;
            }
            file.consume();
            this.dependencies.set(file.absPath, file);
            let fileLimitPath;
            if (this.entryFile && this.entryFile.isNodeModuleEntry) {
                fileLimitPath = this.entryFile.info.absPath;
            }
            return realm_utils_1.each(file.analysis.dependencies, name => {
                return this.resolve(new File_1.File(this.context, this.pm.resolve(name, file.info.absDir, fileLimitPath)), shouldIgnoreDeps);
            });
        }
    }
}
exports.ModuleCollection = ModuleCollection;

});
___scope___.file("core/File.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileAnalysis_1 = require("../analysis/FileAnalysis");
const SourceMapGenerator_1 = require("./SourceMapGenerator");
const realm_utils_1 = require("realm-utils");
const fs = require("fs");
const path = require("path");
const appRoot = require("app-root-path");
class File {
    constructor(context, info) {
        this.context = context;
        this.info = info;
        this.isFuseBoxBundle = false;
        this.isLoaded = false;
        this.isNodeModuleEntry = false;
        this.isTypeScript = false;
        this.properties = new Map();
        this.analysis = new FileAnalysis_1.FileAnalysis(this);
        this.resolving = [];
        this.subFiles = [];
        this.groupMode = false;
        if (info.params) {
            this.params = info.params;
        }
        this.absPath = info.absPath;
    }
    static createByName(collection, name) {
        let info = {
            fuseBoxPath: name,
            absPath: name,
        };
        let file = new File(collection.context, info);
        file.collection = collection;
        return file;
    }
    static createModuleReference(collection, packageInfo) {
        let info = {
            fuseBoxPath: name,
            absPath: name,
            isNodeModule: true,
            nodeModuleInfo: packageInfo,
        };
        let file = new File(collection.context, info);
        file.collection = collection;
        return file;
    }
    addProperty(key, obj) {
        this.properties.set(key, obj);
    }
    getProperty(key) {
        return this.properties.get(key);
    }
    hasSubFiles() {
        return this.subFiles.length > 0;
    }
    addSubFile(file) {
        this.subFiles.push(file);
    }
    getCrossPlatormPath() {
        let name = this.absPath;
        if (!name) {
            return;
        }
        name = name.replace(/\\/g, "/");
        return name;
    }
    tryTypescriptPlugins() {
        if (this.context.plugins) {
            this.context.plugins.forEach((plugin) => {
                if (realm_utils_1.utils.isFunction(plugin.onTypescriptTransform)) {
                    plugin.onTypescriptTransform(this);
                }
            });
        }
    }
    tryPlugins(_ast) {
        if (this.context.plugins) {
            let target;
            let index = 0;
            while (!target && index < this.context.plugins.length) {
                let item = this.context.plugins[index];
                let itemTest;
                if (Array.isArray(item)) {
                    let el = item[0];
                    if (el && typeof el.test === "function") {
                        itemTest = el;
                    }
                    else {
                        itemTest = el.test;
                    }
                }
                else {
                    itemTest = item.test;
                }
                if (itemTest && realm_utils_1.utils.isFunction(itemTest.test) && itemTest.test(path.relative(appRoot.path, this.absPath))) {
                    target = item;
                }
                index++;
            }
            const tasks = [];
            if (target) {
                if (Array.isArray(target)) {
                    target.forEach(plugin => {
                        if (realm_utils_1.utils.isFunction(plugin.transform)) {
                            this.context.debugPlugin(plugin, `Captured ${this.info.fuseBoxPath}`);
                            tasks.push(() => plugin.transform.apply(plugin, [this]));
                        }
                    });
                }
                else {
                    if (realm_utils_1.utils.isFunction(target.transform)) {
                        this.context.debugPlugin(target, `Captured ${this.info.fuseBoxPath}`);
                        tasks.push(() => target.transform.apply(target, [this]));
                    }
                }
            }
            return this.context.queue(realm_utils_1.each(tasks, promise => promise()));
        }
    }
    addHeaderContent(str) {
        if (!this.headerContent) {
            this.headerContent = [];
        }
        this.headerContent.push(str);
    }
    loadContents() {
        if (this.isLoaded) {
            return;
        }
        this.contents = fs.readFileSync(this.info.absPath).toString();
        this.isLoaded = true;
    }
    makeAnalysis(parserOptions) {
        if (!this.analysis.astIsLoaded()) {
            this.analysis.parseUsingAcorn(parserOptions);
        }
        this.analysis.analyze();
    }
    consume() {
        if (this.info.isRemoteFile) {
            return;
        }
        if (!this.absPath) {
            return;
        }
        if (!fs.existsSync(this.info.absPath)) {
            this.notFound = true;
            return;
        }
        if (/\.ts(x)?$/.test(this.absPath)) {
            this.context.debug("Typescript", `Captured  ${this.info.fuseBoxPath}`);
            return this.handleTypescript();
        }
        if (/\.js(x)?$/.test(this.absPath)) {
            this.loadContents();
            this.tryPlugins();
            const vendorSourceMaps = this.context.sourceMapConfig
                && this.context.sourceMapConfig.vendor === true && this.collection.name !== this.context.defaultPackageName;
            if (vendorSourceMaps) {
                this.loadVendorSourceMap();
            }
            else {
                this.makeAnalysis();
            }
            return;
        }
        this.tryPlugins();
        if (!this.isLoaded) {
            throw { message: `File contents for ${this.absPath} were not loaded. Missing a plugin?` };
        }
    }
    loadVendorSourceMap() {
        const key = `vendor/${this.collection.name}/${this.info.fuseBoxPath}`;
        this.context.debug("File", `Vendor sourcemap ${key}`);
        let cachedMaps = this.context.cache.getPermanentCache(key);
        if (cachedMaps) {
            this.sourceMap = cachedMaps;
            this.makeAnalysis();
        }
        else {
            const tokens = [];
            this.makeAnalysis({ onToken: tokens });
            SourceMapGenerator_1.SourceMapGenerator.generate(this, tokens);
            this.generateCorrectSourceMap(key);
            this.context.cache.setPermanentCache(key, this.sourceMap);
        }
    }
    handleTypescript() {
        const debug = (str) => this.context.debug("TypeScript", str);
        if (this.context.useCache) {
            let cached = this.context.cache.getStaticCache(this);
            if (cached) {
                this.isLoaded = true;
                this.sourceMap = cached.sourceMap;
                this.contents = cached.contents;
                if (cached.headerContent) {
                    this.headerContent = cached.headerContent;
                }
                debug(`From cache ${this.info.fuseBoxPath}`);
                this.analysis.dependencies = cached.dependencies;
                this.tryPlugins();
                return;
            }
        }
        const ts = require("typescript");
        this.loadContents();
        this.tryTypescriptPlugins();
        debug(`Transpile ${this.info.fuseBoxPath}`);
        let result = ts.transpileModule(this.contents, this.getTranspilationConfig());
        if (result.sourceMapText && this.context.sourceMapConfig) {
            let jsonSourceMaps = JSON.parse(result.sourceMapText);
            jsonSourceMaps.file = this.info.fuseBoxPath;
            jsonSourceMaps.sources = [this.info.fuseBoxPath.replace(/\.js(x?)$/, ".ts$1")];
            result.outputText = result.outputText.replace("//# sourceMappingURL=module.js.map", "");
            this.sourceMap = JSON.stringify(jsonSourceMaps);
        }
        this.contents = result.outputText;
        this.makeAnalysis();
        this.tryPlugins();
        if (this.context.useCache) {
            this.context.emitJavascriptHotReload(this);
            this.context.cache.writeStaticCache(this, this.sourceMap);
        }
    }
    generateCorrectSourceMap(fname) {
        if (this.sourceMap) {
            let jsonSourceMaps = JSON.parse(this.sourceMap);
            jsonSourceMaps.file = this.info.fuseBoxPath;
            jsonSourceMaps.sources = [fname || this.info.fuseBoxPath];
            this.sourceMap = JSON.stringify(jsonSourceMaps);
        }
        return this.sourceMap;
    }
    getTranspilationConfig() {
        return Object.assign({}, this.context.getTypeScriptConfig(), {
            fileName: this.info.absPath,
        });
    }
}
exports.File = File;

});
___scope___.file("analysis/FileAnalysis.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ASTTraverse_1 = require("./../ASTTraverse");
const PrettyError_1 = require("./../PrettyError");
const acorn = require("acorn");
const AutoImport_1 = require("./plugins/AutoImport");
const OwnVariable_1 = require("./plugins/OwnVariable");
const OwnBundle_1 = require("./plugins/OwnBundle");
const ImportDeclaration_1 = require("./plugins/ImportDeclaration");
require("acorn-es7")(acorn);
require("acorn-jsx/inject")(acorn);
const plugins = [AutoImport_1.AutoImport, OwnVariable_1.OwnVariable, OwnBundle_1.OwnBundle, ImportDeclaration_1.ImportDeclaration];
function acornParse(contents, options) {
    return acorn.parse(contents, Object.assign({}, options || {}, {
        sourceType: "module",
        tolerant: true,
        ecmaVersion: 8,
        plugins: { es7: true, jsx: true },
        jsx: { allowNamespacedObjects: true },
    }));
}
exports.acornParse = acornParse;
class FileAnalysis {
    constructor(file) {
        this.file = file;
        this.wasAnalysed = false;
        this.skipAnalysis = false;
        this.bannedImports = {};
        this.nativeImports = {};
        this.requiresRegeneration = false;
        this.fuseBoxVariable = "FuseBox";
        this.dependencies = [];
    }
    astIsLoaded() {
        return this.ast !== undefined;
    }
    loadAst(ast) {
        this.ast = ast;
    }
    skip() {
        this.skipAnalysis = true;
    }
    parseUsingAcorn(options) {
        try {
            this.ast = acornParse(this.file.contents, options);
        }
        catch (err) {
            return PrettyError_1.PrettyError.errorWithContents(err, this.file);
        }
    }
    handleAliasReplacement(requireStatement) {
        if (!this.file.context.experimentalAliasEnabled) {
            return requireStatement;
        }
        const aliasCollection = this.file.context.aliasCollection;
        aliasCollection.forEach(props => {
            if (props.expr.test(requireStatement)) {
                requireStatement = requireStatement.replace(props.expr, `${props.replacement}$2`);
                this.requiresRegeneration = true;
            }
        });
        return requireStatement;
    }
    addDependency(name) {
        this.dependencies.push(name);
    }
    resetDependencies() {
        this.dependencies = [];
    }
    nodeIsString(node) {
        return node.type === "Literal" || node.type === "StringLiteral";
    }
    analyze() {
        if (this.wasAnalysed || this.skipAnalysis) {
            return;
        }
        ASTTraverse_1.ASTTraverse.traverse(this.ast, {
            pre: (node, parent, prop, idx) => plugins.forEach(plugin => plugin.onNode(this.file, node, parent)),
        });
        plugins.forEach(plugin => plugin.onEnd(this.file));
        this.wasAnalysed = true;
        if (this.requiresRegeneration) {
            this.file.contents = this.file.context.generateCode(this.ast);
        }
    }
}
exports.FileAnalysis = FileAnalysis;

});
___scope___.file("ASTTraverse.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ASTTraverse {
    static traverse(root, options) {
        options = options || {};
        const pre = options.pre;
        const post = options.post;
        const skipProperty = options.skipProperty;
        let visit = (node, parent, prop, idx) => {
            if (!node || typeof node.type !== "string") {
                return;
            }
            if (node._visited) {
                return;
            }
            let res = undefined;
            if (pre) {
                res = pre(node, parent, prop, idx);
            }
            node._visited = true;
            if (res !== false) {
                for (let prop in node) {
                    if (skipProperty ? skipProperty(prop, node) : prop[0] === "$") {
                        continue;
                    }
                    let child = node[prop];
                    if (Array.isArray(child)) {
                        for (let i = 0; i < child.length; i++) {
                            visit(child[i], node, prop, i);
                        }
                    }
                    else {
                        visit(child, node, prop);
                    }
                }
            }
            if (post) {
                post(node, parent, prop, idx);
            }
        };
        visit(root, null);
    }
}
exports.ASTTraverse = ASTTraverse;

});
___scope___.file("PrettyError.js", function(exports, require, module, __filename, __dirname){ 
/* fuse:injection: */ var process = require("process");
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ansi = require("ansi");
const cursor = ansi(process.stdout);
class PrettyError {
    static errorWithContents(error, file) {
        let contents = file.contents;
        let lines = contents.split(/\r?\n/);
        let position = error.loc;
        if (!position || !position.line) {
            throw error;
        }
        let l = cursor;
        l.white().bg.red().bold().write(`Acorn error: ${error.message}`);
        l.reset().write("\n");
        l.bold().write(`File: ${file.absPath}`);
        l.write("\n\n").reset();
        let errorLine = position.line * 1;
        lines.forEach((line, index) => {
            let fits = Math.abs(index - errorLine) <= 3;
            if (fits) {
                if (index + 1 === errorLine) {
                    l.white().bg.red().write(`${index + 1}  ${line}`);
                    l.bg.reset();
                }
                else {
                    l.reset().write(`${index + 1} `).red().write(` ${line}`);
                }
                l.write("\n").reset();
            }
        });
        l.write("\n");
        throw "";
    }
}
exports.PrettyError = PrettyError;

});
___scope___.file("analysis/plugins/AutoImport.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HeaderImport_1 = require("./../HeaderImport");
class AutoImport {
    static onNode(file, node, parent) {
        const analysis = file.analysis;
        if (node.type === "Identifier") {
            if (HeaderImport_1.nativeModules.has(node.name) && !analysis.bannedImports[node.name]) {
                const belongsToAnotherObject = parent.type === "MemberExpression" && parent.object && parent.object.type === "Identifier" && parent.object.name !== node.name;
                if (belongsToAnotherObject) {
                    return;
                }
                const isProperty = parent.type && parent.type === "Property" && parent.value && parent.value.name !== node.name;
                const isFunction = parent.type
                    && (parent.type === "FunctionExpression" ||
                        parent.type === "FunctionDeclaration") && parent.params;
                const isDeclaration = parent.type === "VariableDeclarator" || parent.type === "FunctionDeclaration";
                if (isProperty || isFunction || parent && isDeclaration
                    && parent.id && parent.id.type === "Identifier" && parent.id.name === node.name) {
                    delete analysis.nativeImports[node.name];
                    if (!analysis.bannedImports[node.name]) {
                        analysis.bannedImports[node.name] = true;
                    }
                }
                else {
                    analysis.nativeImports[node.name] = HeaderImport_1.nativeModules.get(node.name);
                }
            }
        }
    }
    static onEnd(file) {
        const analysis = file.analysis;
        if (file.headerContent) {
            file.headerContent = [];
        }
        for (let nativeImportName in analysis.nativeImports) {
            if (analysis.nativeImports.hasOwnProperty(nativeImportName)) {
                const nativeImport = analysis.nativeImports[nativeImportName];
                analysis.dependencies.push(nativeImport.pkg);
                file.addHeaderContent(nativeImport.getImportStatement());
            }
        }
    }
}
exports.AutoImport = AutoImport;

});
___scope___.file("analysis/HeaderImport.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const realm_utils_1 = require("realm-utils");
class HeaderImport {
    constructor(variable, pkg) {
        this.variable = variable;
        if (realm_utils_1.utils.isPlainObject(pkg)) {
            let options = pkg;
            this.pkg = options.pkg;
            this.statement = options.statement;
        }
        else {
            this.pkg = pkg;
            this.statement = `require("${this.pkg}")`;
        }
    }
    getImportStatement() {
        return `/* fuse:injection: */ var ${this.variable} = ${this.statement};`;
    }
}
exports.HeaderImport = HeaderImport;
class HeaderImportCollection {
    constructor() {
        this.collection = new Map();
    }
    add(config) {
        this.collection.set(config.variable, config);
    }
    get(variable) {
        return this.collection.get(variable);
    }
    has(variable) {
        return this.collection.get(variable) !== undefined;
    }
}
exports.HeaderImportCollection = HeaderImportCollection;
let headerCollection;
if (!headerCollection) {
    headerCollection = new HeaderImportCollection();
    ;
}
headerCollection.add(new HeaderImport("stream", {
    pkg: "stream",
    statement: `require("stream").Stream`,
}));
headerCollection.add(new HeaderImport("process", "process"));
headerCollection.add(new HeaderImport("Buffer", {
    pkg: "buffer",
    statement: `require("buffer").Buffer`,
}));
headerCollection.add(new HeaderImport("http", "http"));
exports.nativeModules = headerCollection;

});
___scope___.file("analysis/plugins/OwnVariable.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OwnVariable {
    static onNode(file, node, parent) {
        const analysis = file.analysis;
        if (node.type === "Identifier") {
            if (node.name === "$fuse$") {
                analysis.fuseBoxVariable = parent.object.name;
            }
        }
    }
    static onEnd() { }
}
exports.OwnVariable = OwnVariable;

});
___scope___.file("analysis/plugins/OwnBundle.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const escodegen = require("escodegen");
class OwnBundle {
    static onNode(file, node, parent) {
        const analysis = file.analysis;
        if (node.type === "MemberExpression") {
            if (parent.type === "CallExpression") {
                if (node.object && node.object.type === "Identifier" &&
                    node.object.name === analysis.fuseBoxVariable) {
                    if (node.property && node.property.type === "Identifier") {
                        if (node.property.name === "main") {
                            if (parent.arguments) {
                                let f = parent.arguments[0];
                                if (f && analysis.nodeIsString(f)) {
                                    analysis.fuseBoxMainFile = f.value;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    static onEnd(file) {
        const analysis = file.analysis;
        if (analysis.fuseBoxMainFile) {
            file.analysis.dependencies = [];
            file.isFuseBoxBundle = true;
            this.removeFuseBoxApiFromBundle(file);
            const externalCollection = file.collection.name !== file.context.defaultPackageName;
            if (externalCollection) {
                file.collection.acceptFiles = false;
            }
            else {
                file.alternativeContent = `module.exports = require("${file.analysis.fuseBoxMainFile}")`;
            }
        }
    }
    static removeFuseBoxApiFromBundle(file) {
        let ast = file.analysis.ast;
        const fuseVariable = file.analysis.fuseBoxVariable;
        let modifiedAst;
        if (ast.type === "Program") {
            let first = ast.body[0];
            if (first && first.type === "ExpressionStatement") {
                let expression = first.expression;
                if (expression.type === "UnaryExpression" && expression.operator === "!") {
                    expression = expression.argument || {};
                }
                if (expression.type === "CallExpression") {
                    let callee = expression.callee;
                    if (callee.type === "FunctionExpression") {
                        if (callee.params && callee.params[0]) {
                            let param1 = callee.params[0];
                            if (param1.type === "Identifier" && param1.name === fuseVariable) {
                                modifiedAst = callee.body;
                            }
                        }
                    }
                }
            }
        }
        if (modifiedAst) {
            file.contents = `(function(${fuseVariable})${escodegen.generate(modifiedAst)})(FuseBox);`;
        }
    }
}
exports.OwnBundle = OwnBundle;

});
___scope___.file("analysis/plugins/ImportDeclaration.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ImportDeclaration {
    static onNode(file, node, parent) {
        const analysis = file.analysis;
        if (node.type === "CallExpression" && node.callee) {
            if (node.callee.type === "Identifier" && node.callee.name === "require") {
                let arg1 = node.arguments[0];
                if (analysis.nodeIsString(arg1)) {
                    let requireStatement = this.handleAliasReplacement(file, arg1.value);
                    arg1.value = requireStatement;
                    analysis.addDependency(requireStatement);
                }
            }
        }
        if (node.type === "ImportDeclaration") {
            if (node.source && analysis.nodeIsString(node.source)) {
                let requireStatement = this.handleAliasReplacement(file, node.source.value);
                node.source.value = requireStatement;
                analysis.addDependency(requireStatement);
            }
        }
    }
    static onEnd() { }
    static handleAliasReplacement(file, requireStatement) {
        if (!file.context.experimentalAliasEnabled) {
            return requireStatement;
        }
        const aliasCollection = file.context.aliasCollection;
        aliasCollection.forEach(props => {
            if (props.expr.test(requireStatement)) {
                requireStatement = requireStatement.replace(props.expr, `${props.replacement}$2`);
                file.analysis.requiresRegeneration = true;
            }
        });
        return requireStatement;
    }
}
exports.ImportDeclaration = ImportDeclaration;

});
___scope___.file("core/SourceMapGenerator.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const acorn = require("acorn");
const SourceMap = require("source-map");
class SourceMapGenerator {
    static generate(file, tokens) {
        const fileContent = file.contents;
        const filePath = file.info.fuseBoxPath;
        const smGenerator = new SourceMap.SourceMapGenerator({ file: `packages/${file.collection.name}/${filePath}` });
        tokens.some(token => {
            if (token.type.label === "eof")
                return true;
            const lineInfo = acorn.getLineInfo(fileContent, token.start);
            const mapping = {
                original: lineInfo,
                generated: lineInfo,
                source: filePath,
                name: false,
            };
            if (token.type.label === "name")
                mapping.name = token.value;
            smGenerator.addMapping(mapping);
        });
        smGenerator.setSourceContent(filePath, fileContent);
        file.sourceMap = JSON.stringify(smGenerator.toJSON());
    }
}
exports.SourceMapGenerator = SourceMapGenerator;

});
___scope___.file("core/PathMaster.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../Utils");
const Config_1 = require("../Config");
const path = require("path");
const fs = require("fs");
const NODE_MODULE = /^([a-z@](?!:).*)$/;
class AllowedExtenstions {
    static add(name) {
        if (!this.list.has(name)) {
            this.list.add(name);
        }
    }
    static has(name) {
        return this.list.has(name);
    }
}
AllowedExtenstions.list = new Set([".js", ".ts", ".tsx", ".json", ".xml", ".css", ".html"]);
exports.AllowedExtenstions = AllowedExtenstions;
class PathMaster {
    constructor(context, rootPackagePath) {
        this.context = context;
        this.rootPackagePath = rootPackagePath;
        this.tsMode = false;
    }
    init(name) {
        return this.resolve(name, this.rootPackagePath);
    }
    setTypeScriptMode() {
        this.tsMode = true;
    }
    resolve(name, root, rootEntryLimit) {
        let data = {};
        if (/^(http(s)?:|\/\/)/.test(name)) {
            data.isRemoteFile = true;
            data.remoteURL = name;
            data.absPath = name;
            return data;
        }
        data.isNodeModule = NODE_MODULE.test(name);
        if (data.isNodeModule) {
            let info = this.getNodeModuleInfo(name);
            data.nodeModuleName = info.name;
            let nodeModuleInfo = this.getNodeModuleInformation(info.name);
            let cachedInfo = this.context.getLibInfo(nodeModuleInfo.name, nodeModuleInfo.version);
            if (cachedInfo) {
                data.nodeModuleInfo = cachedInfo;
            }
            else {
                data.nodeModuleInfo = nodeModuleInfo;
                this.context.setLibInfo(nodeModuleInfo.name, nodeModuleInfo.version, nodeModuleInfo);
            }
            if (info.target) {
                data.absPath = this.getAbsolutePath(info.target, data.nodeModuleInfo.root, undefined, true);
                data.absDir = path.dirname(data.absPath);
                data.nodeModuleExplicitOriginal = info.target;
            }
            else {
                data.absPath = data.nodeModuleInfo.entry;
                data.absDir = data.nodeModuleInfo.root;
            }
            if (data.absPath) {
                data.fuseBoxPath = this.getFuseBoxPath(data.absPath, data.nodeModuleInfo.root);
            }
        }
        else {
            if (root) {
                data.absPath = this.getAbsolutePath(name, root, rootEntryLimit);
                data.absDir = path.dirname(data.absPath);
                data.fuseBoxPath = this.getFuseBoxPath(data.absPath, this.rootPackagePath);
            }
        }
        return data;
    }
    getFuseBoxPath(name, root) {
        if (!root) {
            return;
        }
        name = name.replace(/\\/g, "/");
        root = root.replace(/\\/g, "/");
        name = name.replace(root, "").replace(/^\/|\\/, "");
        if (this.tsMode) {
            name = Utils_1.ensurePublicExtension(name);
        }
        let ext = path.extname(name);
        if (!ext) {
            name += ".js";
        }
        return name;
    }
    getAbsolutePath(name, root, rootEntryLimit, explicit = false) {
        let url = this.ensureFolderAndExtensions(name, root, explicit);
        let result = path.resolve(root, url);
        if (rootEntryLimit && name.match(/\.\.\/$/)) {
            if (result.indexOf(path.dirname(rootEntryLimit)) < 0) {
                return rootEntryLimit;
            }
        }
        return result;
    }
    getParentFolderName() {
        if (this.rootPackagePath) {
            let s = this.rootPackagePath.split(/\/|\\/g);
            return s[s.length - 1];
        }
        return "";
    }
    testFolder(folder, name) {
        const extensions = ["js", "jsx"];
        if (this.tsMode) {
            extensions.push("ts", "tsx");
        }
        if (fs.existsSync(folder)) {
            for (let i = 0; i < extensions.length; i++) {
                let ext = extensions[i];
                const index = `index.${ext}`;
                const target = path.join(folder, index);
                if (fs.existsSync(target)) {
                    let result = path.join(name, index);
                    let startsWithDot = result[0] === ".";
                    if (startsWithDot) {
                        result = `./${result}`;
                    }
                    return result;
                }
            }
        }
    }
    checkFileName(root, name) {
        const extensions = ["js", "jsx"];
        if (this.tsMode) {
            extensions.push("ts", "tsx");
        }
        for (let i = 0; i < extensions.length; i++) {
            let ext = extensions[i];
            let fileName = `${name}.${ext}`;
            let target = path.isAbsolute(name) ? fileName : path.join(root, fileName);
            if (fs.existsSync(target)) {
                if (fileName[0] === ".") {
                    fileName = `./${fileName}`;
                }
                return fileName;
            }
        }
    }
    ensureFolderAndExtensions(name, root, explicit = false) {
        let ext = path.extname(name);
        let fileExt = this.tsMode && !explicit ? ".ts" : ".js";
        if (name[0] === "~" && name[1] === "/" && this.rootPackagePath) {
            name = "." + name.slice(1, name.length);
            name = path.join(this.rootPackagePath, name);
        }
        if (!AllowedExtenstions.has(ext)) {
            let folder = path.isAbsolute(name) ? name : path.join(root, name);
            const folderPath = this.testFolder(folder, name);
            if (folderPath) {
                return folderPath;
            }
            else {
                let fileNameCheck = this.checkFileName(root, name);
                if (fileNameCheck) {
                    return fileNameCheck;
                }
                else {
                    name += fileExt;
                }
            }
        }
        return name;
    }
    getNodeModuleInfo(name) {
        if (name[0] === "@") {
            let s = name.split("/");
            let target = s.splice(2, s.length).join("/");
            return {
                name: `${s[0]}/${s[1]}`,
                target: target || undefined,
            };
        }
        let data = name.split(/\/(.+)?/);
        return {
            name: data[0],
            target: data[1],
        };
    }
    getNodeModuleInformation(name) {
        const readMainFile = (folder, isCustom) => {
            const packageJSONPath = path.join(folder, "package.json");
            if (fs.existsSync(packageJSONPath)) {
                const json = require(packageJSONPath);
                let entryFile;
                let entryRoot;
                if (json.browser) {
                    if (typeof json.browser === "object" && json.browser[json.main]) {
                        entryFile = json.browser[json.main];
                    }
                    if (typeof json.browser === "string") {
                        entryFile = json.browser;
                    }
                }
                if (this.context.rollupOptions && json["jsnext:main"]) {
                    entryFile = path.join(folder, json["jsnext:main"]);
                }
                else {
                    entryFile = path.join(folder, entryFile || json.main || "index.js");
                    entryRoot = path.dirname(entryFile);
                }
                return {
                    name,
                    custom: isCustom,
                    root: folder,
                    missing: false,
                    entryRoot,
                    entry: entryFile,
                    version: json.version,
                };
            }
            let defaultEntry = path.join(folder, "index.js");
            let entryFile = fs.existsSync(defaultEntry) ? defaultEntry : undefined;
            let defaultEntryRoot = entryFile ? path.dirname(entryFile) : undefined;
            let packageExists = fs.existsSync(folder);
            return {
                name,
                missing: !packageExists,
                custom: isCustom,
                root: folder,
                entry: entryFile,
                entryRoot: defaultEntryRoot,
                version: "0.0.0",
            };
        };
        let localLib = path.join(Config_1.Config.FUSEBOX_MODULES, name);
        let modulePath = path.join(Config_1.Config.NODE_MODULES_DIR, name);
        if (this.context.customModulesFolder) {
            let customFolder = path.join(this.context.customModulesFolder, name);
            if (fs.existsSync(customFolder)) {
                return readMainFile(customFolder, false);
            }
        }
        if (fs.existsSync(localLib)) {
            return readMainFile(localLib, false);
        }
        if (this.rootPackagePath) {
            let nestedNodeModule = path.join(this.rootPackagePath, "node_modules", name);
            if (fs.existsSync(nestedNodeModule)) {
                return readMainFile(nestedNodeModule, true);
            }
            else {
                let upperNodeModule = path.join(this.rootPackagePath, "../", name);
                if (fs.existsSync(upperNodeModule)) {
                    let isCustom = path.dirname(this.rootPackagePath) !== Config_1.Config.NODE_MODULES_DIR;
                    return readMainFile(upperNodeModule, isCustom);
                }
            }
        }
        return readMainFile(modulePath, false);
    }
}
exports.PathMaster = PathMaster;

});
___scope___.file("devServer/Server.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HotReloadPlugin_1 = require("./../plugins/HotReloadPlugin");
const SocketServer_1 = require("./SocketServer");
const Utils_1 = require("../Utils");
const HTTPServer_1 = require("./HTTPServer");
const realm_utils_1 = require("realm-utils");
const process = require("process");
const path = require("path");
const watch = require("watch");
class Server {
    constructor(fuse) {
        this.fuse = fuse;
    }
    start(str, opts) {
        opts = opts || {};
        let buildPath = Utils_1.ensureUserPath(this.fuse.context.outFile);
        let rootDir = path.dirname(buildPath);
        const root = opts.root !== undefined
            ? (realm_utils_1.utils.isString(opts.root) ? Utils_1.ensureUserPath(opts.root) : false) : rootDir;
        const port = opts.port || 4444;
        if (opts.hmr !== false && this.fuse.context.useCache === true) {
            setTimeout(() => {
                this.fuse.context.log.echo(`HMR is enabled`);
            }, 1000);
            this.fuse.context.plugins.push(HotReloadPlugin_1.HotReloadPlugin({ port, uri: opts.socketURI }));
        }
        else {
            setTimeout(() => { this.fuse.context.log.echo(`HMR is disabled. Caching should be enabled and {hmr} option should be NOT false`); }, 1000);
        }
        let emitter = realm_utils_1.utils.isFunction(opts.emitter) ? opts.emitter : false;
        this.httpServer = new HTTPServer_1.HTTPServer(this.fuse);
        process.nextTick(() => {
            if (opts.httpServer === false) {
                SocketServer_1.SocketServer.startSocketServer(port, this.fuse);
            }
            else {
                this.httpServer.launch({ root, port });
            }
            this.socketServer = SocketServer_1.SocketServer.getInstance();
            this.fuse.context.sourceChangedEmitter.on((info) => {
                if (this.fuse.context.isFirstTime() === false) {
                    this.fuse.context.log.echo(`Source changed for ${info.path}`);
                    if (emitter) {
                        emitter(this, info);
                    }
                    else {
                        this.socketServer.send("source-changed", info);
                    }
                }
            });
            let timeout;
            watch.watchTree(this.fuse.context.homeDir, { interval: 0.2 }, () => {
                clearInterval(timeout);
                timeout = setTimeout(() => {
                    this.fuse.initiateBundle(str);
                }, 70);
            });
        });
        return this;
    }
}
exports.Server = Server;

});
___scope___.file("devServer/SocketServer.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
class SocketServer {
    constructor(server, fuse) {
        this.server = server;
        this.fuse = fuse;
        this.clients = new Set();
        server.on("connection", (ws) => {
            this.fuse.context.log.echo("Client connected");
            this.clients.add(ws);
            ws.on("message", message => {
                let input = JSON.parse(message);
                if (input.event) {
                    this.onMessage(ws, input.event, input.data);
                }
            });
            ws.on("close", () => {
                this.fuse.context.log.echo("Connection closed");
                this.clients.delete(ws);
            });
        });
    }
    static createInstance(server, fuse) {
        if (!this.server) {
            this.server = this.start(server, fuse);
        }
        return this.server;
    }
    static getInstance() {
        return this.server;
    }
    static start(server, fuse) {
        let wss = new ws_1.Server({ server });
        let ss = new SocketServer(wss, fuse);
        return ss;
    }
    static startSocketServer(port, fuse) {
        let wss = new ws_1.Server({ port });
        this.server = new SocketServer(wss, fuse);
        fuse.context.log.echo(`Launching socket server on ${port}`);
        return this.server;
    }
    send(type, data) {
        this.clients.forEach(client => {
            client.send(JSON.stringify({ type, data }));
        });
    }
    onMessage(client, type, data) {
    }
    ;
}
exports.SocketServer = SocketServer;

});
___scope___.file("devServer/HTTPServer.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SocketServer_1 = require("./SocketServer");
const http = require("http");
const express = require("express");
const Utils_1 = require("../Utils");
class HTTPServer {
    constructor(fuse) {
        this.fuse = fuse;
        this.app = express();
    }
    static start(opts, fuse) {
        let server = new HTTPServer(fuse);
        server.launch(opts);
        return server;
    }
    launch(opts) {
        this.opts = opts || {};
        const port = this.opts.port || 4444;
        let server = http.createServer();
        SocketServer_1.SocketServer.createInstance(server, this.fuse);
        this.setup();
        server.on("request", this.app);
        setTimeout(() => {
            server.listen(port, () => {
                this.fuse.context.log.echo(`Launching dev server on port ${port}`);
            });
        }, 10);
    }
    serveStatic(userPath, userFolder) {
        this.app.use(userPath, express.static(Utils_1.ensureUserPath(userFolder)));
    }
    setup() {
        if (this.opts.root) {
            this.app.use("/", express.static(this.opts.root));
        }
    }
}
exports.HTTPServer = HTTPServer;

});
___scope___.file("core/WorkflowContext.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const escodegen = require("escodegen");
const BundleSource_1 = require("../BundleSource");
const File_1 = require("./File");
const Log_1 = require("../Log");
const PathMaster_1 = require("./PathMaster");
const ModuleCache_1 = require("../ModuleCache");
const EventEmitter_1 = require("../EventEmitter");
const realm_utils_1 = require("realm-utils");
const Utils_1 = require("../Utils");
const Config_1 = require("../Config");
const appRoot = require("app-root-path");
class WorkFlowContext {
    constructor() {
        this.sourceChangedEmitter = new EventEmitter_1.EventEmitter();
        this.defaultPackageName = "default";
        this.ignoreGlobal = [];
        this.pendingPromises = [];
        this.serverBundle = false;
        this.nodeModules = new Map();
        this.libPaths = new Map();
        this.printLogs = true;
        this.useCache = true;
        this.doLog = true;
        this.tsMode = false;
        this.standaloneBundle = true;
        this.initialLoad = true;
        this.debugMode = false;
        this.log = new Log_1.Log(this);
        this.experimentalAliasEnabled = false;
    }
    initCache() {
        this.cache = new ModuleCache_1.ModuleCache(this);
    }
    resolve() {
        return Promise.all(this.pendingPromises).then(() => {
            this.pendingPromises = [];
        });
    }
    queue(obj) {
        this.pendingPromises.push(obj);
    }
    getHeaderImportsConfiguration() {
    }
    setCodeGenerator(fn) {
        this.customCodeGenerator = fn;
    }
    generateCode(ast) {
        if (this.customCodeGenerator) {
            return this.customCodeGenerator(ast);
        }
        return escodegen.generate(ast);
    }
    emitJavascriptHotReload(file) {
        let content = file.contents;
        if (file.headerContent) {
            content = file.headerContent.join("\n") + "\n" + content;
        }
        this.sourceChangedEmitter.emit({
            type: "js",
            content,
            path: file.info.fuseBoxPath,
        });
    }
    debug(group, text) {
        if (this.debugMode) {
            this.log.echo(`${group} : ${text}`);
        }
    }
    nukeCache() {
        this.resetNodeModules();
        Utils_1.removeFolder(Config_1.Config.TEMP_FOLDER);
        this.cache.initialize();
    }
    warning(str) {
        return this.log.echoWarning(str);
    }
    fatal(str) {
        throw new Error(str);
    }
    debugPlugin(plugin, text) {
        const name = plugin.constructor && plugin.constructor.name ? plugin.constructor.name : "Unknown";
        this.debug(name, text);
    }
    isShimed(name) {
        if (!this.shim) {
            return false;
        }
        return this.shim[name] !== undefined;
    }
    reset() {
        this.log = new Log_1.Log(this);
        this.storage = new Map();
        this.source = new BundleSource_1.BundleSource(this);
        this.nodeModules = new Map();
        this.pluginTriggers = new Map();
        this.fileGroups = new Map();
        this.libPaths = new Map();
    }
    setItem(key, obj) {
        this.storage.set(key, obj);
    }
    getItem(key) {
        return this.storage.get(key);
    }
    createFileGroup(name, collection, handler) {
        let info = {
            fuseBoxPath: name,
            absPath: name,
        };
        let file = new File_1.File(this, info);
        file.collection = collection;
        file.contents = "";
        file.groupMode = true;
        file.groupHandler = handler;
        this.fileGroups.set(name, file);
        return file;
    }
    getFileGroup(name) {
        return this.fileGroups.get(name);
    }
    allowExtension(ext) {
        if (!PathMaster_1.AllowedExtenstions.has(ext)) {
            PathMaster_1.AllowedExtenstions.add(ext);
        }
    }
    setHomeDir(dir) {
        this.homeDir = Utils_1.ensureDir(dir);
    }
    setLibInfo(name, version, info) {
        let key = `${name}@${version}`;
        if (!this.libPaths.has(key)) {
            return this.libPaths.set(key, info);
        }
    }
    convert2typescript(name) {
        return name.replace(/\.ts$/, ".js");
    }
    getLibInfo(name, version) {
        let key = `${name}@${version}`;
        if (this.libPaths.has(key)) {
            return this.libPaths.get(key);
        }
    }
    setPrintLogs(printLogs) {
        this.printLogs = printLogs;
    }
    setUseCache(useCache) {
        this.useCache = useCache;
    }
    hasNodeModule(name) {
        return this.nodeModules.has(name);
    }
    isGlobalyIgnored(name) {
        return this.ignoreGlobal.indexOf(name) > -1;
    }
    resetNodeModules() {
        this.nodeModules = new Map();
    }
    addNodeModule(name, collection) {
        this.nodeModules.set(name, collection);
    }
    getTypeScriptConfig() {
        if (this.loadedTsConfig) {
            return this.loadedTsConfig;
        }
        let url, configFile;
        let config = {
            compilerOptions: {},
        };
        ;
        if (this.tsConfig) {
            configFile = Utils_1.ensureUserPath(this.tsConfig);
        }
        else {
            url = path.join(this.homeDir, "tsconfig.json");
            let tsconfig = Utils_1.findFileBackwards(url, appRoot.path);
            if (tsconfig) {
                configFile = tsconfig;
            }
        }
        if (configFile) {
            this.log.echoStatus(`Typescript config:  ${configFile.replace(appRoot.path, "")}`);
            config = require(configFile);
        }
        else {
            config.compilerOptions.module = "commonjs";
            this.log.echoStatus(`Typescript config file was not found. Improvising`);
        }
        if (this.sourceMapConfig) {
            config.compilerOptions.sourceMap = true;
            config.compilerOptions.inlineSources = true;
        }
        if (this.rollupOptions) {
            this.debug("Typescript", "Forcing es6 output for typescript. Rollup deteced");
            config.compilerOptions.module = "es6";
            config.compilerOptions.target = "es6";
        }
        this.loadedTsConfig = config;
        return config;
    }
    isFirstTime() {
        return this.initialLoad === true;
    }
    writeOutput(outFileWritten) {
        this.initialLoad = false;
        const res = this.source.getResult();
        if (this.sourceMapConfig && this.sourceMapConfig.outFile) {
            let target = Utils_1.ensureUserPath(this.sourceMapConfig.outFile);
            fs.writeFile(target, res.sourceMap, () => { });
        }
        if (this.outFile) {
            let target = Utils_1.ensureUserPath(this.outFile);
            fs.writeFile(target, res.content, () => {
                if (realm_utils_1.utils.isFunction(outFileWritten)) {
                    outFileWritten();
                }
            });
        }
    }
    getNodeModule(name) {
        return this.nodeModules.get(name);
    }
    triggerPluginsMethodOnce(name, args, fn) {
        this.plugins.forEach(plugin => {
            if (Array.isArray(plugin)) {
                plugin.forEach(p => {
                    if (realm_utils_1.utils.isFunction(p[name])) {
                        if (this.pluginRequiresTriggering(p, name)) {
                            p[name].apply(p, args);
                            if (fn) {
                                fn(p);
                            }
                        }
                    }
                });
            }
            if (realm_utils_1.utils.isFunction(plugin[name])) {
                if (this.pluginRequiresTriggering(plugin, name)) {
                    plugin[name].apply(plugin, args);
                    if (fn) {
                        fn(plugin);
                    }
                }
            }
        });
    }
    pluginRequiresTriggering(cls, method) {
        if (!cls.constructor) {
            return true;
        }
        let name = cls.constructor.name;
        if (!this.pluginTriggers.has(name)) {
            this.pluginTriggers.set(name, new Set());
        }
        let items = this.pluginTriggers.get(name);
        if (!items.has(method)) {
            items.add(method);
            return true;
        }
        return false;
    }
}
exports.WorkFlowContext = WorkFlowContext;

});
___scope___.file("Log.js", function(exports, require, module, __filename, __dirname){ 
/* fuse:injection: */ var process = require("process");
/* fuse:injection: */ var Buffer = require("buffer").Buffer;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ansi = require("ansi");
const cursor = ansi(process.stdout);
const prettysize = require("prettysize");
const prettyTime = require("pretty-time");
class Log {
    constructor(context) {
        this.context = context;
        this.timeStart = process.hrtime();
        this.totalSize = 0;
        this.printLog = true;
        this.printLog = context.doLog;
    }
    echoWith(str, opt) {
        cursor.write(` `)[opt]().write(str);
        cursor.write("\n");
        cursor.reset();
    }
    echo(str) {
        let data = new Date();
        let hour = data.getHours();
        let min = data.getMinutes();
        let sec = data.getSeconds();
        hour = hour < 10 ? `0${hour}` : hour;
        min = min < 10 ? `0${min}` : min;
        sec = sec < 10 ? `0${sec}` : sec;
        cursor.yellow().write(`${hour}:${min}:${sec} : `)
            .green().write(str);
        cursor.write("\n");
        cursor.reset();
    }
    echoStatus(str) {
        if (this.printLog) {
            cursor.write(`  → `)
                .cyan().write(str);
            cursor.write("\n");
            cursor.reset();
        }
    }
    echoWarning(str) {
        cursor.red().write(`  → WARNING `)
            .write(str);
        cursor.write("\n");
        cursor.reset();
    }
    echoDefaultCollection(collection, contents) {
        if (!this.printLog) {
            return;
        }
        let bytes = Buffer.byteLength(contents, "utf8");
        let size = prettysize(bytes);
        this.totalSize += bytes;
        cursor.reset().write(`└──`)
            .green().write(` ${collection.cachedName || collection.name}`)
            .yellow().write(` (${collection.dependencies.size} files,  ${size})`);
        cursor.write("\n");
        collection.dependencies.forEach(file => {
            if (!file.info.isRemoteFile) {
                cursor.reset().write(`      ${file.info.fuseBoxPath}`).write("\n");
            }
        });
        cursor.reset();
    }
    echoCollection(collection, contents) {
        if (!this.printLog) {
            return;
        }
        let bytes = Buffer.byteLength(contents, "utf8");
        let size = prettysize(bytes);
        this.totalSize += bytes;
        cursor.reset().write(`└──`)
            .green().write(` ${collection.cachedName || collection.name}`)
            .reset().write(` (${collection.dependencies.size} files)`)
            .yellow().write(` ${size}`)
            .write("\n").reset();
    }
    end(header) {
        let took = process.hrtime(this.timeStart);
        this.echoBundleStats(header || "Bundle", this.totalSize, took);
    }
    echoBundleStats(header, size, took) {
        if (!this.printLog) {
            return;
        }
        cursor.write("\n")
            .green().write(`    ${header}\n`)
            .yellow().write(`    Size: ${prettysize(size)} \n`)
            .yellow().write(`    Time: ${prettyTime(took, "ms")}`)
            .write("\n").reset();
    }
}
exports.Log = Log;

});
___scope___.file("ModuleCache.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleCollection_1 = require("./core/ModuleCollection");
const Config_1 = require("./Config");
const realm_utils_1 = require("realm-utils");
const fsExtra = require("fs-extra");
const fs = require("fs");
const path = require("path");
const MEMORY_CACHE = {};
class ModuleCache {
    constructor(context) {
        this.context = context;
        this.cachedDeps = {
            tree: {},
            flat: {},
        };
        this.initialize();
    }
    initialize() {
        this.cacheFolder = path.join(Config_1.Config.TEMP_FOLDER, "cache", Config_1.Config.FUSEBOX_VERSION, encodeURIComponent(`${Config_1.Config.PROJECT_FOLDER}${this.context.outFile || ""}`));
        this.permanentCacheFolder = path.join(this.cacheFolder, "permanent");
        fsExtra.ensureDirSync(this.permanentCacheFolder);
        this.staticCacheFolder = path.join(this.cacheFolder, "static");
        fsExtra.ensureDirSync(this.staticCacheFolder);
        this.cacheFile = path.join(this.cacheFolder, "deps.json");
        if (fs.existsSync(this.cacheFile)) {
            try {
                this.cachedDeps = require(this.cacheFile);
            }
            catch (e) {
                this.cachedDeps = {
                    tree: {},
                    flat: {},
                };
            }
        }
    }
    setPermanentCache(key, contents) {
        key = encodeURIComponent(key);
        let filePath = path.join(this.permanentCacheFolder, key);
        fs.writeFile(filePath, contents, () => { });
        MEMORY_CACHE[filePath] = contents;
    }
    getPermanentCache(key) {
        key = encodeURIComponent(key);
        let filePath = path.join(this.permanentCacheFolder, key);
        if (MEMORY_CACHE[filePath]) {
            return MEMORY_CACHE[filePath];
        }
        if (fs.existsSync(filePath)) {
            const contents = fs.readFileSync(filePath).toString();
            MEMORY_CACHE[filePath] = contents;
            return contents;
        }
    }
    getStaticCache(file) {
        let stats = fs.statSync(file.absPath);
        let fileName = encodeURIComponent(file.info.fuseBoxPath);
        let memCacheKey = encodeURIComponent(file.absPath);
        let data;
        if (MEMORY_CACHE[memCacheKey]) {
            data = MEMORY_CACHE[memCacheKey];
            if (data.mtime !== stats.mtime.getTime()) {
                return;
            }
            return data;
        }
        else {
            let dest = path.join(this.staticCacheFolder, fileName);
            if (fs.existsSync(dest)) {
                try {
                    data = require(dest);
                }
                catch (e) {
                    console.log(e);
                    return;
                }
                if (data.mtime !== stats.mtime.getTime()) {
                    return;
                }
                MEMORY_CACHE[memCacheKey] = data;
                return data;
            }
        }
    }
    writeStaticCache(file, sourcemaps) {
        let fileName = encodeURIComponent(file.info.fuseBoxPath);
        let memCacheKey = encodeURIComponent(file.absPath);
        let dest = path.join(this.staticCacheFolder, fileName);
        let stats = fs.statSync(file.absPath);
        let cacheData = {
            contents: file.contents,
            dependencies: file.analysis.dependencies,
            sourceMap: sourcemaps || {},
            headerContent: file.headerContent,
            mtime: stats.mtime.getTime(),
        };
        let data = `module.exports = { contents: ${JSON.stringify(cacheData.contents)},
dependencies: ${JSON.stringify(cacheData.dependencies)},
sourceMap: ${JSON.stringify(cacheData.sourceMap)},
headerContent: ${JSON.stringify(cacheData.headerContent)},
mtime: ${cacheData.mtime}
};`;
        MEMORY_CACHE[memCacheKey] = cacheData;
        fs.writeFileSync(dest, data);
    }
    resolve(files) {
        let through = [];
        let valid4Caching = [];
        const moduleFileCollection = new Map();
        files.forEach(file => {
            let info = file.info.nodeModuleInfo;
            if (!moduleFileCollection.get(info.name)) {
                moduleFileCollection.set(info.name, new Map());
            }
            moduleFileCollection.get(info.name).set(file.info.fuseBoxPath, file);
        });
        files.forEach(file => {
            let info = file.info.nodeModuleInfo;
            let key = `${info.name}@${info.version}`;
            let cachePath = path.join(this.cacheFolder, encodeURIComponent(key));
            let cached = this.cachedDeps.flat[key];
            if (!cached || !fs.existsSync(cachePath)) {
                through.push(file);
            }
            else {
                if (cached.version !== info.version || cached.files.indexOf(file.info.fuseBoxPath) === -1) {
                    through.push(file);
                    for (let i = 0; i < cached.files.length; i++) {
                        let cachedFileName = cached.files[i];
                        let f = moduleFileCollection.get(info.name).get(cachedFileName);
                        if (f) {
                            through.push(f);
                        }
                    }
                    let index = valid4Caching.indexOf(key);
                    if (index !== -1) {
                        valid4Caching.splice(index, 1);
                    }
                }
                else {
                    if (valid4Caching.indexOf(key) === -1) {
                        valid4Caching.push(key);
                    }
                }
            }
        });
        const required = [];
        const operations = [];
        let cacheReset = false;
        const getAllRequired = (key, json) => {
            if (required.indexOf(key) === -1) {
                if (json) {
                    let collection = new ModuleCollection_1.ModuleCollection(this.context, json.name);
                    let cacheKey = encodeURIComponent(key);
                    collection.cached = true;
                    collection.cachedName = key;
                    collection.cacheFile = path.join(this.cacheFolder, cacheKey);
                    operations.push(new Promise((resolve, reject) => {
                        if (MEMORY_CACHE[cacheKey]) {
                            collection.cachedContent = MEMORY_CACHE[cacheKey];
                            return resolve();
                        }
                        if (fs.existsSync(collection.cacheFile)) {
                            fs.readFile(collection.cacheFile, (err, result) => {
                                collection.cachedContent = result.toString();
                                MEMORY_CACHE[cacheKey] = collection.cachedContent;
                                return resolve();
                            });
                        }
                        else {
                            valid4Caching = [];
                            cacheReset = true;
                            return resolve();
                        }
                    }));
                    this.context.addNodeModule(key, collection);
                    required.push(key);
                    if (json.deps) {
                        for (let k in json.deps) {
                            if (json.deps.hasOwnProperty(k)) {
                                getAllRequired(k, json.deps[k]);
                            }
                        }
                    }
                }
            }
        };
        valid4Caching.forEach(key => {
            getAllRequired(key, this.cachedDeps.tree[key]);
        });
        return Promise.all(operations).then(() => {
            if (cacheReset) {
                this.context.resetNodeModules();
                return files;
            }
            return through;
        });
    }
    buildMap(rootCollection) {
        let json = this.cachedDeps;
        const traverse = (modules, root) => {
            return realm_utils_1.each(modules, (collection) => {
                if (collection.traversed) {
                    return;
                }
                let dependencies = {};
                let flatFiles;
                if (collection.cached) {
                    return;
                }
                let key = `${collection.info.name}@${collection.info.version}`;
                if (!json.flat[key]) {
                    json.flat[key] = {
                        name: collection.name,
                        version: collection.info.version,
                        files: [],
                    };
                }
                flatFiles = json.flat[key].files;
                collection.dependencies.forEach(file => {
                    if (flatFiles.indexOf(file.info.fuseBoxPath) < 0) {
                        flatFiles.push(file.info.fuseBoxPath);
                    }
                });
                root[key] = {
                    deps: dependencies,
                    name: collection.info.name,
                    version: collection.info.version,
                };
                collection.traversed = true;
                return traverse(collection.nodeModules, dependencies);
            });
        };
        traverse(rootCollection.nodeModules, json.tree).then(() => {
            fs.writeFile(this.cacheFile, JSON.stringify(json, undefined, 2), () => { });
        });
    }
    set(info, contents) {
        return new Promise((resolve, reject) => {
            const cacheKey = encodeURIComponent(`${info.name}@${info.version}`);
            const targetName = path.join(this.cacheFolder, cacheKey);
            MEMORY_CACHE[cacheKey] = contents;
            fs.writeFile(targetName, contents, (err) => {
                return resolve();
            });
        });
    }
}
exports.ModuleCache = ModuleCache;

});
___scope___.file("EventEmitter.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventEmitter {
    constructor() {
        this.listeners = [];
        this.listenersOncer = [];
        this.on = (listener) => {
            this.listeners.push(listener);
            return {
                dispose: () => this.off(listener),
            };
        };
        this.once = (listener) => {
            this.listenersOncer.push(listener);
        };
        this.off = (listener) => {
            var callbackIndex = this.listeners.indexOf(listener);
            if (callbackIndex > -1)
                this.listeners.splice(callbackIndex, 1);
        };
        this.emit = (event) => {
            this.listeners.forEach((listener) => listener(event));
            this.listenersOncer.forEach((listener) => listener(event));
            this.listenersOncer = [];
        };
    }
}
exports.EventEmitter = EventEmitter;

});
___scope___.file("CollectionSource.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CollectionSource {
    constructor(context) {
        this.context = context;
    }
    get(collection) {
        if (collection.cachedContent) {
            return new Promise((resolve, reject) => {
                this.context.source.addContent(collection.cachedContent);
                return resolve(collection.cachedContent);
            });
        }
        this.context.source.createCollection(collection);
        let files = this.filterFiles(collection.dependencies);
        this.context.source.startCollection(collection);
        files.forEach(f => {
            this.context.source.addFile(f);
        });
        return Promise.resolve(this.context.source.endCollection(collection));
    }
    filterFiles(files) {
        let filtered = [];
        files.forEach(file => {
            if (file.isFuseBoxBundle) {
                this.context.source.addContentToCurrentCollection(file.contents);
            }
            if (!file.info.isRemoteFile) {
                filtered.push(file);
            }
        });
        return filtered;
    }
}
exports.CollectionSource = CollectionSource;

});
___scope___.file("arithmetic/Arithmetic.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArithmeticStringParser_1 = require("./ArithmeticStringParser");
const Fluent_1 = require("./Fluent");
exports.Fluent = Fluent_1.default;
const Config_1 = require("./../Config");
const realm_utils_1 = require("realm-utils");
const path = require("path");
const fs = require("fs");
const fsExtra = require("fs-extra");
const glob = require("glob");
const deleteFolderRecursive = (p) => {
    if (fs.existsSync(p)) {
        fs.readdirSync(p).forEach((file, index) => {
            let curPath = path.join(p, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            }
            else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(p);
    }
};
class BundleData {
    setIncluding(info) {
    }
    setupTempFolder(tmpFolder) {
        this.tmpFolder = tmpFolder;
    }
    fileBlackListed(file) {
        return this.excluding.has(file.getCrossPlatormPath());
    }
    fileWhiteListed(file) {
        return this.including.has(file.getCrossPlatormPath());
    }
    finalize() {
        if (this.tmpFolder) {
            deleteFolderRecursive(this.tmpFolder);
        }
    }
    shouldIgnore(name) {
        return this.excluding.has(name);
    }
    shouldIgnoreDependencies(name) {
        if (this.including.has(name)) {
            return this.including.get(name).deps === false;
        }
    }
    shouldIgnoreNodeModules(asbPath) {
        if (this.including.has(asbPath)) {
            return this.including.get(asbPath).deps === false;
        }
        return false;
    }
}
exports.BundleData = BundleData;
class Arithmetic {
    static parse(str) {
        let parser = new ArithmeticStringParser_1.PropParser(str);
        parser.parse();
        return parser;
    }
    static getFiles(parser, virtualFiles, homeDir) {
        let tsMode = false;
        let collect = (list) => {
            let data = new Map();
            return realm_utils_1.each(list, (withDeps, filePattern) => {
                if (filePattern.match(/^[a-z0-9_\-@\/]+$/i)) {
                    data.set(filePattern, {
                        deps: withDeps,
                        nodeModule: true,
                    });
                    return;
                }
                let fp = path.join(homeDir, filePattern);
                let extname = path.extname(fp);
                if (extname === ".ts" || extname === ".tsx") {
                    tsMode = true;
                }
                if (!extname && !filePattern.match(/\.js$/)) {
                    fp += ".js";
                }
                return new Promise((resolve, reject) => {
                    glob(fp, (err, files) => {
                        for (let i = 0; i < files.length; i++) {
                            data.set(files[i].normalize("NFC"), {
                                deps: withDeps,
                            });
                        }
                        return resolve();
                    });
                });
            }).then(x => {
                return data;
            });
        };
        return realm_utils_1.chain(class extends realm_utils_1.Chainable {
            prepareVirtualFiles() {
                if (virtualFiles) {
                    this.tempFolder = path.join(Config_1.Config.TEMP_FOLDER, "virtual-files", new Date().getTime().toString());
                    homeDir = this.tempFolder;
                    fsExtra.ensureDirSync(this.tempFolder);
                    return realm_utils_1.each(virtualFiles, (fileContents, fileName) => {
                        if (realm_utils_1.utils.isFunction(fileContents)) {
                            fileContents = fileContents();
                        }
                        let filePath = path.join(this.tempFolder, fileName);
                        let fileDir = path.dirname(filePath);
                        fsExtra.ensureDirSync(fileDir);
                        fs.writeFileSync(filePath, fileContents);
                    });
                }
            }
            setTempFolder() {
                return this.tempFolder;
            }
            setIncluding() {
                return collect(parser.including);
            }
            setExcluding() {
                return collect(parser.excluding);
            }
            setDepsOnly() {
                return collect(parser.depsOnly);
            }
            setEntry() {
                let keys = Object.keys(parser.entry);
                if (keys.length) {
                    return keys[0];
                }
            }
        }).then(result => {
            let data = new BundleData();
            data.homeDir = homeDir;
            data.typescriptMode = tsMode;
            data.including = result.including;
            data.excluding = result.excluding;
            data.depsOnly = result.depsOnly;
            data.entry = result.entry;
            data.standalone = parser.standalone;
            data.cache = parser.cache;
            if (result.tempFolder) {
                data.setupTempFolder(result.tempFolder);
            }
            return data;
        });
    }
}
exports.Arithmetic = Arithmetic;

});
___scope___.file("arithmetic/ArithmeticStringParser.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var STATES;
(function (STATES) {
    STATES[STATES["PENDING"] = 0] = "PENDING";
    STATES[STATES["PLUS"] = 1] = "PLUS";
    STATES[STATES["MINUS"] = 2] = "MINUS";
    STATES[STATES["CONSUMING"] = 3] = "CONSUMING";
    STATES[STATES["EXCLUDING_DEPS"] = 4] = "EXCLUDING_DEPS";
    STATES[STATES["ENTRY_POINT"] = 5] = "ENTRY_POINT";
    STATES[STATES["ONLY_DEPS"] = 6] = "ONLY_DEPS";
})(STATES || (STATES = {}));
class PropParser {
    constructor(str) {
        this.str = str;
        this.excluding = {};
        this.including = {};
        this.depsOnly = {};
        this.entry = {};
        this.states = new Set();
        this.index = -1;
        this.word = [];
        this.reset();
    }
    reset() {
        this.empty();
        this.word = [];
        this.set(STATES.PENDING);
        this.set(STATES.PLUS);
    }
    tokenReady() {
        let word = this.word.join("");
        if (!word) {
            this.reset();
            return;
        }
        let isEntry = this.has(STATES.ENTRY_POINT);
        if (this.has(STATES.ONLY_DEPS)) {
            this.depsOnly[word] = true;
        }
        else if (this.has(STATES.EXCLUDING_DEPS)) {
            if (this.has(STATES.MINUS)) {
                this.excluding[word] = false;
            }
            else {
                if (isEntry) {
                    this.entry[word] = false;
                }
                this.including[word] = false;
            }
        }
        else {
            if (this.has(STATES.MINUS)) {
                this.excluding[word] = true;
            }
            else {
                if (isEntry) {
                    this.entry[word] = true;
                }
                this.including[word] = true;
            }
        }
        return this.reset();
    }
    receive(char, last) {
        if (this.has(STATES.PENDING)) {
            if (char === "!") {
                this.standalone = false;
                return;
            }
            if (char === "^") {
                this.cache = false;
                return;
            }
            if (char === "+") {
                this.set(STATES.PLUS);
                return;
            }
            if (char === "-") {
                this.unset(STATES.PLUS);
                this.set(STATES.MINUS);
                return;
            }
            if (char === "~") {
                this.set(STATES.ONLY_DEPS);
                return;
            }
            if (char === ">") {
                this.set(STATES.ENTRY_POINT);
                return;
            }
            if (!char.match(/\s/)) {
                this.set(STATES.CONSUMING);
            }
        }
        if (this.has(STATES.CONSUMING)) {
            this.unset(STATES.PENDING);
            if (char === "[") {
                this.set(STATES.EXCLUDING_DEPS);
                return;
            }
            if (char === "~") {
                this.set(STATES.ONLY_DEPS);
                return;
            }
            if (char === "]") {
                return this.tokenReady();
            }
            if (char.match(/\s/)) {
                if (!this.has(STATES.EXCLUDING_DEPS)) {
                    return this.tokenReady();
                }
            }
            else {
                this.word.push(char);
            }
            if (last) {
                return this.tokenReady();
            }
        }
    }
    next() {
        this.index += 1;
        return this.str[this.index];
    }
    parse() {
        for (let i = 0; i < this.str.length; i++) {
            this.receive(this.str[i], i === this.str.length - 1);
        }
    }
    empty() {
        this.states = new Set();
    }
    set(...args) {
        for (let i = 0; i < args.length; i++) {
            let name = args[i];
            if (!this.states.has(name)) {
                this.states.add(name);
            }
        }
    }
    clean(...args) {
        for (let i = 0; i < args.length; i++) {
            let name = args[i];
            this.states.delete(name);
        }
    }
    has(name) {
        return this.states.has(name);
    }
    once(name) {
        let valid = this.states.has(name);
        if (valid) {
            this.states.delete(name);
        }
        return valid;
    }
    unset(...args) {
        for (let i = 0; i < args.length; i++) {
            let name = args[i];
            this.states.delete(name);
        }
    }
}
exports.PropParser = PropParser;

});
___scope___.file("BundleTestRunner.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BundleTestRunner {
    constructor(bundle, opts) {
        this.bundle = bundle;
        this.opts = opts || {};
        this.reporter = opts.reporter || "fuse-test-reporter";
        this.fuse = bundle.FuseBox;
    }
    start() {
        const FuseBoxTestRunner = this.fuse.import("fuse-test-runner").FuseBoxTestRunner;
        const runner = new FuseBoxTestRunner(this.opts);
        runner.start();
    }
}
exports.BundleTestRunner = BundleTestRunner;

});
___scope___.file("rollup/MagicalRollup.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../Utils");
const Config_1 = require("../Config");
const path = require("path");
const fs = require("fs");
const RollupFuseResolver_1 = require("../rollup/RollupFuseResolver");
const VirtualFile_1 = require("../rollup/VirtualFile");
const MissingExportsRemoval_1 = require("../rollup/MissingExportsRemoval");
class MagicalRollup {
    constructor(context) {
        this.context = context;
        if (!context.rollupOptions.entry) {
            throw new Error("rollup.entry should be present");
        }
        this.opts = context.rollupOptions;
        this.entryFile = context.rollupOptions.entry;
        this.contents = context.source.getResult().content.toString();
        this.outFile = Utils_1.ensureUserPath(context.outFile);
    }
    debug(msg) {
        this.context.debug("Rollup", msg);
    }
    parse() {
        this.debug("Launching rollup ...");
        const lines = this.contents.split(/\r?\n/);
        let defaultCollectionConsume = true;
        let files = {};
        let fileNameConsume;
        lines.forEach(line => {
            if (fileNameConsume && files[fileNameConsume]) {
                files[fileNameConsume].push(line);
            }
            if (defaultCollectionConsume) {
                const matchedName = line.match(/\/\* fuse:start-file "(.*)"\*\//);
                if (matchedName) {
                    fileNameConsume = matchedName[1];
                    files[fileNameConsume] = [];
                }
                const matchedEndName = line.match(/\/\* fuse:end-file "(.*)"\*\//);
                if (matchedEndName) {
                    fileNameConsume = false;
                }
            }
            if (line.indexOf(`/* fuse:start-collection "default"*/`) === 0) {
                defaultCollectionConsume = true;
            }
            if (line.indexOf(`/* fuse:end-collection "default"*/`) === 0) {
                defaultCollectionConsume = false;
                fileNameConsume = false;
            }
        });
        this.debug("Files reverse engineered");
        return this.rollup(files);
    }
    rollup(files) {
        const rollup = require("rollup");
        const tmpFolder = path.join(Config_1.Config.TEMP_FOLDER, "es6", encodeURIComponent(this.context.outFile), new Date().getTime().toString());
        Utils_1.ensureDir(tmpFolder);
        let virtualMap = new Map();
        for (let fname in files) {
            if (files.hasOwnProperty(fname)) {
                const contents = files[fname].join("\n");
                let file = new VirtualFile_1.VirtualFile(contents);
                virtualMap.set(fname, file);
            }
        }
        this.debug("Fixing missing imports");
        let fixer = new MissingExportsRemoval_1.MissingImportsRemoval(virtualMap);
        fixer.ensureAll();
        virtualMap.forEach((file, name) => {
            const fpath = path.join(tmpFolder, name);
            const fdir = path.dirname(fpath);
            Utils_1.ensureDir(fdir);
            fs.writeFileSync(fpath, file.generate());
        });
        this.debug("Roll Roll Roll!");
        const bundleOptions = Object.assign(this.opts.bundle, {});
        let rollupOptions = Object.assign(this.opts, {});
        delete rollupOptions.bundle;
        rollupOptions.entry = path.join(tmpFolder, rollupOptions.entry);
        rollupOptions.plugins = [
            RollupFuseResolver_1.RollupFuseResolver(this.context, tmpFolder),
        ];
        return rollup.rollup(rollupOptions).then(bundle => {
            this.debug("Generate bundle");
            const defaultOptions = Object.assign({ format: "umd" }, bundleOptions);
            var result = bundle.generate(defaultOptions);
            const ts = require("typescript");
            this.debug("Transpile to es5 with typescript");
            let transpiled = ts.transpileModule(result.code, { target: "es5" });
            this.debug(`Writing to ${this.outFile}`);
            let concat = new Utils_1.Concat(true, "", "\n");
            concat.add(null, transpiled.outputText);
            this.context.source.concat = concat;
        });
    }
}
exports.MagicalRollup = MagicalRollup;

});
___scope___.file("rollup/RollupFuseResolver.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
const PathMaster_1 = require("../core/PathMaster");
function RollupFuseResolver(context, root) {
    return {
        resolveId(importee, importer) {
            if (!importer) {
                return null;
            }
            let pm = new PathMaster_1.PathMaster(context, root);
            if (importee.indexOf("~") === 0) {
                const localFile = "." + importee.slice(1);
                let resolved = pm.resolve(localFile, root);
                return resolved.absPath;
            }
            let resolved = pm.resolve(importee, root);
            if (resolved.isNodeModule) {
                if (resolved.nodeModuleInfo && resolved.nodeModuleInfo.entry) {
                    return resolved.nodeModuleInfo.entry;
                }
            }
            const basename = path.basename(importer);
            const directory = importer.split(basename)[0];
            const dirIndexFile = path.join(directory + importee, "index.js");
            let stats;
            try {
                stats = fs_1.statSync(dirIndexFile);
            }
            catch (e) {
                return null;
            }
            if (stats.isFile()) {
                console.log("YES", dirIndexFile);
                return dirIndexFile;
            }
            return null;
        },
    };
}
exports.RollupFuseResolver = RollupFuseResolver;

});
___scope___.file("rollup/VirtualFile.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileAnalysis_1 = require("../analysis/FileAnalysis");
const ASTTraverse_1 = require("../ASTTraverse");
const escodegen = require("escodegen");
class ImportDeclaration {
    constructor(item, node, parent) {
        this.item = item;
        this.node = node;
        this.parent = parent;
        this.isDefault = false;
        this.name = item.imported && item.imported.name;
        this.localReference = node.source && node.source.value;
        this.isDefault = item.imported === undefined;
    }
    remove() {
        let specifiers = this.node.specifiers;
        let index = specifiers.indexOf(this.item);
        specifiers.splice(index, 1);
        if (specifiers.length === 0) {
            let body = this.parent.body;
            let index = body.indexOf(this.node);
            body.splice(index, 1);
        }
    }
}
exports.ImportDeclaration = ImportDeclaration;
class VirtualFile {
    constructor(contents) {
        this.contents = contents;
        this.exports = [];
        this.defaultExports = false;
        this.localImports = new Map();
        this.ast = FileAnalysis_1.acornParse(contents);
        ASTTraverse_1.ASTTraverse.traverse(this.ast, {
            pre: (node, parent, prop, idx) => {
                if (node.type === "ExportNamedDeclaration") {
                    if (node.declaration && node.declaration.id) {
                        this.exports.push(node.declaration.id.name);
                    }
                }
                if (node.type === "ExportDefaultDeclaration") {
                    if (node.declaration && node.declaration.id) {
                        this.defaultExports = true;
                    }
                }
                if (node.type === "ImportDeclaration") {
                    this.registerImportDeclaration(node, parent);
                }
            },
        });
    }
    inExports(name) {
        return this.exports.indexOf(name) > -1;
    }
    generate() {
        return escodegen.generate(this.ast);
    }
    registerImportDeclaration(node, parent) {
        if (node.source) {
            if (/^[\.~]/.test(node.source.value)) {
                let map = this.localImports.get(node.source.value) || new Map();
                node.specifiers.forEach(item => {
                    if (item.type === "ImportSpecifier") {
                        let declaration = new ImportDeclaration(item, node, parent);
                        map.set(declaration.name, declaration);
                    }
                    if (item.type === "ImportDefaultSpecifier") {
                        let declaration = new ImportDeclaration(item, node, parent);
                        map.set("@default", declaration);
                    }
                });
                this.localImports.set(node.source.value, map);
            }
        }
    }
}
exports.VirtualFile = VirtualFile;

});
___scope___.file("rollup/MissingExportsRemoval.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const Utils_1 = require("../Utils");
class MissingImportsRemoval {
    constructor(collection) {
        this.collection = collection;
    }
    ensureAll() {
        this.collection.forEach((file, fileName) => {
            const baseDir = path.dirname(fileName);
            file.localImports.forEach(imports => {
                imports.forEach((importDeclaration, localName) => {
                    let target = path.join(baseDir, importDeclaration.localReference);
                    target = Utils_1.ensureFuseBoxPath(target);
                    let file = this.findFile(target);
                    if (file) {
                        if (!file.inExports(importDeclaration.name)) {
                            importDeclaration.remove();
                        }
                    }
                });
            });
        });
    }
    findFile(userPath) {
        let file;
        const variations = [".js", "/index.js", ".jsx", "/index.jsx"];
        if (!/jsx?/.test(userPath)) {
            variations.forEach(variant => {
                let probe = userPath + variant;
                probe = probe.replace(/\/\//, "");
                if (this.collection.get(probe)) {
                    file = this.collection.get(probe);
                }
                return false;
            });
        }
        return file;
    }
}
exports.MissingImportsRemoval = MissingImportsRemoval;

});
___scope___.file("cli/cliUtils.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = require("../Log");
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
const log = new Log_1.Log({
    doLog: true,
});
exports.log = log;
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
    log,
    getOpts,
    inspector,
};

});
___scope___.file("cli/docs.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fsbx = require("../index");
const fs = require("fs");
const path = require("path");
const appRoot = require("app-root-path");
const cliUtils_1 = require("./cliUtils");
const Utils_1 = require("../Utils");
const base = appRoot.path;
const src = path.resolve(base, "./src");
const resolveSrc = file => path.resolve(src, file);
const resolveRoot = file => path.resolve(base, file);
const mds = {};
const mdKeys = [];
const plugins = Object.keys(fsbx).filter((key) => key.includes("Plugin"));
exports.plugins = plugins;
function findDocsFor(name) {
    let found = ``;
    const mdsFound = [];
    const keysFound = [];
    mdKeys.forEach(key => {
        const md = mds[key];
        const anyU = `.[\\s\\S]*?`;
        const titleToMatch = `(#{1,2}(${anyU}))`;
        const untilNextTitle = `(?!#{1,5})`;
        const untilNextHeader = `(?:^#{1,2})${untilNextTitle})`;
        const reg = new RegExp(`(${titleToMatch}(${name})(${anyU}${untilNextHeader})`, "gmi");
        const match = md.match(reg);
        if (match) {
            mdsFound.push(md);
            const spl = match[0].split(/#{1,6}/gmi).filter(line => line && line.length > 0);
            found += spl.pop();
            keysFound.push(key);
        }
    });
    console.log(cliUtils_1.inspector(found.split("\n")));
    return "";
}
exports.findDocsFor = findDocsFor;
function gatherDocs() {
    const mdFiles = Utils_1.walk(resolveRoot("./docs"));
    mdFiles.forEach(md => {
        const contents = fs.readFileSync(md, "utf8");
        const file = md.split("/").pop().replace(".md", "");
        mds[file] = contents;
        mdKeys.push(file);
    });
}
gatherDocs();
function githubSrcFor(name) {
    return `https://github.com/fuse-box/fuse-box/tree/master/src/plugins/` + name + ".ts";
}
exports.githubSrcFor = githubSrcFor;
function docsLinkFor(name) {
    return `http://fuse-box.org/#` + name.toLowerCase();
}
exports.docsLinkFor = docsLinkFor;
function codeFor(file) {
    try {
        const fileAbs = resolveSrc(file);
        const contents = fs.readFileSync(fileAbs, "utf8");
        return contents;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
exports.codeFor = codeFor;
exports.default = {
    findDocsFor,
    githubSrcFor,
    docsLinkFor,
    codeFor,
    plugins,
};

});
___scope___.file("cli/ConfigGatherer.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
class Data {
}
Data.availableDemos = {
    react: ["react-seed"],
};
Data.demos = Object.keys(Data.availableDemos);
Data.hasDemo = (view) => Data.demos.forEach(demo => demo.includes(view));
Data.choices = {
    view: [
        new inquirer.Separator(' = View / Presentation = '),
        {
            name: "React",
            value: "react",
        },
        {
            name: "Inferno",
            value: "inferno",
        },
        {
            name: "Vue",
            value: "vue",
        },
        {
            name: "Angular",
            value: "angular",
        },
        {
            name: "Other",
            value: "other",
        },
    ],
    target: [
        new inquirer.Separator(' = Environment? ='),
        {
            name: "Server",
            value: "server",
            checked: true,
        },
        {
            name: "Browser",
            value: "browser",
            checked: true,
        },
        {
            name: "Electron",
            value: "electron",
        },
    ],
    exporting: [
        {
            type: "confirm",
            name: "exporting",
            message: "Exporting anything?",
            default: false,
        },
        {
            type: "input",
            name: "pkgname",
            message: "Package name?",
            when: answers => answers.exporting,
        },
        {
            type: "input",
            name: "pkgname",
            message: "modules to export?",
            default: "*",
            when: answers => answers.exporting,
        },
    ],
    env: [
        new inquirer.Separator(' = Production? = '),
        {
            name: "DefinePlugin",
            checked: true,
        },
        {
            name: "Uglify",
            checked: true,
        },
        {
            name: "SourceMaps",
            checked: true,
        },
    ],
    syntax: [
        new inquirer.Separator(' = Syntax? = '),
        {
            name: "TypeScript",
            value: "ts",
            checked: true,
        },
        {
            name: "Babel es6",
            value: "babel",
        },
        {
            name: "None - es5",
            value: "es5",
        },
        {
            name: "CoffeeScript",
            value: "cs",
        },
        {
            name: "Other",
            value: "other",
        },
    ],
};
Data._steps = {
    aliases: {
        type: "confirm",
        name: "aliases",
        message: "Do you use aliases?",
        default: false,
    },
    target: {
        type: "checkbox",
        name: "target",
        message: "Target env(s)?",
        choices: Data.choices.target,
    },
    syntax: {
        type: "checkbox",
        name: "syntax",
        message: "Syntax used?",
        choices: Data.choices.syntax,
    },
    bundles: {
        type: "confirm",
        name: "bundles",
        message: "Multiple bundles?",
        default: false,
    },
    targetThenView: [
        {
            type: "checkbox",
            name: "target",
            message: "Env target(s)?",
            choices: Data.choices.target,
        },
        {
            type: "list",
            name: "view",
            message: "View framework?",
            choices: Data.choices.view,
            when: answers => answers.target.includes("browser"),
        },
        {
            type: "confirm",
            message: "Start with an existing demo?",
            name: "downloaddemo",
            default: false,
            when: answers => true || Data.hasDemo(answers.view),
        },
    ],
};
const choices = Data.choices;
const _steps = Data._steps;
class Builder {
    constructor(fsbx) {
        this.config = {};
        this.Fluent = {};
        this.gatherer = new Gatherer();
        this.Fluent = fsbx.Fluent;
    }
    stepper() {
        this.gatherer.stepper();
    }
}
exports.Builder = Builder;
class Gatherer {
    constructor() {
        this.data = {};
        this.steps = [];
        this.indx = 0;
    }
    stepper() {
        const steps = [
            _steps.targetThenView,
            _steps.aliases,
            choices.exporting,
            _steps.bundles,
            _steps.syntax,
        ];
        this.steps = steps;
        this.thenner();
    }
    thenner() {
        const steps = this.steps[this.indx];
        if (!steps) {
            return;
        }
        if (steps.type === "checkbox")
            steps.message += " (use [spacebar])";
        inquirer.prompt(steps).then(answers => {
            Object.assign(this.data, answers);
            this.indx++;
            setTimeout(() => this.thenner(), 1);
        });
    }
}
exports.Gatherer = Gatherer;
exports.default = Builder;

});
});

FuseBox.import("default/cli/CommandLine.js");
FuseBox.main("default/cli/CommandLine.js");
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((d||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),f=e.substring(o+1);return[a,f]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(d){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function f(e){return{"server":require(e)}}function u(e,n){var o=n.path||"./",a=n.pkg||"default",u=r(e);if(u&&(o="./",a=u[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=u[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!d&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return f(e);var s=h[a];if(!s){if(d)throw"Package not found "+a;return f(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,c=t(o,e),v=i(c),p=s.f[v];return!p&&v.indexOf("*")>-1&&(l=v),p||l||(v=t(c,"/","index.js"),p=s.f[v],p||(v=c+".js",p=s.f[v]),p||(p=s.f[c+".jsx"]),p||(v=c+"/index.jsx",p=s.f[v])),{"file":p,"wildcard":l,"pkgName":a,"versions":s.v,"filePath":c,"validPath":v}}function s(e,r){if(!d)return r(/\.(js|json)$/.test(e)?v.require(e):"");var n=new XMLHttpRequest;n.onreadystatechange=function(){if(4==n.readyState)if(200==n.status){var i=n.getResponseHeader("Content-Type"),o=n.responseText;/json/.test(i)?o="module.exports = "+o:/javascript/.test(i)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);g.dynamic(a,o),r(g.import(e,{}))}else console.error(e,"not found on request"),r(void 0)},n.open("GET",e,!0),n.send()}function l(e,r){var n=m[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=u(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@/g,"[a-z0-9$_-]+"),"i"),f=h[t.pkgName];if(f){var p={};for(var m in f.f)a.test(m)&&(p[m]=c(t.pkgName+"/"+m));return p}}if(!i){var g="function"==typeof r,x=l("async",[e,r]);if(x===!1)return;return s(e,function(e){return g?r(e):null})}var _=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var w=i.locals={},y=n(t.validPath);w.exports={},w.module={"exports":w.exports},w.require=function(e,r){return c(e,{"pkg":_,"path":y,"v":t.versions})},w.require.main={"filename":d?"./":v.require.main.filename,"paths":d?[]:v.require.main.paths};var b=[w.module.exports,w.require,w.module,t.validPath,y,_];return l("before-import",b),i.fn.apply(0,b),l("after-import",b),w.module.exports}if(e.FuseBox)return e.FuseBox;var d="undefined"!=typeof window&&window.navigator,v=d?window:global;d&&(v.global=window),e=d&&"undefined"==typeof __fbx__dnm__?e:module.exports;var p=d?window.__fsbx__=window.__fsbx__||{}:v.$fsbx=v.$fsbx||{};d||(v.require=require);var h=p.p=p.p||{},m=p.e=p.e||{},g=function(){function r(){}return r.global=function(e,r){return void 0===r?v[e]:void(v[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){m[e]=m[e]||[],m[e].push(r)},r.exists=function(e){try{var r=u(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=u(e,{}),n=h[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var f=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);f(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=h.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(h[e])return n(h[e].s);var t=h[e]={};return t.f={},t.v=r,t.s={"file":function(e,r){return t.f[e]={"fn":r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r}();return g.packages=h,g.isBrowser=void 0!==d,g.isServer=!d,g.plugins=[],e.FuseBox=g}(this))