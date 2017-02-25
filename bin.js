(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.pkg("fuse-box4-test", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var WorkflowContext_1 = require("./WorkflowContext");
exports.WorkFlowContext = WorkflowContext_1.WorkFlowContext;
var PathMaster_1 = require("./PathMaster");
exports.PathMaster = PathMaster_1.PathMaster;
var Arithmetic_1 = require("./arithmetic/Arithmetic");
exports.Arithmetic = Arithmetic_1.Arithmetic;
var ModuleCollection_1 = require("./ModuleCollection");
exports.ModuleCollection = ModuleCollection_1.ModuleCollection;
var FuseBox_1 = require("./FuseBox");
exports.FuseBox = FuseBox_1.FuseBox;

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
                            '.woff': 'application/font-woff',
                            '.woff2': 'application/font-woff2',
                            '.eot': 'application/vnd.ms-fontobject',
                            '.ttf': 'application/x-font-ttf',
                            '.otf': 'font/opentype'
                        };
                        if (fontsExtensions[ext]) {
                            let content = new Buffer(fs.readFileSync(urlFile)).toString('base64');
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
const appRoot = require("app-root-path");
const mkdirp = require("mkdirp");
const MBLACKLIST = [
    "freelist",
    "sys"
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
    mkdirp.sync(dir);
    return userPath;
}
exports.ensureUserPath = ensureUserPath;
function ensureDir(userPath) {
    if (!path.isAbsolute(userPath)) {
        userPath = path.join(appRoot.path, userPath);
    }
    userPath = path.normalize(userPath);
    mkdirp.sync(userPath);
    return userPath;
}
exports.ensureDir = ensureDir;
function removeFolder(userPath) {
    if (fs.existsSync(userPath)) {
        fs.readdirSync(userPath).forEach(function (file, index) {
            var curPath = path.join(userPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                removeFolder(curPath);
            }
            else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(userPath);
    }
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
        context.allowExtension('.styl');
    }
    transform(file) {
        const context = file.context;
        const options = Object.assign({}, this.options);
        const sourceMapDef = {
            comment: false,
            sourceRoot: file.info.absDir
        };
        file.loadContents();
        if (!stylus)
            stylus = require('stylus');
        options.filename = file.info.fuseBoxPath;
        if ('sourceMapConfig' in context) {
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
        this.test = /(\.js|\.ts)$/;
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
            let result = babelCore.transform(file.contents, this.config);
            if (result.ast) {
                file.analysis.loadAst(result.ast);
                file.analysis.analyze();
                file.contents = result.code;
                if (result.map) {
                    let sm = result.map;
                    sm.file = file.info.fuseBoxPath;
                    sm.sources = [file.info.fuseBoxPath];
                    file.sourceMap = JSON.stringify(sm);
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
            generatedFile: false
        }, options);
    }
    init(context) {
        context.allowExtension('.coffee');
    }
    transform(file) {
        file.loadContents();
        if (!coffee) {
            coffee = require('coffee-script');
        }
        return new Promise((res, rej) => {
            try {
                let options = Object.assign({}, this.options, {
                    filename: file.absPath
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
            sourceMapBasepath: '.',
            sourceMapRootpath: file.info.absDir
        };
        if (!less) {
            less = require("less");
        }
        options.filename = file.info.fuseBoxPath;
        if ('sourceMapConfig' in context) {
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
        const result = options.inject !== false ? `__fsbx_css("${resolvedPath}");` : '';
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
            file.alternativeContent = '';
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
        this.banner = banner || '';
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
        options.includePaths.push(file.info.absDir);
        return new Promise((res, rej) => {
            return sass.render(options, (err, result) => {
                if (err) {
                    return rej(err);
                }
                file.sourceMap = result.map && result.map.toString();
                file.contents = result.css.toString();
                return res(file.contents);
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
            fromString: true
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
        context.log.echoBundleStats('Bundle (Uglified)', bytes, took);
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
    }
    endCollection(collection) {
        let entry = collection.entryFile ? collection.entryFile.info.fuseBoxPath : "";
        if (entry) {
            this.collectionSource.add(null, `return ___scope___.entry = "${entry}";`);
        }
        this.collectionSource.add(null, "});");
        let key = collection.info ? `${collection.info.name}@${collection.info.version}` : "default";
        this.concat.add(`packages/${key}`, this.collectionSource.content, key === "default" ? this.collectionSource.sourceMap : undefined);
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
        this.collectionSource.add(null, file.alternativeContent !== undefined ? file.alternativeContent : file.contents, file.sourceMap);
        this.collectionSource.add(null, "});");
    }
    finalize(bundleData) {
        let entry = bundleData.entry;
        let context = this.context;
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
            let wrapper = fs.readFileSync(fuseboxLibFile).toString();
            this.concat.add(null, `(${wrapper})`);
        }
        else {
            this.concat.add(null, "()");
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
        if ('test' in options)
            this.test = options.test;
        if ('ext' in options)
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
        if ('sourceMapConfig' in this.context) {
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
                name: false
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
class RawPluginClass {
    constructor(options) {
        this.test = /.*/;
        if ('extensions' in (options || {}))
            this.extensions = options.extensions;
    }
    init(context) {
        if (Array.isArray(this.extensions)) {
            return this.extensions.forEach(ext => context.allowExtension(ext));
        }
    }
    transform(file) {
        file.loadContents();
        file.contents = `module.exports = ${JSON.stringify(file.contents)}`;
    }
}
exports.RawPluginClass = RawPluginClass;
exports.RawPlugin = (options) => {
    return new RawPluginClass(options);
};

});
___scope___.file("WorkflowContext.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const BundleSource_1 = require("./BundleSource");
const File_1 = require("./File");
const Log_1 = require("./Log");
const PathMaster_1 = require("./PathMaster");
const ModuleCache_1 = require("./ModuleCache");
const realm_utils_1 = require("realm-utils");
const EventEmitter_1 = require("./EventEmitter");
const Utils_1 = require("./Utils");
const Config_1 = require("./Config");
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
    emitJavascriptHotReload(file) {
        let content = file.contents;
        if (file.headerContent) {
            content = file.headerContent.join("\n") + "\n" + content;
        }
        this.sourceChangedEmitter.emit({
            type: "js",
            content: content,
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
        return name.replace(/\.ts$/, '.js');
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
            compilerOptions: {}
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
            this.log.echoStatus(`Typescript config:  ${configFile.replace(appRoot.path, '')}`);
            config = require(configFile);
        }
        else {
            this.log.echoStatus(`Typescript config file was not found. Improvising`);
        }
        config.compilerOptions.module = "commonjs";
        if (this.sourceMapConfig) {
            config.compilerOptions.sourceMap = true;
            config.compilerOptions.inlineSources = true;
        }
        this.loadedTsConfig = config;
        return config;
    }
    isFirstTime() {
        return this.initialLoad === true;
    }
    writeOutput(outFileWritten) {
        this.initialLoad = false;
        let res = this.source.getResult();
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
___scope___.file("File.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileAnalysis_1 = require("./FileAnalysis");
const fs = require("fs");
const realm_utils_1 = require("realm-utils");
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
            nodeModuleInfo: packageInfo
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
            this.makeAnalysis();
            return;
        }
        this.tryPlugins();
        if (!this.isLoaded) {
            throw { message: `File contents for ${this.absPath} were not loaded. Missing a plugin?` };
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
___scope___.file("FileAnalysis.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ASTTraverse_1 = require("./ASTTraverse");
const PrettyError_1 = require("./PrettyError");
const HeaderImport_1 = require("./HeaderImport");
const acorn = require("acorn");
const escodegen = require("escodegen");
require("acorn-es7")(acorn);
require("acorn-jsx/inject")(acorn);
class FileAnalysis {
    constructor(file) {
        this.file = file;
        this.wasAnalysed = false;
        this.skipAnalysis = false;
        this.fuseBoxVariable = "FuseBox";
        this.requiresRegeneration = false;
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
            this.ast = acorn.parse(this.file.contents, Object.assign({}, options || {}, {
                sourceType: "module",
                tolerant: true,
                ecmaVersion: 8,
                plugins: { es7: true, jsx: true },
                jsx: { allowNamespacedObjects: true }
            }));
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
    analyze() {
        if (this.wasAnalysed || this.skipAnalysis) {
            return;
        }
        const nativeImports = {};
        const bannedImports = {};
        let out = {
            requires: [],
            fuseBoxBundle: false,
            fuseBoxMain: undefined
        };
        let isString = (node) => {
            return node.type === "Literal" || node.type === "StringLiteral";
        };
        ASTTraverse_1.ASTTraverse.traverse(this.ast, {
            pre: (node, parent, prop, idx) => {
                if (node.type === "Identifier") {
                    if (node.name === "$fuse$") {
                        this.fuseBoxVariable = parent.object.name;
                    }
                    else {
                        if (HeaderImport_1.nativeModules.has(node.name) && !bannedImports[node.name]) {
                            const isProperty = parent.type && parent.type === "Property";
                            const isFunction = parent.type
                                && (parent.type === "FunctionExpression" ||
                                    parent.type === "FunctionDeclaration") && parent.params;
                            const isDeclaration = parent.type === "VariableDeclarator" || parent.type === "FunctionDeclaration";
                            if (isProperty || isFunction || parent && isDeclaration
                                && parent.id && parent.id.type === "Identifier" && parent.id.name === node.name) {
                                delete nativeImports[node.name];
                                if (!bannedImports[node.name]) {
                                    bannedImports[node.name] = true;
                                }
                            }
                            else {
                                nativeImports[node.name] = HeaderImport_1.nativeModules.get(node.name);
                            }
                        }
                    }
                }
                if (node.type === "MemberExpression") {
                    if (parent.type === "CallExpression") {
                        if (node.object && node.object.type === "Identifier" && node.object.name === this.fuseBoxVariable) {
                            if (node.property && node.property.type === "Identifier") {
                                if (node.property.name === "main") {
                                    if (parent.arguments) {
                                        let f = parent.arguments[0];
                                        if (f && isString(f)) {
                                            out.fuseBoxMain = f.value;
                                            out.fuseBoxBundle = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (node.type === "ImportDeclaration") {
                    if (node.source && isString(node.source)) {
                        out.requires.push(node.source.value);
                    }
                }
                if (node.type === "CallExpression" && node.callee) {
                    if (node.callee.type === "Identifier" && node.callee.name === "require") {
                        let arg1 = node.arguments[0];
                        if (isString(arg1)) {
                            let requireStatement = this.handleAliasReplacement(arg1.value);
                            arg1.value = requireStatement;
                            out.requires.push(requireStatement);
                        }
                    }
                }
            }
        });
        out.requires.forEach(name => {
            this.dependencies.push(name);
        });
        for (let nativeImportName in nativeImports) {
            if (nativeImports.hasOwnProperty(nativeImportName)) {
                const nativeImport = nativeImports[nativeImportName];
                this.dependencies.push(nativeImport.pkg);
                this.file.addHeaderContent(nativeImport.getImportStatement());
            }
        }
        if (out.fuseBoxBundle) {
            this.dependencies = [];
            this.file.isFuseBoxBundle = true;
            this.removeFuseBoxApiFromBundle();
            if (out.fuseBoxMain) {
                const externalCollection = this.file.collection.name !== this.file.context.defaultPackageName;
                if (externalCollection) {
                    this.file.collection.acceptFiles = false;
                }
                else {
                    this.file.alternativeContent = `module.exports = require("${out.fuseBoxMain}")`;
                }
            }
        }
        this.wasAnalysed = true;
        if (this.requiresRegeneration) {
            this.file.contents = escodegen.generate(this.ast);
        }
    }
    removeFuseBoxApiFromBundle() {
        let ast = this.ast;
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
                            if (param1.type === "Identifier" && param1.name === this.fuseBoxVariable) {
                                modifiedAst = callee.body;
                            }
                        }
                    }
                }
            }
        }
        if (modifiedAst) {
            this.file.contents = `(function(${this.fuseBoxVariable})${escodegen.generate(modifiedAst)})(FuseBox);`;
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
        let pre = options.pre;
        let post = options.post;
        let skipProperty = options.skipProperty;
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
___scope___.file("HeaderImport.js", function(exports, require, module, __filename, __dirname){ 

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
headerCollection.add(new HeaderImport("process", "process"));
headerCollection.add(new HeaderImport("Buffer", {
    pkg: "buffer",
    statement: `require("buffer").Buffer`
}));
headerCollection.add(new HeaderImport("http", "http"));
exports.nativeModules = headerCollection;

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
        this.echoBundleStats(header || 'Bundle', this.totalSize, took);
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
___scope___.file("PathMaster.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./Utils");
const path = require("path");
const fs = require("fs");
const Config_1 = require("./Config");
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
        let readMainFile = (folder, isCustom) => {
            let packageJSONPath = path.join(folder, "package.json");
            if (fs.existsSync(packageJSONPath)) {
                let json = require(packageJSONPath);
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
                entryFile = path.join(folder, entryFile || json.main || "index.js");
                entryRoot = path.dirname(entryFile);
                return {
                    name: name,
                    custom: isCustom,
                    root: folder,
                    missing: false,
                    entryRoot: entryRoot,
                    entry: entryFile,
                    version: json.version,
                };
            }
            let defaultEntry = path.join(folder, "index.js");
            let entryFile = fs.existsSync(defaultEntry) ? defaultEntry : undefined;
            let defaultEntryRoot = entryFile ? path.dirname(entryFile) : undefined;
            let packageExists = fs.existsSync(folder);
            return {
                name: name,
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
___scope___.file("ModuleCache.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleCollection_1 = require("./ModuleCollection");
const fs = require("fs");
const Config_1 = require("./Config");
const path = require("path");
const realm_utils_1 = require("realm-utils");
const mkdirp = require("mkdirp");
const MEMORY_CACHE = {};
class ModuleCache {
    constructor(context) {
        this.context = context;
        this.cachedDeps = {
            tree: {},
            flat: {}
        };
        this.initialize();
    }
    initialize() {
        this.cacheFolder = path.join(Config_1.Config.TEMP_FOLDER, "cache", Config_1.Config.FUSEBOX_VERSION, encodeURIComponent(`${Config_1.Config.PROJECT_FOLDER}${this.context.outFile || ""}`));
        this.staticCacheFolder = path.join(this.cacheFolder, "static");
        mkdirp.sync(this.staticCacheFolder);
        mkdirp.sync(this.cacheFolder);
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
        let data = `module.exports = { contents : ${JSON.stringify(cacheData.contents)}, 
dependencies : ${JSON.stringify(cacheData.dependencies)}, 
sourceMap : ${JSON.stringify(cacheData.sourceMap)},
headerContent : ${JSON.stringify(cacheData.headerContent)}, 
mtime : ${cacheData.mtime}
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
        let required = [];
        let operations = [];
        let cacheReset = false;
        let getAllRequired = (key, json) => {
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
        let traverse = (modules, root) => {
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
                        files: []
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
            let cacheKey = encodeURIComponent(`${info.name}@${info.version}`);
            let targetName = path.join(this.cacheFolder, cacheKey);
            MEMORY_CACHE[cacheKey] = contents;
            fs.writeFile(targetName, contents, (err) => {
                return resolve();
            });
        });
    }
}
exports.ModuleCache = ModuleCache;

});
___scope___.file("ModuleCollection.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const File_1 = require("./File");
const PathMaster_1 = require("./PathMaster");
const realm_utils_1 = require("realm-utils");
const Utils_1 = require("./Utils");
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
        this.context.triggerPluginsMethodOnce("init", [this.context], (plugin) => {
            if (plugin.dependencies) {
                plugin.dependencies.forEach(mod => {
                    this.toBeResolved.push(new File_1.File(this.context, this.pm.init(mod)));
                });
            }
        });
    }
    collectBundle(data) {
        this.bundle = data;
        this.delayedResolve = true;
        this.initPlugins();
        if (this.context.defaultEntryPoint) {
            this.entryFile = File_1.File.createByName(this, Utils_1.ensurePublicExtension(this.context.defaultEntryPoint));
        }
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
            .then(() => {
            return this.context.cache.buildMap(this);
        }).catch(e => {
            this.context.nukeCache();
            console.error(e);
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
                dispose: () => this.off(listener)
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
___scope___.file("arithmetic/Arithmetic.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArithmeticStringParser_1 = require("./ArithmeticStringParser");
const Config_1 = require("./../Config");
const realm_utils_1 = require("realm-utils");
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
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
    constructor(homeDir, typescriptMode, including, excluding, entry) {
        this.homeDir = homeDir;
        this.typescriptMode = typescriptMode;
        this.including = including;
        this.excluding = excluding;
        this.entry = entry;
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
                            data.set(files[i], {
                                deps: withDeps
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
                    this.tempFolder = path.join(Config_1.Config.TEMP_FOLDER, new Date().getTime().toString());
                    homeDir = this.tempFolder;
                    mkdirp.sync(this.tempFolder);
                    return realm_utils_1.each(virtualFiles, (fileContents, fileName) => {
                        if (realm_utils_1.utils.isFunction(fileContents)) {
                            fileContents = fileContents();
                        }
                        let filePath = path.join(this.tempFolder, fileName);
                        let fileDir = path.dirname(filePath);
                        mkdirp.sync(fileDir);
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
            setEntry() {
                let keys = Object.keys(parser.entry);
                if (keys.length) {
                    return keys[0];
                }
            }
        }).then(result => {
            let data = new BundleData(homeDir, tsMode, result.including, result.excluding, result.entry);
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
})(STATES || (STATES = {}));
class PropParser {
    constructor(str) {
        this.str = str;
        this.excluding = {};
        this.including = {};
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
        let isEntry = this.has(STATES.ENTRY_POINT);
        if (this.has(STATES.EXCLUDING_DEPS)) {
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
            if (char === "+") {
                this.set(STATES.PLUS);
                return;
            }
            if (char === "-") {
                this.unset(STATES.PLUS);
                this.set(STATES.MINUS);
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
___scope___.file("FuseBox.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Utils_1 = require("./Utils");
const ShimCollection_1 = require("./ShimCollection");
const Server_1 = require("./devServer/Server");
const JSONplugin_1 = require("./plugins/JSONplugin");
const PathMaster_1 = require("./PathMaster");
const WorkflowContext_1 = require("./WorkflowContext");
const CollectionSource_1 = require("./CollectionSource");
const Arithmetic_1 = require("./arithmetic/Arithmetic");
const ModuleCollection_1 = require("./ModuleCollection");
const path = require("path");
const realm_utils_1 = require("realm-utils");
const Config_1 = require("./Config");
const BundleTestRunner_1 = require("./testRunner/BundleTestRunner");
const process = require("process");
const HeaderImport_1 = require("./HeaderImport");
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
        this.context.debugMode = opts.debug !== undefined ? opts.debug : Utils_1.contains(process.argv, '--debug');
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
        if (opts.standaloneBundle !== undefined) {
            this.context.standaloneBundle = opts.standaloneBundle;
        }
        if (opts.sourceMap) {
            this.context.sourceMapConfig = opts.sourceMap;
        }
        if (opts.ignoreGlobal) {
            this.context.ignoreGlobal = opts.ignoreGlobal;
        }
        if (opts.outFile) {
            this.context.outFile = opts.outFile;
        }
        this.context.setHomeDir(homeDir);
        if (opts.cache !== undefined) {
            this.context.setUseCache(opts.cache);
        }
        this.virtualFiles = opts.files;
        this.context.initCache();
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
                let newConfig = Object.assign({}, this.opts, { outFile: outFile });
                let fuse = FuseBox.init(newConfig);
                return fuse.initiateBundle(bundleStr);
            });
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
                self.context.log.end();
                this.triggerEnd();
                self.context.source.finalize(bundleData);
                this.triggerPost();
                this.context.writeOutput(bundleReady);
                return self.context.source.getResult();
            });
        });
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
        const testBundleFile = path.join(Config_1.Config.TEMP_FOLDER, "tests", decodeURIComponent(this.opts.outFile));
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
const File_1 = require("./File");
const ModuleCollection_1 = require("./ModuleCollection");
class ShimCollection {
    static create(context, name, exports) {
        let entryInfo = {
            isNodeModule: false,
            fuseBoxPath: "index.js"
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
___scope___.file("devServer/Server.js", function(exports, require, module, __filename, __dirname){ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SocketServer_1 = require("./SocketServer");
const HotReloadPlugin_1 = require("./../plugins/HotReloadPlugin");
const path = require("path");
const Utils_1 = require("../Utils");
const HTTPServer_1 = require("./HTTPServer");
const realm_utils_1 = require("realm-utils");
const process = require("process");
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
        if (opts.hmr !== false) {
            this.fuse.context.plugins.push(HotReloadPlugin_1.HotReloadPlugin({ port, uri: opts.socketURI }));
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
        let wss = new ws_1.Server({ server: server });
        let ss = new SocketServer(wss, fuse);
        return ss;
    }
    static startSocketServer(port, fuse) {
        let wss = new ws_1.Server({ port: port });
        this.server = new SocketServer(wss, fuse);
        fuse.context.log.echo(`Launching socket server on ${port}`);
        return this.server;
    }
    send(type, data) {
        this.clients.forEach(client => {
            client.send(JSON.stringify({ type: type, data: data }));
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
___scope___.file("testRunner/BundleTestRunner.js", function(exports, require, module, __filename, __dirname){ 

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
return ___scope___.entry = "index.js";
});
FuseBox.defaultPackageName = "fuse-box4-test";
})
(function(e){if(e.FuseBox)return e.FuseBox;var r="undefined"!=typeof window&&window.navigator;r&&(window.global=window),e=r&&"undefined"==typeof __fbx__dnm__?e:module.exports;var n=r?window.__fsbx__=window.__fsbx__||{}:global.$fsbx=global.$fsbx||{};r||(global.require=require);var t=n.p=n.p||{},i=n.e=n.e||{},a=function(e){var n=e.charCodeAt(0),t=e.charCodeAt(1);if((r||58!==t)&&(n>=97&&n<=122||64===n)){if(64===n){var i=e.split("/"),a=i.splice(2,i.length).join("/");return[i[0]+"/"+i[1],a||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var f=e.substring(0,o),u=e.substring(o+1);return[f,u]}},o=function(e){return e.substring(0,e.lastIndexOf("/"))||"./"},f=function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var a=[],t=0,i=n.length;t<i;t++){var o=n[t];o&&"."!==o&&(".."===o?a.pop():a.push(o))}return""===n[0]&&a.unshift(""),a.join("/")||(a.length?"/":".")},u=function(e){var r=e.match(/\.(\w{1,})$/);if(r){var n=r[1];return n?e:e+".js"}return e+".js"},s=function(e){if(r){var n,t=document,i=t.getElementsByTagName("head")[0];/\.css$/.test(e)?(n=t.createElement("link"),n.rel="stylesheet",n.type="text/css",n.href=e):(n=t.createElement("script"),n.type="text/javascript",n.src=e,n.async=!0),i.insertBefore(n,i.firstChild)}},l=function(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])},c=function(e){return{server:require(e)}},v=function(e,n){var i=n.path||"./",o=n.pkg||"default",s=a(e);if(s&&(i="./",o=s[0],n.v&&n.v[o]&&(o=o+"@"+n.v[o]),e=s[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),i="./";else if(!r&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return c(e);var l=t[o];if(!l){if(r)throw'Package was not found "'+o+'"';return c(o+(e?"/"+e:""))}e||(e="./"+l.s.entry);var v,d=f(i,e),p=u(d),g=l.f[p];return!g&&p.indexOf("*")>-1&&(v=p),g||v||(p=f(d,"/","index.js"),g=l.f[p],g||(p=d+".js",g=l.f[p]),g||(g=l.f[d+".jsx"]),g||(p=d+"/index.jsx",g=l.f[p])),{file:g,wildcard:v,pkgName:o,versions:l.v,filePath:d,validPath:p}},d=function(e,n){if(!r)return n(/\.(js|json)$/.test(e)?global.require(e):"");var t;t=new XMLHttpRequest,t.onreadystatechange=function(){if(4==t.readyState)if(200==t.status){var r=t.getResponseHeader("Content-Type"),i=t.responseText;/json/.test(r)?i="module.exports = "+i:/javascript/.test(r)||(i="module.exports = "+JSON.stringify(i));var a=f("./",e);h.dynamic(a,i),n(h.import(e,{}))}else console.error(e+" was not found upon request"),n(void 0)},t.open("GET",e,!0),t.send()},p=function(e,r){var n=i[e];if(n)for(var t in n){var a=n[t].apply(null,r);if(a===!1)return!1}},g=function(e,n){if(void 0===n&&(n={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return s(e);var i=v(e,n);if(i.server)return i.server;var a=i.file;if(i.wildcard){var f=new RegExp(i.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@/g,"[a-z0-9$_-]+"),"i"),u=t[i.pkgName];if(u){var l={};for(var c in u.f)f.test(c)&&(l[c]=g(i.pkgName+"/"+c));return l}}if(!a){var h="function"==typeof n,m=p("async",[e,n]);if(m===!1)return;return d(e,function(e){if(h)return n(e)})}var x=i.validPath,_=i.pkgName;if(a.locals&&a.locals.module)return a.locals.module.exports;var w=a.locals={},y=o(x);w.exports={},w.module={exports:w.exports},w.require=function(e,r){return g(e,{pkg:_,path:y,v:i.versions})},w.require.main={filename:r?"./":global.require.main.filename,paths:r?[]:global.require.main.paths};var b=[w.module.exports,w.require,w.module,x,y,_];p("before-import",b);var j=a.fn;return j.apply(0,b),p("after-import",b),w.module.exports},h=function(){function n(){}return n.global=function(e,n){var t=r?window:global;return void 0===n?t[e]:void(t[e]=n)},n.import=function(e,r){return g(e,r)},n.on=function(e,r){i[e]=i[e]||[],i[e].push(r)},n.exists=function(e){try{var r=v(e,{});return void 0!==r.file}catch(e){return!1}},n.remove=function(e){var r=v(e,{}),n=t[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},n.main=function(e){return this.mainFile=e,n.import(e,{})},n.expose=function(r){var n=function(n){var t=r[n],i=t.alias,a=g(t.pkg);"*"===i?l(a,function(r,n){return e[r]=n}):"object"==typeof i?l(i,function(r,n){return e[n]=a[r]}):e[i]=a};for(var t in r)n(t)},n.dynamic=function(r,n,t){var i=t&&t.pkg||"default";this.pkg(i,{},function(t){t.file(r,function(r,t,i,a,o){var f=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);f(!0,r,t,i,a,o,e)})})},n.flush=function(e){var r=t.default;for(var n in r.f){var i=!e||e(n);if(i){var a=r.f[n];delete a.locals}}},n.pkg=function(e,r,n){if(t[e])return n(t[e].s);var i=t[e]={},a=i.f={};i.v=r;var o=i.s={file:function(e,r){a[e]={fn:r}}};return n(o)},n.addPlugin=function(e){this.plugins.push(e)},n}();return h.packages=t,h.isBrowser=void 0!==r,h.isServer=!r,h.plugins=[],e.FuseBox=h}(this))