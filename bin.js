(function(FuseBox) {
    FuseBox.$fuse$ = FuseBox;
    FuseBox.pkg("fuse-box4-test", {}, function(___scope___) {
        ___scope___.file("index.js", function(exports, require, module, __filename, __dirname) {

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
        ___scope___.file("plugins/VuePlugin.js", function(exports, require, module, __filename, __dirname) {

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
            exports.VuePluginClass = VuePluginClass;;
            exports.VuePlugin = (opts) => {
                return new VuePluginClass(opts);
            };

        });
        ___scope___.file("plugins/images/ImageBase64Plugin.js", function(exports, require, module, __filename, __dirname) {

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
                    } else {
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
            exports.ImageBase64PluginClass = ImageBase64PluginClass;;
            exports.ImageBase64Plugin = () => {
                return new ImageBase64PluginClass();
            };

        });
        ___scope___.file("lib/SVG2Base64.js", function(exports, require, module, __filename, __dirname) {

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
        ___scope___.file("plugins/stylesheet/CSSResourcePlugin.js", function(exports, require, module, __filename, __dirname) {
            /* fuse:injection: */
            var Buffer = require("buffer").Buffer;
            /* fuse:injection: */
            var process = require("process");
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
        ___scope___.file("Utils.js", function(exports, require, module, __filename, __dirname) {

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
                    fs.readdirSync(userPath).forEach(function(file, index) {
                        var curPath = path.join(userPath, file);
                        if (fs.lstatSync(curPath).isDirectory()) {
                            removeFolder(curPath);
                        } else {
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
                } else {
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
        ___scope___.file("lib/postcss/PostCSSResourcePlugin.js", function(exports, require, module, __filename, __dirname) {

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
            exports.PostCSSResourcePlugin = postcss.plugin("css-resource", function(opts) {
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
        ___scope___.file("plugins/HotReloadPlugin.js", function(exports, require, module, __filename, __dirname) {

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
                init() {}
                bundleEnd(context) {
                    context.source.addContent(`FuseBox.import("fusebox-hot-reload").connect(${this.port}, ${JSON.stringify(this.uri)})`);
                }
            }
            exports.HotReloadPluginClass = HotReloadPluginClass;;
            exports.HotReloadPlugin = (opts) => {
                return new HotReloadPluginClass(opts);
            };

        });
        ___scope___.file("plugins/EnvPlugin.js", function(exports, require, module, __filename, __dirname) {

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
        ___scope___.file("plugins/ConcatPlugin.js", function(exports, require, module, __filename, __dirname) {

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
            exports.ConcatPluginClass = ConcatPluginClass;;
            exports.ConcatPlugin = (opts) => {
                return new ConcatPluginClass(opts);
            };

        });
        ___scope___.file("plugins/stylesheet/StylusPlugin.js", function(exports, require, module, __filename, __dirname) {

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
        ___scope___.file("plugins/stylesheet/PostCSSPlugin.js", function(exports, require, module, __filename, __dirname) {
            /* fuse:injection: */
            var process = require("process");
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
        ___scope___.file("plugins/TypeScriptHelpers.js", function(exports, require, module, __filename, __dirname) {

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
        ___scope___.file("Config.js", function(exports, require, module, __filename, __dirname) {
            /* fuse:injection: */
            var process = require("process");
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
        ___scope___.file("plugins/images/SVGPlugin.js", function(exports, require, module, __filename, __dirname) {

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
            exports.SVGSimplePlugin = SVGSimplePlugin;;
            exports.SVGPlugin = () => {
                return new SVGSimplePlugin();
            };

        });
        ___scope___.file("plugins/js-transpilers/BabelPlugin.js", function(exports, require, module, __filename, __dirname) {

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
            exports.BabelPluginClass = BabelPluginClass;;
            exports.BabelPlugin = (opts) => {
                return new BabelPluginClass(opts);
            };

        });
        ___scope___.file("plugins/js-transpilers/CoffeePlugin.js", function(exports, require, module, __filename, __dirname) {

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
                        } catch (err) {
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
        ___scope___.file("plugins/stylesheet/LESSPlugin.js", function(exports, require, module, __filename, __dirname) {

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
        ___scope___.file("plugins/stylesheet/CSSplugin.js", function(exports, require, module, __filename, __dirname) {

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
                    const resolvedPath = realm_utils_1.utils.isFunction(options.inject) ?
                        options.inject(file.info.fuseBoxPath) : file.info.fuseBoxPath;
                    const result = options.inject !== false ? `__fsbx_css("${resolvedPath}");` : '';
                    if (alternative) {
                        file.alternativeContent = result;
                    } else {
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
                    } else {
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
                        } else {
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
                    } else {
                        let safeContents = JSON.stringify(file.contents);
                        let serve = false;
                        if (this.writeOptions) {
                            const writeResult = CSSPluginDeprecated_1.CSSPluginDeprecated.writeOptions(this.writeOptions, file);
                            if (writeResult) {
                                return writeResult;
                            }
                        } else {
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
                        } else {
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
        ___scope___.file("plugins/stylesheet/CSSPluginDeprecated.js", function(exports, require, module, __filename, __dirname) {

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
        ___scope___.file("plugins/HTMLplugin.js", function(exports, require, module, __filename, __dirname) {

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
                    } else {
                        file.contents = `module.exports =  ${JSON.stringify(file.contents)}`;
                    }
                    if (context.useCache) {
                        context.emitJavascriptHotReload(file);
                        context.cache.writeStaticCache(file, file.sourceMap);
                    }
                }
            }
            exports.FuseBoxHTMLPlugin = FuseBoxHTMLPlugin;;
            exports.HTMLPlugin = (opts) => {
                return new FuseBoxHTMLPlugin(opts);
            };

        });
        ___scope___.file("plugins/JSONplugin.js", function(exports, require, module, __filename, __dirname) {

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
            exports.FuseBoxJSONPlugin = FuseBoxJSONPlugin;;
            exports.JSONPlugin = () => {
                return new FuseBoxJSONPlugin();
            };

        });
        ___scope___.file("plugins/BannerPlugin.js", function(exports, require, module, __filename, __dirname) {

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
        ___scope___.file("plugins/stylesheet/SassPlugin.js", function(exports, require, module, __filename, __dirname) {

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
        ___scope___.file("plugins/UglifyJSPlugin.js", function(exports, require, module, __filename, __dirname) {
            /* fuse:injection: */
            var process = require("process");
            /* fuse:injection: */
            var Buffer = require("buffer").Buffer;
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
        ___scope___.file("BundleSource.js", function(exports, require, module, __filename, __dirname) {

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
                    if (file.info.isRemoteFile || file.notFound ||
                        file.collection && file.collection.acceptFiles === false) {
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
                    } else {
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
        ___scope___.file("plugins/SourceMapPlainJsPlugin.js", function(exports, require, module, __filename, __dirname) {

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
                    } else {
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
        ___scope___.file("plugins/RawPlugin.js", function(exports, require, module, __filename, __dirname) {

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
        ___scope___.file("WorkflowContext.js", function(exports, require, module, __filename, __dirname) {

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
                getHeaderImportsConfiguration() {}
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
                    };;
                    if (this.tsConfig) {
                        configFile = Utils_1.ensureUserPath(this.tsConfig);
                    } else {
                        url = path.join(this.homeDir, "tsconfig.json");
                        let tsconfig = Utils_1.findFileBackwards(url, appRoot.path);
                        if (tsconfig) {
                            configFile = tsconfig;
                        }
                    }
                    if (configFile) {
                        this.log.echoStatus(`Typescript config:  ${configFile.replace(appRoot.path, '')}`);
                        config = require(configFile);
                    } else {
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
                        fs.writeFile(target, res.sourceMap, () => {});
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
        ___scope___.file("File.js", function(exports, require, module, __filename, __dirname) {

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
                                } else {
                                    itemTest = el.test;
                                }
                            } else {
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
                            } else {
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
        ___scope___.file("FileAnalysis.js", function(exports, require, module, __filename, __dirname) {

            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            const ASTTraverse_1 = require("./ASTTraverse");
            const PrettyError_1 = require("./PrettyError");
            const HeaderImport_1 = require("./HeaderImport");
            const acorn = require("acorn");
            const escodegen = require("escodegen");
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
                            ecmaVersion: '2018',
                            plugins: { jsx: true },
                            jsx: { allowNamespacedObjects: true }
                        }));
                    } catch (err) {
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
                                } else {
                                    if (HeaderImport_1.nativeModules.has(node.name) && !bannedImports[node.name]) {
                                        const isProperty = parent.type && parent.type === "Property";
                                        const isFunction = parent.type &&
                                            (parent.type === "FunctionExpression" ||
                                                parent.type === "FunctionDeclaration") && parent.params;
                                        const isDeclaration = parent.type === "VariableDeclarator" || parent.type === "FunctionDeclaration";
                                        if (isProperty || isFunction || parent && isDeclaration &&
                                            parent.id && parent.id.type === "Identifier" && parent.id.name === node.name) {
                                            delete nativeImports[node.name];
                                            if (!bannedImports[node.name]) {
                                                bannedImports[node.name] = true;
                                            }
                                        } else {
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
                            } else {
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
        ___scope___.file("ASTTraverse.js", function(exports, require, module, __filename, __dirname) {

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
                                } else {
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
        ___scope___.file("PrettyError.js", function(exports, require, module, __filename, __dirname) {
            /* fuse:injection: */
            var process = require("process");
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
                            } else {
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
        ___scope___.file("HeaderImport.js", function(exports, require, module, __filename, __dirname) {

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
                    } else {
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
                headerCollection = new HeaderImportCollection();;
            }
            headerCollection.add(new HeaderImport("process", "process"));
            headerCollection.add(new HeaderImport("Buffer", {
                pkg: "buffer",
                statement: `require("buffer").Buffer`
            }));
            headerCollection.add(new HeaderImport("http", "http"));
            exports.nativeModules = headerCollection;

        });
        ___scope___.file("Log.js", function(exports, require, module, __filename, __dirname) {
            /* fuse:injection: */
            var process = require("process");
            /* fuse:injection: */
            var Buffer = require("buffer").Buffer;
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
        ___scope___.file("PathMaster.js", function(exports, require, module, __filename, __dirname) {

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
                        } else {
                            data.nodeModuleInfo = nodeModuleInfo;
                            this.context.setLibInfo(nodeModuleInfo.name, nodeModuleInfo.version, nodeModuleInfo);
                        }
                        if (info.target) {
                            data.absPath = this.getAbsolutePath(info.target, data.nodeModuleInfo.root, undefined, true);
                            data.absDir = path.dirname(data.absPath);
                            data.nodeModuleExplicitOriginal = info.target;
                        } else {
                            data.absPath = data.nodeModuleInfo.entry;
                            data.absDir = data.nodeModuleInfo.root;
                        }
                        if (data.absPath) {
                            data.fuseBoxPath = this.getFuseBoxPath(data.absPath, data.nodeModuleInfo.root);
                        }
                    } else {
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
                        } else {
                            let fileNameCheck = this.checkFileName(root, name);
                            if (fileNameCheck) {
                                return fileNameCheck;
                            } else {
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
                        } else {
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
        ___scope___.file("ModuleCache.js", function(exports, require, module, __filename, __dirname) {

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
                        } catch (e) {
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
                    } else {
                        let dest = path.join(this.staticCacheFolder, fileName);
                        if (fs.existsSync(dest)) {
                            try {
                                data = require(dest);
                            } catch (e) {
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
                        } else {
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
                            } else {
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
                                    } else {
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
                        fs.writeFile(this.cacheFile, JSON.stringify(json, undefined, 2), () => {});
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
        ___scope___.file("ModuleCollection.js", function(exports, require, module, __filename, __dirname) {

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
                    } else {
                        collection = this.context.getNodeModule(moduleName);
                    }
                    if (info.custom) {
                        this.conflictingVersions.set(info.name, info.version);
                    }
                    this.nodeModules.set(moduleName, collection);
                    return file.info.nodeModuleExplicitOriginal && collection.pm ?
                        collection.resolve(new File_1.File(this.context, collection.pm.init(file.info.absPath))) :
                        collection.resolveEntry();
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
                        return this.delayedResolve ?
                            this.toBeResolved.push(file) :
                            this.resolveNodeModule(file);
                    } else {
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
        ___scope___.file("EventEmitter.js", function(exports, require, module, __filename, __dirname) {

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
        ___scope___.file("arithmetic/Arithmetic.js", function(exports, require, module, __filename, __dirname) {

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
                        } else {
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
        ___scope___.file("arithmetic/ArithmeticStringParser.js", function(exports, require, module, __filename, __dirname) {

            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            var STATES;
            (function(STATES) {
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
                        } else {
                            if (isEntry) {
                                this.entry[word] = false;
                            }
                            this.including[word] = false;
                        }
                    } else {
                        if (this.has(STATES.MINUS)) {
                            this.excluding[word] = true;
                        } else {
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
                        } else {
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
        ___scope___.file("FuseBox.js", function(exports, require, module, __filename, __dirname) {

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
                            path.isAbsolute(opts.modulesFolder) ?
                            opts.modulesFolder : path.join(appRoot.path, opts.modulesFolder);
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
                        } else {
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
        ___scope___.file("ShimCollection.js", function(exports, require, module, __filename, __dirname) {

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
        ___scope___.file("devServer/Server.js", function(exports, require, module, __filename, __dirname) {

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
                    const root = opts.root !== undefined ?
                        (realm_utils_1.utils.isString(opts.root) ? Utils_1.ensureUserPath(opts.root) : false) : rootDir;
                    const port = opts.port || 4444;
                    if (opts.hmr !== false) {
                        this.fuse.context.plugins.push(HotReloadPlugin_1.HotReloadPlugin({ port, uri: opts.socketURI }));
                    }
                    let emitter = realm_utils_1.utils.isFunction(opts.emitter) ? opts.emitter : false;
                    this.httpServer = new HTTPServer_1.HTTPServer(this.fuse);
                    process.nextTick(() => {
                        if (opts.httpServer === false) {
                            SocketServer_1.SocketServer.startSocketServer(port, this.fuse);
                        } else {
                            this.httpServer.launch({ root, port });
                        }
                        this.socketServer = SocketServer_1.SocketServer.getInstance();
                        this.fuse.context.sourceChangedEmitter.on((info) => {
                            if (this.fuse.context.isFirstTime() === false) {
                                this.fuse.context.log.echo(`Source changed for ${info.path}`);
                                if (emitter) {
                                    emitter(this, info);
                                } else {
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
        ___scope___.file("devServer/SocketServer.js", function(exports, require, module, __filename, __dirname) {

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
                onMessage(client, type, data) {};
            }
            exports.SocketServer = SocketServer;

        });
        ___scope___.file("devServer/HTTPServer.js", function(exports, require, module, __filename, __dirname) {

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
        ___scope___.file("CollectionSource.js", function(exports, require, module, __filename, __dirname) {

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
        ___scope___.file("testRunner/BundleTestRunner.js", function(exports, require, module, __filename, __dirname) {

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
                    const FuseBoxTestRunner = this.fuse.import("fuse-test-runner").FuseBoxTestRunner

                    const runner = new FuseBoxTestRunner(this.opts);
                    runner.start();
                }
            }
            exports.BundleTestRunner = BundleTestRunner;

        });
        return ___scope___.entry = "index.js";
    });
    FuseBox.pkg("fuse-test-runner", {}, function(___scope___) {
        ___scope___.file("dist/commonjs/index.js", function(exports, require, module, __filename, __dirname) {

            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            var FuseBoxTestRunner_1 = require("./FuseBoxTestRunner");
            exports.FuseBoxTestRunner = FuseBoxTestRunner_1.FuseBoxTestRunner;
            var Should_1 = require("./Should");
            exports.should = Should_1.should;

        });
        ___scope___.file("dist/commonjs/FuseBoxTestRunner.js", function(exports, require, module, __filename, __dirname) {
            /* fuse:injection: */
            var process = require("process");
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            const Awaiting_1 = require("./Awaiting");
            const realm_utils_1 = require("realm-utils");
            const Exception_1 = require("./Exception");
            const Reporter_1 = require("./Reporter");
            const systemProps = ["before", "beforeAll", "afterAll", 'beforeEach', 'after', 'afterEach'];
            const $isSystemProp = (name) => {
                return systemProps.indexOf(name) > -1;
            };
            const $isPromise = (item) => {
                return item &&
                    typeof item.then === 'function' &&
                    typeof item.catch === 'function';
            };
            class FuseBoxTestRunner {
                constructor(opts) {
                    this.startTime = new Date().getTime();
                    this.doExit = false;
                    this.failed = false;
                    let reporterPath = opts.reporterPath || "fuse-test-reporter";
                    let reportLib = FuseBox.import(reporterPath);
                    this.doExit = FuseBox.isServer && opts.exit === true;
                    if (reportLib.default) {
                        this.reporter = new Reporter_1.Reporter(reportLib.default);
                    }
                }
                finish() {
                    if (this.doExit) {
                        process.exit(this.failed ? 1 : 0);
                    }
                }
                start() {
                    const tests = FuseBox.import("*.test.js");
                    this.reporter.initialize(tests);
                    return realm_utils_1.each(tests, (moduleExports, name) => {
                        return this.startFile(name, moduleExports);
                    }).then((res) => {
                        const reportResult = this.reporter.endTest(res, new Date().getTime() - this.startTime);
                        if (realm_utils_1.utils.isPromise(reportResult)) {
                            reportResult.then(x => this.finish())
                                .catch(e => {
                                    console.error(e.stack || e);
                                });
                        } else {
                            this.finish();
                        }
                    }).catch(e => {
                        console.error(e.stack || e);
                    });
                }
                convertToReadableName(str) {
                    if (str.match(/\s+/)) {
                        return str;
                    }
                    let prev;
                    let word = [];
                    let words = [];
                    let addWord = () => {
                        if (word.length) {
                            words.push(word.join('').toLowerCase());
                        }
                    };
                    for (let i = 0; i < str.length; i++) {
                        let char = str.charAt(i);
                        if (char === "_" || char === " ") {
                            if (word.length) {
                                addWord();
                                word = [];
                            }
                        } else {
                            if (char.toUpperCase() === char) {
                                addWord();
                                word = [char];
                            } else {
                                word.push(char);
                            }
                            if (i == str.length - 1) {
                                addWord();
                            }
                        }
                    }
                    let sentence = words.join(' ');
                    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
                }
                extractInstructions(obj) {
                    let props = Object.getOwnPropertyNames(obj.constructor.prototype);
                    let instructions = {
                        methods: [],
                        suites: {}
                    };
                    if (realm_utils_1.utils.isPlainObject(obj.suites)) {
                        instructions.suites = obj.suites;
                    }
                    for (var i = 1; i < props.length; i++) {
                        let propertyName = props[i];
                        if (systemProps.indexOf(propertyName) == -1) {
                            instructions.methods.push(propertyName);
                        } else {
                            if (typeof obj[propertyName] === "function") {
                                instructions[propertyName] = true;
                            }
                        }
                    }
                    return instructions;
                }
                hasCallback(func) {
                    return /^(function\s*)?([a-z0-9$_]+\s*)?\((.+)\)/.test(func.toString());
                }
                createEvalFunction(obj, method) {
                    return () => {
                        return new Promise((resolve, reject) => {
                            let awaiter = new Awaiting_1.Awaiting();
                            awaiter.start(resolve, reject);
                            const func = obj[method];
                            const hasCallback = this.hasCallback(func);
                            if (hasCallback) {
                                func((error) => {
                                    if (error) {
                                        return awaiter.resolveError(error);
                                    }
                                    return awaiter.resolveSuccess();
                                });
                            } else {
                                let result;
                                try {
                                    result = func();
                                } catch (e) {
                                    return awaiter.resolveError(e);
                                }
                                if ($isPromise(result)) {
                                    return result.then(() => {
                                        awaiter.resolveSuccess();
                                    }).catch((e) => {
                                        awaiter.resolveError(e);
                                    });
                                } else {
                                    return awaiter.resolveSuccess();
                                }
                            }
                        });
                    };
                }
                startFile(filename, moduleExports) {
                    const report = {};
                    this.reporter.startFile(filename);
                    return realm_utils_1.each(moduleExports, (obj, key) => {
                        if (key[0] === "_") {
                            return;
                        }
                        report[key] = {
                            title: this.convertToReadableName(key),
                            items: []
                        };
                        this.reporter.startClass(filename, report[key]);
                        return this.createTasks(filename, key, obj).then(items => {
                            report[key].tasks = items;
                        }).then(() => {
                            this.reporter.endClass(filename, report[key]);
                        });
                    }).then(() => {
                        return report;
                    });
                }
                createTasks(filename, className, obj) {
                    let instance = new obj();
                    let instructions = this.extractInstructions(instance);
                    let tasks = [];
                    if (instructions["before"]) {
                        tasks.push({
                            method: "before",
                            fn: this.createEvalFunction(instance, "before")
                        });
                    }
                    instructions.methods.forEach(methodName => {
                        if (!$isSystemProp(methodName)) {
                            if (instructions["beforeEach"]) {
                                tasks.push({
                                    method: "beforeEach",
                                    fn: this.createEvalFunction(instance, "beforeEach")
                                });
                            }
                            tasks.push({
                                method: methodName,
                                title: this.convertToReadableName(methodName),
                                fn: this.createEvalFunction(instance, methodName)
                            });
                            if (instructions["afterEach"]) {
                                tasks.push({
                                    method: "afterEach",
                                    fn: this.createEvalFunction(instance, "afterEach")
                                });
                            }
                        }
                    });
                    if (instructions["after"]) {
                        tasks.push({
                            method: "after",
                            fn: this.createEvalFunction(instance, "after")
                        });
                    }
                    return this.runTasks(filename, className, tasks);
                }
                runTasks(filename, className, tasks) {
                    const size = tasks.length;
                    let current = 0;
                    return realm_utils_1.each(tasks, (item) => {
                        return new Promise((resolve, reject) => {
                            return item.fn().then((data) => {
                                let report = {
                                    item: item,
                                    data: data
                                };
                                if (!data.success) {
                                    this.failed = true;
                                }
                                if (!$isSystemProp(item.method)) {
                                    this.reporter.testCase(report);
                                }
                                return resolve(report);
                            }).catch((e) => {
                                let error;
                                if (e instanceof Exception_1.Exception) {
                                    error = e;
                                    error.filename = filename;
                                    error.className = className;
                                    error.methodName = item.method;
                                    error.title = item.title;
                                }
                                let report = {
                                    item: item,
                                    error: error || e
                                };
                                this.reporter.testCase(report);
                                return resolve(report);
                            });
                        });
                    });
                }
            }
            exports.FuseBoxTestRunner = FuseBoxTestRunner;

        });
        ___scope___.file("dist/commonjs/Awaiting.js", function(exports, require, module, __filename, __dirname) {

            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            const Exception_1 = require("./Exception");
            const $nextTick = (fn) => {
                return setTimeout(() => {
                    fn();
                }, 1);
            };
            class Awaiting {
                constructor() {
                    this.timeSince = 0;
                    this.timeStart = new Date().getTime();
                }
                start(successFn, rejectFn, timeout = 2000) {
                    this.successFn = successFn;
                    this.rejectFn = rejectFn;
                    this.timeout = timeout;
                    this.poll();
                }
                poll() {
                    $nextTick(() => {
                        this.timeSince = new Date().getTime() - this.timeStart;
                        if (this.timeSince >= this.timeout) {
                            this.resolveError(new Exception_1.Exception("Timeout error"));
                        }
                        if (this.rejectObject) {
                            return this.rejectFn(this.rejectObject);
                        }
                        if (this.resolved) {
                            return this.successFn(this.resolved);
                        } else {
                            this.poll();
                        }
                    });
                }
                reject(obj) {
                    this.rejectObject = obj || { message: "Rejected" };
                }
                resolveSuccess() {
                    this.resolved = {
                        ms: this.timeSince,
                        success: true
                    };
                }
                resolveError(e) {
                    this.resolved = {
                        ms: this.timeSince,
                        error: e || true
                    };
                }
                resolve(obj) {
                    this.resolved = obj;
                }
            }
            exports.Awaiting = Awaiting;

        });
        ___scope___.file("dist/commonjs/Exception.js", function(exports, require, module, __filename, __dirname) {

            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            class Exception extends Error {
                constructor(message) {
                    super(message);
                    this.message = message;
                }
            }
            exports.Exception = Exception;

        });
        ___scope___.file("dist/commonjs/Reporter.js", function(exports, require, module, __filename, __dirname) {

            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            const realm_utils_1 = require("realm-utils");
            class Reporter {
                constructor(target) {
                    this.target = target;
                    if (target) {
                        this.userReporter = new target();
                    }
                }
                proxy(name, args) {
                    let properArgs = [];
                    for (let i in args) {
                        if (args.hasOwnProperty(i)) {
                            properArgs.push(args[i]);
                        }
                    }
                    if (this.userReporter && realm_utils_1.utils.isFunction(this.userReporter[name])) {
                        this.userReporter[name].apply(this.userReporter, properArgs);
                    }
                }
                initialize(...args) {
                    this.proxy("initialize", args);
                }
                startFile(...args) {
                    this.proxy("startFile", args);
                }
                endTest(...args) {
                    return this.proxy("endTest", args);
                }
                endFile(...args) {
                    this.proxy("endFIle", args);
                }
                startClass(...args) {
                    this.proxy("startClass", args);
                }
                endClass(...args) {
                    this.proxy("endClass", args);
                }
                testCase(report) {
                    this.proxy("testCase", arguments);
                }
            }
            exports.Reporter = Reporter;

        });
        ___scope___.file("dist/commonjs/Should.js", function(exports, require, module, __filename, __dirname) {

            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            const Exception_1 = require("./Exception");
            const realm_utils_1 = require("realm-utils");
            class ShouldInstance {
                constructor(obj) {
                    this.obj = obj;
                }
                equal(expected) {
                    if (this.obj !== expected) {
                        throw new Exception_1.Exception(`Expected ${this.obj} to equal ${expected}`);
                    }
                    return this;
                }
                notEqual(expected) {
                    if (this.obj === expected) {
                        throw new Exception_1.Exception(`Expected ${this.obj} to not equal ${expected}`);
                    }
                    return this;
                }
                match(exp) {
                    this.beString();
                    if (!exp.test(this.obj)) {
                        throw new Exception_1.Exception(`Expected ${this.obj} to match ${exp}`);
                    }
                    return this;
                }
                findString(target) {
                    this.beString();
                    if (this.obj.indexOf(target) === -1) {
                        throw new Exception_1.Exception(`Expected ${this.obj} to have ${target}`);
                    }
                    return this;
                }
                notFindString(target) {
                    this.beString();
                    if (this.obj.indexOf(target) > -1) {
                        throw new Exception_1.Exception(`Expected ${this.obj} not to have ${target}`);
                    }
                    return this;
                }
                okay() {
                    if (this.obj === undefined || this.obj === null) {
                        throw new Exception_1.Exception(`Expected ${this.obj} to be not undefined or null`);
                    }
                    return this;
                }
                haveLength(expected) {
                    this.okay();
                    if (this.obj.length === undefined) {
                        throw new Exception_1.Exception(`Expected ${this.obj} to have length, got undefined`);
                    }
                    if (expected !== undefined) {
                        if (this.obj.length !== expected) {
                            throw new Exception_1.Exception(`Expected ${this.obj} to have length of ${expected}. Got ${this.obj.length}`);
                        }
                    }
                    return this;
                }
                haveLengthGreater(expected) {
                    this.haveLength();
                    if (this.obj.length <= expected) {
                        throw new Exception_1.Exception(`Expected ${this.obj} length be greater than ${expected}. Got ${this.obj.length}`);
                    }
                    return this;
                }
                haveLengthGreaterEqual(expected) {
                    this.haveLength();
                    if (!(this.obj.length >= expected)) {
                        throw new Exception_1.Exception(`Expected ${this.obj} length be greater or equal than ${expected}. Got ${this.obj.length}`);
                    }
                    return this;
                }
                haveLengthLess(expected) {
                    this.haveLength();
                    if (!(this.obj.length < expected)) {
                        throw new Exception_1.Exception(`Expected ${this.obj} length be less than ${expected}. Got ${this.obj.length}`);
                    }
                    return this;
                }
                haveLengthLessEqual(expected) {
                    this.haveLength();
                    if (!(this.obj.length <= expected)) {
                        throw new Exception_1.Exception(`Expected ${this.obj} length be less or equal than ${expected}. Got ${this.obj.length}`);
                    }
                    return this;
                }
                throwException(fn) {
                    try {
                        fn();
                        throw { __exception_test__: true };
                    } catch (e) {
                        if (e && e.__exception_test__) {
                            throw new Exception_1.Exception(`Expected exception did not occur`);
                        }
                    }
                }
                deepEqual(expected) {
                    function $deepEqual(a, b) {
                        if ((typeof a == 'object' && a != null) &&
                            (typeof b == 'object' && b != null)) {
                            var count = [0, 0];
                            for (var key in a)
                                count[0]++;
                            for (var key in b)
                                count[1]++;
                            if (count[0] - count[1] != 0) {
                                return false;
                            }
                            for (var key in a) {
                                if (!(key in b) || !$deepEqual(a[key], b[key])) {
                                    return false;
                                }
                            }
                            for (var key in b) {
                                if (!(key in a) || !$deepEqual(b[key], a[key])) {
                                    return false;
                                }
                            }
                            return true;
                        } else {
                            return a === b;
                        }
                    }
                    const result = $deepEqual(this.obj, expected);
                    if (result === false) {
                        throw new Exception_1.Exception(`Expected the original
${JSON.stringify(this.obj, null, 2)} 
to be deep equal to 
${JSON.stringify(expected, null, 2)}`);
                    }
                    return this;
                }
                beTrue() {
                    if (this.obj !== true) {
                        throw new Exception_1.Exception(`Expected ${this.obj} to be true, got ${this.obj}`);
                    }
                    return this;
                }
                beFalse() {
                    if (this.obj !== false) {
                        throw new Exception_1.Exception(`Expected ${this.obj} to be false, got ${this.obj}`);
                    }
                    return this;
                }
                beString() {
                    if (!realm_utils_1.utils.isString(this.obj)) {
                        throw new Exception_1.Exception(`Expected ${this.obj} to be a string, Got ${typeof this.obj}`);
                    }
                    return this;
                }
                beArray() {
                    if (!realm_utils_1.utils.isArray(this.obj)) {
                        throw new Exception_1.Exception(`Expected ${this.obj} to be an array, Got ${typeof this.obj}`);
                    }
                    return this;
                }
                beObject() {
                    if (!realm_utils_1.utils.isObject(this.obj)) {
                        throw new Exception_1.Exception(`Expected ${this.obj} to be an obj, Got ${typeof this.obj}`);
                    }
                    return this;
                }
                bePlainObject() {
                    if (!realm_utils_1.utils.isPlainObject(this.obj)) {
                        throw new Exception_1.Exception(`Expected ${this.obj} to be a plain object, Got ${typeof this.obj}`);
                    }
                    return this;
                }
                bePromise() {
                    if (!realm_utils_1.utils.isPromise(this.obj)) {
                        throw new Exception_1.Exception(`Expected ${this.obj} to be a promise, Got ${typeof this.obj}`);
                    }
                    return this;
                }
                beFunction() {
                    if (!realm_utils_1.utils.isFunction(this.obj)) {
                        throw new Exception_1.Exception(`Expected ${this.obj} to be a function, Got ${typeof this.obj}`);
                    }
                    return this;
                }
                beNumber() {
                    if (typeof this.obj !== "number") {
                        throw new Exception_1.Exception(`Expected ${this.obj} to be a number, Got ${typeof this.obj}`);
                    }
                    return this;
                }
                beBoolean() {
                    if (typeof this.obj !== "boolean") {
                        throw new Exception_1.Exception(`Expected ${this.obj} to be a boolean, Got ${typeof this.obj}`);
                    }
                    return this;
                }
                beUndefined() {
                    if (this.obj !== undefined) {
                        throw new Exception_1.Exception(`Expected ${this.obj} to be a undefined, Got ${typeof this.obj}`);
                    }
                    return this;
                }
            }
            exports.ShouldInstance = ShouldInstance;
            exports.should = (obj) => {
                return new ShouldInstance(obj);
            };

        });
        return ___scope___.entry = "dist/commonjs/index.js";
    });
    FuseBox.pkg("realm-utils", {}, function(___scope___) {
        ___scope___.file("dist/commonjs/index.js", function(exports, require, module, __filename, __dirname) {

            "use strict";

            var each_1 = require('./each');
            exports.each = each_1.Each;
            var chain_1 = require('./chain');
            exports.chain = chain_1.Chain;
            exports.Chainable = chain_1.Chainable;
            var utils_1 = require('./utils');
            exports.utils = utils_1.Utils;
        });
        ___scope___.file("dist/commonjs/each.js", function(exports, require, module, __filename, __dirname) {

            "use strict";

            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) { return typeof obj; } : function(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

            var _slicedToArray = function() {
                function sliceIterator(arr, i) {
                    var _arr = [];
                    var _n = true;
                    var _d = false;
                    var _e = undefined;
                    try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) {
                        _d = true;
                        _e = err;
                    } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } }
                    return _arr;
                }
                return function(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };
            }();

            var utils_1 = require('./utils');
            exports.Each = function(argv, cb) {
                return new Promise(function(resolve, reject) {
                    var results = [];
                    var isObject = utils_1.Utils.isPlainObject(argv);
                    var isMap = utils_1.Utils.isMap(argv);
                    var isSet = utils_1.Utils.isSet(argv);
                    if (!argv) {
                        return resolve(results);
                    }
                    if (isMap || isSet) {
                        var _ret = function() {
                            var iterator = void 0;
                            if (isMap) {
                                var map = argv;
                                iterator = map.entries();
                            }
                            if (isSet) {
                                var set = argv;
                                iterator = set.values();
                            }
                            var index = -1;
                            var iterateMap = function iterateMap(data) {
                                index++;
                                if (data.done) {
                                    return resolve(results);
                                }
                                var k = void 0,
                                    v = void 0,
                                    res = void 0;
                                if (isMap) {
                                    var _data$value = _slicedToArray(data.value, 2);

                                    k = _data$value[0];
                                    v = _data$value[1];

                                    res = cb.apply(undefined, [v, k]);
                                }
                                if (isSet) {
                                    v = data.value;
                                    res = cb(v);
                                }
                                if (utils_1.Utils.isPromise(res)) {
                                    res.then(function(a) {
                                        results.push(a);
                                        iterateMap(iterator.next());
                                    }).catch(reject);
                                } else {
                                    results.push(res);
                                    iterateMap(iterator.next());
                                }
                            };
                            iterateMap(iterator.next());
                            return {
                                v: void 0
                            };
                        }();

                        if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
                    }
                    var dataLength = isObject ? Object.keys(argv).length : argv.length;
                    var index = -1;
                    var iterate = function iterate() {
                        index++;
                        if (index < dataLength) {
                            var key = isObject ? Object.keys(argv)[index] : index;
                            var value = isObject ? argv[key] : argv[index];
                            if (utils_1.Utils.isPromise(value)) {
                                value.then(function(data) {
                                    results.push(data);
                                    iterate();
                                }).catch(reject);
                            } else {
                                var res = cb.apply(undefined, [value, key]);
                                if (utils_1.Utils.isPromise(res)) {
                                    res.then(function(a) {
                                        results.push(a);
                                        iterate();
                                    }).catch(reject);
                                } else {
                                    results.push(res);
                                    iterate();
                                }
                            }
                        } else return resolve(results);
                    };
                    return iterate();
                });
            };
        });
        ___scope___.file("dist/commonjs/utils.js", function(exports, require, module, __filename, __dirname) {

            "use strict";

            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) { return typeof obj; } : function(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

            var _createClass = function() {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function(Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; };
            }();

            function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

            var funcProto = Function.prototype;
            var objectProto = Object.prototype;
            var funcToString = funcProto.toString;
            var hasOwnProperty = objectProto.hasOwnProperty;
            var objectCtorString = funcToString.call(Object);
            var objectToString = objectProto.toString;
            var objectTag = '[object Object]';
            var funcTag = '[object Function]';
            var funcTag2 = '[Function]';
            var genTag = '[object GeneratorFunction]';

            var Utils = function() {
                function Utils() {
                    _classCallCheck(this, Utils);
                }

                _createClass(Utils, null, [{
                    key: 'isPromise',
                    value: function isPromise(item) {
                        return item && typeof item.then === 'function' && typeof item.catch === 'function';
                    }
                }, {
                    key: 'isNotSet',
                    value: function isNotSet(input) {
                        return input === undefined || input === null;
                    }
                }, {
                    key: 'isMap',
                    value: function isMap(input) {
                        if (typeof Map === "undefined") {
                            return false;
                        }
                        return input instanceof Map;
                    }
                }, {
                    key: 'isSet',
                    value: function isSet(input) {
                        if (typeof Set === "undefined") {
                            return false;
                        }
                        return input instanceof Set;
                    }
                }, {
                    key: 'isFunction',
                    value: function isFunction(value) {
                        var tag = this.isObject(value) ? objectToString.call(value) : '';
                        return tag === funcTag2 || tag == funcTag || tag == genTag;
                    }
                }, {
                    key: 'isObject',
                    value: function isObject(input) {
                        var type = typeof input === 'undefined' ? 'undefined' : _typeof(input);
                        return !!input && (type == 'object' || type == 'function');
                    }
                }, {
                    key: 'isHostObject',
                    value: function isHostObject(value) {
                        var result = false;
                        if (value != null && typeof value.toString != 'function') {
                            try {
                                result = !!(value + '');
                            } catch (e) {}
                        }
                        return result;
                    }
                }, {
                    key: 'overArg',
                    value: function overArg(func, transform) {
                        return function(arg) {
                            return func(transform(arg));
                        };
                    }
                }, {
                    key: 'isObjectLike',
                    value: function isObjectLike(value) {
                        return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
                    }
                }, {
                    key: 'flatten',
                    value: function flatten(data) {
                        return [].concat.apply([], data);
                    }
                }, {
                    key: 'setHiddenProperty',
                    value: function setHiddenProperty(obj, key, value) {
                        Object.defineProperty(obj, key, {
                            enumerable: false,
                            value: value
                        });
                        return value;
                    }
                }, {
                    key: 'isString',
                    value: function isString(value) {
                        return typeof value === 'string';
                    }
                }, {
                    key: 'isArray',
                    value: function isArray(input) {
                        return Array.isArray(input);
                    }
                }, {
                    key: 'isPlainObject',
                    value: function isPlainObject(value) {
                        if (!this.isObjectLike(value) || objectToString.call(value) != objectTag || this.isHostObject(value)) {
                            return false;
                        }
                        var proto = this.overArg(Object.getPrototypeOf, Object)(value);
                        if (proto === null) {
                            return true;
                        }
                        var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
                        return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
                    }
                }, {
                    key: 'getParameterNamesFromFunction',
                    value: function getParameterNamesFromFunction(func) {
                        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
                        var ARGUMENT_NAMES = /([^\s,]+)/g;
                        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
                        var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
                        if (result === null) result = [];
                        return result;
                    }
                }]);

                return Utils;
            }();

            exports.Utils = Utils;
        });
        ___scope___.file("dist/commonjs/chain.js", function(exports, require, module, __filename, __dirname) {

            "use strict";

            var _createClass = function() {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function(Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; };
            }();

            function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

            var utils_1 = require('./utils');
            var each_1 = require('./each');

            var Chainable = function() {
                function Chainable() {
                    _classCallCheck(this, Chainable);

                    this.$finalized = false;
                    this.$killed = false;
                    this.$collection = {};
                }

                _createClass(Chainable, [{
                    key: 'break',
                    value: function _break(manual) {
                        this.$finalized = true;
                        this.$manual = manual;
                    }
                }, {
                    key: 'kill',
                    value: function kill() {
                        this.$finalized = true;
                        this.$killed = true;
                    }
                }]);

                return Chainable;
            }();

            exports.Chainable = Chainable;
            var ChainClassContructor = function ChainClassContructor(input) {
                if (input instanceof Chainable) {
                    return input;
                }
                var instance = {};
                if (utils_1.Utils.isFunction(input)) {
                    instance = new input();
                    if (instance instanceof Chainable) {
                        return instance;
                    }
                } else if (utils_1.Utils.isObject(input)) {
                    instance = input;
                } else {
                    throw new Error("Chain requires a Class or an Instance");
                }
                instance['$collection'] = {};
                instance['break'] = function(manual) {
                    utils_1.Utils.setHiddenProperty(instance, '$finalized', true);
                    utils_1.Utils.setHiddenProperty(instance, '$manual', manual);
                };
                instance['kill'] = function() {
                    utils_1.Utils.setHiddenProperty(instance, '$finalized', true);
                    utils_1.Utils.setHiddenProperty(instance, '$killed', true);
                };
                return instance;
            };
            exports.Chain = function(cls) {
                var instance = ChainClassContructor(cls);
                var props = Object.getOwnPropertyNames(instance.constructor.prototype);
                var tasks = [];
                for (var i = 1; i < props.length; i++) {
                    var propertyName = props[i];
                    if (!(propertyName in ["format", 'kill', 'break'])) {
                        var isSetter = propertyName.match(/^set(.*)$/);
                        var setterName = null;
                        if (isSetter) {
                            setterName = isSetter[1];
                            setterName = setterName.charAt(0).toLowerCase() + setterName.slice(1);
                        }
                        tasks.push({
                            prop: propertyName,
                            setter: setterName
                        });
                    }
                }
                var store = function store(prop, val) {
                    instance.$collection[prop] = val;
                    instance[prop] = val;
                };
                var evaluate = function evaluate(task) {
                    var result = instance[task.prop].apply(instance);
                    if (task.setter) {
                        if (utils_1.Utils.isPromise(result)) {
                            return result.then(function(res) {
                                store(task.setter, res);
                            });
                        } else store(task.setter, result);
                    }
                    return result;
                };
                return each_1.Each(tasks, function(task) {
                    return !instance.$finalized ? evaluate(task) : false;
                }).then(function() {
                    if (utils_1.Utils.isFunction(instance["format"])) {
                        return evaluate({
                            prop: "format"
                        });
                    }
                }).then(function(specialFormat) {
                    if (instance.$killed) return;
                    if (!instance.$manual) {
                        if (specialFormat) return specialFormat;
                        return instance.$collection;
                    } else return instance.$manual;
                });
            };
        });
        return ___scope___.entry = "dist/commonjs/index.js";
    });
    FuseBox.pkg("process", {}, function(___scope___) {
        ___scope___.file("index.js", function(exports, require, module, __filename, __dirname) {

            // From https://github.com/defunctzombie/node-process/blob/master/browser.js
            // shim for using process in browser
            if (FuseBox.isServer) {
                if (typeof __process_env__ !== "undefined") {
                    Object.assign(global.process.env, __process_env__);
                }
                module.exports = global.process;
            } else {
                require("object-assign-polyfill");
                var productionEnv = false; //require('@system-env').production;

                var process = module.exports = {};
                var queue = [];
                var draining = false;
                var currentQueue;
                var queueIndex = -1;

                function cleanUpNextTick() {
                    draining = false;
                    if (currentQueue.length) {
                        queue = currentQueue.concat(queue);
                    } else {
                        queueIndex = -1;
                    }
                    if (queue.length) {
                        drainQueue();
                    }
                }

                function drainQueue() {
                    if (draining) {
                        return;
                    }
                    var timeout = setTimeout(cleanUpNextTick);
                    draining = true;

                    var len = queue.length;
                    while (len) {
                        currentQueue = queue;
                        queue = [];
                        while (++queueIndex < len) {
                            if (currentQueue) {
                                currentQueue[queueIndex].run();
                            }
                        }
                        queueIndex = -1;
                        len = queue.length;
                    }
                    currentQueue = null;
                    draining = false;
                    clearTimeout(timeout);
                }

                process.nextTick = function(fun) {
                    var args = new Array(arguments.length - 1);
                    if (arguments.length > 1) {
                        for (var i = 1; i < arguments.length; i++) {
                            args[i - 1] = arguments[i];
                        }
                    }
                    queue.push(new Item(fun, args));
                    if (queue.length === 1 && !draining) {
                        setTimeout(drainQueue, 0);
                    }
                };

                // v8 likes predictible objects
                function Item(fun, array) {
                    this.fun = fun;
                    this.array = array;
                }
                Item.prototype.run = function() {
                    this.fun.apply(null, this.array);
                };
                process.title = 'browser';
                process.browser = true;
                process.env = {
                    NODE_ENV: productionEnv ? 'production' : 'development'
                };
                if (typeof __process_env__ !== "undefined") {
                    Object.assign(process.env, __process_env__);
                }
                process.argv = [];
                process.version = ''; // empty string to avoid regexp issues
                process.versions = {};

                function noop() {}

                process.on = noop;
                process.addListener = noop;
                process.once = noop;
                process.off = noop;
                process.removeListener = noop;
                process.removeAllListeners = noop;
                process.emit = noop;

                process.binding = function(name) {
                    throw new Error('process.binding is not supported');
                };

                process.cwd = function() { return '/' };
                process.chdir = function(dir) {
                    throw new Error('process.chdir is not supported');
                };
                process.umask = function() { return 0; };

            }
        });
        return ___scope___.entry = "index.js";
    });
    FuseBox.pkg("object-assign-polyfill", {}, function(___scope___) {
        ___scope___.file("index.js", function(exports, require, module, __filename, __dirname) {

            if (typeof Object.assign != 'function') {
                Object.assign = function(target, varArgs) { // .length of function is 2
                    'use strict';
                    if (target == null) { // TypeError if undefined or null
                        throw new TypeError('Cannot convert undefined or null to object');
                    }

                    var to = Object(target);

                    for (var index = 1; index < arguments.length; index++) {
                        var nextSource = arguments[index];

                        if (nextSource != null) { // Skip over if undefined or null
                            for (var nextKey in nextSource) {
                                // Avoid bugs when hasOwnProperty is shadowed
                                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                    to[nextKey] = nextSource[nextKey];
                                }
                            }
                        }
                    }
                    return to;
                };
            }
        });
        return ___scope___.entry = "index.js";
    });
    FuseBox.pkg("fuse-test-reporter", {}, function(___scope___) {
        ___scope___.file("index.js", function(exports, require, module, __filename, __dirname) {
            /* fuse:injection: */
            var process = require("process");
            "use strict";
            const realm_utils_1 = require("realm-utils");
            let ansi, cursor;
            if (FuseBox.isServer) {
                ansi = require("ansi");
                cursor = ansi(process.stdout);
            }
            const $indentString = (str, amount) => {
                let lines = str.split(/\r?\n/);
                let newLines = [];
                let emptySpace = "";
                for (let i = 0; i < amount; i++) {
                    emptySpace += " ";
                }
                for (let i = 0; i < lines.length; i++) {
                    newLines.push(emptySpace + lines[i]);
                }
                return newLines.join('\n');
            };
            const $printCategory = (title) => {
                if (cursor) {
                    cursor.write(' ')
                        .bold().write(`\n   ${title} ______________________ `)
                        .bg.reset();
                    cursor.write("\n");
                    cursor.reset();
                }
            };
            const $printSubCategory = (title) => {
                if (cursor) {
                    cursor.write('    ').bold().brightBlack().write(`${title} →`);
                    cursor.write("\n");
                    cursor.reset();
                }
            };
            const $printLine = () => {
                if (cursor) {
                    cursor.write("\n");
                    cursor.reset();
                }
            };
            const $printCaseSuccess = (name) => {
                if (cursor) {
                    cursor.green().write(`      ✓ `)
                        .brightBlack().write(name);
                    cursor.write("\n");
                    cursor.reset();
                }
            };
            const $printCaseError = (name, message) => {
                if (cursor) {
                    cursor.red().bold().write(`      ✗ `)
                        .red().write(name);
                    cursor.write("\n");
                    cursor.reset();
                    if (message) {
                        cursor.white().write($indentString(message, 10));
                        cursor.write("\n");
                    }
                    cursor.reset();
                }
            };
            const $printHeading = (fileAmount) => {
                if (cursor) {
                    cursor.yellow()
                        .bold().write(`> Launching tests ... `);
                    cursor.write("\n");
                    cursor.write(`> Found ${fileAmount} files`);
                    cursor.write("\n");
                    cursor.reset();
                }
            };
            const $printStats = (data, took) => {
                if (cursor) {
                    const amount = data.length;
                    let totalTasks = 0;
                    let failed = 0;
                    let passed = 0;
                    realm_utils_1.each(data, items => {
                        realm_utils_1.each(items, (info, item) => {
                            totalTasks += info.tasks.length;
                            realm_utils_1.each(info.tasks, (task) => {

                                if (task.data.success) {
                                    passed++;
                                }
                                if (task.data.error) {
                                    failed++;
                                }
                            });
                        });
                    });
                    cursor.write("\n");
                    cursor.write("   ☞ ");
                    cursor.write("\n   ");
                    cursor.green().write(` ${passed} passed `);
                    cursor.reset();
                    if (failed > 0) {
                        cursor.write(" ");
                        cursor.bold().red().write(` ${failed} failed `);
                        cursor.reset();
                        cursor.brightBlack().write(` (${took}ms)`);
                        cursor.write("\n   ");
                        cursor.reset();
                        cursor.write("\n");
                    } else {
                        cursor.brightBlack().write(` (${took}ms)`).reset();
                    }
                    cursor.reset();
                }
            };
            class FuseBoxTestReporter {
                constructor() {}
                initialize(tests) {
                    const amount = Object.keys(tests).length;
                    $printHeading(amount);
                }
                startFile(name) {
                    $printCategory(name);
                }
                startClass(name, item) {
                    $printSubCategory(item.title);
                }
                endClass() {}
                testCase(report) {

                    if (report.data.success) {
                        $printCaseSuccess(report.item.title || report.item.method);
                    } else {
                        let message = report.data.error.message ? report.data.error.message : report.data.error;
                        console.log(report);
                        $printCaseError(report.item.title || report.item.method, message);
                    }
                }
                endTest(stats, took) {
                    $printStats(stats, took);
                    console.log("");
                }
            }
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.default = FuseBoxTestReporter;
        });
        return ___scope___.entry = "index.js";
    });
    FuseBox.pkg("ansi", {}, function(___scope___) {
        ___scope___.file("lib/ansi.js", function(exports, require, module, __filename, __dirname) {


            /**
             * References:
             *
             *   - http://en.wikipedia.org/wiki/ANSI_escape_code
             *   - http://www.termsys.demon.co.uk/vtansi.htm
             *
             */

            /**
             * Module dependencies.
             */

            var emitNewlineEvents = require('./newlines'),
                prefix = '\x1b[' // For all escape codes
                ,
                suffix = 'm' // Only for color codes

            /**
             * The ANSI escape sequences.
             */

            var codes = {
                up: 'A',
                down: 'B',
                forward: 'C',
                back: 'D',
                nextLine: 'E',
                previousLine: 'F',
                horizontalAbsolute: 'G',
                eraseData: 'J',
                eraseLine: 'K',
                scrollUp: 'S',
                scrollDown: 'T',
                savePosition: 's',
                restorePosition: 'u',
                queryPosition: '6n',
                hide: '?25l',
                show: '?25h'
            }

            /**
             * Rendering ANSI codes.
             */

            var styles = {
                bold: 1,
                italic: 3,
                underline: 4,
                inverse: 7
            }

            /**
             * The negating ANSI code for the rendering modes.
             */

            var reset = {
                bold: 22,
                italic: 23,
                underline: 24,
                inverse: 27
            }

            /**
             * The standard, styleable ANSI colors.
             */

            var colors = {
                white: 37,
                black: 30,
                blue: 34,
                cyan: 36,
                green: 32,
                magenta: 35,
                red: 31,
                yellow: 33,
                grey: 90,
                brightBlack: 90,
                brightRed: 91,
                brightGreen: 92,
                brightYellow: 93,
                brightBlue: 94,
                brightMagenta: 95,
                brightCyan: 96,
                brightWhite: 97
            }


            /**
             * Creates a Cursor instance based off the given `writable stream` instance.
             */

            function ansi(stream, options) {
                if (stream._ansicursor) {
                    return stream._ansicursor
                } else {
                    return stream._ansicursor = new Cursor(stream, options)
                }
            }
            module.exports = exports = ansi

            /**
             * The `Cursor` class.
             */

            function Cursor(stream, options) {
                if (!(this instanceof Cursor)) {
                    return new Cursor(stream, options)
                }
                if (typeof stream != 'object' || typeof stream.write != 'function') {
                    throw new Error('a valid Stream instance must be passed in')
                }

                // the stream to use
                this.stream = stream

                // when 'enabled' is false then all the functions are no-ops except for write()
                this.enabled = options && options.enabled
                if (typeof this.enabled === 'undefined') {
                    this.enabled = stream.isTTY
                }
                this.enabled = !!this.enabled

                // then `buffering` is true, then `write()` calls are buffered in
                // memory until `flush()` is invoked
                this.buffering = !!(options && options.buffering)
                this._buffer = []

                // controls the foreground and background colors
                this.fg = this.foreground = new Colorer(this, 0)
                this.bg = this.background = new Colorer(this, 10)

                // defaults
                this.Bold = false
                this.Italic = false
                this.Underline = false
                this.Inverse = false

                // keep track of the number of "newlines" that get encountered
                this.newlines = 0
                emitNewlineEvents(stream)
                stream.on('newline', function() {
                    this.newlines++
                }.bind(this))
            }
            exports.Cursor = Cursor

            /**
             * Helper function that calls `write()` on the underlying Stream.
             * Returns `this` instead of the write() return value to keep
             * the chaining going.
             */

            Cursor.prototype.write = function(data) {
                if (this.buffering) {
                    this._buffer.push(arguments)
                } else {
                    this.stream.write.apply(this.stream, arguments)
                }
                return this
            }

            /**
             * Buffer `write()` calls into memory.
             *
             * @api public
             */

            Cursor.prototype.buffer = function() {
                this.buffering = true
                return this
            }

            /**
             * Write out the in-memory buffer.
             *
             * @api public
             */

            Cursor.prototype.flush = function() {
                this.buffering = false
                var str = this._buffer.map(function(args) {
                    if (args.length != 1) throw new Error('unexpected args length! ' + args.length);
                    return args[0];
                }).join('');
                this._buffer.splice(0); // empty
                this.write(str);
                return this
            }


            /**
             * The `Colorer` class manages both the background and foreground colors.
             */

            function Colorer(cursor, base) {
                this.current = null
                this.cursor = cursor
                this.base = base
            }
            exports.Colorer = Colorer

            /**
             * Write an ANSI color code, ensuring that the same code doesn't get rewritten.
             */

            Colorer.prototype._setColorCode = function setColorCode(code) {
                var c = String(code)
                if (this.current === c) return
                this.cursor.enabled && this.cursor.write(prefix + c + suffix)
                this.current = c
                return this
            }


            /**
             * Set up the positional ANSI codes.
             */

            Object.keys(codes).forEach(function(name) {
                var code = String(codes[name])
                Cursor.prototype[name] = function() {
                    var c = code
                    if (arguments.length > 0) {
                        c = toArray(arguments).map(Math.round).join(';') + code
                    }
                    this.enabled && this.write(prefix + c)
                    return this
                }
            })

            /**
             * Set up the functions for the rendering ANSI codes.
             */

            Object.keys(styles).forEach(function(style) {
                var name = style[0].toUpperCase() + style.substring(1),
                    c = styles[style],
                    r = reset[style]

                Cursor.prototype[style] = function() {
                    if (this[name]) return this
                    this.enabled && this.write(prefix + c + suffix)
                    this[name] = true
                    return this
                }

                Cursor.prototype['reset' + name] = function() {
                    if (!this[name]) return this
                    this.enabled && this.write(prefix + r + suffix)
                    this[name] = false
                    return this
                }
            })

            /**
             * Setup the functions for the standard colors.
             */

            Object.keys(colors).forEach(function(color) {
                var code = colors[color]

                Colorer.prototype[color] = function() {
                    this._setColorCode(this.base + code)
                    return this.cursor
                }

                Cursor.prototype[color] = function() {
                    return this.foreground[color]()
                }
            })

            /**
             * Makes a beep sound!
             */

            Cursor.prototype.beep = function() {
                this.enabled && this.write('\x07')
                return this
            }

            /**
             * Moves cursor to specific position
             */

            Cursor.prototype.goto = function(x, y) {
                x = x | 0
                y = y | 0
                this.enabled && this.write(prefix + y + ';' + x + 'H')
                return this
            }

            /**
             * Resets the color.
             */

            Colorer.prototype.reset = function() {
                this._setColorCode(this.base + 39)
                return this.cursor
            }

            /**
             * Resets all ANSI formatting on the stream.
             */

            Cursor.prototype.reset = function() {
                this.enabled && this.write(prefix + '0' + suffix)
                this.Bold = false
                this.Italic = false
                this.Underline = false
                this.Inverse = false
                this.foreground.current = null
                this.background.current = null
                return this
            }

            /**
             * Sets the foreground color with the given RGB values.
             * The closest match out of the 216 colors is picked.
             */

            Colorer.prototype.rgb = function(r, g, b) {
                var base = this.base + 38,
                    code = rgb(r, g, b)
                this._setColorCode(base + ';5;' + code)
                return this.cursor
            }

            /**
             * Same as `cursor.fg.rgb(r, g, b)`.
             */

            Cursor.prototype.rgb = function(r, g, b) {
                return this.foreground.rgb(r, g, b)
            }

            /**
             * Accepts CSS color codes for use with ANSI escape codes.
             * For example: `#FF000` would be bright red.
             */

            Colorer.prototype.hex = function(color) {
                return this.rgb.apply(this, hex(color))
            }

            /**
             * Same as `cursor.fg.hex(color)`.
             */

            Cursor.prototype.hex = function(color) {
                return this.foreground.hex(color)
            }


            // UTIL FUNCTIONS //

            /**
             * Translates a 255 RGB value to a 0-5 ANSI RGV value,
             * then returns the single ANSI color code to use.
             */

            function rgb(r, g, b) {
                var red = r / 255 * 5,
                    green = g / 255 * 5,
                    blue = b / 255 * 5
                return rgb5(red, green, blue)
            }

            /**
             * Turns rgb 0-5 values into a single ANSI color code to use.
             */

            function rgb5(r, g, b) {
                var red = Math.round(r),
                    green = Math.round(g),
                    blue = Math.round(b)
                return 16 + (red * 36) + (green * 6) + blue
            }

            /**
             * Accepts a hex CSS color code string (# is optional) and
             * translates it into an Array of 3 RGB 0-255 values, which
             * can then be used with rgb().
             */

            function hex(color) {
                var c = color[0] === '#' ? color.substring(1) : color,
                    r = c.substring(0, 2),
                    g = c.substring(2, 4),
                    b = c.substring(4, 6)
                return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)]
            }

            /**
             * Turns an array-like object into a real array.
             */

            function toArray(a) {
                var i = 0,
                    l = a.length,
                    rtn = []
                for (; i < l; i++) {
                    rtn.push(a[i])
                }
                return rtn
            }

        });
        ___scope___.file("lib/newlines.js", function(exports, require, module, __filename, __dirname) {


            /**
             * Accepts any node Stream instance and hijacks its "write()" function,
             * so that it can count any newlines that get written to the output.
             *
             * When a '\n' byte is encountered, then a "newline" event will be emitted
             * on the stream, with no arguments. It is up to the listeners to determine
             * any necessary deltas required for their use-case.
             *
             * Ex:
             *
             *   var cursor = ansi(process.stdout)
             *     , ln = 0
             *   process.stdout.on('newline', function () {
             *    ln++
             *   })
             */

            /**
             * Module dependencies.
             */

            var assert = require('assert')
            var NEWLINE = '\n'.charCodeAt(0)

            function emitNewlineEvents(stream) {
                if (stream._emittingNewlines) {
                    // already emitting newline events
                    return
                }

                var write = stream.write

                stream.write = function(data) {
                    // first write the data
                    var rtn = write.apply(stream, arguments)

                    if (stream.listeners('newline').length > 0) {
                        var len = data.length,
                            i = 0
                            // now try to calculate any deltas
                        if (typeof data == 'string') {
                            for (; i < len; i++) {
                                processByte(stream, data.charCodeAt(i))
                            }
                        } else {
                            // buffer
                            for (; i < len; i++) {
                                processByte(stream, data[i])
                            }
                        }
                    }

                    return rtn
                }

                stream._emittingNewlines = true
            }
            module.exports = emitNewlineEvents


            /**
             * Processes an individual byte being written to a stream
             */

            function processByte(stream, b) {
                assert.equal(typeof b, 'number')
                if (b === NEWLINE) {
                    stream.emit('newline')
                }
            }

        });
        return ___scope___.entry = "lib/ansi.js";
    });
    FuseBox.pkg("assert", {}, function(___scope___) {
        ___scope___.file("index.js", function(exports, require, module, __filename, __dirname) {

            /*
             * From https://github.com/defunctzombie/commonjs-assert/blob/master/assert.js
             */

            // http://wiki.commonjs.org/wiki/Unit_Testing/1.0
            //
            // Originally from narwhal.js (http://narwhaljs.org)
            // Copyright (c) 2009 Thomas Robinson <280north.com>
            //
            // Permission is hereby granted, free of charge, to any person obtaining a copy
            // of this software and associated documentation files (the 'Software'), to
            // deal in the Software without restriction, including without limitation the
            // rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
            // sell copies of the Software, and to permit persons to whom the Software is
            // furnished to do so, subject to the following conditions:
            //
            // The above copyright notice and this permission notice shall be included in
            // all copies or substantial portions of the Software.
            //
            // THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            // AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
            // ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
            // WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

            // when used in node, this will actually load the util module we depend on
            // versus loading the builtin util module as happens otherwise
            // this is a bug in node module loading as far as I am concerned
            var util = require('util');

            var pSlice = Array.prototype.slice;
            var hasOwn = Object.prototype.hasOwnProperty;

            // 1. The assert module provides functions that throw
            // AssertionError's when particular conditions are not met. The
            // assert module must conform to the following interface.

            var assert = module.exports = ok;

            // 2. The AssertionError is defined in assert.
            // new assert.AssertionError({ message: message,
            //                             actual: actual,
            //                             expected: expected })

            assert.AssertionError = function AssertionError(options) {
                this.name = 'AssertionError';
                this.actual = options.actual;
                this.expected = options.expected;
                this.operator = options.operator;
                if (options.message) {
                    this.message = options.message;
                    this.generatedMessage = false;
                } else {
                    this.message = getMessage(this);
                    this.generatedMessage = true;
                }
                var stackStartFunction = options.stackStartFunction || fail;

                if (Error.captureStackTrace) {
                    Error.captureStackTrace(this, stackStartFunction);
                } else {
                    // non v8 browsers so we can have a stacktrace
                    var err = new Error();
                    if (err.stack) {
                        var out = err.stack;

                        // try to strip useless frames
                        var fn_name = stackStartFunction.name;
                        var idx = out.indexOf('\n' + fn_name);
                        if (idx >= 0) {
                            // once we have located the function frame
                            // we need to strip out everything before it (and its line)
                            var next_line = out.indexOf('\n', idx + 1);
                            out = out.substring(next_line + 1);
                        }

                        this.stack = out;
                    }
                }
            };

            // assert.AssertionError instanceof Error
            util.inherits(assert.AssertionError, Error);

            function replacer(key, value) {
                if (util.isUndefined(value)) {
                    return '' + value;
                }
                if (util.isNumber(value) && !isFinite(value)) {
                    return value.toString();
                }
                if (util.isFunction(value) || util.isRegExp(value)) {
                    return value.toString();
                }
                return value;
            }

            function truncate(s, n) {
                if (util.isString(s)) {
                    return s.length < n ? s : s.slice(0, n);
                } else {
                    return s;
                }
            }

            function getMessage(self) {
                return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
                    self.operator + ' ' +
                    truncate(JSON.stringify(self.expected, replacer), 128);
            }

            // At present only the three keys mentioned above are used and
            // understood by the spec. Implementations or sub modules can pass
            // other keys to the AssertionError's constructor - they will be
            // ignored.

            // 3. All of the following functions must throw an AssertionError
            // when a corresponding condition is not met, with a message that
            // may be undefined if not provided.  All assertion methods provide
            // both the actual and expected values to the assertion error for
            // display purposes.

            function fail(actual, expected, message, operator, stackStartFunction) {
                throw new assert.AssertionError({
                    message: message,
                    actual: actual,
                    expected: expected,
                    operator: operator,
                    stackStartFunction: stackStartFunction
                });
            }

            // EXTENSION! allows for well behaved errors defined elsewhere.
            assert.fail = fail;

            // 4. Pure assertion tests whether a value is truthy, as determined
            // by !!guard.
            // assert.ok(guard, message_opt);
            // This statement is equivalent to assert.equal(true, !!guard,
            // message_opt);. To test strictly for the value true, use
            // assert.strictEqual(true, guard, message_opt);.

            function ok(value, message) {
                if (!value) fail(value, true, message, '==', assert.ok);
            }
            assert.ok = ok;

            // 5. The equality assertion tests shallow, coercive equality with
            // ==.
            // assert.equal(actual, expected, message_opt);

            assert.equal = function equal(actual, expected, message) {
                if (actual != expected) fail(actual, expected, message, '==', assert.equal);
            };

            // 6. The non-equality assertion tests for whether two objects are not equal
            // with != assert.notEqual(actual, expected, message_opt);

            assert.notEqual = function notEqual(actual, expected, message) {
                if (actual == expected) {
                    fail(actual, expected, message, '!=', assert.notEqual);
                }
            };

            // 7. The equivalence assertion tests a deep equality relation.
            // assert.deepEqual(actual, expected, message_opt);

            assert.deepEqual = function deepEqual(actual, expected, message) {
                if (!_deepEqual(actual, expected)) {
                    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
                }
            };

            function _deepEqual(actual, expected) {
                // 7.1. All identical values are equivalent, as determined by ===.
                if (actual === expected) {
                    return true;

                } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
                    if (actual.length != expected.length) return false;

                    for (var i = 0; i < actual.length; i++) {
                        if (actual[i] !== expected[i]) return false;
                    }

                    return true;

                    // 7.2. If the expected value is a Date object, the actual value is
                    // equivalent if it is also a Date object that refers to the same time.
                } else if (util.isDate(actual) && util.isDate(expected)) {
                    return actual.getTime() === expected.getTime();

                    // 7.3 If the expected value is a RegExp object, the actual value is
                    // equivalent if it is also a RegExp object with the same source and
                    // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
                } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
                    return actual.source === expected.source &&
                        actual.global === expected.global &&
                        actual.multiline === expected.multiline &&
                        actual.lastIndex === expected.lastIndex &&
                        actual.ignoreCase === expected.ignoreCase;

                    // 7.4. Other pairs that do not both pass typeof value == 'object',
                    // equivalence is determined by ==.
                } else if (!util.isObject(actual) && !util.isObject(expected)) {
                    return actual == expected;

                    // 7.5 For all other Object pairs, including Array objects, equivalence is
                    // determined by having the same number of owned properties (as verified
                    // with Object.prototype.hasOwnProperty.call), the same set of keys
                    // (although not necessarily the same order), equivalent values for every
                    // corresponding key, and an identical 'prototype' property. Note: this
                    // accounts for both named and indexed properties on Arrays.
                } else {
                    return objEquiv(actual, expected);
                }
            }

            function isArguments(object) {
                return Object.prototype.toString.call(object) == '[object Arguments]';
            }

            function objEquiv(a, b) {
                if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
                    return false;
                // an identical 'prototype' property.
                if (a.prototype !== b.prototype) return false;
                // if one is a primitive, the other must be same
                if (util.isPrimitive(a) || util.isPrimitive(b)) {
                    return a === b;
                }
                var aIsArgs = isArguments(a),
                    bIsArgs = isArguments(b);
                if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
                    return false;
                if (aIsArgs) {
                    a = pSlice.call(a);
                    b = pSlice.call(b);
                    return _deepEqual(a, b);
                }
                var ka = objectKeys(a),
                    kb = objectKeys(b),
                    key, i;
                // having the same number of owned properties (keys incorporates
                // hasOwnProperty)
                if (ka.length != kb.length)
                    return false;
                //the same set of keys (although not necessarily the same order),
                ka.sort();
                kb.sort();
                //~~~cheap key test
                for (i = ka.length - 1; i >= 0; i--) {
                    if (ka[i] != kb[i])
                        return false;
                }
                //equivalent values for every corresponding key, and
                //~~~possibly expensive deep test
                for (i = ka.length - 1; i >= 0; i--) {
                    key = ka[i];
                    if (!_deepEqual(a[key], b[key])) return false;
                }
                return true;
            }

            // 8. The non-equivalence assertion tests for any deep inequality.
            // assert.notDeepEqual(actual, expected, message_opt);

            assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
                if (_deepEqual(actual, expected)) {
                    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
                }
            };

            // 9. The strict equality assertion tests strict equality, as determined by ===.
            // assert.strictEqual(actual, expected, message_opt);

            assert.strictEqual = function strictEqual(actual, expected, message) {
                if (actual !== expected) {
                    fail(actual, expected, message, '===', assert.strictEqual);
                }
            };

            // 10. The strict non-equality assertion tests for strict inequality, as
            // determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

            assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
                if (actual === expected) {
                    fail(actual, expected, message, '!==', assert.notStrictEqual);
                }
            };

            function expectedException(actual, expected) {
                if (!actual || !expected) {
                    return false;
                }

                if (Object.prototype.toString.call(expected) == '[object RegExp]') {
                    return expected.test(actual);
                } else if (actual instanceof expected) {
                    return true;
                } else if (expected.call({}, actual) === true) {
                    return true;
                }

                return false;
            }

            function _throws(shouldThrow, block, expected, message) {
                var actual;

                if (util.isString(expected)) {
                    message = expected;
                    expected = null;
                }

                try {
                    block();
                } catch (e) {
                    actual = e;
                }

                message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
                    (message ? ' ' + message : '.');

                if (shouldThrow && !actual) {
                    fail(actual, expected, 'Missing expected exception' + message);
                }

                if (!shouldThrow && expectedException(actual, expected)) {
                    fail(actual, expected, 'Got unwanted exception' + message);
                }

                if ((shouldThrow && actual && expected &&
                        !expectedException(actual, expected)) || (!shouldThrow && actual)) {
                    throw actual;
                }
            }

            // 11. Expected to throw an error:
            // assert.throws(block, Error_opt, message_opt);

            assert.throws = function(block, /*optional*/ error, /*optional*/ message) {
                _throws.apply(this, [true].concat(pSlice.call(arguments)));
            };

            // EXTENSION! This is annoying to write outside this module.
            assert.doesNotThrow = function(block, /*optional*/ message) {
                _throws.apply(this, [false].concat(pSlice.call(arguments)));
            };

            assert.ifError = function(err) { if (err) { throw err; } };

            var objectKeys = Object.keys || function(obj) {
                var keys = [];
                for (var key in obj) {
                    if (hasOwn.call(obj, key)) keys.push(key);
                }
                return keys;
            };
        });
        return ___scope___.entry = "index.js";
    });
    FuseBox.pkg("util", {}, function(___scope___) {
        ___scope___.file("index.js", function(exports, require, module, __filename, __dirname) {

            /*
             * Fork of https://raw.githubusercontent.com/defunctzombie/node-util
             * inlining https://github.com/isaacs/inherits/blob/master/inherits_browser.js
             */

            // Copyright Joyent, Inc. and other Node contributors.
            //
            // Permission is hereby granted, free of charge, to any person obtaining a
            // copy of this software and associated documentation files (the
            // "Software"), to deal in the Software without restriction, including
            // without limitation the rights to use, copy, modify, merge, publish,
            // distribute, sublicense, and/or sell copies of the Software, and to permit
            // persons to whom the Software is furnished to do so, subject to the
            // following conditions:
            //
            // The above copyright notice and this permission notice shall be included
            // in all copies or substantial portions of the Software.
            //
            // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
            // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
            // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
            // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
            // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
            // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
            // USE OR OTHER DEALINGS IN THE SOFTWARE.

            var process = require('process');

            var formatRegExp = /%[sdj%]/g;
            exports.format = function(f) {
                if (!isString(f)) {
                    var objects = [];
                    for (var i = 0; i < arguments.length; i++) {
                        objects.push(inspect(arguments[i]));
                    }
                    return objects.join(' ');
                }

                var i = 1;
                var args = arguments;
                var len = args.length;
                var str = String(f).replace(formatRegExp, function(x) {
                    if (x === '%%') return '%';
                    if (i >= len) return x;
                    switch (x) {
                        case '%s':
                            return String(args[i++]);
                        case '%d':
                            return Number(args[i++]);
                        case '%j':
                            try {
                                return JSON.stringify(args[i++]);
                            } catch (_) {
                                return '[Circular]';
                            }
                        default:
                            return x;
                    }
                });
                for (var x = args[i]; i < len; x = args[++i]) {
                    if (isNull(x) || !isObject(x)) {
                        str += ' ' + x;
                    } else {
                        str += ' ' + inspect(x);
                    }
                }
                return str;
            };


            // Mark that a method should not be used.
            // Returns a modified function which warns once by default.
            // If --no-deprecation is set, then it is a no-op.
            exports.deprecate = function(fn, msg) {
                // Allow for deprecating things in the process of starting up.
                if (isUndefined(global.process)) {
                    return function() {
                        return exports.deprecate(fn, msg).apply(this, arguments);
                    };
                }

                if (process.noDeprecation === true) {
                    return fn;
                }

                var warned = false;

                function deprecated() {
                    if (!warned) {
                        if (process.throwDeprecation) {
                            throw new Error(msg);
                        } else if (process.traceDeprecation) {
                            console.trace(msg);
                        } else {
                            console.error(msg);
                        }
                        warned = true;
                    }
                    return fn.apply(this, arguments);
                }

                return deprecated;
            };


            var debugs = {};
            var debugEnviron;
            exports.debuglog = function(set) {
                if (isUndefined(debugEnviron))
                    debugEnviron = process.env.NODE_DEBUG || '';
                set = set.toUpperCase();
                if (!debugs[set]) {
                    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
                        var pid = process.pid;
                        debugs[set] = function() {
                            var msg = exports.format.apply(exports, arguments);
                            console.error('%s %d: %s', set, pid, msg);
                        };
                    } else {
                        debugs[set] = function() {};
                    }
                }
                return debugs[set];
            };


            /**
             * Echos the value of a value. Trys to print the value out
             * in the best way possible given the different types.
             *
             * @param {Object} obj The object to print out.
             * @param {Object} opts Optional options object that alters the output.
             */
            /* legacy: obj, showHidden, depth, colors*/
            function inspect(obj, opts) {
                // default options
                var ctx = {
                    seen: [],
                    stylize: stylizeNoColor
                };
                // legacy...
                if (arguments.length >= 3) ctx.depth = arguments[2];
                if (arguments.length >= 4) ctx.colors = arguments[3];
                if (isBoolean(opts)) {
                    // legacy...
                    ctx.showHidden = opts;
                } else if (opts) {
                    // got an "options" object
                    exports._extend(ctx, opts);
                }
                // set default options
                if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
                if (isUndefined(ctx.depth)) ctx.depth = 2;
                if (isUndefined(ctx.colors)) ctx.colors = false;
                if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
                if (ctx.colors) ctx.stylize = stylizeWithColor;
                return formatValue(ctx, obj, ctx.depth);
            }
            exports.inspect = inspect;


            // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
            inspect.colors = {
                'bold': [1, 22],
                'italic': [3, 23],
                'underline': [4, 24],
                'inverse': [7, 27],
                'white': [37, 39],
                'grey': [90, 39],
                'black': [30, 39],
                'blue': [34, 39],
                'cyan': [36, 39],
                'green': [32, 39],
                'magenta': [35, 39],
                'red': [31, 39],
                'yellow': [33, 39]
            };

            // Don't use 'blue' not visible on cmd.exe
            inspect.styles = {
                'special': 'cyan',
                'number': 'yellow',
                'boolean': 'yellow',
                'undefined': 'grey',
                'null': 'bold',
                'string': 'green',
                'date': 'magenta',
                // "name": intentionally not styling
                'regexp': 'red'
            };


            function stylizeWithColor(str, styleType) {
                var style = inspect.styles[styleType];

                if (style) {
                    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
                        '\u001b[' + inspect.colors[style][1] + 'm';
                } else {
                    return str;
                }
            }


            function stylizeNoColor(str, styleType) {
                return str;
            }


            function arrayToHash(array) {
                var hash = {};

                array.forEach(function(val, idx) {
                    hash[val] = true;
                });

                return hash;
            }


            function formatValue(ctx, value, recurseTimes) {
                // Provide a hook for user-specified inspect functions.
                // Check that value is an object with an inspect function on it
                if (ctx.customInspect &&
                    value &&
                    isFunction(value.inspect) &&
                    // Filter out the util module, it's inspect function is special
                    value.inspect !== exports.inspect &&
                    // Also filter out any prototype objects using the circular check.
                    !(value.constructor && value.constructor.prototype === value)) {
                    var ret = value.inspect(recurseTimes, ctx);
                    if (!isString(ret)) {
                        ret = formatValue(ctx, ret, recurseTimes);
                    }
                    return ret;
                }

                // Primitive types cannot have properties
                var primitive = formatPrimitive(ctx, value);
                if (primitive) {
                    return primitive;
                }

                // Look up the keys of the object.
                var keys = Object.keys(value);
                var visibleKeys = arrayToHash(keys);

                if (ctx.showHidden) {
                    keys = Object.getOwnPropertyNames(value);
                }

                // IE doesn't make error fields non-enumerable
                // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
                if (isError(value) &&
                    (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
                    return formatError(value);
                }

                // Some type of object without properties can be shortcutted.
                if (keys.length === 0) {
                    if (isFunction(value)) {
                        var name = value.name ? ': ' + value.name : '';
                        return ctx.stylize('[Function' + name + ']', 'special');
                    }
                    if (isRegExp(value)) {
                        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                    }
                    if (isDate(value)) {
                        return ctx.stylize(Date.prototype.toString.call(value), 'date');
                    }
                    if (isError(value)) {
                        return formatError(value);
                    }
                }

                var base = '',
                    array = false,
                    braces = ['{', '}'];

                // Make Array say that they are Array
                if (isArray(value)) {
                    array = true;
                    braces = ['[', ']'];
                }

                // Make functions say that they are functions
                if (isFunction(value)) {
                    var n = value.name ? ': ' + value.name : '';
                    base = ' [Function' + n + ']';
                }

                // Make RegExps say that they are RegExps
                if (isRegExp(value)) {
                    base = ' ' + RegExp.prototype.toString.call(value);
                }

                // Make dates with properties first say the date
                if (isDate(value)) {
                    base = ' ' + Date.prototype.toUTCString.call(value);
                }

                // Make error with message first say the error
                if (isError(value)) {
                    base = ' ' + formatError(value);
                }

                if (keys.length === 0 && (!array || value.length == 0)) {
                    return braces[0] + base + braces[1];
                }

                if (recurseTimes < 0) {
                    if (isRegExp(value)) {
                        return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
                    } else {
                        return ctx.stylize('[Object]', 'special');
                    }
                }

                ctx.seen.push(value);

                var output;
                if (array) {
                    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
                } else {
                    output = keys.map(function(key) {
                        return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
                    });
                }

                ctx.seen.pop();

                return reduceToSingleString(output, base, braces);
            }


            function formatPrimitive(ctx, value) {
                if (isUndefined(value))
                    return ctx.stylize('undefined', 'undefined');
                if (isString(value)) {
                    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                        .replace(/'/g, "\\'")
                        .replace(/\\"/g, '"') + '\'';
                    return ctx.stylize(simple, 'string');
                }
                if (isNumber(value))
                    return ctx.stylize('' + value, 'number');
                if (isBoolean(value))
                    return ctx.stylize('' + value, 'boolean');
                // For some reason typeof null is "object", so special case here.
                if (isNull(value))
                    return ctx.stylize('null', 'null');
            }


            function formatError(value) {
                return '[' + Error.prototype.toString.call(value) + ']';
            }


            function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
                var output = [];
                for (var i = 0, l = value.length; i < l; ++i) {
                    if (hasOwnProperty(value, String(i))) {
                        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
                            String(i), true));
                    } else {
                        output.push('');
                    }
                }
                keys.forEach(function(key) {
                    if (!key.match(/^\d+$/)) {
                        output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
                            key, true));
                    }
                });
                return output;
            }


            function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
                var name, str, desc;
                desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
                if (desc.get) {
                    if (desc.set) {
                        str = ctx.stylize('[Getter/Setter]', 'special');
                    } else {
                        str = ctx.stylize('[Getter]', 'special');
                    }
                } else {
                    if (desc.set) {
                        str = ctx.stylize('[Setter]', 'special');
                    }
                }
                if (!hasOwnProperty(visibleKeys, key)) {
                    name = '[' + key + ']';
                }
                if (!str) {
                    if (ctx.seen.indexOf(desc.value) < 0) {
                        if (isNull(recurseTimes)) {
                            str = formatValue(ctx, desc.value, null);
                        } else {
                            str = formatValue(ctx, desc.value, recurseTimes - 1);
                        }
                        if (str.indexOf('\n') > -1) {
                            if (array) {
                                str = str.split('\n').map(function(line) {
                                    return '  ' + line;
                                }).join('\n').substr(2);
                            } else {
                                str = '\n' + str.split('\n').map(function(line) {
                                    return '   ' + line;
                                }).join('\n');
                            }
                        }
                    } else {
                        str = ctx.stylize('[Circular]', 'special');
                    }
                }
                if (isUndefined(name)) {
                    if (array && key.match(/^\d+$/)) {
                        return str;
                    }
                    name = JSON.stringify('' + key);
                    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                        name = name.substr(1, name.length - 2);
                        name = ctx.stylize(name, 'name');
                    } else {
                        name = name.replace(/'/g, "\\'")
                            .replace(/\\"/g, '"')
                            .replace(/(^"|"$)/g, "'");
                        name = ctx.stylize(name, 'string');
                    }
                }

                return name + ': ' + str;
            }


            function reduceToSingleString(output, base, braces) {
                var numLinesEst = 0;
                var length = output.reduce(function(prev, cur) {
                    numLinesEst++;
                    if (cur.indexOf('\n') >= 0) numLinesEst++;
                    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
                }, 0);

                if (length > 60) {
                    return braces[0] +
                        (base === '' ? '' : base + '\n ') +
                        ' ' +
                        output.join(',\n  ') +
                        ' ' +
                        braces[1];
                }

                return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
            }


            // NOTE: These type checking functions intentionally don't use `instanceof`
            // because it is fragile and can be easily faked with `Object.create()`.
            function isArray(ar) {
                return Array.isArray(ar);
            }
            exports.isArray = isArray;

            function isBoolean(arg) {
                return typeof arg === 'boolean';
            }
            exports.isBoolean = isBoolean;

            function isNull(arg) {
                return arg === null;
            }
            exports.isNull = isNull;

            function isNullOrUndefined(arg) {
                return arg == null;
            }
            exports.isNullOrUndefined = isNullOrUndefined;

            function isNumber(arg) {
                return typeof arg === 'number';
            }
            exports.isNumber = isNumber;

            function isString(arg) {
                return typeof arg === 'string';
            }
            exports.isString = isString;

            function isSymbol(arg) {
                return typeof arg === 'symbol';
            }
            exports.isSymbol = isSymbol;

            function isUndefined(arg) {
                return arg === void 0;
            }
            exports.isUndefined = isUndefined;

            function isRegExp(re) {
                return isObject(re) && objectToString(re) === '[object RegExp]';
            }
            exports.isRegExp = isRegExp;

            function isObject(arg) {
                return typeof arg === 'object' && arg !== null;
            }
            exports.isObject = isObject;

            function isDate(d) {
                return isObject(d) && objectToString(d) === '[object Date]';
            }
            exports.isDate = isDate;

            function isError(e) {
                return isObject(e) &&
                    (objectToString(e) === '[object Error]' || e instanceof Error);
            }
            exports.isError = isError;

            function isFunction(arg) {
                return typeof arg === 'function';
            }
            exports.isFunction = isFunction;

            function isPrimitive(arg) {
                return arg === null ||
                    typeof arg === 'boolean' ||
                    typeof arg === 'number' ||
                    typeof arg === 'string' ||
                    typeof arg === 'symbol' || // ES6 symbol
                    typeof arg === 'undefined';
            }
            exports.isPrimitive = isPrimitive;

            exports.isBuffer = require('./isBuffer.js');

            function objectToString(o) {
                return Object.prototype.toString.call(o);
            }


            function pad(n) {
                return n < 10 ? '0' + n.toString(10) : n.toString(10);
            }


            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec'
            ];

            // 26 Feb 16:19:34
            function timestamp() {
                var d = new Date();
                var time = [pad(d.getHours()),
                    pad(d.getMinutes()),
                    pad(d.getSeconds())
                ].join(':');
                return [d.getDate(), months[d.getMonth()], time].join(' ');
            }


            // log is just a thin wrapper to console.log that prepends a timestamp
            exports.log = function() {
                console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
            };


            /**
             * Inherit the prototype methods from one constructor into another.
             *
             * The Function.prototype.inherits from lang.js rewritten as a standalone
             * function (not on Function.prototype). NOTE: If this file is to be loaded
             * during bootstrapping this function needs to be rewritten using some native
             * functions as prototype setup using normal JavaScript does not work as
             * expected during bootstrapping (see mirror.js in r114903).
             *
             * @param {function} ctor Constructor function which needs to inherit the
             *     prototype.
             * @param {function} superCtor Constructor function to inherit prototype from.
             */
            if (typeof Object.create === 'function') {
                // implementation from standard node.js 'util' module
                exports.inherits = function inherits(ctor, superCtor) {
                    ctor.super_ = superCtor
                    ctor.prototype = Object.create(superCtor.prototype, {
                        constructor: {
                            value: ctor,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    });
                };
            } else {
                // old school shim for old browsers
                exports.inherits = function inherits(ctor, superCtor) {
                    ctor.super_ = superCtor
                    var TempCtor = function() {}
                    TempCtor.prototype = superCtor.prototype
                    ctor.prototype = new TempCtor()
                    ctor.prototype.constructor = ctor
                }
            }

            exports._extend = function(origin, add) {
                // Don't do anything if add isn't an object
                if (!add || !isObject(add)) return origin;

                var keys = Object.keys(add);
                var i = keys.length;
                while (i--) {
                    origin[keys[i]] = add[keys[i]];
                }
                return origin;
            };

            function hasOwnProperty(obj, prop) {
                return Object.prototype.hasOwnProperty.call(obj, prop);
            }
        });
        ___scope___.file("isBuffer.js", function(exports, require, module, __filename, __dirname) {
            /* fuse:injection: */
            var Buffer = require("buffer").Buffer;
            /*
             * From https://github.com/defunctzombie/node-util/blob/master/support/isBuffer.js
             */
            module.exports = function isBuffer(arg) {
                if (typeof Buffer !== "undefined") {
                    return arg instanceof Buffer;
                } else {
                    return arg && typeof arg === 'object' &&
                        typeof arg.copy === 'function' &&
                        typeof arg.fill === 'function' &&
                        typeof arg.readUInt8 === 'function';
                }
            }
        });
        return ___scope___.entry = "index.js";
    });
    FuseBox.pkg("buffer", {}, function(___scope___) {
        ___scope___.file("index.js", function(exports, require, module, __filename, __dirname) {

            if (FuseBox.isServer) {

                module.exports = global.require("buffer");
            } else {
                /*!
                 * The buffer module from node.js, for the browser.
                 *
                 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
                 * @license  MIT
                 */
                /* eslint-disable no-proto */

                'use strict'

                var base64 = require('base64-js')
                var ieee754 = require('ieee754')

                exports.Buffer = Buffer
                exports.FuseShim = true
                exports.SlowBuffer = SlowBuffer
                exports.INSPECT_MAX_BYTES = 50

                var K_MAX_LENGTH = 0x7fffffff
                exports.kMaxLength = K_MAX_LENGTH

                /**
                 * If `Buffer.TYPED_ARRAY_SUPPORT`:
                 *   === true    Use Uint8Array implementation (fastest)
                 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
                 *               implementation (most compatible, even IE6)
                 *
                 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
                 * Opera 11.6+, iOS 4.2+.
                 *
                 * We report that the browser does not support typed arrays if the are not subclassable
                 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
                 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
                 * for __proto__ and has a buggy typed array implementation.
                 */
                Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

                if (!Buffer.TYPED_ARRAY_SUPPORT) {
                    console.error(
                        'This browser lacks typed array (Uint8Array) support which is required by ' +
                        '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.')
                }

                function typedArraySupport() {
                    // Can typed array instances can be augmented?
                    try {
                        var arr = new Uint8Array(1)
                        arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function() { return 42 } }
                        return arr.foo() === 42
                    } catch (e) {
                        return false
                    }
                }

                function createBuffer(length) {
                    if (length > K_MAX_LENGTH) {
                        throw new RangeError('Invalid typed array length')
                    }
                    // Return an augmented `Uint8Array` instance
                    var buf = new Uint8Array(length)
                    buf.__proto__ = Buffer.prototype
                    return buf
                }

                /**
                 * The Buffer constructor returns instances of `Uint8Array` that have their
                 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
                 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
                 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
                 * returns a single octet.
                 *
                 * The `Uint8Array` prototype remains unmodified.
                 */

                function Buffer(arg, encodingOrOffset, length) {
                    // Common case.
                    if (typeof arg === 'number') {
                        if (typeof encodingOrOffset === 'string') {
                            throw new Error(
                                'If encoding is specified then the first argument must be a string'
                            )
                        }
                        return allocUnsafe(arg)
                    }
                    return from(arg, encodingOrOffset, length)
                }

                // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
                if (typeof Symbol !== 'undefined' && Symbol.species &&
                    Buffer[Symbol.species] === Buffer) {
                    Object.defineProperty(Buffer, Symbol.species, {
                        value: null,
                        configurable: true,
                        enumerable: false,
                        writable: false
                    })
                }

                Buffer.poolSize = 8192 // not used by this implementation

                function from(value, encodingOrOffset, length) {
                    if (typeof value === 'number') {
                        throw new TypeError('"value" argument must not be a number')
                    }

                    if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
                        return fromArrayBuffer(value, encodingOrOffset, length)
                    }

                    if (typeof value === 'string') {
                        return fromString(value, encodingOrOffset)
                    }

                    return fromObject(value)
                }

                /**
                 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
                 * if value is a number.
                 * Buffer.from(str[, encoding])
                 * Buffer.from(array)
                 * Buffer.from(buffer)
                 * Buffer.from(arrayBuffer[, byteOffset[, length]])
                 **/
                Buffer.from = function(value, encodingOrOffset, length) {
                    return from(value, encodingOrOffset, length)
                }

                // Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
                // https://github.com/feross/buffer/pull/148
                Buffer.prototype.__proto__ = Uint8Array.prototype
                Buffer.__proto__ = Uint8Array

                function assertSize(size) {
                    if (typeof size !== 'number') {
                        throw new TypeError('"size" argument must be a number')
                    } else if (size < 0) {
                        throw new RangeError('"size" argument must not be negative')
                    }
                }

                function alloc(size, fill, encoding) {
                    assertSize(size)
                    if (size <= 0) {
                        return createBuffer(size)
                    }
                    if (fill !== undefined) {
                        // Only pay attention to encoding if it's a string. This
                        // prevents accidentally sending in a number that would
                        // be interpretted as a start offset.
                        return typeof encoding === 'string' ?
                            createBuffer(size).fill(fill, encoding) :
                            createBuffer(size).fill(fill)
                    }
                    return createBuffer(size)
                }

                /**
                 * Creates a new filled Buffer instance.
                 * alloc(size[, fill[, encoding]])
                 **/
                Buffer.alloc = function(size, fill, encoding) {
                    return alloc(size, fill, encoding)
                }

                function allocUnsafe(size) {
                    assertSize(size)
                    return createBuffer(size < 0 ? 0 : checked(size) | 0)
                }

                /**
                 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
                 * */
                Buffer.allocUnsafe = function(size) {
                        return allocUnsafe(size)
                    }
                    /**
                     * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
                     */
                Buffer.allocUnsafeSlow = function(size) {
                    return allocUnsafe(size)
                }

                function fromString(string, encoding) {
                    if (typeof encoding !== 'string' || encoding === '') {
                        encoding = 'utf8'
                    }

                    if (!Buffer.isEncoding(encoding)) {
                        throw new TypeError('"encoding" must be a valid string encoding')
                    }

                    var length = byteLength(string, encoding) | 0
                    var buf = createBuffer(length)

                    var actual = buf.write(string, encoding)

                    if (actual !== length) {
                        // Writing a hex string, for example, that contains invalid characters will
                        // cause everything after the first invalid character to be ignored. (e.g.
                        // 'abxxcd' will be treated as 'ab')
                        buf = buf.slice(0, actual)
                    }

                    return buf
                }

                function fromArrayLike(array) {
                    var length = array.length < 0 ? 0 : checked(array.length) | 0
                    var buf = createBuffer(length)
                    for (var i = 0; i < length; i += 1) {
                        buf[i] = array[i] & 255
                    }
                    return buf
                }

                function fromArrayBuffer(array, byteOffset, length) {
                    array.byteLength // this throws if `array` is not a valid ArrayBuffer

                    if (byteOffset < 0 || array.byteLength < byteOffset) {
                        throw new RangeError('\'offset\' is out of bounds')
                    }

                    if (array.byteLength < byteOffset + (length || 0)) {
                        throw new RangeError('\'length\' is out of bounds')
                    }

                    var buf
                    if (byteOffset === undefined && length === undefined) {
                        buf = new Uint8Array(array)
                    } else if (length === undefined) {
                        buf = new Uint8Array(array, byteOffset)
                    } else {
                        buf = new Uint8Array(array, byteOffset, length)
                    }

                    // Return an augmented `Uint8Array` instance
                    buf.__proto__ = Buffer.prototype
                    return buf
                }

                function fromObject(obj) {
                    if (Buffer.isBuffer(obj)) {
                        var len = checked(obj.length) | 0
                        var buf = createBuffer(len)

                        if (buf.length === 0) {
                            return buf
                        }

                        obj.copy(buf, 0, 0, len)
                        return buf
                    }

                    if (obj) {
                        if ((typeof ArrayBuffer !== 'undefined' &&
                                obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
                            if (typeof obj.length !== 'number' || isnan(obj.length)) {
                                return createBuffer(0)
                            }
                            return fromArrayLike(obj)
                        }

                        if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
                            return fromArrayLike(obj.data)
                        }
                    }

                    throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
                }

                function checked(length) {
                    // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
                    // length is NaN (which is otherwise coerced to zero.)
                    if (length >= K_MAX_LENGTH) {
                        throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                            'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
                    }
                    return length | 0
                }

                function SlowBuffer(length) {
                    if (+length != length) { // eslint-disable-line eqeqeq
                        length = 0
                    }
                    return Buffer.alloc(+length)
                }

                Buffer.isBuffer = function isBuffer(b) {
                    return !!(b != null && b._isBuffer)
                }

                Buffer.compare = function compare(a, b) {
                    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
                        throw new TypeError('Arguments must be Buffers')
                    }

                    if (a === b) return 0

                    var x = a.length
                    var y = b.length

                    for (var i = 0, len = Math.min(x, y); i < len; ++i) {
                        if (a[i] !== b[i]) {
                            x = a[i]
                            y = b[i]
                            break
                        }
                    }

                    if (x < y) return -1
                    if (y < x) return 1
                    return 0
                }

                Buffer.isEncoding = function isEncoding(encoding) {
                    switch (String(encoding).toLowerCase()) {
                        case 'hex':
                        case 'utf8':
                        case 'utf-8':
                        case 'ascii':
                        case 'latin1':
                        case 'binary':
                        case 'base64':
                        case 'ucs2':
                        case 'ucs-2':
                        case 'utf16le':
                        case 'utf-16le':
                            return true
                        default:
                            return false
                    }
                }

                Buffer.concat = function concat(list, length) {
                    if (!Array.isArray(list)) {
                        throw new TypeError('"list" argument must be an Array of Buffers')
                    }

                    if (list.length === 0) {
                        return Buffer.alloc(0)
                    }

                    var i
                    if (length === undefined) {
                        length = 0
                        for (i = 0; i < list.length; ++i) {
                            length += list[i].length
                        }
                    }

                    var buffer = Buffer.allocUnsafe(length)
                    var pos = 0
                    for (i = 0; i < list.length; ++i) {
                        var buf = list[i]
                        if (!Buffer.isBuffer(buf)) {
                            throw new TypeError('"list" argument must be an Array of Buffers')
                        }
                        buf.copy(buffer, pos)
                        pos += buf.length
                    }
                    return buffer
                }

                function byteLength(string, encoding) {
                    if (Buffer.isBuffer(string)) {
                        return string.length
                    }
                    if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
                        (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
                        return string.byteLength
                    }
                    if (typeof string !== 'string') {
                        string = '' + string
                    }

                    var len = string.length
                    if (len === 0) return 0

                    // Use a for loop to avoid recursion
                    var loweredCase = false
                    for (;;) {
                        switch (encoding) {
                            case 'ascii':
                            case 'latin1':
                            case 'binary':
                                return len
                            case 'utf8':
                            case 'utf-8':
                            case undefined:
                                return utf8ToBytes(string).length
                            case 'ucs2':
                            case 'ucs-2':
                            case 'utf16le':
                            case 'utf-16le':
                                return len * 2
                            case 'hex':
                                return len >>> 1
                            case 'base64':
                                return base64ToBytes(string).length
                            default:
                                if (loweredCase) return utf8ToBytes(string).length // assume utf8
                                encoding = ('' + encoding).toLowerCase()
                                loweredCase = true
                        }
                    }
                }
                Buffer.byteLength = byteLength

                function slowToString(encoding, start, end) {
                    var loweredCase = false

                    // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
                    // property of a typed array.

                    // This behaves neither like String nor Uint8Array in that we set start/end
                    // to their upper/lower bounds if the value passed is out of range.
                    // undefined is handled specially as per ECMA-262 6th Edition,
                    // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
                    if (start === undefined || start < 0) {
                        start = 0
                    }
                    // Return early if start > this.length. Done here to prevent potential uint32
                    // coercion fail below.
                    if (start > this.length) {
                        return ''
                    }

                    if (end === undefined || end > this.length) {
                        end = this.length
                    }

                    if (end <= 0) {
                        return ''
                    }

                    // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
                    end >>>= 0
                    start >>>= 0

                    if (end <= start) {
                        return ''
                    }

                    if (!encoding) encoding = 'utf8'

                    while (true) {
                        switch (encoding) {
                            case 'hex':
                                return hexSlice(this, start, end)

                            case 'utf8':
                            case 'utf-8':
                                return utf8Slice(this, start, end)

                            case 'ascii':
                                return asciiSlice(this, start, end)

                            case 'latin1':
                            case 'binary':
                                return latin1Slice(this, start, end)

                            case 'base64':
                                return base64Slice(this, start, end)

                            case 'ucs2':
                            case 'ucs-2':
                            case 'utf16le':
                            case 'utf-16le':
                                return utf16leSlice(this, start, end)

                            default:
                                if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                                encoding = (encoding + '').toLowerCase()
                                loweredCase = true
                        }
                    }
                }

                // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
                // Buffer instances.
                Buffer.prototype._isBuffer = true

                function swap(b, n, m) {
                    var i = b[n]
                    b[n] = b[m]
                    b[m] = i
                }

                Buffer.prototype.swap16 = function swap16() {
                    var len = this.length
                    if (len % 2 !== 0) {
                        throw new RangeError('Buffer size must be a multiple of 16-bits')
                    }
                    for (var i = 0; i < len; i += 2) {
                        swap(this, i, i + 1)
                    }
                    return this
                }

                Buffer.prototype.swap32 = function swap32() {
                    var len = this.length
                    if (len % 4 !== 0) {
                        throw new RangeError('Buffer size must be a multiple of 32-bits')
                    }
                    for (var i = 0; i < len; i += 4) {
                        swap(this, i, i + 3)
                        swap(this, i + 1, i + 2)
                    }
                    return this
                }

                Buffer.prototype.swap64 = function swap64() {
                    var len = this.length
                    if (len % 8 !== 0) {
                        throw new RangeError('Buffer size must be a multiple of 64-bits')
                    }
                    for (var i = 0; i < len; i += 8) {
                        swap(this, i, i + 7)
                        swap(this, i + 1, i + 6)
                        swap(this, i + 2, i + 5)
                        swap(this, i + 3, i + 4)
                    }
                    return this
                }

                Buffer.prototype.toString = function toString() {
                    var length = this.length
                    if (length === 0) return ''
                    if (arguments.length === 0) return utf8Slice(this, 0, length)
                    return slowToString.apply(this, arguments)
                }

                Buffer.prototype.equals = function equals(b) {
                    if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
                    if (this === b) return true
                    return Buffer.compare(this, b) === 0
                }

                Buffer.prototype.inspect = function inspect() {
                    var str = ''
                    var max = exports.INSPECT_MAX_BYTES
                    if (this.length > 0) {
                        str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
                        if (this.length > max) str += ' ... '
                    }
                    return '<Buffer ' + str + '>'
                }

                Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
                    if (!Buffer.isBuffer(target)) {
                        throw new TypeError('Argument must be a Buffer')
                    }

                    if (start === undefined) {
                        start = 0
                    }
                    if (end === undefined) {
                        end = target ? target.length : 0
                    }
                    if (thisStart === undefined) {
                        thisStart = 0
                    }
                    if (thisEnd === undefined) {
                        thisEnd = this.length
                    }

                    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
                        throw new RangeError('out of range index')
                    }

                    if (thisStart >= thisEnd && start >= end) {
                        return 0
                    }
                    if (thisStart >= thisEnd) {
                        return -1
                    }
                    if (start >= end) {
                        return 1
                    }

                    start >>>= 0
                    end >>>= 0
                    thisStart >>>= 0
                    thisEnd >>>= 0

                    if (this === target) return 0

                    var x = thisEnd - thisStart
                    var y = end - start
                    var len = Math.min(x, y)

                    var thisCopy = this.slice(thisStart, thisEnd)
                    var targetCopy = target.slice(start, end)

                    for (var i = 0; i < len; ++i) {
                        if (thisCopy[i] !== targetCopy[i]) {
                            x = thisCopy[i]
                            y = targetCopy[i]
                            break
                        }
                    }

                    if (x < y) return -1
                    if (y < x) return 1
                    return 0
                }

                // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
                // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
                //
                // Arguments:
                // - buffer - a Buffer to search
                // - val - a string, Buffer, or number
                // - byteOffset - an index into `buffer`; will be clamped to an int32
                // - encoding - an optional encoding, relevant is val is a string
                // - dir - true for indexOf, false for lastIndexOf
                function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
                    // Empty buffer means no match
                    if (buffer.length === 0) return -1

                    // Normalize byteOffset
                    if (typeof byteOffset === 'string') {
                        encoding = byteOffset
                        byteOffset = 0
                    } else if (byteOffset > 0x7fffffff) {
                        byteOffset = 0x7fffffff
                    } else if (byteOffset < -0x80000000) {
                        byteOffset = -0x80000000
                    }
                    byteOffset = +byteOffset // Coerce to Number.
                    if (isNaN(byteOffset)) {
                        // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
                        byteOffset = dir ? 0 : (buffer.length - 1)
                    }

                    // Normalize byteOffset: negative offsets start from the end of the buffer
                    if (byteOffset < 0) byteOffset = buffer.length + byteOffset
                    if (byteOffset >= buffer.length) {
                        if (dir) return -1
                        else byteOffset = buffer.length - 1
                    } else if (byteOffset < 0) {
                        if (dir) byteOffset = 0
                        else return -1
                    }

                    // Normalize val
                    if (typeof val === 'string') {
                        val = Buffer.from(val, encoding)
                    }

                    // Finally, search either indexOf (if dir is true) or lastIndexOf
                    if (Buffer.isBuffer(val)) {
                        // Special case: looking for empty string/buffer always fails
                        if (val.length === 0) {
                            return -1
                        }
                        return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
                    } else if (typeof val === 'number') {
                        val = val & 0xFF // Search for a byte value [0-255]
                        if (typeof Uint8Array.prototype.indexOf === 'function') {
                            if (dir) {
                                return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
                            } else {
                                return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
                            }
                        }
                        return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
                    }

                    throw new TypeError('val must be string, number or Buffer')
                }

                function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
                    var indexSize = 1
                    var arrLength = arr.length
                    var valLength = val.length

                    if (encoding !== undefined) {
                        encoding = String(encoding).toLowerCase()
                        if (encoding === 'ucs2' || encoding === 'ucs-2' ||
                            encoding === 'utf16le' || encoding === 'utf-16le') {
                            if (arr.length < 2 || val.length < 2) {
                                return -1
                            }
                            indexSize = 2
                            arrLength /= 2
                            valLength /= 2
                            byteOffset /= 2
                        }
                    }

                    function read(buf, i) {
                        if (indexSize === 1) {
                            return buf[i]
                        } else {
                            return buf.readUInt16BE(i * indexSize)
                        }
                    }

                    var i
                    if (dir) {
                        var foundIndex = -1
                        for (i = byteOffset; i < arrLength; i++) {
                            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                                if (foundIndex === -1) foundIndex = i
                                if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
                            } else {
                                if (foundIndex !== -1) i -= i - foundIndex
                                foundIndex = -1
                            }
                        }
                    } else {
                        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
                        for (i = byteOffset; i >= 0; i--) {
                            var found = true
                            for (var j = 0; j < valLength; j++) {
                                if (read(arr, i + j) !== read(val, j)) {
                                    found = false
                                    break
                                }
                            }
                            if (found) return i
                        }
                    }

                    return -1
                }

                Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
                    return this.indexOf(val, byteOffset, encoding) !== -1
                }

                Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
                    return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
                }

                Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
                    return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
                }

                function hexWrite(buf, string, offset, length) {
                    offset = Number(offset) || 0
                    var remaining = buf.length - offset
                    if (!length) {
                        length = remaining
                    } else {
                        length = Number(length)
                        if (length > remaining) {
                            length = remaining
                        }
                    }

                    // must be an even number of digits
                    var strLen = string.length
                    if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

                    if (length > strLen / 2) {
                        length = strLen / 2
                    }
                    for (var i = 0; i < length; ++i) {
                        var parsed = parseInt(string.substr(i * 2, 2), 16)
                        if (isNaN(parsed)) return i
                        buf[offset + i] = parsed
                    }
                    return i
                }

                function utf8Write(buf, string, offset, length) {
                    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
                }

                function asciiWrite(buf, string, offset, length) {
                    return blitBuffer(asciiToBytes(string), buf, offset, length)
                }

                function latin1Write(buf, string, offset, length) {
                    return asciiWrite(buf, string, offset, length)
                }

                function base64Write(buf, string, offset, length) {
                    return blitBuffer(base64ToBytes(string), buf, offset, length)
                }

                function ucs2Write(buf, string, offset, length) {
                    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
                }

                Buffer.prototype.write = function write(string, offset, length, encoding) {
                    // Buffer#write(string)
                    if (offset === undefined) {
                        encoding = 'utf8'
                        length = this.length
                        offset = 0
                            // Buffer#write(string, encoding)
                    } else if (length === undefined && typeof offset === 'string') {
                        encoding = offset
                        length = this.length
                        offset = 0
                            // Buffer#write(string, offset[, length][, encoding])
                    } else if (isFinite(offset)) {
                        offset = offset >>> 0
                        if (isFinite(length)) {
                            length = length >>> 0
                            if (encoding === undefined) encoding = 'utf8'
                        } else {
                            encoding = length
                            length = undefined
                        }
                        // legacy write(string, encoding, offset, length) - remove in v0.13
                    } else {
                        throw new Error(
                            'Buffer.write(string, encoding, offset[, length]) is no longer supported'
                        )
                    }

                    var remaining = this.length - offset
                    if (length === undefined || length > remaining) length = remaining

                    if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
                        throw new RangeError('Attempt to write outside buffer bounds')
                    }

                    if (!encoding) encoding = 'utf8'

                    var loweredCase = false
                    for (;;) {
                        switch (encoding) {
                            case 'hex':
                                return hexWrite(this, string, offset, length)

                            case 'utf8':
                            case 'utf-8':
                                return utf8Write(this, string, offset, length)

                            case 'ascii':
                                return asciiWrite(this, string, offset, length)

                            case 'latin1':
                            case 'binary':
                                return latin1Write(this, string, offset, length)

                            case 'base64':
                                // Warning: maxLength not taken into account in base64Write
                                return base64Write(this, string, offset, length)

                            case 'ucs2':
                            case 'ucs-2':
                            case 'utf16le':
                            case 'utf-16le':
                                return ucs2Write(this, string, offset, length)

                            default:
                                if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
                                encoding = ('' + encoding).toLowerCase()
                                loweredCase = true
                        }
                    }
                }

                Buffer.prototype.toJSON = function toJSON() {
                    return {
                        type: 'Buffer',
                        data: Array.prototype.slice.call(this._arr || this, 0)
                    }
                }

                function base64Slice(buf, start, end) {
                    if (start === 0 && end === buf.length) {
                        return base64.fromByteArray(buf)
                    } else {
                        return base64.fromByteArray(buf.slice(start, end))
                    }
                }

                function utf8Slice(buf, start, end) {
                    end = Math.min(buf.length, end)
                    var res = []

                    var i = start
                    while (i < end) {
                        var firstByte = buf[i]
                        var codePoint = null
                        var bytesPerSequence = (firstByte > 0xEF) ? 4 :
                            (firstByte > 0xDF) ? 3 :
                            (firstByte > 0xBF) ? 2 :
                            1

                        if (i + bytesPerSequence <= end) {
                            var secondByte, thirdByte, fourthByte, tempCodePoint

                            switch (bytesPerSequence) {
                                case 1:
                                    if (firstByte < 0x80) {
                                        codePoint = firstByte
                                    }
                                    break
                                case 2:
                                    secondByte = buf[i + 1]
                                    if ((secondByte & 0xC0) === 0x80) {
                                        tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
                                        if (tempCodePoint > 0x7F) {
                                            codePoint = tempCodePoint
                                        }
                                    }
                                    break
                                case 3:
                                    secondByte = buf[i + 1]
                                    thirdByte = buf[i + 2]
                                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                                        tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
                                        if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                                            codePoint = tempCodePoint
                                        }
                                    }
                                    break
                                case 4:
                                    secondByte = buf[i + 1]
                                    thirdByte = buf[i + 2]
                                    fourthByte = buf[i + 3]
                                    if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                                        tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
                                        if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                                            codePoint = tempCodePoint
                                        }
                                    }
                            }
                        }

                        if (codePoint === null) {
                            // we did not generate a valid codePoint so insert a
                            // replacement char (U+FFFD) and advance only 1 byte
                            codePoint = 0xFFFD
                            bytesPerSequence = 1
                        } else if (codePoint > 0xFFFF) {
                            // encode to utf16 (surrogate pair dance)
                            codePoint -= 0x10000
                            res.push(codePoint >>> 10 & 0x3FF | 0xD800)
                            codePoint = 0xDC00 | codePoint & 0x3FF
                        }

                        res.push(codePoint)
                        i += bytesPerSequence
                    }

                    return decodeCodePointsArray(res)
                }

                // Based on http://stackoverflow.com/a/22747272/680742, the browser with
                // the lowest limit is Chrome, with 0x10000 args.
                // We go 1 magnitude less, for safety
                var MAX_ARGUMENTS_LENGTH = 0x1000

                function decodeCodePointsArray(codePoints) {
                    var len = codePoints.length
                    if (len <= MAX_ARGUMENTS_LENGTH) {
                        return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
                    }

                    // Decode in chunks to avoid "call stack size exceeded".
                    var res = ''
                    var i = 0
                    while (i < len) {
                        res += String.fromCharCode.apply(
                            String,
                            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
                        )
                    }
                    return res
                }

                function asciiSlice(buf, start, end) {
                    var ret = ''
                    end = Math.min(buf.length, end)

                    for (var i = start; i < end; ++i) {
                        ret += String.fromCharCode(buf[i] & 0x7F)
                    }
                    return ret
                }

                function latin1Slice(buf, start, end) {
                    var ret = ''
                    end = Math.min(buf.length, end)

                    for (var i = start; i < end; ++i) {
                        ret += String.fromCharCode(buf[i])
                    }
                    return ret
                }

                function hexSlice(buf, start, end) {
                    var len = buf.length

                    if (!start || start < 0) start = 0
                    if (!end || end < 0 || end > len) end = len

                    var out = ''
                    for (var i = start; i < end; ++i) {
                        out += toHex(buf[i])
                    }
                    return out
                }

                function utf16leSlice(buf, start, end) {
                    var bytes = buf.slice(start, end)
                    var res = ''
                    for (var i = 0; i < bytes.length; i += 2) {
                        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
                    }
                    return res
                }

                Buffer.prototype.slice = function slice(start, end) {
                    var len = this.length
                    start = ~~start
                    end = end === undefined ? len : ~~end

                    if (start < 0) {
                        start += len
                        if (start < 0) start = 0
                    } else if (start > len) {
                        start = len
                    }

                    if (end < 0) {
                        end += len
                        if (end < 0) end = 0
                    } else if (end > len) {
                        end = len
                    }

                    if (end < start) end = start

                    var newBuf = this.subarray(start, end)
                        // Return an augmented `Uint8Array` instance
                    newBuf.__proto__ = Buffer.prototype
                    return newBuf
                }

                /*
                 * Need to make sure that buffer isn't trying to write out of bounds.
                 */
                function checkOffset(offset, ext, length) {
                    if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
                    if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
                }

                Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
                    offset = offset >>> 0
                    byteLength = byteLength >>> 0
                    if (!noAssert) checkOffset(offset, byteLength, this.length)

                    var val = this[offset]
                    var mul = 1
                    var i = 0
                    while (++i < byteLength && (mul *= 0x100)) {
                        val += this[offset + i] * mul
                    }

                    return val
                }

                Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
                    offset = offset >>> 0
                    byteLength = byteLength >>> 0
                    if (!noAssert) {
                        checkOffset(offset, byteLength, this.length)
                    }

                    var val = this[offset + --byteLength]
                    var mul = 1
                    while (byteLength > 0 && (mul *= 0x100)) {
                        val += this[offset + --byteLength] * mul
                    }

                    return val
                }

                Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
                    offset = offset >>> 0
                    if (!noAssert) checkOffset(offset, 1, this.length)
                    return this[offset]
                }

                Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
                    offset = offset >>> 0
                    if (!noAssert) checkOffset(offset, 2, this.length)
                    return this[offset] | (this[offset + 1] << 8)
                }

                Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
                    offset = offset >>> 0
                    if (!noAssert) checkOffset(offset, 2, this.length)
                    return (this[offset] << 8) | this[offset + 1]
                }

                Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
                    offset = offset >>> 0
                    if (!noAssert) checkOffset(offset, 4, this.length)

                    return ((this[offset]) |
                            (this[offset + 1] << 8) |
                            (this[offset + 2] << 16)) +
                        (this[offset + 3] * 0x1000000)
                }

                Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
                    offset = offset >>> 0
                    if (!noAssert) checkOffset(offset, 4, this.length)

                    return (this[offset] * 0x1000000) +
                        ((this[offset + 1] << 16) |
                            (this[offset + 2] << 8) |
                            this[offset + 3])
                }

                Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
                    offset = offset >>> 0
                    byteLength = byteLength >>> 0
                    if (!noAssert) checkOffset(offset, byteLength, this.length)

                    var val = this[offset]
                    var mul = 1
                    var i = 0
                    while (++i < byteLength && (mul *= 0x100)) {
                        val += this[offset + i] * mul
                    }
                    mul *= 0x80

                    if (val >= mul) val -= Math.pow(2, 8 * byteLength)

                    return val
                }

                Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
                    offset = offset >>> 0
                    byteLength = byteLength >>> 0
                    if (!noAssert) checkOffset(offset, byteLength, this.length)

                    var i = byteLength
                    var mul = 1
                    var val = this[offset + --i]
                    while (i > 0 && (mul *= 0x100)) {
                        val += this[offset + --i] * mul
                    }
                    mul *= 0x80

                    if (val >= mul) val -= Math.pow(2, 8 * byteLength)

                    return val
                }

                Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
                    offset = offset >>> 0
                    if (!noAssert) checkOffset(offset, 1, this.length)
                    if (!(this[offset] & 0x80)) return (this[offset])
                    return ((0xff - this[offset] + 1) * -1)
                }

                Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
                    offset = offset >>> 0
                    if (!noAssert) checkOffset(offset, 2, this.length)
                    var val = this[offset] | (this[offset + 1] << 8)
                    return (val & 0x8000) ? val | 0xFFFF0000 : val
                }

                Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
                    offset = offset >>> 0
                    if (!noAssert) checkOffset(offset, 2, this.length)
                    var val = this[offset + 1] | (this[offset] << 8)
                    return (val & 0x8000) ? val | 0xFFFF0000 : val
                }

                Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
                    offset = offset >>> 0
                    if (!noAssert) checkOffset(offset, 4, this.length)

                    return (this[offset]) |
                        (this[offset + 1] << 8) |
                        (this[offset + 2] << 16) |
                        (this[offset + 3] << 24)
                }

                Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
                    offset = offset >>> 0
                    if (!noAssert) checkOffset(offset, 4, this.length)

                    return (this[offset] << 24) |
                        (this[offset + 1] << 16) |
                        (this[offset + 2] << 8) |
                        (this[offset + 3])
                }

                Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
                    offset = offset >>> 0
                    if (!noAssert) checkOffset(offset, 4, this.length)
                    return ieee754.read(this, offset, true, 23, 4)
                }

                Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
                    offset = offset >>> 0
                    if (!noAssert) checkOffset(offset, 4, this.length)
                    return ieee754.read(this, offset, false, 23, 4)
                }

                Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
                    offset = offset >>> 0
                    if (!noAssert) checkOffset(offset, 8, this.length)
                    return ieee754.read(this, offset, true, 52, 8)
                }

                Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
                    offset = offset >>> 0
                    if (!noAssert) checkOffset(offset, 8, this.length)
                    return ieee754.read(this, offset, false, 52, 8)
                }

                function checkInt(buf, value, offset, ext, max, min) {
                    if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
                    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
                    if (offset + ext > buf.length) throw new RangeError('Index out of range')
                }

                Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
                    value = +value
                    offset = offset >>> 0
                    byteLength = byteLength >>> 0
                    if (!noAssert) {
                        var maxBytes = Math.pow(2, 8 * byteLength) - 1
                        checkInt(this, value, offset, byteLength, maxBytes, 0)
                    }

                    var mul = 1
                    var i = 0
                    this[offset] = value & 0xFF
                    while (++i < byteLength && (mul *= 0x100)) {
                        this[offset + i] = (value / mul) & 0xFF
                    }

                    return offset + byteLength
                }

                Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
                    value = +value
                    offset = offset >>> 0
                    byteLength = byteLength >>> 0
                    if (!noAssert) {
                        var maxBytes = Math.pow(2, 8 * byteLength) - 1
                        checkInt(this, value, offset, byteLength, maxBytes, 0)
                    }

                    var i = byteLength - 1
                    var mul = 1
                    this[offset + i] = value & 0xFF
                    while (--i >= 0 && (mul *= 0x100)) {
                        this[offset + i] = (value / mul) & 0xFF
                    }

                    return offset + byteLength
                }

                Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
                    value = +value
                    offset = offset >>> 0
                    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
                    this[offset] = (value & 0xff)
                    return offset + 1
                }

                Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
                    value = +value
                    offset = offset >>> 0
                    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
                    this[offset] = (value & 0xff)
                    this[offset + 1] = (value >>> 8)
                    return offset + 2
                }

                Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
                    value = +value
                    offset = offset >>> 0
                    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
                    this[offset] = (value >>> 8)
                    this[offset + 1] = (value & 0xff)
                    return offset + 2
                }

                Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
                    value = +value
                    offset = offset >>> 0
                    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
                    this[offset + 3] = (value >>> 24)
                    this[offset + 2] = (value >>> 16)
                    this[offset + 1] = (value >>> 8)
                    this[offset] = (value & 0xff)
                    return offset + 4
                }

                Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
                    value = +value
                    offset = offset >>> 0
                    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
                    this[offset] = (value >>> 24)
                    this[offset + 1] = (value >>> 16)
                    this[offset + 2] = (value >>> 8)
                    this[offset + 3] = (value & 0xff)
                    return offset + 4
                }

                Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
                    value = +value
                    offset = offset >>> 0
                    if (!noAssert) {
                        var limit = Math.pow(2, 8 * byteLength - 1)

                        checkInt(this, value, offset, byteLength, limit - 1, -limit)
                    }

                    var i = 0
                    var mul = 1
                    var sub = 0
                    this[offset] = value & 0xFF
                    while (++i < byteLength && (mul *= 0x100)) {
                        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
                            sub = 1
                        }
                        this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
                    }

                    return offset + byteLength
                }

                Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
                    value = +value
                    offset = offset >>> 0
                    if (!noAssert) {
                        var limit = Math.pow(2, 8 * byteLength - 1)

                        checkInt(this, value, offset, byteLength, limit - 1, -limit)
                    }

                    var i = byteLength - 1
                    var mul = 1
                    var sub = 0
                    this[offset + i] = value & 0xFF
                    while (--i >= 0 && (mul *= 0x100)) {
                        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
                            sub = 1
                        }
                        this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
                    }

                    return offset + byteLength
                }

                Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
                    value = +value
                    offset = offset >>> 0
                    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
                    if (value < 0) value = 0xff + value + 1
                    this[offset] = (value & 0xff)
                    return offset + 1
                }

                Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
                    value = +value
                    offset = offset >>> 0
                    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
                    this[offset] = (value & 0xff)
                    this[offset + 1] = (value >>> 8)
                    return offset + 2
                }

                Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
                    value = +value
                    offset = offset >>> 0
                    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
                    this[offset] = (value >>> 8)
                    this[offset + 1] = (value & 0xff)
                    return offset + 2
                }

                Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
                    value = +value
                    offset = offset >>> 0
                    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
                    this[offset] = (value & 0xff)
                    this[offset + 1] = (value >>> 8)
                    this[offset + 2] = (value >>> 16)
                    this[offset + 3] = (value >>> 24)
                    return offset + 4
                }

                Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
                    value = +value
                    offset = offset >>> 0
                    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
                    if (value < 0) value = 0xffffffff + value + 1
                    this[offset] = (value >>> 24)
                    this[offset + 1] = (value >>> 16)
                    this[offset + 2] = (value >>> 8)
                    this[offset + 3] = (value & 0xff)
                    return offset + 4
                }

                function checkIEEE754(buf, value, offset, ext, max, min) {
                    if (offset + ext > buf.length) throw new RangeError('Index out of range')
                    if (offset < 0) throw new RangeError('Index out of range')
                }

                function writeFloat(buf, value, offset, littleEndian, noAssert) {
                    value = +value
                    offset = offset >>> 0
                    if (!noAssert) {
                        checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
                    }
                    ieee754.write(buf, value, offset, littleEndian, 23, 4)
                    return offset + 4
                }

                Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
                    return writeFloat(this, value, offset, true, noAssert)
                }

                Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
                    return writeFloat(this, value, offset, false, noAssert)
                }

                function writeDouble(buf, value, offset, littleEndian, noAssert) {
                    value = +value
                    offset = offset >>> 0
                    if (!noAssert) {
                        checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
                    }
                    ieee754.write(buf, value, offset, littleEndian, 52, 8)
                    return offset + 8
                }

                Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
                    return writeDouble(this, value, offset, true, noAssert)
                }

                Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
                    return writeDouble(this, value, offset, false, noAssert)
                }

                // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
                Buffer.prototype.copy = function copy(target, targetStart, start, end) {
                    if (!start) start = 0
                    if (!end && end !== 0) end = this.length
                    if (targetStart >= target.length) targetStart = target.length
                    if (!targetStart) targetStart = 0
                    if (end > 0 && end < start) end = start

                    // Copy 0 bytes; we're done
                    if (end === start) return 0
                    if (target.length === 0 || this.length === 0) return 0

                    // Fatal error conditions
                    if (targetStart < 0) {
                        throw new RangeError('targetStart out of bounds')
                    }
                    if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
                    if (end < 0) throw new RangeError('sourceEnd out of bounds')

                    // Are we oob?
                    if (end > this.length) end = this.length
                    if (target.length - targetStart < end - start) {
                        end = target.length - targetStart + start
                    }

                    var len = end - start
                    var i

                    if (this === target && start < targetStart && targetStart < end) {
                        // descending copy from end
                        for (i = len - 1; i >= 0; --i) {
                            target[i + targetStart] = this[i + start]
                        }
                    } else if (len < 1000) {
                        // ascending copy from start
                        for (i = 0; i < len; ++i) {
                            target[i + targetStart] = this[i + start]
                        }
                    } else {
                        Uint8Array.prototype.set.call(
                            target,
                            this.subarray(start, start + len),
                            targetStart
                        )
                    }

                    return len
                }

                // Usage:
                //    buffer.fill(number[, offset[, end]])
                //    buffer.fill(buffer[, offset[, end]])
                //    buffer.fill(string[, offset[, end]][, encoding])
                Buffer.prototype.fill = function fill(val, start, end, encoding) {
                    // Handle string cases:
                    if (typeof val === 'string') {
                        if (typeof start === 'string') {
                            encoding = start
                            start = 0
                            end = this.length
                        } else if (typeof end === 'string') {
                            encoding = end
                            end = this.length
                        }
                        if (val.length === 1) {
                            var code = val.charCodeAt(0)
                            if (code < 256) {
                                val = code
                            }
                        }
                        if (encoding !== undefined && typeof encoding !== 'string') {
                            throw new TypeError('encoding must be a string')
                        }
                        if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
                            throw new TypeError('Unknown encoding: ' + encoding)
                        }
                    } else if (typeof val === 'number') {
                        val = val & 255
                    }

                    // Invalid ranges are not set to a default, so can range check early.
                    if (start < 0 || this.length < start || this.length < end) {
                        throw new RangeError('Out of range index')
                    }

                    if (end <= start) {
                        return this
                    }

                    start = start >>> 0
                    end = end === undefined ? this.length : end >>> 0

                    if (!val) val = 0

                    var i
                    if (typeof val === 'number') {
                        for (i = start; i < end; ++i) {
                            this[i] = val
                        }
                    } else {
                        var bytes = Buffer.isBuffer(val) ?
                            val :
                            new Buffer(val, encoding)
                        var len = bytes.length
                        for (i = 0; i < end - start; ++i) {
                            this[i + start] = bytes[i % len]
                        }
                    }

                    return this
                }

                // HELPER FUNCTIONS
                // ================

                var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

                function base64clean(str) {
                    // Node strips out invalid characters like \n and \t from the string, base64-js does not
                    str = stringtrim(str).replace(INVALID_BASE64_RE, '')
                        // Node converts strings with length < 2 to ''
                    if (str.length < 2) return ''
                        // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
                    while (str.length % 4 !== 0) {
                        str = str + '='
                    }
                    return str
                }

                function stringtrim(str) {
                    if (str.trim) return str.trim()
                    return str.replace(/^\s+|\s+$/g, '')
                }

                function toHex(n) {
                    if (n < 16) return '0' + n.toString(16)
                    return n.toString(16)
                }

                function utf8ToBytes(string, units) {
                    units = units || Infinity
                    var codePoint
                    var length = string.length
                    var leadSurrogate = null
                    var bytes = []

                    for (var i = 0; i < length; ++i) {
                        codePoint = string.charCodeAt(i)

                        // is surrogate component
                        if (codePoint > 0xD7FF && codePoint < 0xE000) {
                            // last char was a lead
                            if (!leadSurrogate) {
                                // no lead yet
                                if (codePoint > 0xDBFF) {
                                    // unexpected trail
                                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                                    continue
                                } else if (i + 1 === length) {
                                    // unpaired lead
                                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                                    continue
                                }

                                // valid lead
                                leadSurrogate = codePoint

                                continue
                            }

                            // 2 leads in a row
                            if (codePoint < 0xDC00) {
                                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                                leadSurrogate = codePoint
                                continue
                            }

                            // valid surrogate pair
                            codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
                        } else if (leadSurrogate) {
                            // valid bmp char, but last char was a lead
                            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                        }

                        leadSurrogate = null

                        // encode utf8
                        if (codePoint < 0x80) {
                            if ((units -= 1) < 0) break
                            bytes.push(codePoint)
                        } else if (codePoint < 0x800) {
                            if ((units -= 2) < 0) break
                            bytes.push(
                                codePoint >> 0x6 | 0xC0,
                                codePoint & 0x3F | 0x80
                            )
                        } else if (codePoint < 0x10000) {
                            if ((units -= 3) < 0) break
                            bytes.push(
                                codePoint >> 0xC | 0xE0,
                                codePoint >> 0x6 & 0x3F | 0x80,
                                codePoint & 0x3F | 0x80
                            )
                        } else if (codePoint < 0x110000) {
                            if ((units -= 4) < 0) break
                            bytes.push(
                                codePoint >> 0x12 | 0xF0,
                                codePoint >> 0xC & 0x3F | 0x80,
                                codePoint >> 0x6 & 0x3F | 0x80,
                                codePoint & 0x3F | 0x80
                            )
                        } else {
                            throw new Error('Invalid code point')
                        }
                    }

                    return bytes
                }

                function asciiToBytes(str) {
                    var byteArray = []
                    for (var i = 0; i < str.length; ++i) {
                        // Node's code seems to be doing this and not & 0x7F..
                        byteArray.push(str.charCodeAt(i) & 0xFF)
                    }
                    return byteArray
                }

                function utf16leToBytes(str, units) {
                    var c, hi, lo
                    var byteArray = []
                    for (var i = 0; i < str.length; ++i) {
                        if ((units -= 2) < 0) break

                        c = str.charCodeAt(i)
                        hi = c >> 8
                        lo = c % 256
                        byteArray.push(lo)
                        byteArray.push(hi)
                    }

                    return byteArray
                }

                function base64ToBytes(str) {
                    return base64.toByteArray(base64clean(str))
                }

                function blitBuffer(src, dst, offset, length) {
                    for (var i = 0; i < length; ++i) {
                        if ((i + offset >= dst.length) || (i >= src.length)) break
                        dst[i + offset] = src[i]
                    }
                    return i
                }

                function isnan(val) {
                    return val !== val // eslint-disable-line no-self-compare
                }
            }
        });
        return ___scope___.entry = "index.js";
    });
    FuseBox.pkg("base64-js", {}, function(___scope___) {
        ___scope___.file("index.js", function(exports, require, module, __filename, __dirname) {

            'use strict'

            exports.byteLength = byteLength
            exports.toByteArray = toByteArray
            exports.fromByteArray = fromByteArray

            var lookup = []
            var revLookup = []
            var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

            var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
            for (var i = 0, len = code.length; i < len; ++i) {
                lookup[i] = code[i]
                revLookup[code.charCodeAt(i)] = i
            }

            revLookup['-'.charCodeAt(0)] = 62
            revLookup['_'.charCodeAt(0)] = 63

            function placeHoldersCount(b64) {
                var len = b64.length
                if (len % 4 > 0) {
                    throw new Error('Invalid string. Length must be a multiple of 4')
                }

                // the number of equal signs (place holders)
                // if there are two placeholders, than the two characters before it
                // represent one byte
                // if there is only one, then the three characters before it represent 2 bytes
                // this is just a cheap hack to not do indexOf twice
                return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
            }

            function byteLength(b64) {
                // base64 is 4/3 + up to two characters of the original data
                return b64.length * 3 / 4 - placeHoldersCount(b64)
            }

            function toByteArray(b64) {
                var i, j, l, tmp, placeHolders, arr
                var len = b64.length
                placeHolders = placeHoldersCount(b64)

                arr = new Arr(len * 3 / 4 - placeHolders)

                // if there are placeholders, only get up to the last complete 4 chars
                l = placeHolders > 0 ? len - 4 : len

                var L = 0

                for (i = 0, j = 0; i < l; i += 4, j += 3) {
                    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
                    arr[L++] = (tmp >> 16) & 0xFF
                    arr[L++] = (tmp >> 8) & 0xFF
                    arr[L++] = tmp & 0xFF
                }

                if (placeHolders === 2) {
                    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
                    arr[L++] = tmp & 0xFF
                } else if (placeHolders === 1) {
                    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
                    arr[L++] = (tmp >> 8) & 0xFF
                    arr[L++] = tmp & 0xFF
                }

                return arr
            }

            function tripletToBase64(num) {
                return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
            }

            function encodeChunk(uint8, start, end) {
                var tmp
                var output = []
                for (var i = start; i < end; i += 3) {
                    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
                    output.push(tripletToBase64(tmp))
                }
                return output.join('')
            }

            function fromByteArray(uint8) {
                var tmp
                var len = uint8.length
                var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
                var output = ''
                var parts = []
                var maxChunkLength = 16383 // must be multiple of 3

                // go through the array every three bytes, we'll deal with trailing stuff later
                for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
                    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
                }

                // pad the end with zeros, but make sure to not forget the extra bytes
                if (extraBytes === 1) {
                    tmp = uint8[len - 1]
                    output += lookup[tmp >> 2]
                    output += lookup[(tmp << 4) & 0x3F]
                    output += '=='
                } else if (extraBytes === 2) {
                    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
                    output += lookup[tmp >> 10]
                    output += lookup[(tmp >> 4) & 0x3F]
                    output += lookup[(tmp << 2) & 0x3F]
                    output += '='
                }

                parts.push(output)

                return parts.join('')
            }

        });
        return ___scope___.entry = "index.js";
    });
    FuseBox.pkg("ieee754", {}, function(___scope___) {
        ___scope___.file("index.js", function(exports, require, module, __filename, __dirname) {

            exports.read = function(buffer, offset, isLE, mLen, nBytes) {
                var e, m
                var eLen = nBytes * 8 - mLen - 1
                var eMax = (1 << eLen) - 1
                var eBias = eMax >> 1
                var nBits = -7
                var i = isLE ? (nBytes - 1) : 0
                var d = isLE ? -1 : 1
                var s = buffer[offset + i]

                i += d

                e = s & ((1 << (-nBits)) - 1)
                s >>= (-nBits)
                nBits += eLen
                for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

                m = e & ((1 << (-nBits)) - 1)
                e >>= (-nBits)
                nBits += mLen
                for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

                if (e === 0) {
                    e = 1 - eBias
                } else if (e === eMax) {
                    return m ? NaN : ((s ? -1 : 1) * Infinity)
                } else {
                    m = m + Math.pow(2, mLen)
                    e = e - eBias
                }
                return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
            }

            exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
                var e, m, c
                var eLen = nBytes * 8 - mLen - 1
                var eMax = (1 << eLen) - 1
                var eBias = eMax >> 1
                var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
                var i = isLE ? 0 : (nBytes - 1)
                var d = isLE ? 1 : -1
                var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

                value = Math.abs(value)

                if (isNaN(value) || value === Infinity) {
                    m = isNaN(value) ? 1 : 0
                    e = eMax
                } else {
                    e = Math.floor(Math.log(value) / Math.LN2)
                    if (value * (c = Math.pow(2, -e)) < 1) {
                        e--
                        c *= 2
                    }
                    if (e + eBias >= 1) {
                        value += rt / c
                    } else {
                        value += rt * Math.pow(2, 1 - eBias)
                    }
                    if (value * c >= 2) {
                        e++
                        c /= 2
                    }

                    if (e + eBias >= eMax) {
                        m = 0
                        e = eMax
                    } else if (e + eBias >= 1) {
                        m = (value * c - 1) * Math.pow(2, mLen)
                        e = e + eBias
                    } else {
                        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
                        e = 0
                    }
                }

                for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

                e = (e << mLen) | m
                eLen += mLen
                for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

                buffer[offset + i - d] |= s * 128
            }

        });
        return ___scope___.entry = "index.js";
    });
    FuseBox.defaultPackageName = "fuse-box4-test";
})
(function(e) {
    if (e.FuseBox) return e.FuseBox;
    var r = "undefined" != typeof window && window.navigator;
    r && (window.global = window), e = r && "undefined" == typeof __fbx__dnm__ ? e : module.exports;
    var n = r ? window.__fsbx__ = window.__fsbx__ || {} : global.$fsbx = global.$fsbx || {};
    r || (global.require = require);
    var t = n.p = n.p || {},
        i = n.e = n.e || {},
        a = function(e) {
            var n = e.charCodeAt(0),
                t = e.charCodeAt(1);
            if ((r || 58 !== t) && (n >= 97 && n <= 122 || 64 === n)) {
                if (64 === n) {
                    var i = e.split("/"),
                        a = i.splice(2, i.length).join("/");
                    return [i[0] + "/" + i[1], a || void 0]
                }
                var o = e.indexOf("/");
                if (o === -1) return [e];
                var f = e.substring(0, o),
                    u = e.substring(o + 1);
                return [f, u]
            }
        },
        o = function(e) { return e.substring(0, e.lastIndexOf("/")) || "./" },
        f = function() {
            for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
            for (var n = [], t = 0, i = arguments.length; t < i; t++) n = n.concat(arguments[t].split("/"));
            for (var a = [], t = 0, i = n.length; t < i; t++) {
                var o = n[t];
                o && "." !== o && (".." === o ? a.pop() : a.push(o))
            }
            return "" === n[0] && a.unshift(""), a.join("/") || (a.length ? "/" : ".")
        },
        u = function(e) { var r = e.match(/\.(\w{1,})$/); if (r) { var n = r[1]; return n ? e : e + ".js" } return e + ".js" },
        s = function(e) {
            if (r) {
                var n, t = document,
                    i = t.getElementsByTagName("head")[0];
                /\.css$/.test(e) ? (n = t.createElement("link"), n.rel = "stylesheet", n.type = "text/css", n.href = e) : (n = t.createElement("script"), n.type = "text/javascript", n.src = e, n.async = !0), i.insertBefore(n, i.firstChild)
            }
        },
        l = function(e, r) { for (var n in e) e.hasOwnProperty(n) && r(n, e[n]) },
        c = function(e) { return { server: require(e) } },
        v = function(e, n) {
            var i = n.path || "./",
                o = n.pkg || "default",
                s = a(e);
            if (s && (i = "./", o = s[0], n.v && n.v[o] && (o = o + "@" + n.v[o]), e = s[1]), e)
                if (126 === e.charCodeAt(0)) e = e.slice(2, e.length), i = "./";
                else if (!r && (47 === e.charCodeAt(0) || 58 === e.charCodeAt(1))) return c(e);
            var l = t[o];
            if (!l) { if (r) throw 'Package was not found "' + o + '"'; return c(o + (e ? "/" + e : "")) }
            e || (e = "./" + l.s.entry);
            var v, d = f(i, e),
                p = u(d),
                g = l.f[p];
            return !g && p.indexOf("*") > -1 && (v = p), g || v || (p = f(d, "/", "index.js"), g = l.f[p], g || (p = d + ".js", g = l.f[p]), g || (g = l.f[d + ".jsx"]), g || (p = d + "/index.jsx", g = l.f[p])), { file: g, wildcard: v, pkgName: o, versions: l.v, filePath: d, validPath: p }
        },
        d = function(e, n) {
            if (!r) return n(/\.(js|json)$/.test(e) ? global.require(e) : "");
            var t;
            t = new XMLHttpRequest, t.onreadystatechange = function() {
                if (4 == t.readyState)
                    if (200 == t.status) {
                        var r = t.getResponseHeader("Content-Type"),
                            i = t.responseText;
                        /json/.test(r) ? i = "module.exports = " + i : /javascript/.test(r) || (i = "module.exports = " + JSON.stringify(i));
                        var a = f("./", e);
                        h.dynamic(a, i), n(h.import(e, {}))
                    } else console.error(e + " was not found upon request"), n(void 0)
            }, t.open("GET", e, !0), t.send()
        },
        p = function(e, r) {
            var n = i[e];
            if (n)
                for (var t in n) { var a = n[t].apply(null, r); if (a === !1) return !1 }
        },
        g = function(e, n) {
            if (void 0 === n && (n = {}), 58 === e.charCodeAt(4) || 58 === e.charCodeAt(5)) return s(e);
            var i = v(e, n);
            if (i.server) return i.server;
            var a = i.file;
            if (i.wildcard) {
                var f = new RegExp(i.wildcard.replace(/\*/g, "@").replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&").replace(/@/g, "[a-z0-9$_-]+"), "i"),
                    u = t[i.pkgName];
                if (u) { var l = {}; for (var c in u.f) f.test(c) && (l[c] = g(i.pkgName + "/" + c)); return l }
            }
            if (!a) {
                var h = "function" == typeof n,
                    m = p("async", [e, n]);
                if (m === !1) return;
                return d(e, function(e) { if (h) return n(e) })
            }
            var x = i.validPath,
                _ = i.pkgName;
            if (a.locals && a.locals.module) return a.locals.module.exports;
            var w = a.locals = {},
                y = o(x);
            w.exports = {}, w.module = { exports: w.exports }, w.require = function(e, r) { return g(e, { pkg: _, path: y, v: i.versions }) }, w.require.main = { filename: r ? "./" : global.require.main.filename, paths: r ? [] : global.require.main.paths };
            var b = [w.module.exports, w.require, w.module, x, y, _];
            p("before-import", b);
            var j = a.fn;
            return j.apply(0, b), p("after-import", b), w.module.exports
        },
        h = function() {
            function n() {}
            return n.global = function(e, n) { var t = r ? window : global; return void 0 === n ? t[e] : void(t[e] = n) }, n.import = function(e, r) { return g(e, r) }, n.on = function(e, r) { i[e] = i[e] || [], i[e].push(r) }, n.exists = function(e) { try { var r = v(e, {}); return void 0 !== r.file } catch (e) { return !1 } }, n.remove = function(e) {
                var r = v(e, {}),
                    n = t[r.pkgName];
                n && n.f[r.validPath] && delete n.f[r.validPath]
            }, n.main = function(e) { return this.mainFile = e, n.import(e, {}) }, n.expose = function(r) {
                var n = function(n) {
                    var t = r[n],
                        i = t.alias,
                        a = g(t.pkg);
                    "*" === i ? l(a, function(r, n) { return e[r] = n }) : "object" == typeof i ? l(i, function(r, n) { return e[n] = a[r] }) : e[i] = a
                };
                for (var t in r) n(t)
            }, n.dynamic = function(r, n, t) {
                var i = t && t.pkg || "default";
                this.pkg(i, {}, function(t) {
                    t.file(r, function(r, t, i, a, o) {
                        var f = new Function("__fbx__dnm__", "exports", "require", "module", "__filename", "__dirname", "__root__", n);
                        f(!0, r, t, i, a, o, e)
                    })
                })
            }, n.flush = function(e) {
                var r = t.default;
                for (var n in r.f) {
                    var i = !e || e(n);
                    if (i) {
                        var a = r.f[n];
                        delete a.locals
                    }
                }
            }, n.pkg = function(e, r, n) {
                if (t[e]) return n(t[e].s);
                var i = t[e] = {},
                    a = i.f = {};
                i.v = r;
                var o = i.s = { file: function(e, r) { a[e] = { fn: r } } };
                return n(o)
            }, n.addPlugin = function(e) { this.plugins.push(e) }, n
        }();
    return h.packages = t, h.isBrowser = void 0 !== r, h.isServer = !r, h.plugins = [], e.FuseBox = h
}(this))