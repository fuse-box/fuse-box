    if (typeof global === "object") {
        global.require = require;
    }
    var _bca95ef7 = {};
    _bca95ef7.f = {}
    // cached modules
    _bca95ef7.m = {};
    _bca95ef7.s = function(id) {
        var result = _bca95ef7.r(id);
        if (result === undefined) {
            return require(id);
        }
    }
    _bca95ef7.r = function(id) {
        var cached = _bca95ef7.m[id];
        // resolve if in cache
        if (cached) {
            return cached.m.exports;
        }
        var file = _bca95ef7.f[id];
        if (!file)
            return;
        cached = _bca95ef7.m[id] = {};
        cached.exports = {};
        cached.m = { exports: cached.exports };
        file(cached.m, cached.exports);
        return cached.m.exports;
    };
// default/index.js
_bca95ef7.f[0] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const CacheBreaker_1 = _bca95ef7.r(1);
const Utils_1 = _bca95ef7.r(3);
CacheBreaker_1.breakCache();
Utils_1.printCurrentVersion();
var WorkflowContext_1 = _bca95ef7.r(5);
exports.Plugin = WorkflowContext_1.Plugin;
exports.WorkFlowContext = WorkflowContext_1.WorkFlowContext;
var Bundle_1 = _bca95ef7.r(28);
exports.Bundle = Bundle_1.Bundle;
var BundleProducer_1 = _bca95ef7.r(40);
exports.BundleProducer = BundleProducer_1.BundleProducer;
var FuseBox_1 = _bca95ef7.r(29);
exports.FuseBoxOptions = FuseBox_1.FuseBoxOptions;
var QuantumOptions_1 = _bca95ef7.r(63);
exports.IQuantumExtensionParams = QuantumOptions_1.IQuantumExtensionParams;
var ComputerStatementRule_1 = _bca95ef7.r(64);
exports.ComputedStatementRule = ComputerStatementRule_1.ComputedStatementRule;
var QuantumPlugin_1 = _bca95ef7.r(65);
exports.QuantumPlugin = QuantumPlugin_1.QuantumPlugin;
var ReplacePlugin_1 = _bca95ef7.r(79);
exports.ReplacePlugin = ReplacePlugin_1.ReplacePlugin;
var VuePlugin_1 = _bca95ef7.r(80);
exports.VuePlugin = VuePlugin_1.VuePlugin;
var VuePlugin_2 = _bca95ef7.r(81);
exports.VueComponentPlugin = VuePlugin_2.VueComponentPlugin;
var ImageBase64Plugin_1 = _bca95ef7.r(95);
exports.ImageBase64Plugin = ImageBase64Plugin_1.ImageBase64Plugin;
var CSSResourcePlugin_1 = _bca95ef7.r(97);
exports.CSSResourcePlugin = CSSResourcePlugin_1.CSSResourcePlugin;
var HotReloadPlugin_1 = _bca95ef7.r(61);
exports.HotReloadPlugin = HotReloadPlugin_1.HotReloadPlugin;
var EnvPlugin_1 = _bca95ef7.r(99);
exports.EnvPlugin = EnvPlugin_1.EnvPlugin;
var ConcatPlugin_1 = _bca95ef7.r(100);
exports.ConcatPlugin = ConcatPlugin_1.ConcatPlugin;
var StylusPlugin_1 = _bca95ef7.r(87);
exports.StylusPlugin = StylusPlugin_1.StylusPlugin;
var PostCSSPlugin_1 = _bca95ef7.r(101);
exports.PostCSS = PostCSSPlugin_1.PostCSS;
var PostCSSPlugin_2 = _bca95ef7.r(101);
exports.PostCSSPlugin = PostCSSPlugin_2.PostCSS;
var TypeScriptHelpers_1 = _bca95ef7.r(102);
exports.TypeScriptHelpers = TypeScriptHelpers_1.TypeScriptHelpers;
var SVGPlugin_1 = _bca95ef7.r(103);
exports.SVGPlugin = SVGPlugin_1.SVGPlugin;
var BabelPlugin_1 = _bca95ef7.r(89);
exports.BabelPlugin = BabelPlugin_1.BabelPlugin;
var BublePlugin_1 = _bca95ef7.r(104);
exports.BublePlugin = BublePlugin_1.BublePlugin;
var CoffeePlugin_1 = _bca95ef7.r(90);
exports.CoffeePlugin = CoffeePlugin_1.CoffeePlugin;
var LESSPlugin_1 = _bca95ef7.r(85);
exports.LESSPlugin = LESSPlugin_1.LESSPlugin;
var CSSplugin_1 = _bca95ef7.r(82);
exports.CSSPlugin = CSSplugin_1.CSSPlugin;
var HTMLplugin_1 = _bca95ef7.r(88);
exports.HTMLPlugin = HTMLplugin_1.HTMLPlugin;
var Markdownplugin_1 = _bca95ef7.r(105);
exports.MarkdownPlugin = Markdownplugin_1.MarkdownPlugin;
var JSONplugin_1 = _bca95ef7.r(34);
exports.JSONPlugin = JSONplugin_1.JSONPlugin;
var BannerPlugin_1 = _bca95ef7.r(106);
exports.BannerPlugin = BannerPlugin_1.BannerPlugin;
var SassPlugin_1 = _bca95ef7.r(86);
exports.SassPlugin = SassPlugin_1.SassPlugin;
var UglifyESPlugin_1 = _bca95ef7.r(107);
exports.UglifyESPlugin = UglifyESPlugin_1.UglifyESPlugin;
var UglifyJSPlugin_1 = _bca95ef7.r(108);
exports.UglifyJSPlugin = UglifyJSPlugin_1.UglifyJSPlugin;
var SourceMapPlainJsPlugin_1 = _bca95ef7.r(109);
exports.SourceMapPlainJsPlugin = SourceMapPlainJsPlugin_1.SourceMapPlainJsPlugin;
var RawPlugin_1 = _bca95ef7.r(110);
exports.RawPlugin = RawPlugin_1.RawPlugin;
var OptimizeJSPlugin_1 = _bca95ef7.r(111);
exports.OptimizeJSPlugin = OptimizeJSPlugin_1.OptimizeJSPlugin;
var Fluent_1 = _bca95ef7.r(38);
exports.Fluent = Fluent_1.Fluent;
var FuseBox_2 = _bca95ef7.r(29);
exports.FuseBox = FuseBox_2.FuseBox;
var Sparky_1 = _bca95ef7.r(112);
exports.Sparky = Sparky_1.Sparky;
var Cli_1 = _bca95ef7.r(117);
exports.CLI = Cli_1.CLI;
var CSSModules_1 = _bca95ef7.r(118);
exports.CSSModules = CSSModules_1.CSSModules;
var CopyPlugin_1 = _bca95ef7.r(119);
exports.CopyPlugin = CopyPlugin_1.CopyPlugin;
var WebIndexPlugin_1 = _bca95ef7.r(120);
exports.WebIndexPlugin = WebIndexPlugin_1.WebIndexPlugin;
var PlainJSPlugin_1 = _bca95ef7.r(121);
exports.PlainJSPlugin = PlainJSPlugin_1.PlainJSPlugin;
var ConsolidatePlugin_1 = _bca95ef7.r(91);
exports.ConsolidatePlugin = ConsolidatePlugin_1.ConsolidatePlugin;
var File_1 = _bca95ef7.r(7);
exports.File = File_1.File;
}
// default/CacheBreaker.js
_bca95ef7.f[1] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const Config_1 = _bca95ef7.r(2);
const path = _bca95ef7.s('path');
const Utils_1 = _bca95ef7.r(3);
const fs = _bca95ef7.s('fs');
const Log_1 = _bca95ef7.r(4);
function breakCache() {
    const mainFile = require.main.filename;
    const fileKey = Utils_1.fastHash(mainFile);
    const currentStat = fs.statSync(mainFile);
    const fileModificationTime = currentStat.mtime.getTime();
    const bustingCacheFolder = path.join(Config_1.Config.NODE_MODULES_DIR, 'fuse-box/.cache-busting');
    try {
        Utils_1.ensureDir(bustingCacheFolder);
    } catch (error) {
        return;
    }
    const infoFile = path.join(bustingCacheFolder, fileKey);
    if (fs.existsSync(infoFile)) {
        const lastModifiedStored = fs.readFileSync(infoFile).toString();
        if (fileModificationTime.toString() !== lastModifiedStored) {
            Log_1.Log.defer(log => log.echoGray(`--- cache cleared ---`));
            Utils_1.removeFolder(Config_1.Config.TEMP_FOLDER);
            fs.writeFileSync(infoFile, fileModificationTime.toString());
        }
    } else {
        fs.writeFileSync(infoFile, fileModificationTime.toString());
    }
}
exports.breakCache = breakCache;
}
// default/Config.js
_bca95ef7.f[2] = function(module,exports){
var __dirname = ".";
Object.defineProperty(exports, '__esModule', { value: true });
const appRoot = _bca95ef7.s('app-root-path');
const path = _bca95ef7.s('path');
const PROJECT_ROOT = process.env.FUSEBOX_DIST_ROOT || path.resolve(__dirname);
const MAIN_FILE = require.main.filename;
if (MAIN_FILE.indexOf('gulp.js') > -1 && !process.env.PROJECT_ROOT) {
    console.warn('FuseBox wasn\'t able to detect your project root! You are running gulp!');
    console.warn('Please set process.env.PROJECT_ROOT');
}
class Configuration {
    constructor() {
        this.NODE_MODULES_DIR = process.env.PROJECT_NODE_MODULES || path.join(appRoot.path, 'node_modules');
        this.FUSEBOX_ROOT = PROJECT_ROOT;
        this.FUSEBOX_MODULES = process.env.FUSEBOX_MODULES || path.join(PROJECT_ROOT, 'modules');
        this.TEMP_FOLDER = process.env.FUSEBOX_TEMP_FOLDER || path.join(appRoot.path, '.fusebox');
        this.PROJECT_FOLDER = appRoot.path;
        this.PROJECT_ROOT = process.env.PROJECT_ROOT || path.dirname(MAIN_FILE);
        this.FUSEBOX_VERSION = process.env.FUSEBOX_VERSION || _bca95ef7.s(path.join(PROJECT_ROOT, 'package.json')).version;
    }
}
exports.Config = new Configuration();
}
// default/Utils.js
_bca95ef7.f[3] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const path = _bca95ef7.s('path');
const fs = _bca95ef7.s('fs');
const fsExtra = _bca95ef7.s('fs-extra');
const realm_utils_1 = _bca95ef7.s('realm-utils');
const Config_1 = _bca95ef7.r(2);
const LegoAPI = _bca95ef7.s('lego-api');
const Log_1 = _bca95ef7.r(4);
const userFuseDir = Config_1.Config.PROJECT_ROOT;
const stylesheetExtensions = new Set([
    '.css',
    '.sass',
    '.scss',
    '.styl',
    '.less'
]);
const MBLACKLIST = [
    'freelist',
    'sys'
];
exports.Concat = _bca95ef7.s('concat-with-sourcemaps');
function contains(array, obj) {
    return array && array.indexOf(obj) > -1;
}
exports.contains = contains;
function replaceAliasRequireStatement(requireStatement, aliasName, aliasReplacement) {
    requireStatement = requireStatement.replace(aliasName, aliasReplacement);
    requireStatement = path.normalize(requireStatement);
    return requireStatement;
}
function jsCommentTemplate(fname, conditions, variables, raw, replaceRaw) {
    const contents = fs.readFileSync(fname).toString();
    let data = LegoAPI.parse(contents).render(conditions);
    for (let varName in variables) {
        data = data.replace(`$${ varName }$`, JSON.stringify(variables[varName]));
    }
    if (replaceRaw) {
        for (let varName in replaceRaw) {
            data = data.split(varName).join(replaceRaw[varName]);
        }
    }
    for (let varName in raw) {
        data = data.replace(`$${ varName }$`, raw[varName]);
    }
    return data;
}
exports.jsCommentTemplate = jsCommentTemplate;
function getFuseBoxInfo() {
    return _bca95ef7.s(path.join(Config_1.Config.FUSEBOX_ROOT, 'package.json'));
}
exports.getFuseBoxInfo = getFuseBoxInfo;
function printCurrentVersion() {
    const info = getFuseBoxInfo();
    Log_1.Log.defer(log => log.echoYellow(`--- FuseBox ${ info.version } ---`));
}
exports.printCurrentVersion = printCurrentVersion;
function uglify(contents, {
    es6 = false,
    ...opts
} = {}) {
    const UglifyJs = es6 ? _bca95ef7.s('uglify-es') : _bca95ef7.s('uglify-js');
    return UglifyJs.minify(contents.toString(), opts);
}
exports.uglify = uglify;
function readFuseBoxModule(target) {
    return fs.readFileSync(path.join(Config_1.Config.FUSEBOX_MODULES, target)).toString();
}
exports.readFuseBoxModule = readFuseBoxModule;
function write(fileName, contents) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, contents, e => {
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
        return group1 ? group1.toUpperCase() : '';
    }
    return str.replace(DEFAULT_REGEX, toUpper);
}
function parseQuery(qstr) {
    let query = new Map();
    let a = qstr.split('&');
    for (let i = 0; i < a.length; i++) {
        let b = a[i].split('=');
        query.set(decodeURIComponent(b[0]), decodeURIComponent(b[1] || ''));
    }
    return query;
}
function ensureUserPath(userPath) {
    if (!path.isAbsolute(userPath)) {
        userPath = path.join(userFuseDir, userPath);
    }
    userPath = path.normalize(userPath);
    let dir = path.dirname(userPath);
    fsExtra.ensureDirSync(dir);
    return userPath;
}
exports.ensureUserPath = ensureUserPath;
function ensureAbsolutePath(userPath) {
    if (!path.isAbsolute(userPath)) {
        return path.join(userFuseDir, userPath);
    }
    return userPath;
}
exports.ensureAbsolutePath = ensureAbsolutePath;
function joinFuseBoxPath(...any) {
    return ensureFuseBoxPath(path.join(...any));
}
exports.joinFuseBoxPath = joinFuseBoxPath;
function ensureDir(userPath) {
    if (!path.isAbsolute(userPath)) {
        userPath = path.join(userFuseDir, userPath);
    }
    userPath = path.normalize(userPath);
    fsExtra.ensureDirSync(userPath);
    return userPath;
}
exports.ensureDir = ensureDir;
function isStylesheetExtension(str) {
    let ext = path.extname(str);
    return stylesheetExtensions.has(ext);
}
exports.isStylesheetExtension = isStylesheetExtension;
function string2RegExp(obj) {
    let escapedRegEx = obj.replace(/\*/g, '@').replace(/[.?*+[\]-]/g, '\\$&').replace(/@@/g, '.*', 'i').replace(/@/g, '\\w{1,}', 'i');
    if (escapedRegEx.indexOf('$') === -1) {
        escapedRegEx += '$';
    }
    return new RegExp(escapedRegEx);
}
exports.string2RegExp = string2RegExp;
function removeFolder(userPath) {
    fsExtra.removeSync(userPath);
}
exports.removeFolder = removeFolder;
function replaceExt(npath, ext) {
    if (typeof npath !== 'string') {
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
function isGlob(str) {
    if (!str) {
        return false;
    }
    return /\*/.test(str);
}
function hashString(text) {
    var hash = 5381, index = text.length;
    while (index) {
        hash = hash * 33 ^ text.charCodeAt(--index);
    }
    let data = hash >>> 0;
    return data.toString(16);
}
exports.hashString = hashString;
function fastHash(text) {
    let hash = 0;
    if (text.length == 0)
        return hash;
    for (let i = 0; i < text.length; i++) {
        let char = text.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}
exports.fastHash = fastHash;
function extractExtension(str) {
    const result = str.match(/\.([a-z0-9]+)\$?$/);
    if (!result) {
        throw new Error(`Can't extract extension from string ${ str }`);
    }
    return result[1];
}
exports.extractExtension = extractExtension;
function ensureFuseBoxPath(input) {
    return input.replace(/\\/g, '/').replace(/\/$/, '');
}
exports.ensureFuseBoxPath = ensureFuseBoxPath;
function transpileToEs5(contents) {
    const ts = _bca95ef7.s('typescript');
    let tsconfg = {
        compilerOptions: {
            module: 'commonjs',
            target: 'es5'
        }
    };
    ;
    let result = ts.transpileModule(contents, tsconfg);
    return result.outputText;
}
exports.transpileToEs5 = transpileToEs5;
function ensurePublicExtension(url) {
    let ext = path.extname(url);
    if (ext === '.ts') {
        url = replaceExt(url, '.js');
    }
    if (ext === '.tsx') {
        url = replaceExt(url, '.jsx');
    }
    return url;
}
exports.ensurePublicExtension = ensurePublicExtension;
function getBuiltInNodeModules() {
    const process = global.process;
    return Object.keys(process.binding('natives')).filter(m => {
        return !/^_|^internal|\//.test(m) && MBLACKLIST.indexOf(m) === -1;
    });
}
function findFileBackwards(target, limitPath) {
    let [found, reachedLimit] = [
        false,
        false
    ];
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
        current = path.join(current, '..');
        iterations++;
        if (iterations > maxIterations) {
            reachedLimit = true;
        }
    }
}
exports.findFileBackwards = findFileBackwards;
function walk(dir, options) {
    var defaults = { recursive: false };
    options = Object.assign(defaults, options);
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (options.recursive) {
            if (stat && stat.isDirectory())
                results = results.concat(walk(file));
            else
                results.push(file);
        } else if (stat && stat.isFile()) {
            results.push(file);
        }
    });
    return results;
}
function filter(items, fn) {
    if (Array.isArray(items)) {
        return items.filter(fn);
    }
    if (realm_utils_1.utils.isPlainObject(items)) {
        let newObject = {};
        for (let key in items) {
            if (items.hasOwnProperty(key)) {
                if (fn(items[key], key)) {
                    newObject[key] = items[key];
                }
            }
        }
        return newObject;
    }
}
exports.filter = filter;
const readline = _bca95ef7.s('readline');
class Spinner {
    constructor(options) {
        this.text = '';
        this.title = '';
        this.chars = '\u280B\u2819\u2839\u2838\u283C\u2834\u2826\u2827\u2807\u280F';
        this.stream = process.stdout;
        this.delay = 60;
        if (typeof options === 'string') {
            options = { text: options };
        } else if (!options) {
            options = {};
        }
        if (options.text)
            this.text = options.text;
        if (options.onTick)
            this.onTick = options.onTick;
        if (options.stream)
            this.stream = options.stream;
        if (options.title)
            this.title = options.title;
        if (options.delay)
            this.delay = options.delay;
    }
    start() {
        let current = 0;
        this.id = setInterval(() => {
            let msg = this.chars[current] + ' ' + this.text;
            if (this.text.includes('%s')) {
                msg = this.text.replace('%s', this.chars[current]);
            }
            this.onTick(msg);
            current = ++current % this.chars.length;
        }, this.delay);
        return this;
    }
    stop(clear) {
        clearInterval(this.id);
        this.id = undefined;
        if (clear) {
            this.clearLine(this.stream);
        }
        return this;
    }
    isSpinning() {
        return this.id !== undefined;
    }
    onTick(msg) {
        this.clearLine(this.stream);
        this.stream.write(msg);
        return this;
    }
    clearLine(stream) {
        readline.clearLine(stream, 0);
        readline.cursorTo(stream, 0);
        return this;
    }
}
}
// default/Log.js
_bca95ef7.f[4] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const log = _bca95ef7.s('fliplog');
const prettysize = _bca95ef7.s('prettysize');
const prettyTime = _bca95ef7.s('pretty-time');
const zlib = _bca95ef7.s('zlib');
class Indenter {
    constructor() {
        this.store = new Map();
        this.set('indent', 0);
    }
    set(key, val) {
        this.store.set(key, val);
        return this;
    }
    get(key) {
        return this.store.get(key);
    }
    reset() {
        return this.set('indent', 0);
    }
    tap(key, cb) {
        const updated = cb(this.store.get(key));
        return this.set(key, updated);
    }
    indent(level) {
        return this.tap('indent', indent => indent + level);
    }
    level(level) {
        return this.set('indent', level);
    }
    toString() {
        return ' '.repeat(this.get('indent'));
    }
    toNumber() {
        return this.get('indent');
    }
    [Symbol.toPrimitive](hint) {
        if (hint === 'number') {
            return this.toNumber();
        }
        return this.toString();
        ;
    }
}
class Log {
    constructor(context) {
        this.context = context;
        this.timeStart = process.hrtime();
        this.printLog = true;
        this.debugMode = false;
        this.indent = new Indenter();
        this.totalSize = 0;
        this.printLog = context.doLog;
        this.debugMode = context.debugMode;
        log.filter(arg => {
            const debug = this.debugMode;
            const level = this.printLog;
            const hasTag = tag => arg.tags.includes(tag);
            const levelHas = tag => debug || level && level.includes && level.includes(tag) && !level.includes('!' + tag);
            if (level === false)
                return false;
            if (level === true && debug === true) {
                return null;
            }
            if (level == 'error') {
                if (!hasTag('error')) {
                    return false;
                }
            }
            if (hasTag('magic')) {
                if (!levelHas('magic')) {
                    return false;
                }
            }
            if (hasTag('filelist')) {
                if (!levelHas('filelist')) {
                    return false;
                }
            }
            return null;
        });
        setTimeout(() => {
            if (this.printLog) {
                Log.deferred.forEach(x => x(this));
            }
            Log.deferred = [];
        });
    }
    static defer(fn) {
        Log.deferred.push(fn);
    }
    reset() {
        this.timeStart = process.hrtime();
        this.totalSize = 0;
        this.indent.reset();
        return this;
    }
    printOptions(title, obj) {
        let indent = this.indent.level(2) + '';
        ;
        let indent2 = this.indent.level(4) + '';
        ;
        log.addPreset('min', instance => {
            instance.formatter(data => {
                return log.inspector()(data).split('\n').map(data => indent2 + data).map(data => data.replace(/[{},]/, '')).join('\n');
                ;
            });
        });
        log.bold().yellow(`${ indent }→ ${ title }\n`).preset('min').data(obj).echo();
        return this;
    }
    bundleStart(name) {
        log.gray(``).echo();
        log.gray(`--------------------------`).echo();
        log.magenta(`Bundle "${ name }" `).echo();
        log.gray(``).echo();
        return this;
    }
    subBundleStart(name, parent) {
        log.bold(`${ name } (child of ${ parent }) ->`).echo();
        return this;
    }
    bundleEnd(name, collection) {
        let took = process.hrtime(this.timeStart);
        log.ansi().write(`-> Finished`).green(collection.cachedName || collection.name).yellow(`took: ${ prettyTime(took, 'ms') }`).echo();
    }
    startSpinner(text) {
        if (!this.printLog) {
            return this;
        }
        const indentStr = this.indent.toString();
        const indent = +this.indent;
        const interval = 20;
        const frames = [
            '\u280B',
            '\u2819',
            '\u2839',
            '\u2838',
            '\u283C',
            '\u2834',
            '\u2826',
            '\u2827',
            '\u2807',
            '\u280F'
        ].map(frame => indentStr + frame);
        const spinner = {
            frames,
            interval
        };
        this.spinner = log.requirePkg('ora')({
            text,
            indent,
            spinner
        });
        this.spinner.start();
        this.spinner.indent = +this.indent;
        this.spinner.succeeded = false;
        setTimeout(() => {
            if (this.spinner.succeeded === false && this.spinner.fail) {
                this.spinner.fail();
                ;
            }
        }, 1000);
        return this;
    }
    stopSpinner(text) {
        if (!this.printLog) {
            return this;
        }
        if (this.spinner && this.spinner.succeeded === false) {
            this.spinner.succeeded = true;
            const reference = this.spinner;
            const indent = this.indent.level(this.spinner.indent).toString();
            const success = log.chalk().green(`${ indent }✔ `);
            text = text || reference.text;
            reference.stopAndPersist({
                symbol: success,
                text
            });
        }
        return this;
    }
    echoDefaultCollection(collection, contents) {
        if (this.printLog === false)
            return this;
        let bytes = Buffer.byteLength(contents, 'utf8');
        let size = prettysize(bytes);
        this.totalSize += bytes;
        const indent = this.indent.reset().indent(+1).toString();
        collection.dependencies.forEach(file => {
            if (file.info.isRemoteFile) {
                return;
            }
            const indent = this.indent.level(4).toString();
            log.white(`${ indent }${ file.info.fuseBoxPath }`).echo();
        });
        log.ansi().write(`└──`).yellow(`${ indent }(${ collection.dependencies.size } files,  ${ size })`).green(collection.cachedName || collection.name).echo();
        this.indent.level(0);
        return this;
    }
    echoCollection(collection, contents) {
        if (this.printLog === false) {
            return this;
        }
        let bytes = Buffer.byteLength(contents, 'utf8');
        let size = prettysize(bytes);
        this.totalSize += bytes;
        const indent = this.indent.toString();
        const name = (collection.cachedName || collection.name).trim();
        log.ansi().write(`${ indent }└──`).green(name).yellow(size).write(`(${ collection.dependencies.size } files)`).echo();
        return this;
    }
    end(header) {
        let took = process.hrtime(this.timeStart);
        this.echoBundleStats(header || 'Bundle', this.totalSize, took);
        return this;
    }
    echoGzip(size, msg = '') {
        if (!size)
            return this;
        const yellow = log.chalk().yellow;
        const gzipped = zlib.gzipSync(size, { level: 9 }).length;
        const gzippedSize = prettysize(gzipped) + ' (gzipped)';
        const compressedSize = prettysize(size.length);
        const prettyGzip = yellow(`${ compressedSize }, ${ gzippedSize }`);
        log.title(this.indent + '').when(msg, () => log.text(msg), () => log.bold('size: ')).data(prettyGzip).echo();
        return this;
    }
    echoBundleStats(header, size, took) {
        this.indent.reset();
        const yellow = log.chalk().yellow;
        const sized = yellow(`${ prettysize(size) }`);
        log.text(`size: ${ sized } in ${ prettyTime(took, 'ms') }`).echo();
        return this;
    }
    echoHeader(str) {
        this.indent.level(1);
        log.yellow(`${ this.indent }${ str }`).echo();
        return this;
    }
    echoStatus(str) {
        log.title(`→`).cyan(`${ str }`).echo();
        return this;
    }
    groupHeader(str) {
        log.color('bold.underline').text(`${ str }`).echo();
        return this;
    }
    echoInfo(str) {
        const indent = this.indent.level(2);
        log.preset('info').green(`${ indent }→ ${ str }`).echo();
        return this;
    }
    error(error) {
        log.tags('error').data(error).echo();
        return this;
    }
    magicReason(str, metadata = false) {
        if (metadata) {
            log.data(metadata);
        }
        log.tags('magic').magenta(str).echo();
        return this;
    }
    echo(str) {
        log.time(true).green(str).echo();
        return this;
    }
    echoBoldRed(msg) {
        log.red().bold(msg).echo();
        return this;
    }
    echoError(str) {
        log.red(`  → ERROR ${ str }`).echo();
    }
    echoRed(msg) {
        log.red(msg).echo();
        return this;
    }
    echoBreak() {
        log.green(`\n  -------------- \n`).echo();
        return this;
    }
    echoWarning(str) {
        log.yellow(`  → WARNING ${ str }`).echo();
        return this;
    }
    echoYellow(str) {
        log.yellow(str).echo();
        return this;
    }
    echoGray(str) {
        log.gray(str).echo();
        return this;
    }
}
Log.deferred = [];
exports.Log = Log;
}
// default/core/WorkflowContext.js
_bca95ef7.f[5] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const path = _bca95ef7.s('path');
const escodegen = _bca95ef7.s('escodegen');
const BundleSource_1 = _bca95ef7.r(6);
const File_1 = _bca95ef7.r(7);
const Log_1 = _bca95ef7.r(4);
const NativeEmitter = _bca95ef7.s('events');
const PathMaster_1 = _bca95ef7.r(19);
const ModuleCache_1 = _bca95ef7.r(20);
const EventEmitter_1 = _bca95ef7.r(22);
const realm_utils_1 = _bca95ef7.s('realm-utils');
const Utils_1 = _bca95ef7.r(3);
const AutoImportedModule_1 = _bca95ef7.r(23);
const Defer_1 = _bca95ef7.r(24);
const QuantumSplit_1 = _bca95ef7.r(25);
const ServerPolyfillList_1 = _bca95ef7.r(26);
const CSSDependencyExtractor_1 = _bca95ef7.r(27);
const appRoot = _bca95ef7.s('app-root-path');
class WorkFlowContext {
    constructor() {
        this.appRoot = appRoot.path;
        this.dynamicImportsEnabled = true;
        this.writeBundles = true;
        this.useTypescriptCompiler = false;
        this.userWriteBundles = true;
        this.showWarnings = true;
        this.useJsNext = false;
        this.showErrors = true;
        this.showErrorsInBrowser = true;
        this.sourceChangedEmitter = new EventEmitter_1.EventEmitter();
        this.emitter = new NativeEmitter();
        this.defaultPackageName = 'default';
        this.ignoreGlobal = [];
        this.pendingPromises = [];
        this.emitHMRDependencies = false;
        this.polyfillNonStandardDefaultUsage = false;
        this.target = 'universal';
        this.serverBundle = false;
        this.nodeModules = new Map();
        this.libPaths = new Map();
        this.printLogs = true;
        this.runAllMatchedPlugins = false;
        this.useCache = true;
        this.doLog = true;
        this.tsMode = false;
        this.dependents = new Map();
        this.standaloneBundle = true;
        this.sourceMapsProject = false;
        this.sourceMapsVendor = false;
        this.inlineSourceMaps = true;
        this.sourceMapsRoot = '';
        this.initialLoad = true;
        this.debugMode = false;
        this.log = new Log_1.Log(this);
        this.natives = {
            process: true,
            stream: true,
            Buffer: true,
            http: true
        };
        this.autoImportConfig = {};
        this.experimentalAliasEnabled = false;
        this.defer = new Defer_1.Defer();
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
    convertToFuseBoxPath(name) {
        let root = this.homeDir;
        name = name.replace(/\\/g, '/');
        root = root.replace(/\\/g, '/');
        name = name.replace(root, '').replace(/^\/|\\/, '');
        return name;
    }
    isBrowserTarget() {
        return this.target === 'browser';
    }
    shouldPolyfillNonStandardDefault(file) {
        if (file.belongsToProject()) {
            return false;
        }
        let collectionName = file.collection && file.collection.name;
        if (collectionName === 'fuse-heresy-default') {
            return false;
        }
        if (this.polyfillNonStandardDefaultUsage === true) {
            return true;
        }
        if (Array.isArray(this.polyfillNonStandardDefaultUsage)) {
            return this.polyfillNonStandardDefaultUsage.indexOf(collectionName) > -1;
        }
    }
    shouldUseJsNext(libName) {
        if (this.useJsNext === true) {
            return true;
        }
        if (Array.isArray(this.useJsNext)) {
            return this.useJsNext.indexOf(libName) > -1;
        }
    }
    quantumSplit(rule, bundleName, entryFile) {
        if (!this.quantumSplitConfig) {
            this.quantumSplitConfig = new QuantumSplit_1.QuantumSplitConfig(this);
        }
        this.quantumSplitConfig.register(rule, bundleName, entryFile);
    }
    configureQuantumSplitResolving(opts) {
        if (!this.quantumSplitConfig) {
            this.quantumSplitConfig = new QuantumSplit_1.QuantumSplitConfig(this);
        }
        this.quantumSplitConfig.resolveOptions = opts;
    }
    getQuantumDevelepmentConfig() {
        if (this.quantumSplitConfig) {
            let opts = this.quantumSplitConfig.resolveOptions;
            opts.bundles = {};
            this.quantumSplitConfig.getItems().forEach(item => {
                opts.bundles[item.name] = { main: item.entry };
            });
            return opts;
        }
    }
    requiresQuantumSplitting(path) {
        if (!this.quantumSplitConfig) {
            return;
        }
        return this.quantumSplitConfig.matches(path);
    }
    setCodeGenerator(fn) {
        this.customCodeGenerator = fn;
    }
    generateCode(ast, opts) {
        if (this.customCodeGenerator) {
            try {
                return this.customCodeGenerator(ast);
            } catch (e) {
            }
        }
        return escodegen.generate(ast, opts);
    }
    emitJavascriptHotReload(file) {
        if (file.ignoreCache) {
            return;
        }
        let content = file.contents;
        if (file.context.emitHMRDependencies) {
            this.emitter.addListener('bundle-collected', () => {
                if (file.headerContent) {
                    content = file.headerContent.join('\n') + '\n' + content;
                }
                let dependants = {};
                this.dependents.forEach((set, key) => {
                    dependants[key] = [...set];
                });
                this.sourceChangedEmitter.emit({
                    type: 'js',
                    content,
                    dependants: dependants,
                    path: file.info.fuseBoxPath
                });
            });
        } else {
            if (file.headerContent) {
                content = file.headerContent.join('\n') + '\n' + content;
            }
            this.sourceChangedEmitter.emit({
                type: 'js',
                content,
                path: file.info.fuseBoxPath
            });
        }
    }
    debug(group, text) {
        if (this.debugMode) {
            this.log.echo(`${ group } : ${ text }`);
        }
    }
    nukeCache() {
        this.resetNodeModules();
        if (this.cache) {
            Utils_1.removeFolder(this.cache.cacheFolder);
            this.cache.initialize();
        }
    }
    setSourceMapsProperty(params) {
        if (typeof params === 'boolean') {
            this.sourceMapsProject = params;
        } else {
            if (realm_utils_1.utils.isPlainObject(params)) {
                this.sourceMapsProject = params.project !== undefined ? params.project : true;
                this.sourceMapsVendor = params.vendor === true;
                if (params.inline !== undefined) {
                    this.inlineSourceMaps = params.inline;
                }
                if (params.sourceRoot || params.sourceRoot === '') {
                    this.sourceMapsRoot = params.sourceRoot;
                }
            }
        }
        if (this.sourceMapsProject || this.sourceMapsVendor) {
            this.useSourceMaps = true;
        }
    }
    warning(str) {
        return this.log.echoWarning(str);
    }
    fatal(str) {
        throw new Error(str);
    }
    debugPlugin(plugin, text) {
        const name = plugin.constructor && plugin.constructor.name ? plugin.constructor.name : 'Unknown';
        this.debug(name, text);
    }
    isShimed(name) {
        if (!this.shim) {
            return false;
        }
        return this.shim[name] !== undefined;
    }
    isHashingRequired() {
        const hashOption = this.hash;
        let useHash = false;
        if (typeof hashOption === 'string') {
            if (hashOption !== 'md5') {
                throw new Error(`Uknown algorythm ${ hashOption }`);
            }
            useHash = true;
        }
        if (hashOption === true) {
            useHash = true;
        }
        return useHash;
    }
    reset() {
        this.log.reset();
        this.dependents = new Map();
        this.emitter = new NativeEmitter();
        this.storage = new Map();
        this.source = new BundleSource_1.BundleSource(this);
        this.nodeModules = new Map();
        this.pluginTriggers = new Map();
        this.fileGroups = new Map();
        this.libPaths = new Map();
    }
    registerDependant(target, dependant) {
        let fileSet;
        if (!this.dependents.has(target.info.fuseBoxPath)) {
            fileSet = new Set();
            this.dependents.set(target.info.fuseBoxPath, fileSet);
        } else {
            fileSet = this.dependents.get(target.info.fuseBoxPath);
        }
        if (!fileSet.has(dependant.info.fuseBoxPath)) {
            fileSet.add(dependant.info.fuseBoxPath);
        }
    }
    initAutoImportConfig(userNatives, userImports) {
        if (this.target !== 'server') {
            this.autoImportConfig = AutoImportedModule_1.registerDefaultAutoImportModules(userNatives);
            if (realm_utils_1.utils.isPlainObject(userImports)) {
                for (let varName in userImports) {
                    this.autoImportConfig[varName] = new AutoImportedModule_1.AutoImportedModule(varName, userImports[varName]);
                }
            }
        }
    }
    setItem(key, obj) {
        this.storage.set(key, obj);
    }
    getItem(key, defaultValue) {
        return this.storage.get(key) !== undefined ? this.storage.get(key) : defaultValue;
    }
    setCSSDependencies(file, userDeps) {
        let collection = this.getItem('cssDependencies') || {};
        collection[file.info.absPath] = userDeps;
        this.setItem('cssDependencies', collection);
    }
    extractCSSDependencies(file, opts) {
        const extractor = CSSDependencyExtractor_1.CSSDependencyExtractor.init(opts);
        this.setCSSDependencies(file, extractor.getDependencies());
        return extractor.getDependencies();
    }
    getCSSDependencies(file) {
        let collection = this.getItem('cssDependencies') || {};
        return collection[file.info.absPath];
    }
    createFileGroup(name, collection, handler) {
        let info = {
            fuseBoxPath: name,
            absPath: name
        };
        let file = new File_1.File(this, info);
        file.collection = collection;
        file.contents = '';
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
    addAlias(obj, value) {
        const aliases = [];
        if (!value) {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (path.isAbsolute(key)) {
                        this.fatal(`Can't use absolute paths with alias "${ key }"`);
                    }
                    aliases.push({
                        expr: new RegExp(`^(${ key })(/|$)`),
                        replacement: obj[key]
                    });
                }
            }
        } else {
            aliases.push({
                expr: new RegExp(`^(${ obj })(/|$)`),
                replacement: value
            });
        }
        this.aliasCollection = this.aliasCollection || [];
        this.aliasCollection = this.aliasCollection.concat(aliases);
        this.experimentalAliasEnabled = true;
    }
    setHomeDir(dir) {
        this.homeDir = Utils_1.ensureDir(dir);
    }
    setLibInfo(name, version, info) {
        let key = `${ name }@${ version }`;
        if (!this.libPaths.has(key)) {
            return this.libPaths.set(key, info);
        }
    }
    convert2typescript(name) {
        return name.replace(/\.ts$/, '.js');
    }
    getLibInfo(name, version) {
        let key = `${ name }@${ version }`;
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
        if (this.ignoreGlobal.indexOf(name) > -1) {
            return true;
        }
        if (this.target === 'server') {
            return ServerPolyfillList_1.isPolyfilledByFuseBox(name);
        }
    }
    resetNodeModules() {
        this.nodeModules = new Map();
    }
    addNodeModule(name, collection) {
        this.nodeModules.set(name, collection);
    }
    isFirstTime() {
        return this.initialLoad === true;
    }
    writeOutput(outFileWritten) {
        this.initialLoad = false;
        const res = this.source.getResult();
        if (this.bundle) {
            this.bundle.generatedCode = res.content;
        }
        if (this.output && (!this.bundle || this.bundle && this.bundle.producer.writeBundles)) {
            this.output.writeCurrent(res.content).then(() => {
                if (this.source.includeSourceMaps) {
                    this.writeSourceMaps(res);
                }
                this.defer.unlock();
                if (realm_utils_1.utils.isFunction(outFileWritten)) {
                    outFileWritten();
                }
            });
        } else {
            this.defer.unlock();
            outFileWritten();
        }
    }
    writeSourceMaps(result) {
        if (this.sourceMapsProject || this.sourceMapsVendor) {
            this.output.writeToOutputFolder(`${ this.output.filename }.js.map`, result.sourceMap);
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
            if (plugin && realm_utils_1.utils.isFunction(plugin[name])) {
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
}
// default/BundleSource.js
_bca95ef7.f[6] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const Utils_1 = _bca95ef7.r(3);
const Config_1 = _bca95ef7.r(2);
const path = _bca95ef7.s('path');
const fs = _bca95ef7.s('fs');
class BundleSource {
    constructor(context) {
        this.context = context;
        this.standalone = false;
        this.includeSourceMaps = false;
        this.concat = new Utils_1.Concat(true, '', '\n');
    }
    init() {
        this.concat.add(null, '(function(FuseBox){FuseBox.$fuse$=FuseBox;');
    }
    annotate(comment) {
    }
    createCollection(collection) {
        this.collectionSource = new Utils_1.Concat(true, collection.name, '\n');
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
        this.collectionSource.add(null, `FuseBox.pkg("${ collection.name }", ${ JSON.stringify(conflicting) }, function(___scope___){`);
        this.annotate(`/* fuse:start-collection "${ collection.name }"*/`);
    }
    endCollection(collection) {
        let entry = collection.entryFile ? collection.entryFile.info.fuseBoxPath : '';
        entry = entry || collection.bundle && collection.bundle.entry;
        if (entry) {
            this.collectionSource.add(null, `return ___scope___.entry = "${ entry }";`);
        }
        this.collectionSource.add(null, '});');
        this.annotate(`/* fuse:end-collection "${ collection.name }"*/`);
        let key = collection.info ? `${ collection.info.name }@${ collection.info.version }` : 'default';
        this.concat.add(`packages/${ key }`, this.collectionSource.content, key !== undefined ? this.collectionSource.sourceMap : undefined);
        return this.collectionSource.content.toString();
    }
    addContent(data) {
        this.concat.add(null, data);
    }
    addFile(file) {
        if (file.info.isRemoteFile || file.notFound || file.collection && file.collection.acceptFiles === false) {
            return;
        }
        if (!this.includeSourceMaps) {
            this.includeSourceMaps = file.belongsToProject() && this.context.sourceMapsProject || !file.belongsToProject() && this.context.sourceMapsVendor;
        }
        this.collectionSource.add(null, `___scope___.file("${ file.info.fuseBoxPath }", function(exports, require, module, __filename, __dirname){
${ file.headerContent ? file.headerContent.join('\n') : '' }`);
        this.annotate(`/* fuse:start-file "${ file.info.fuseBoxPath }"*/`);
        this.collectionSource.add(null, file.alternativeContent !== undefined ? file.alternativeContent : file.contents, file.sourceMap);
        this.annotate(`/* fuse:end-file "${ file.info.fuseBoxPath }"*/`);
        if (this.context.shouldPolyfillNonStandardDefault(file)) {
            this.collectionSource.add(null, 'require(\'fuse-heresy-default\')(module.exports)');
        }
        this.collectionSource.add(null, '});');
    }
    finalize(bundleData) {
        let entry = bundleData.entry;
        const context = this.context;
        if (entry) {
            entry = Utils_1.ensurePublicExtension(entry);
            context.fuse.producer.entryPackageName = this.context.defaultPackageName;
            context.fuse.producer.entryPackageFile = entry;
        }
        if (context.fuse.producer) {
            const injections = context.fuse.producer.getDevInjections();
            if (injections) {
                injections.forEach(code => {
                    this.concat.add(null, code);
                });
            }
        }
        let mainEntry;
        if (this.context.target) {
            this.concat.add(null, `FuseBox.target = "${ this.context.target }"`);
        }
        if (context.serverBundle) {
            this.concat.add(null, `FuseBox.isServer = true;`);
        }
        if (this.bundleInfoObject) {
            this.concat.add(null, `FuseBox.global("__fsbx__bundles__",${ JSON.stringify(this.bundleInfoObject) })`);
        }
        if (this.context.fuse && this.context.fuse.producer) {
            const masterContext = this.context.fuse.producer.fuse.context;
            const splitConfig = masterContext.getQuantumDevelepmentConfig();
            if (splitConfig) {
                this.concat.add(null, `FuseBox.global("__fsbx__bundles__",${ JSON.stringify(splitConfig) })`);
            }
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
                        mainEntry = item.pkg = `${ key }/${ entry }`;
                        entry = undefined;
                    }
                    data.push(item);
                }
            }
            this.concat.add(null, `FuseBox.expose(${ JSON.stringify(data) });`);
        }
        if (entry) {
            mainEntry = `${ context.defaultPackageName }/${ entry }`;
            this.concat.add(null, `\nFuseBox.import("${ mainEntry }");`);
        }
        if (mainEntry) {
            this.concat.add(null, `FuseBox.main("${ mainEntry }");`);
        }
        if (context.defaultPackageName !== 'default') {
            this.concat.add(null, `FuseBox.defaultPackageName = ${ JSON.stringify(context.defaultPackageName) };`);
        }
        this.concat.add(null, '})');
        if (context.standaloneBundle) {
            let fuseboxLibFile = path.join(Config_1.Config.FUSEBOX_MODULES, 'fuse-box-loader-api', context.debugMode ? 'fusebox.js' : 'fusebox.min.js');
            if (this.context.customAPIFile) {
                fuseboxLibFile = Utils_1.ensureUserPath(this.context.customAPIFile);
            }
            let wrapper = fs.readFileSync(fuseboxLibFile).toString();
            this.concat.add(null, `(${ wrapper })`);
        } else {
            this.concat.add(null, '(FuseBox)');
        }
        if (this.context.sourceMapsProject || this.context.sourceMapsVendor) {
            let sourceName = /[^\/]*$/.exec(this.context.output.filename)[0];
            this.concat.add(null, `//# sourceMappingURL=${ sourceName }.js.map`);
        }
    }
    getResult() {
        return this.concat;
    }
}
exports.BundleSource = BundleSource;
}
// default/core/File.js
_bca95ef7.f[7] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const FileAnalysis_1 = _bca95ef7.r(8);
const SourceMapGenerator_1 = _bca95ef7.r(18);
const realm_utils_1 = _bca95ef7.s('realm-utils');
const fs = _bca95ef7.s('fs');
const path = _bca95ef7.s('path');
const Utils_1 = _bca95ef7.r(3);
var ScriptTarget;
(function (ScriptTarget) {
    ScriptTarget[ScriptTarget['ES5'] = 1] = 'ES5';
    ScriptTarget[ScriptTarget['ES2015'] = 2] = 'ES2015';
    ScriptTarget[ScriptTarget['ES2016'] = 3] = 'ES2016';
    ScriptTarget[ScriptTarget['ES2017'] = 4] = 'ES2017';
    ScriptTarget[ScriptTarget['ESNext'] = 5] = 'ESNext';
}(ScriptTarget = exports.ScriptTarget || (exports.ScriptTarget = {})));
class File {
    constructor(context, info) {
        this.context = context;
        this.info = info;
        this.isFuseBoxBundle = false;
        this.languageLevel = ScriptTarget.ES5;
        this.es6module = false;
        this.dependants = new Set();
        this.dependencies = new Set();
        this.shouldIgnoreDeps = false;
        this.resolveDepsOnly = false;
        this.wasTranspiled = false;
        this.cached = false;
        this.isLoaded = false;
        this.ignoreCache = false;
        this.isNodeModuleEntry = false;
        this.isTypeScript = false;
        this.properties = new Map();
        this.analysis = new FileAnalysis_1.FileAnalysis(this);
        this.resolving = [];
        this.subFiles = [];
        this.groupMode = false;
        this.hasExtensionOverride = false;
        this.bustCSSCache = false;
        if (info.params) {
            this.params = info.params;
        }
        this.absPath = info.absPath;
        if (this.absPath) {
            this.relativePath = Utils_1.ensureFuseBoxPath(path.relative(this.context.appRoot, this.absPath));
        }
    }
    addAlternativeContent(str) {
        this.alternativeContent = this.alternativeContent || '';
        this.alternativeContent += '\n' + str;
    }
    registerDependant(file) {
        if (!this.dependants.has(file.info.fuseBoxPath)) {
            this.dependants.add(file.info.fuseBoxPath);
        }
    }
    registerDependency(file) {
        if (!this.dependencies.has(file.info.fuseBoxPath)) {
            this.dependencies.add(file.info.fuseBoxPath);
        }
    }
    static createByName(collection, name) {
        let info = {
            fuseBoxPath: name,
            absPath: name
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
    setLanguageLevel(level) {
        if (this.languageLevel < level) {
            this.languageLevel = level;
        }
    }
    addProperty(key, obj) {
        this.properties.set(key, obj);
    }
    addStringDependency(name) {
        let deps = this.analysis.dependencies;
        if (deps.indexOf(name) === -1) {
            deps.push(name);
        }
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
    getUniquePath() {
        let collection = this.collection ? this.collection.name : 'default';
        return `${ collection }/${ this.info.fuseBoxPath }`;
    }
    getCrossPlatormPath() {
        let name = this.absPath;
        if (!name) {
            return;
        }
        name = name.replace(/\\/g, '/');
        return name;
    }
    tryTypescriptPlugins() {
        if (this.context.plugins) {
            this.context.plugins.forEach(plugin => {
                if (plugin && realm_utils_1.utils.isFunction(plugin.onTypescriptTransform)) {
                    plugin.onTypescriptTransform(this);
                }
            });
        }
    }
    tryPlugins(_ast) {
        if (this.context.runAllMatchedPlugins) {
            return this.tryAllPlugins(_ast);
        }
        if (this.context.plugins && this.relativePath) {
            let target;
            let index = 0;
            while (!target && index < this.context.plugins.length) {
                let item = this.context.plugins[index];
                let itemTest;
                if (Array.isArray(item)) {
                    let el = item[0];
                    if (el && typeof el.test === 'function') {
                        itemTest = el;
                    } else {
                        itemTest = el.test;
                    }
                } else {
                    itemTest = item && item.test;
                }
                if (itemTest && realm_utils_1.utils.isFunction(itemTest.test) && itemTest.test(this.relativePath)) {
                    target = item;
                }
                index++;
            }
            const tasks = [];
            if (target) {
                if (Array.isArray(target)) {
                    target.forEach(plugin => {
                        if (realm_utils_1.utils.isFunction(plugin.transform)) {
                            this.context.debugPlugin(plugin, `Captured ${ this.info.fuseBoxPath }`);
                            tasks.push(() => plugin.transform.apply(plugin, [this]));
                        }
                    });
                } else {
                    if (realm_utils_1.utils.isFunction(target.transform)) {
                        this.context.debugPlugin(target, `Captured ${ this.info.fuseBoxPath }`);
                        tasks.push(() => target.transform.apply(target, [this]));
                    }
                }
            }
            const promise = realm_utils_1.each(tasks, promise => promise());
            this.context.queue(promise);
            return promise;
        }
    }
    async tryAllPlugins(_ast) {
        const tasks = [];
        if (this.context.plugins && this.relativePath) {
            const addTask = item => {
                if (realm_utils_1.utils.isFunction(item.transform)) {
                    this.context.debugPlugin(item, `Captured ${ this.info.fuseBoxPath }`);
                    tasks.push(() => item.transform.apply(item, [this]));
                }
            };
            this.context.plugins.forEach(item => {
                let itemTest;
                if (Array.isArray(item)) {
                    let el = item[0];
                    itemTest = el && realm_utils_1.utils.isFunction(el.test) ? el : el.test;
                } else {
                    itemTest = item && item.test;
                }
                if (itemTest && realm_utils_1.utils.isFunction(itemTest.test) && itemTest.test(this.relativePath)) {
                    Array.isArray(item) ? item.forEach(addTask, this) : addTask(item);
                }
            }, this);
        }
        const promise = realm_utils_1.each(tasks, promise => promise());
        this.context.queue(promise);
        return promise;
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
    makeAnalysis(parserOptions, traversalOptions) {
        if (!this.analysis.astIsLoaded()) {
            this.analysis.parseUsingAcorn(parserOptions);
        }
        this.analysis.analyze(traversalOptions);
    }
    replaceDynamicImports() {
        if (!this.context.dynamicImportsEnabled) {
            return;
        }
        if (this.contents && this.collection.name === this.context.defaultPackageName) {
            const expression = /(\s+|^)(import\()/g;
            if (expression.test(this.contents)) {
                this.contents = this.contents.replace(expression, '$1$fsmp$(');
                if (this.context.fuse && this.context.fuse.producer) {
                    this.devLibsRequired = ['fuse-imports'];
                    if (!this.context.fuse.producer.devCodeHasBeenInjected('fuse-imports')) {
                        this.context.fuse.producer.injectDevCode('fuse-imports', Utils_1.readFuseBoxModule('fuse-box-responsive-api/dev-imports.js'));
                    }
                }
            }
        }
    }
    belongsToProject() {
        return this.collection && this.collection.name === this.context.defaultPackageName;
    }
    consume() {
        if (this.info.isRemoteFile) {
            return;
        }
        if (!this.absPath) {
            return;
        }
        this.context.extensionOverrides && this.context.extensionOverrides.setOverrideFileInfo(this);
        if (!fs.existsSync(this.info.absPath)) {
            if (/\.js$/.test(this.info.fuseBoxPath) && this.context.fuse && this.context.fuse.producer) {
                this.context.fuse.producer.addWarning('unresolved', `Statement "${ this.info.fuseBoxPath }" has failed to resolve in module "${ this.collection && this.collection.name }"`);
            }
            this.notFound = true;
            return;
        }
        if (this.context.polyfillNonStandardDefaultUsage) {
            this.addStringDependency('fuse-heresy-default');
        }
        if (/\.ts(x)?$/.test(this.absPath)) {
            this.context.debug('Typescript', `Captured  ${ this.info.fuseBoxPath }`);
            return this.handleTypescript();
        }
        if (/\.js(x)?$/.test(this.absPath)) {
            this.loadContents();
            this.replaceDynamicImports();
            if (this.context.useTypescriptCompiler && this.belongsToProject()) {
                return this.handleTypescript();
            }
            this.tryPlugins();
            if (!this.wasTranspiled && this.context.cache && this.belongsToProject()) {
                if (this.loadFromCache()) {
                    return;
                }
                this.makeAnalysis();
                if (this.context.useCache) {
                    this.context.cache.writeStaticCache(this, this.sourceMap);
                }
                return;
            }
            const vendorSourceMaps = this.context.sourceMapsVendor && !this.belongsToProject();
            if (vendorSourceMaps) {
                this.loadVendorSourceMap();
            } else {
                this.makeAnalysis();
            }
            return;
        }
        return this.tryPlugins().then(result => {
            if (!this.isLoaded) {
                this.contents = '';
                this.context.fuse.producer.addWarning('missing-plugin', `The contents of ${ this.absPath } weren't loaded. Missing a plugin?`);
            }
            return result;
        });
    }
    fileDependsOnLastChangedCSS() {
        const bundle = this.context.bundle;
        if (bundle && bundle.lastChangedFile) {
            if (!Utils_1.isStylesheetExtension(bundle.lastChangedFile)) {
                return false;
            }
            let collection = this.context.getItem('cssDependencies');
            if (!collection) {
                return false;
            }
            if (!collection[this.info.absPath]) {
                return false;
            }
            let HMR_FILE_REQUIRED = this.context.getItem('HMR_FILE_REQUIRED', []);
            for (let i = 0; i < collection[this.info.absPath].length; i++) {
                const absPath = Utils_1.ensureFuseBoxPath(collection[this.info.absPath][i]);
                if (absPath.indexOf(bundle.lastChangedFile) > -1) {
                    this.context.log.echoInfo(`CSS Dependency: ${ bundle.lastChangedFile } depends on ${ this.info.fuseBoxPath }`);
                    HMR_FILE_REQUIRED.push(this.info.fuseBoxPath);
                    this.context.setItem('HMR_FILE_REQUIRED', HMR_FILE_REQUIRED);
                    return true;
                }
            }
        }
    }
    isCSSCached(type = 'css') {
        if (this.ignoreCache === true || this.bustCSSCache) {
            return false;
        }
        if (!this.context || !this.context.cache) {
            return;
        }
        if (!this.context.useCache) {
            return false;
        }
        let cached = this.context.cache.getStaticCache(this, type);
        if (cached) {
            if (cached.sourceMap) {
                this.sourceMap = cached.sourceMap;
            }
            this.context.setCSSDependencies(this, cached.dependencies);
            if (!this.fileDependsOnLastChangedCSS()) {
                this.isLoaded = true;
                this.contents = cached.contents;
                return true;
            }
        }
        return false;
    }
    loadFromCache() {
        let cached = this.context.cache.getStaticCache(this);
        if (cached) {
            if (cached.sourceMap) {
                this.sourceMap = cached.sourceMap;
            }
            this.isLoaded = true;
            this.cached = true;
            if (cached._) {
                this.cacheData = cached._;
            }
            if (cached.devLibsRequired) {
                cached.devLibsRequired.forEach(item => {
                    if (!this.context.fuse.producer.devCodeHasBeenInjected(item)) {
                        this.context.fuse.producer.injectDevCode(item, Utils_1.readFuseBoxModule('fuse-box-responsive-api/dev-imports.js'));
                    }
                });
            }
            if (cached.headerContent) {
                this.headerContent = cached.headerContent;
            }
            this.analysis.skip();
            this.analysis.dependencies = cached.dependencies;
            this.contents = cached.contents;
            return true;
        }
        return false;
    }
    loadVendorSourceMap() {
        if (!this.context.cache) {
            return this.makeAnalysis();
        }
        const key = `vendor/${ this.collection.name }/${ this.info.fuseBoxPath }`;
        this.context.debug('File', `Vendor sourcemap ${ key }`);
        let cachedMaps = this.context.cache.getPermanentCache(key);
        if (cachedMaps) {
            this.sourceMap = cachedMaps;
            this.makeAnalysis();
        } else {
            const tokens = [];
            this.makeAnalysis({ onToken: tokens });
            SourceMapGenerator_1.SourceMapGenerator.generate(this, tokens);
            this.generateCorrectSourceMap(key);
            this.context.cache.setPermanentCache(key, this.sourceMap);
        }
    }
    handleTypescript() {
        this.wasTranspiled = true;
        if (this.context.useCache) {
            if (this.loadFromCache()) {
                this.tryPlugins();
                return;
            }
        }
        const ts = _bca95ef7.s('typescript');
        this.loadContents();
        this.replaceDynamicImports();
        this.tryTypescriptPlugins();
        this.context.debug('TypeScript', `Transpile ${ this.info.fuseBoxPath }`);
        let result = ts.transpileModule(this.contents, this.getTranspilationConfig());
        if (result.sourceMapText && this.context.useSourceMaps) {
            let jsonSourceMaps = JSON.parse(result.sourceMapText);
            jsonSourceMaps.file = this.info.fuseBoxPath;
            jsonSourceMaps.sources = [this.context.sourceMapsRoot + '/' + this.relativePath.replace(/\.js(x?)$/, '.ts$1')];
            if (!this.context.inlineSourceMaps) {
                delete jsonSourceMaps.sourcesContent;
            }
            result.outputText = result.outputText.replace('//# sourceMappingURL=module.js.map', '');
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
    setCacheData(data) {
        this.cacheData = data;
    }
    generateCorrectSourceMap(fname) {
        if (typeof this.sourceMap === 'string') {
            let jsonSourceMaps = JSON.parse(this.sourceMap);
            jsonSourceMaps.file = this.info.fuseBoxPath;
            jsonSourceMaps.sources = jsonSourceMaps.sources.map(source => {
                return this.context.sourceMapsRoot + '/' + (fname || source);
            });
            if (!this.context.inlineSourceMaps) {
                delete jsonSourceMaps.sourcesContent;
            }
            this.sourceMap = JSON.stringify(jsonSourceMaps);
        }
        return this.sourceMap;
    }
    getTranspilationConfig() {
        return Object.assign({}, this.context.tsConfig.getConfig(), {
            fileName: this.info.absPath,
            transformers: this.context.fuse.opts.transformers || {}
        });
    }
    addError(message) {
        this.context.bundle.addError(message);
    }
}
exports.File = File;
}
// default/analysis/FileAnalysis.js
_bca95ef7.f[8] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const ASTTraverse_1 = _bca95ef7.r(9);
const PrettyError_1 = _bca95ef7.r(10);
const File_1 = _bca95ef7.r(7);
const acorn = _bca95ef7.s('acorn');
const AutoImport_1 = _bca95ef7.r(11);
const LanguageLevel_1 = _bca95ef7.r(12);
const OwnVariable_1 = _bca95ef7.r(13);
const OwnBundle_1 = _bca95ef7.r(14);
const ImportDeclaration_1 = _bca95ef7.r(15);
const DynamicImportStatement_1 = _bca95ef7.r(16);
_bca95ef7.s('acorn-jsx/inject')(acorn);
_bca95ef7.r(17)(acorn);
const plugins = [
    AutoImport_1.AutoImport,
    OwnVariable_1.OwnVariable,
    OwnBundle_1.OwnBundle,
    ImportDeclaration_1.ImportDeclaration,
    DynamicImportStatement_1.DynamicImportStatement,
    LanguageLevel_1.LanguageLevel
];
function acornParse(contents, options) {
    return acorn.parse(contents, {
        ...options || {},
        ...{
            sourceType: 'module',
            tolerant: true,
            ecmaVersion: '2018',
            plugins: {
                jsx: true,
                objRestSpread: true
            },
            jsx: { allowNamespacedObjects: true }
        }
    });
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
        this.requiresTranspilation = false;
        this.fuseBoxVariable = 'FuseBox';
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
                requireStatement = requireStatement.replace(props.expr, `${ props.replacement }$2`);
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
        return node.type === 'Literal' || node.type === 'StringLiteral';
    }
    analyze(traversalOptions) {
        if (this.wasAnalysed || this.skipAnalysis) {
            return;
        }
        if (this.file.collection && this.file.collection.info && this.file.collection.info.jsNext) {
            this.file.es6module = true;
        }
        let traversalPlugins = plugins;
        if (traversalOptions && Array.isArray(traversalOptions.plugins)) {
            traversalPlugins = plugins.concat(traversalOptions.plugins);
        }
        ASTTraverse_1.ASTTraverse.traverse(this.ast, { pre: (node, parent, prop, idx) => traversalPlugins.forEach(plugin => plugin.onNode(this.file, node, parent)) });
        traversalPlugins.forEach(plugin => plugin.onEnd(this.file));
        this.wasAnalysed = true;
        if (this.requiresRegeneration) {
            this.file.contents = this.file.context.generateCode(this.ast);
        }
        if (this.requiresTranspilation) {
            const target = File_1.ScriptTarget[this.file.context.languageLevel];
            this.file.context.log.magicReason('compiling with typescript to match language target: ' + target, this.file.info.fuseBoxPath);
            const ts = _bca95ef7.s('typescript');
            let tsconfg = {
                compilerOptions: {
                    module: 'commonjs',
                    target
                }
            };
            let result = ts.transpileModule(this.file.contents, tsconfg);
            this.file.contents = result.outputText;
        }
    }
}
exports.FileAnalysis = FileAnalysis;
}
// default/ASTTraverse.js
_bca95ef7.f[9] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class ASTTraverse {
    static traverse(root, options) {
        options = options || {};
        const pre = options.pre;
        const skipProperty = options.skipProperty;
        let visit = (node, parent, prop, idx) => {
            if (!node || typeof node.type !== 'string') {
                return;
            }
            if (node._visited) {
                return;
            }
            node.$parent = parent;
            node.$prop = prop;
            node.$idx = idx;
            let res = undefined;
            if (pre) {
                res = pre(node, parent, prop, idx);
            }
            node._visited = true;
            if (typeof res === 'object' && res.type) {
                return visit(res, null);
            }
            if (res !== false) {
                for (let prop in node) {
                    if (skipProperty ? skipProperty(prop, node) : prop[0] === '$') {
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
        };
        visit(root, null);
    }
}
exports.ASTTraverse = ASTTraverse;
}
// default/PrettyError.js
_bca95ef7.f[10] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const ansi = _bca95ef7.s('ansi');
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
        l.white().bg.red().bold().write(`Acorn error: ${ error.message }`);
        l.reset().write('\n');
        l.bold().write(`File: ${ file.absPath }`);
        l.write('\n\n').reset();
        let errorLine = position.line * 1;
        lines.forEach((line, index) => {
            let fits = Math.abs(index - errorLine) <= 3;
            if (fits) {
                if (index + 1 === errorLine) {
                    l.white().bg.red().write(`${ index + 1 }  ${ line }`);
                    l.bg.reset();
                } else {
                    l.reset().write(`${ index + 1 } `).red().write(` ${ line }`);
                }
                l.write('\n').reset();
            }
        });
        l.write('\n');
        throw '';
    }
}
exports.PrettyError = PrettyError;
}
// default/analysis/plugins/AutoImport.js
_bca95ef7.f[11] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class AutoImport {
    static onNode(file, node, parent) {
        const analysis = file.analysis;
        let modules = file.context.autoImportConfig;
        if (node.type === 'Identifier') {
            if (modules[node.name] && !analysis.bannedImports[node.name]) {
                const belongsToAnotherObject = parent.type === 'MemberExpression' && parent.object && parent.object.type === 'Identifier' && parent.object.name !== node.name;
                if (belongsToAnotherObject) {
                    return;
                }
                const isProperty = parent.type && parent.type === 'Property' && parent.value && parent.value.name !== node.name;
                const isFunction = parent.type && (parent.type === 'FunctionExpression' || parent.type === 'FunctionDeclaration') && parent.params;
                const isDeclaration = parent.type === 'VariableDeclarator' || parent.type === 'FunctionDeclaration';
                if (isProperty || isFunction || parent && isDeclaration && parent.id && parent.id.type === 'Identifier' && parent.id.name === node.name) {
                    delete analysis.nativeImports[node.name];
                    if (!analysis.bannedImports[node.name]) {
                        analysis.bannedImports[node.name] = true;
                    }
                } else {
                    analysis.nativeImports[node.name] = modules[node.name];
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
}
// default/analysis/plugins/LanguageLevel.js
_bca95ef7.f[12] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const File_1 = _bca95ef7.r(7);
class LanguageLevel {
    static onNode(file, node, parent) {
        if (node.async === true) {
            file.setLanguageLevel(File_1.ScriptTarget.ES2017);
        } else if (node.kind === 'const') {
            file.setLanguageLevel(File_1.ScriptTarget.ES2015);
        } else if (node.kind === 'let') {
            file.setLanguageLevel(File_1.ScriptTarget.ES2015);
        } else if (node.type === 'ArrowFunctionExpression') {
            file.setLanguageLevel(File_1.ScriptTarget.ES2015);
        }
    }
    static onEnd(file) {
        const target = file.context.languageLevel;
        if (file.languageLevel > target) {
            file.analysis.requiresTranspilation = true;
        }
    }
}
exports.LanguageLevel = LanguageLevel;
}
// default/analysis/plugins/OwnVariable.js
_bca95ef7.f[13] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class OwnVariable {
    static onNode(file, node, parent) {
        const analysis = file.analysis;
        if (node.type === 'Identifier') {
            if (node.name === '$fuse$') {
                analysis.fuseBoxVariable = parent.object.name;
            }
        }
    }
    static onEnd() {
    }
}
exports.OwnVariable = OwnVariable;
}
// default/analysis/plugins/OwnBundle.js
_bca95ef7.f[14] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const escodegen = _bca95ef7.s('escodegen');
function extractMainFileFromPackageEntry(input) {
    let res = input.split('/');
    if (res.length > 1) {
        return res.splice(1).join('/');
    }
}
class OwnBundle {
    static onNode(file, node, parent) {
        const analysis = file.analysis;
        if (file.collection && file.collection.entryFile && node.type === 'MemberExpression') {
            if (parent.type === 'CallExpression') {
                if (node.object && node.object.type === 'Identifier' && node.object.name === analysis.fuseBoxVariable) {
                    if (node.property && node.property.type === 'Identifier') {
                        if (node.property.name === 'main') {
                            if (parent.arguments) {
                                let f = parent.arguments[0];
                                if (f && analysis.nodeIsString(f)) {
                                    const extractedEntry = extractMainFileFromPackageEntry(f.value);
                                    if (extractedEntry && file.collection) {
                                        file.collection.entryFile.info.fuseBoxPath = extractedEntry;
                                    }
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
            } else {
                file.alternativeContent = `module.exports = require("${ file.analysis.fuseBoxMainFile }")`;
            }
        }
    }
    static removeFuseBoxApiFromBundle(file) {
        let ast = file.analysis.ast;
        const fuseVariable = file.analysis.fuseBoxVariable;
        let modifiedAst;
        if (ast.type === 'Program') {
            let first = ast.body[0];
            if (first && first.type === 'ExpressionStatement') {
                let expression = first.expression;
                if (expression.type === 'UnaryExpression' && expression.operator === '!') {
                    expression = expression.argument || {};
                }
                if (expression.type === 'CallExpression') {
                    let callee = expression.callee;
                    if (callee.type === 'FunctionExpression') {
                        if (callee.params && callee.params[0]) {
                            let param1 = callee.params[0];
                            if (param1.type === 'Identifier' && param1.name === fuseVariable) {
                                modifiedAst = callee.body;
                            }
                        }
                    }
                }
            }
        }
        if (modifiedAst) {
            file.contents = `(function(${ fuseVariable })${ escodegen.generate(modifiedAst) })(FuseBox);`;
        }
    }
}
exports.OwnBundle = OwnBundle;
}
// default/analysis/plugins/ImportDeclaration.js
_bca95ef7.f[15] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class ImportDeclaration {
    static onNode(file, node, parent) {
        const analysis = file.analysis;
        if (node.type === 'CallExpression' && node.callee) {
            if (node.callee.type === 'Identifier' && node.callee.name === 'require') {
                let arg1 = node.arguments[0];
                if (analysis.nodeIsString(arg1)) {
                    let requireStatement = this.handleAliasReplacement(file, arg1.value);
                    if (requireStatement) {
                        arg1.value = requireStatement;
                        analysis.addDependency(requireStatement);
                    }
                }
            }
        }
        if (node.type === 'ExportDefaultDeclaration') {
            file.es6module = true;
        }
        if (node.type === 'ExportAllDeclaration') {
            file.es6module = true;
            analysis.addDependency(node.source.value);
        }
        if (node.type === 'ImportDeclaration' || node.type === 'ExportNamedDeclaration') {
            file.es6module = true;
            if (node.source && analysis.nodeIsString(node.source)) {
                let requireStatement = this.handleAliasReplacement(file, node.source.value);
                node.source.value = requireStatement;
                analysis.addDependency(requireStatement);
            }
        }
    }
    static onEnd(file) {
        if (file.es6module) {
            file.analysis.requiresTranspilation = true;
        }
    }
    static handleAliasReplacement(file, requireStatement) {
        if (file.collection && file.collection.info && file.collection.info.browserOverrides) {
            const overrides = file.collection.info.browserOverrides;
            const pm = file.collection.pm;
            if (overrides) {
                if (overrides[requireStatement] !== undefined) {
                    if (typeof overrides[requireStatement] === 'string') {
                        requireStatement = overrides[requireStatement];
                        file.analysis.requiresRegeneration = true;
                    } else {
                        return;
                    }
                } else {
                    const resolved = pm.resolve(requireStatement, file.info.absDir);
                    if (resolved && resolved.absPath) {
                        const fuseBoxPath = pm.getFuseBoxPath(resolved.absPath, file.collection.entryFile.info.absDir);
                        if (overrides[fuseBoxPath] !== undefined) {
                            if (typeof overrides[fuseBoxPath] === 'string') {
                                requireStatement = overrides[fuseBoxPath];
                                file.analysis.requiresRegeneration = true;
                            } else {
                                return;
                            }
                        }
                    }
                }
            }
        }
        const aliasCollection = file.context.aliasCollection;
        if (aliasCollection) {
            aliasCollection.forEach(props => {
                if (props.expr.test(requireStatement)) {
                    requireStatement = requireStatement.replace(props.expr, `${ props.replacement }$2`);
                    file.analysis.requiresRegeneration = true;
                }
            });
        }
        return requireStatement;
    }
}
exports.ImportDeclaration = ImportDeclaration;
}
// default/analysis/plugins/DynamicImportStatement.js
_bca95ef7.f[16] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const fs = _bca95ef7.s('fs');
class DynamicImportStatement {
    static onNode(file, node, parent) {
        const analysis = file.analysis;
        if (node.type === 'CallExpression' && node.callee) {
            if (node.callee.type === 'Identifier' && node.callee.name === '$fsmp$') {
                let arg1 = node.arguments[0];
                if (analysis.nodeIsString(arg1)) {
                    let requireStatement = arg1.value;
                    let resolved = file.collection.pm.resolve(requireStatement, file.info.absDir);
                    if (resolved && resolved.fuseBoxPath && fs.existsSync(resolved.absPath)) {
                        arg1.value = `~/${ resolved.fuseBoxPath }`;
                        file.analysis.requiresRegeneration = true;
                    }
                }
            }
        }
    }
    static onEnd() {
    }
}
exports.DynamicImportStatement = DynamicImportStatement;
}
// default/analysis/acorn-ext/obj-rest-spread.js
_bca95ef7.f[17] = function(module,exports){
function wrap(func, wrapper) {
    return function (...args) {
        return wrapper.call(this, func, args);
    };
}
module.exports = function inject(acorn) {
    var tt = acorn.tokTypes;
    function parseObj(func, args) {
        let first = true;
        const [isPattern, refDestructuringErrors] = args;
        const node = this.startNode();
        node.properties = [];
        this.next();
        while (!this.eat(tt.braceR)) {
            if (first) {
                first = false;
            } else {
                this.expect(tt.comma);
                if (this.afterTrailingComma(tt.braceR)) {
                    break;
                }
            }
            let startLoc;
            let startPos;
            let propNode = this.startNode();
            if (isPattern || refDestructuringErrors) {
                startPos = this.start;
                startLoc = this.startLoc;
            }
            if (this.type === tt.ellipsis) {
                propNode = this.parseSpread();
                propNode.type = 'SpreadElement';
                if (isPattern) {
                    propNode.type = 'RestElement';
                    propNode.value = this.toAssignable(propNode.argument, true);
                }
                node.properties.push(propNode);
                continue;
            }
            propNode.method = propNode.shorthand = false;
            const isGenerator = !isPattern && this.eat(tt.star);
            this.parsePropertyName(propNode);
            let isAsync = false;
            if (!isPattern && !isGenerator && isAsyncProp(this, propNode)) {
                isAsync = true;
                this.parsePropertyName(propNode);
            }
            this.parsePropertyValue(propNode, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors);
            node.properties.push(this.finishNode(propNode, 'Property'));
        }
        return this.finishNode(node, isPattern ? 'ObjectPattern' : 'ObjectExpression');
    }
    function toAssignable(func, args) {
        const [node] = args;
        if (node && node.type === 'ObjectExpression') {
            node.type = 'ObjectPattern';
            const {properties} = node;
            for (const propNode of properties) {
                if (propNode.kind === 'init') {
                    this.toAssignable(propNode.value);
                } else if (propNode.type === 'SpreadElement') {
                    propNode.value = this.toAssignable(propNode.argument);
                } else {
                    this.raise(propNode.key.start, 'Object pattern can\'t contain getter or setter');
                }
            }
            return node;
        }
        return func.apply(this, args);
    }
    acorn.plugins.objRestSpread = function objectRestSpreadPlugin(parser) {
        parser.parseObj = wrap(parser.parseObj, parseObj);
        parser.toAssignable = wrap(parser.toAssignable, toAssignable);
    };
    return acorn;
};
function isAsyncProp(parser, propNode) {
    return typeof parser.isAsyncProp === 'function' ? parser.isAsyncProp(propNode) : parser.toks.isAsyncProp(propNode);
}
}
// default/core/SourceMapGenerator.js
_bca95ef7.f[18] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const acorn = _bca95ef7.s('acorn');
const SourceMap = _bca95ef7.s('source-map');
class SourceMapGenerator {
    static generate(file, tokens) {
        const fileContent = file.contents;
        const filePath = file.info.fuseBoxPath;
        const smGenerator = new SourceMap.SourceMapGenerator({ file: `packages/${ file.collection.name }/${ filePath }` });
        tokens.some(token => {
            if (token.type.label === 'eof')
                return true;
            const lineInfo = acorn.getLineInfo(fileContent, token.start);
            const mapping = {
                original: lineInfo,
                generated: lineInfo,
                source: filePath,
                name: false
            };
            if (token.type.label === 'name')
                mapping.name = token.value;
            smGenerator.addMapping(mapping);
        });
        smGenerator.setSourceContent(filePath, fileContent);
        file.sourceMap = JSON.stringify(smGenerator.toJSON());
    }
}
exports.SourceMapGenerator = SourceMapGenerator;
}
// default/core/PathMaster.js
_bca95ef7.f[19] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const Utils_1 = _bca95ef7.r(3);
const Config_1 = _bca95ef7.r(2);
const path = _bca95ef7.s('path');
const fs = _bca95ef7.s('fs');
const NODE_MODULE = /^([a-z@](?!:).*)$/;
const isRelative = /^[\.\/\\]+$/;
const jsExtensions = [
    'js',
    'jsx'
];
const tsExtensions = jsExtensions.concat([
    'ts',
    'tsx'
]);
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
AllowedExtenstions.list = new Set([
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
    '.json',
    '.xml',
    '.css',
    '.html'
]);
exports.AllowedExtenstions = AllowedExtenstions;
class PathMaster {
    constructor(context, rootPackagePath) {
        this.context = context;
        this.rootPackagePath = rootPackagePath;
        this.tsMode = false;
    }
    init(name, fuseBoxPath) {
        const resolved = this.resolve(name, this.rootPackagePath);
        if (fuseBoxPath) {
            resolved.fuseBoxPath = fuseBoxPath;
        }
        return resolved;
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
                const absPath = this.getAbsolutePath(info.target, data.nodeModuleInfo.root, undefined, true);
                if (absPath.alias) {
                    data.fuseBoxAlias = absPath.alias;
                }
                data.absPath = absPath.resolved;
                data.absDir = path.dirname(data.absPath);
                data.nodeModuleExplicitOriginal = info.target;
            } else {
                data.absPath = data.nodeModuleInfo.entry;
                data.absDir = data.nodeModuleInfo.root;
            }
            if (data.absPath) {
                data.fuseBoxPath = this.getFuseBoxPath(data.absPath, data.nodeModuleInfo.root);
            }
            if (this.fuseBoxAlias) {
                data.fuseBoxPath = this.fuseBoxAlias;
            }
        } else {
            if (root) {
                const absPath = this.getAbsolutePath(name, root, rootEntryLimit);
                if (absPath.alias) {
                    data.fuseBoxAlias = absPath.alias;
                }
                data.absPath = absPath.resolved;
                data.absDir = path.dirname(data.absPath);
                data.fuseBoxPath = this.getFuseBoxPath(data.absPath, this.rootPackagePath);
                if (path.relative(this.rootPackagePath, data.absPath).match(/^\.\.(\\|\/)/)) {
                    this.context.fuse.producer.addWarning('unresolved', `File "${ data.absPath }" cannot be bundled because it's out of your project directory (homeDir)`);
                }
            }
        }
        return data;
    }
    getFuseBoxPath(name, root) {
        if (!root) {
            return;
        }
        name = name.replace(/\\/g, '/');
        root = root.replace(/\\/g, '/');
        name = name.replace(root, '').replace(/^\/|\\/, '');
        if (this.tsMode) {
            name = Utils_1.ensurePublicExtension(name);
        }
        let ext = path.extname(name);
        if (!ext) {
            name += '.js';
        }
        return name;
    }
    getAbsolutePath(name, root, rootEntryLimit, explicit = false) {
        const data = this.ensureFolderAndExtensions(name, root, explicit);
        const url = data.resolved;
        const alias = data.alias;
        let result = path.resolve(root, url);
        if (rootEntryLimit && name.match(/\.\.\/$/)) {
            if (result.indexOf(path.dirname(rootEntryLimit)) < 0) {
                return {
                    resolved: rootEntryLimit,
                    alias: alias
                };
            }
        }
        const output = {
            resolved: result,
            alias: alias
        };
        return output;
    }
    getParentFolderName() {
        if (this.rootPackagePath) {
            let s = this.rootPackagePath.split(/\/|\\/g);
            return s[s.length - 1];
        }
        return '';
    }
    testFolder(folder, name) {
        let extensions = jsExtensions;
        if (this.tsMode) {
            extensions = tsExtensions;
        }
        if (fs.existsSync(folder)) {
            for (let i = 0; i < extensions.length; i++) {
                const index = 'index.' + extensions[i];
                if (fs.existsSync(path.join(folder, index))) {
                    const result = path.join(name, index);
                    const [a, b] = name;
                    if (a === '.' && b !== '.') {
                        return './' + result;
                    }
                    return result;
                }
            }
        }
    }
    checkFileName(root, name) {
        let extensions = jsExtensions;
        if (this.tsMode) {
            extensions = tsExtensions;
        }
        for (let i = 0; i < extensions.length; i++) {
            let ext = extensions[i];
            let fileName = `${ name }.${ ext }`;
            let target = path.isAbsolute(name) ? fileName : path.join(root, fileName);
            if (fs.existsSync(target)) {
                if (fileName[0] === '.') {
                    fileName = `./${ fileName }`;
                }
                return fileName;
            }
        }
    }
    ensureNodeModuleExtension(input) {
        let ext = path.extname(input);
        if (!ext && !isRelative.test(input)) {
            return input + '.js';
        }
        return input;
    }
    ensureFolderAndExtensions(name, root, explicit = false) {
        let ext = path.extname(name);
        let fileExt = this.tsMode && !explicit ? '.ts' : '.js';
        if (name[0] === '~' && name[1] === '/' && this.rootPackagePath) {
            name = '.' + name.slice(1, name.length);
            name = path.join(this.rootPackagePath, name);
        }
        if (!ext) {
            const folderJsonPath = path.join(root, name, 'package.json');
            if (fs.existsSync(folderJsonPath)) {
                const folderJSON = _bca95ef7.s(folderJsonPath);
                if (folderJSON.main) {
                    return {
                        resolved: path.resolve(root, name, folderJSON.main),
                        alias: this.ensureNodeModuleExtension(name)
                    };
                }
            }
        }
        if (!AllowedExtenstions.has(ext)) {
            let fileNameCheck = this.checkFileName(root, name);
            if (fileNameCheck) {
                return { resolved: fileNameCheck };
            } else {
                let folder = path.isAbsolute(name) ? name : path.join(root, name);
                const folderPath = this.testFolder(folder, name);
                if (folderPath) {
                    return { resolved: folderPath };
                } else {
                    name += fileExt;
                    return { resolved: name };
                }
            }
        }
        return { resolved: name };
    }
    getNodeModuleInfo(name) {
        if (name[0] === '@') {
            let s = name.split('/');
            let target = s.splice(2, s.length).join('/');
            return {
                name: `${ s[0] }/${ s[1] }`,
                target: target
            };
        }
        let data = name.split(/\/(.+)?/);
        return {
            name: data[0],
            target: data[1]
        };
    }
    fixBrowserOverrides(browserOverrides) {
        let newOverrides = {};
        for (let key in browserOverrides) {
            let value = browserOverrides[key];
            if (typeof value === 'string') {
                if (/\.\//.test(key)) {
                    key = key.slice(2);
                }
                if (/\.\//.test(value)) {
                    value = '~/' + value.slice(2);
                } else {
                    value = '~/' + value;
                }
                if (!/.js$/.test(value)) {
                    value = value + '.js';
                }
            }
            newOverrides[key] = value;
        }
        return newOverrides;
    }
    getNodeModuleInformation(name) {
        const readMainFile = (folder, isCustom) => {
            const packageJSONPath = path.join(folder, 'package.json');
            if (fs.existsSync(packageJSONPath)) {
                const json = _bca95ef7.s(packageJSONPath);
                let entryFile;
                let entryRoot;
                let jsNext = false;
                let browserOverrides;
                if (this.context.target !== 'server') {
                    if (json.browser && !this.context.isBrowserTarget()) {
                        this.context.fuse.producer.addWarning('json.browser', `Library "${ name }" contains "browser" field. Set .target("browser") to avoid problems with your browser build!`);
                    }
                }
                if (this.context.isBrowserTarget() && json.browser) {
                    if (typeof json.browser === 'object') {
                        browserOverrides = this.fixBrowserOverrides(json.browser);
                        if (json.browser[json.main]) {
                            entryFile = json.browser[json.main];
                        }
                    }
                    if (typeof json.browser === 'string') {
                        entryFile = json.browser;
                    }
                }
                if (this.context.shouldUseJsNext(name) && (json['jsnext:main'] || json.module)) {
                    jsNext = true;
                    entryFile = path.join(folder, json['jsnext:main'] || json.module);
                } else {
                    entryFile = path.join(folder, entryFile || json.main || 'index.js');
                }
                entryRoot = path.dirname(entryFile);
                return {
                    browserOverrides: browserOverrides,
                    name,
                    jsNext,
                    custom: isCustom,
                    root: folder,
                    missing: false,
                    entryRoot,
                    entry: entryFile,
                    version: json.version
                };
            }
            let defaultEntry = path.join(folder, 'index.js');
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
                version: '0.0.0'
            };
        };
        let localLib = path.join(Config_1.Config.FUSEBOX_MODULES, name);
        let modulePath = path.join(Config_1.Config.NODE_MODULES_DIR, name);
        const producer = this.context.bundle && this.context.bundle.producer;
        if (producer && producer.isShared(name)) {
            let shared = producer.getSharedPackage(name);
            return {
                name,
                custom: false,
                bundleData: shared.data,
                root: shared.homeDir,
                entry: shared.mainPath,
                entryRoot: shared.mainDir,
                version: '0.0.0'
            };
        }
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
            let nodeModules = path.join(this.rootPackagePath, 'node_modules');
            let nestedNodeModule = path.join(nodeModules, name);
            if (fs.existsSync(nestedNodeModule)) {
                return readMainFile(nestedNodeModule, nodeModules !== Config_1.Config.NODE_MODULES_DIR);
            } else {
                let upperNodeModule = path.join(this.rootPackagePath, '../', name);
                if (path.dirname(upperNodeModule) !== Config_1.Config.NODE_MODULES_DIR) {
                    if (fs.existsSync(upperNodeModule)) {
                        let isCustom = false;
                        if (path.dirname(upperNodeModule).match(/node_modules$/)) {
                            isCustom = path.dirname(this.rootPackagePath) !== Config_1.Config.NODE_MODULES_DIR;
                            return readMainFile(upperNodeModule, isCustom);
                        }
                    }
                }
            }
        }
        return readMainFile(modulePath, false);
    }
}
exports.PathMaster = PathMaster;
}
// default/ModuleCache.js
_bca95ef7.f[20] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const ModuleCollection_1 = _bca95ef7.r(21);
const Config_1 = _bca95ef7.r(2);
const realm_utils_1 = _bca95ef7.s('realm-utils');
const fsExtra = _bca95ef7.s('fs-extra');
const fs = _bca95ef7.s('fs');
const path = _bca95ef7.s('path');
const MEMORY_CACHE = {};
class ModuleCache {
    constructor(context) {
        this.context = context;
        this.cachedDeps = {
            tree: {},
            flat: {}
        };
    }
    initialize() {
        this.cacheFolder = path.join(Config_1.Config.TEMP_FOLDER, 'cache', encodeURIComponent(Config_1.Config.FUSEBOX_VERSION), this.context.output.getUniqueHash());
        this.permanentCacheFolder = path.join(this.cacheFolder, 'permanent');
        fsExtra.ensureDirSync(this.permanentCacheFolder);
        this.staticCacheFolder = path.join(this.cacheFolder, 'static');
        fsExtra.ensureDirSync(this.staticCacheFolder);
        this.cacheFile = path.join(this.cacheFolder, 'deps.json');
        if (fs.existsSync(this.cacheFile)) {
            try {
                this.cachedDeps = _bca95ef7.s(this.cacheFile);
            } catch (e) {
                this.cachedDeps = {
                    tree: {},
                    flat: {}
                };
            }
        }
    }
    setPermanentCache(key, contents) {
        key = encodeURIComponent(key);
        let filePath = path.join(this.permanentCacheFolder, key);
        fs.writeFile(filePath, contents, () => {
        });
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
    getStaticCacheKey(file, type = '') {
        return encodeURIComponent(this.context.bundle.name + type + file.absPath);
    }
    encodeCacheFileName(str) {
        let ext = path.extname(str);
        if (ext !== '.js') {
            str = str + '.js';
        }
        return encodeURIComponent(str);
    }
    getStaticCache(file, type = '') {
        if (file.ignoreCache) {
            return;
        }
        let stats = fs.statSync(file.absPath);
        let fileName = this.encodeCacheFileName(type + file.info.fuseBoxPath);
        let memCacheKey = this.getStaticCacheKey(file, type);
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
                    data = _bca95ef7.s(dest);
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
    getCSSCache(file) {
        if (file.ignoreCache) {
            return;
        }
        let stats = fs.statSync(file.absPath);
        let fileName = this.encodeCacheFileName(file.info.fuseBoxPath);
        let memCacheKey = this.getStaticCacheKey(file);
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
                    data = _bca95ef7.s(dest);
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
    writeStaticCache(file, sourcemaps, type = '') {
        if (file.ignoreCache) {
            return;
        }
        let fileName = this.encodeCacheFileName(type + file.info.fuseBoxPath);
        let memCacheKey = this.getStaticCacheKey(file, type);
        let dest = path.join(this.staticCacheFolder, fileName);
        let stats = fs.statSync(file.absPath);
        let cacheData = {
            contents: file.contents,
            dependencies: file.analysis.dependencies,
            sourceMap: sourcemaps || {},
            headerContent: file.headerContent,
            mtime: stats.mtime.getTime(),
            _: file.cacheData || {}
        };
        if (file.devLibsRequired) {
            cacheData.devLibsRequired = file.devLibsRequired;
        }
        let data = `module.exports = { contents: ${ JSON.stringify(cacheData.contents) },
dependencies: ${ JSON.stringify(cacheData.dependencies) },
sourceMap: ${ JSON.stringify(cacheData.sourceMap) },
headerContent: ${ JSON.stringify(cacheData.headerContent) },
mtime: ${ cacheData.mtime },
devLibsRequired : ${ JSON.stringify(cacheData.devLibsRequired) },
_ : ${ JSON.stringify(cacheData._ || {}) }
}
`;
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
            let key = `${ info.name }@${ info.version }`;
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
                        if (MEMORY_CACHE[collection.cacheFile]) {
                            collection.cachedContent = MEMORY_CACHE[collection.cacheFile];
                            return resolve();
                        }
                        if (fs.existsSync(collection.cacheFile)) {
                            fs.readFile(collection.cacheFile, (err, result) => {
                                collection.cachedContent = result.toString();
                                MEMORY_CACHE[collection.cacheFile] = collection.cachedContent;
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
        const traverse = (modules, root) => {
            return realm_utils_1.each(modules, collection => {
                if (collection.traversed) {
                    return;
                }
                let dependencies = {};
                let flatFiles;
                if (collection.cached) {
                    return;
                }
                let key = `${ collection.info.name }@${ collection.info.version }`;
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
                    version: collection.info.version
                };
                collection.traversed = true;
                return traverse(collection.nodeModules, dependencies);
            });
        };
        traverse(rootCollection.nodeModules, json.tree).then(() => {
            fs.writeFile(this.cacheFile, JSON.stringify(json, undefined, 2), () => {
            });
        });
    }
    set(info, contents) {
        return new Promise((resolve, reject) => {
            const cacheKey = encodeURIComponent(`${ info.name }@${ info.version }`);
            const targetName = path.join(this.cacheFolder, cacheKey);
            MEMORY_CACHE[cacheKey] = contents;
            fs.writeFile(targetName, contents, err => {
                return resolve();
            });
        });
    }
}
exports.ModuleCache = ModuleCache;
}
// default/core/ModuleCollection.js
_bca95ef7.f[21] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const File_1 = _bca95ef7.r(7);
const PathMaster_1 = _bca95ef7.r(19);
const Utils_1 = _bca95ef7.r(3);
const realm_utils_1 = _bca95ef7.s('realm-utils');
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
        this.isDefault = false;
        this.isDefault = this.name === this.context.defaultPackageName;
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
            } else {
                if (plugin && realm_utils_1.utils.isString(plugin.test)) {
                    plugin.test = Utils_1.string2RegExp(plugin.test);
                }
            }
        });
        this.context.triggerPluginsMethodOnce('init', [this.context], plugin => {
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
            file.resolveDepsOnly = true;
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
            }).then(() => this.context.resolve()).then(() => {
                return this.context.useCache ? this.context.cache.resolve(this.toBeResolved) : this.toBeResolved;
            }).then(toResolve => {
                return realm_utils_1.each(toResolve, file => this.resolveNodeModule(file));
            }).then(() => this.context.resolve()).then(() => this.transformGroups()).then(() => this.context.cache && this.context.cache.buildMap(this)).catch(e => {
                this.context.defer.unlock();
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
        let moduleName = `${ info.name }@${ info.version }`;
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
        if (info.bundleData) {
            info.bundleData.including.forEach((inf, fname) => {
                const userFileInfo = collection.pm.init(fname);
                if (!userFileInfo.isNodeModule) {
                    let userFile = new File_1.File(this.context, userFileInfo);
                    userFile.consume();
                    collection.dependencies.set(userFileInfo.fuseBoxPath, userFile);
                }
            });
        }
        return file.info.nodeModuleExplicitOriginal && collection.pm ? collection.resolve(new File_1.File(this.context, collection.pm.init(file.info.absPath, file.info.fuseBoxAlias))) : collection.resolveEntry();
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
    resolveSplitFiles(files) {
        return realm_utils_1.each(files, file => {
            this.dependencies.set(file.absPath, file);
        });
    }
    async resolve(file, shouldIgnoreDeps) {
        file.shouldIgnoreDeps = shouldIgnoreDeps;
        file.collection = this;
        if (this.bundle) {
            if (this.bundle.fileBlackListed(file)) {
                return;
            }
            if (shouldIgnoreDeps === undefined) {
                shouldIgnoreDeps = this.bundle.shouldIgnoreNodeModules(file.getCrossPlatormPath());
            }
        }
        if (this.context.filterFile) {
            if (!this.context.filterFile(file)) {
                return;
            }
        }
        if (file.info.isNodeModule) {
            if (this.context.isGlobalyIgnored(file.info.nodeModuleName)) {
                return;
            }
            if (shouldIgnoreDeps || this.bundle && this.bundle.shouldIgnore(file.info.nodeModuleName)) {
                return;
            }
            return this.delayedResolve ? this.toBeResolved.push(file) : this.resolveNodeModule(file);
        } else {
            if (this.dependencies.has(file.absPath)) {
                return;
            }
            await file.consume();
            this.dependencies.set(file.absPath, file);
            let fileLimitPath;
            if (this.entryFile && this.entryFile.isNodeModuleEntry) {
                fileLimitPath = this.entryFile.info.absPath;
            }
            return realm_utils_1.each(file.analysis.dependencies, name => {
                const newFile = new File_1.File(this.context, this.pm.resolve(name, file.info.absDir, fileLimitPath));
                newFile.resolveDepsOnly = file.resolveDepsOnly;
                if (this.context.emitHMRDependencies && file.belongsToProject()) {
                    this.context.registerDependant(newFile, file);
                }
                return this.resolve(newFile, shouldIgnoreDeps);
            });
        }
    }
}
exports.ModuleCollection = ModuleCollection;
}
// default/EventEmitter.js
_bca95ef7.f[22] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class EventEmitter {
    constructor() {
        this.listeners = [];
        this.listenersOncer = [];
        this.on = listener => {
            this.listeners.push(listener);
            return { dispose: () => this.off(listener) };
        };
        this.once = listener => {
            this.listenersOncer.push(listener);
        };
        this.off = listener => {
            var callbackIndex = this.listeners.indexOf(listener);
            if (callbackIndex > -1)
                this.listeners.splice(callbackIndex, 1);
        };
        this.emit = event => {
            this.listeners.forEach(listener => listener(event));
            this.listenersOncer.forEach(listener => listener(event));
            this.listenersOncer = [];
        };
    }
}
exports.EventEmitter = EventEmitter;
}
// default/core/AutoImportedModule.js
_bca95ef7.f[23] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const realm_utils_1 = _bca95ef7.s('realm-utils');
const Utils_1 = _bca95ef7.r(3);
class AutoImportedModule {
    constructor(variable, pkg) {
        this.variable = variable;
        if (realm_utils_1.utils.isPlainObject(pkg)) {
            let options = pkg;
            this.pkg = options.pkg;
            this.statement = options.statement;
        } else {
            this.pkg = pkg;
            this.statement = `require("${ this.pkg }")`;
        }
    }
    getImportStatement() {
        return `/* fuse:injection: */ var ${ this.variable } = ${ this.statement };`;
    }
}
exports.AutoImportedModule = AutoImportedModule;
function registerDefaultAutoImportModules(userConfig) {
    let nativeImports = {};
    nativeImports.stream = new AutoImportedModule('stream', {
        pkg: 'stream',
        statement: `require("stream").Stream`
    });
    nativeImports.process = new AutoImportedModule('process', 'process');
    nativeImports.Buffer = new AutoImportedModule('Buffer', {
        pkg: 'buffer',
        statement: `require("buffer").Buffer`
    });
    nativeImports.http = new AutoImportedModule('http', 'http');
    return userConfig ? Utils_1.filter(nativeImports, (value, key) => userConfig[key] === undefined || userConfig[key] === true) : nativeImports;
}
exports.registerDefaultAutoImportModules = registerDefaultAutoImportModules;
}
// default/Defer.js
_bca95ef7.f[24] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class Defer {
    constructor() {
        this.locked = false;
        this.reset();
    }
    reset() {
        this.queued = new Map();
    }
    queue(id, fn) {
        if (this.locked === false) {
            return fn();
        }
        if (!this.queued.get(id)) {
            this.queued.set(id, fn);
        }
    }
    release() {
        this.queued.forEach((fn, key) => {
            fn();
        });
        this.reset();
    }
    lock() {
        this.locked = true;
    }
    unlock() {
        this.locked = false;
        this.release();
    }
}
exports.Defer = Defer;
}
// default/quantum/plugin/QuantumSplit.js
_bca95ef7.f[25] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const Utils_1 = _bca95ef7.r(3);
class QuantumItem {
    constructor(rule, bundleName, entryFile) {
        this.abstractions = new Set();
        this.expression = Utils_1.string2RegExp(rule);
        this.name = bundleName;
        this.entry = Utils_1.ensurePublicExtension(entryFile);
    }
    getFiles() {
        return this.abstractions;
    }
    addFile(file) {
        this.abstractions.add(file);
    }
    matches(path) {
        return this.expression.test(path);
    }
}
class QuantumSplitConfig {
    constructor(context) {
        this.items = new Set();
        this.resolveOptions = {};
    }
    register(rule, bundleName, entryFile) {
        this.items.add(new QuantumItem(rule, bundleName, entryFile));
    }
    resolve(name) {
        return Utils_1.joinFuseBoxPath(this.resolveOptions.dest ? this.resolveOptions.dest : '', name);
    }
    getItems() {
        return this.items;
    }
    findByEntry(file) {
        let config;
        this.items.forEach(value => {
            if (value.entry === file.fuseBoxPath) {
                config = value;
            }
        });
        return config;
    }
    matches(path) {
        let target;
        this.items.forEach(item => {
            if (item.matches(path)) {
                target = item;
            }
        });
        return target;
    }
}
exports.QuantumSplitConfig = QuantumSplitConfig;
}
// default/core/ServerPolyfillList.js
_bca95ef7.f[26] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const LIST = new Set([
    'assert',
    'buffer',
    'child_process',
    'crypto',
    'events',
    'fs',
    'http',
    'https',
    'module',
    'net',
    'os',
    'path',
    'process',
    'querystring',
    'stream',
    'timers',
    'tls',
    'tty',
    'url',
    'util',
    'zlib'
]);
function isPolyfilledByFuseBox(name) {
    return LIST.has(name);
}
exports.isPolyfilledByFuseBox = isPolyfilledByFuseBox;
}
// default/lib/CSSDependencyExtractor.js
_bca95ef7.f[27] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const path = _bca95ef7.s('path');
const fs = _bca95ef7.s('fs');
class CSSDependencyExtractor {
    constructor(opts) {
        this.opts = opts;
        this.dependencies = [];
        this.extractDepsFromString(opts.content);
    }
    extractDepsFromString(input, currentPath) {
        const re = /@import\s+("|')([^"']+)/g;
        let match;
        while (match = re.exec(input)) {
            let target = this.findTarget(match[2], currentPath);
            if (target) {
                this.readFile(target, path.dirname(target));
                this.dependencies.push(target);
            }
        }
    }
    readFile(fileName, currentPath) {
        let contents = fs.readFileSync(fileName).toString();
        this.extractDepsFromString(contents, currentPath);
    }
    getDependencies() {
        return this.dependencies;
    }
    tryFile(filePath) {
        if (filePath.indexOf('node_modules') > -1) {
            return;
        }
        let fname = path.basename(filePath);
        if (this.opts.sassStyle && !/^_/.test(fname)) {
            const pathWithUnderScore = path.join(path.dirname(filePath), '_' + fname);
            if (fs.existsSync(pathWithUnderScore)) {
                return pathWithUnderScore;
            }
        }
        if (fs.existsSync(filePath)) {
            return filePath;
        }
    }
    getPath(suggested, fileName) {
        let target = fileName;
        if (this.opts.importer) {
            fileName = this.opts.importer(fileName, null, info => {
                target = info.file;
            });
        }
        if (path.isAbsolute(target)) {
            return target;
        }
        return path.join(suggested, target);
    }
    findTarget(fileName, currentPath) {
        let targetFile;
        let extName = path.extname(fileName);
        let paths = this.opts.paths;
        if (currentPath) {
            paths = [currentPath].concat(paths);
        }
        if (!extName) {
            for (let p = 0; p < paths.length; p++) {
                for (let e = 0; e < this.opts.extensions.length; e++) {
                    let filePath = this.getPath(paths[p], fileName + '.' + this.opts.extensions[e]);
                    filePath = this.tryFile(filePath);
                    if (filePath) {
                        return filePath;
                    }
                }
            }
        } else {
            for (let p = 0; p < paths.length; p++) {
                let filePath = this.getPath(paths[p], fileName);
                filePath = this.tryFile(filePath);
                if (filePath) {
                    return filePath;
                }
            }
        }
        return targetFile;
    }
    static init(opts) {
        return new CSSDependencyExtractor(opts);
    }
}
exports.CSSDependencyExtractor = CSSDependencyExtractor;
}
// default/core/Bundle.js
_bca95ef7.f[28] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const FuseBox_1 = _bca95ef7.r(29);
const FuseProcess_1 = _bca95ef7.r(60);
const HotReloadPlugin_1 = _bca95ef7.r(61);
const path = _bca95ef7.s('path');
const BundleTestRunner_1 = _bca95ef7.r(62);
const Config_1 = _bca95ef7.r(2);
const EventEmitter_1 = _bca95ef7.r(22);
const ExtensionOverrides_1 = _bca95ef7.r(58);
class Bundle {
    constructor(name, fuse, producer) {
        this.name = name;
        this.fuse = fuse;
        this.producer = producer;
        this.process = new FuseProcess_1.FuseProcess(this);
        this.webIndexPriority = 0;
        this.webIndexed = true;
        this.errors = [];
        this.errorEmitter = new EventEmitter_1.EventEmitter();
        this.clearErrorEmitter = new EventEmitter_1.EventEmitter();
        this.context = fuse.context;
        this.context.bundle = this;
        fuse.producer = producer;
        this.setup();
    }
    watch(rules) {
        this.watchRule = rules ? rules : '**';
        return this;
    }
    globals(globals) {
        this.context.globals = globals;
        return this;
    }
    tsConfig(fpath) {
        this.context.tsConfig.setConfigFile(fpath);
        return this;
    }
    shim(shimConfig) {
        this.context.shim = shimConfig;
        return this;
    }
    hmr(opts) {
        if (!this.producer.hmrAllowed) {
            return this;
        }
        if (!this.producer.hmrInjected) {
            opts = opts || {};
            opts.port = this.producer.devServerOptions && this.producer.devServerOptions.port || 4444;
            let plugin = HotReloadPlugin_1.HotReloadPlugin({
                port: opts.port,
                uri: opts.socketURI,
                reload: opts.reload
            });
            this.context.plugins = this.context.plugins || [];
            this.context.plugins.push(plugin);
            this.producer.hmrInjected = true;
        }
        this.producer.sharedEvents.on('SocketServerReady', server => {
            this.fuse.context.sourceChangedEmitter.on(info => {
                if (this.fuse.context.isFirstTime() === false) {
                    this.fuse.context.log.echo(`Source changed for ${ info.path }`);
                    server.send('source-changed', info);
                }
            });
            if (this.context.showErrorsInBrowser) {
                const type = 'update-bundle-errors', getData = () => ({
                        bundleName: this.name,
                        messages: this.errors
                    });
                this.errorEmitter.on(message => {
                    server.send('bundle-error', {
                        bundleName: this.name,
                        message
                    });
                });
                this.clearErrorEmitter.on(() => {
                    server.send(type, getData());
                });
                server.server.on('connection', client => {
                    client.send(JSON.stringify({
                        type,
                        data: getData()
                    }));
                });
            }
        });
        return this;
    }
    alias(key, value) {
        this.context.addAlias(key, value);
        return this;
    }
    split(rule, str) {
        const arithmetics = str.match(/(\S+)\s*>\s(\S+)/i);
        if (!arithmetics) {
            throw new Error('Can\'t parse split arithmetics. Should look like:');
        }
        const bundleName = arithmetics[1];
        const mainFile = arithmetics[2];
        this.producer.fuse.context.quantumSplit(rule, bundleName, mainFile);
        return this;
    }
    cache(cache) {
        this.context.useCache = cache;
        return this;
    }
    splitConfig(opts) {
        this.producer.fuse.context.configureQuantumSplitResolving(opts);
        return this;
    }
    log(log) {
        this.context.doLog = log;
        this.context.log.printLog = log;
        return this;
    }
    extensionOverrides(...overrides) {
        if (!this.context.extensionOverrides) {
            this.context.extensionOverrides = new ExtensionOverrides_1.ExtensionOverrides(overrides);
        } else {
            overrides.forEach(override => this.context.extensionOverrides.add(override));
        }
        return this;
    }
    plugin(...args) {
        this.context.plugins = this.context.plugins || [];
        this.context.plugins.push(args.length === 1 ? args[0] : args);
        return this;
    }
    natives(opts) {
        this.context.natives = opts;
        return this;
    }
    instructions(arithmetics) {
        this.arithmetics = arithmetics;
        return this;
    }
    target(target) {
        this.context.target = target;
        return this;
    }
    sourceMaps(params) {
        this.context.setSourceMapsProperty(params);
        return this;
    }
    test(str = '**/*.test.ts', opts) {
        opts = opts || {};
        opts.reporter = opts.reporter || 'fuse-test-reporter';
        opts.exit = true;
        const clonedOpts = Object.assign({}, this.fuse.opts);
        const testBundleFile = path.join(Config_1.Config.TEMP_FOLDER, 'tests', new Date().getTime().toString(), '/$name.js');
        clonedOpts.output = testBundleFile;
        str += ` +fuse-test-runner ${ opts.reporter } -ansi`;
        const fuse = FuseBox_1.FuseBox.init(clonedOpts);
        fuse.bundle('test').instructions(str).completed(proc => {
            const bundle = _bca95ef7.s(proc.filePath);
            let runner = new BundleTestRunner_1.BundleTestRunner(bundle, opts);
            runner.start();
        });
        fuse.run();
    }
    exec() {
        this.context.tsConfig.read();
        return new Promise((resolve, reject) => {
            this.clearErrors();
            this.fuse.initiateBundle(this.arithmetics || '', () => {
                const output = this.fuse.context.output;
                this.process.setFilePath(output.lastPrimaryOutput ? output.lastPrimaryOutput.path : output.lastGeneratedFileName);
                if (this.onDoneCallback && this.producer.writeBundles === true) {
                    this.onDoneCallback(this.process);
                }
                this.printErrors();
                return resolve(this);
            }).then(source => {
            }).catch(e => {
                console.error(e);
                return reject(reject);
            });
            return this;
        });
    }
    completed(fn) {
        this.onDoneCallback = fn;
        return this;
    }
    setup() {
        this.context.output.setName(this.name);
        if (this.context.useCache) {
            this.context.initCache();
            this.context.cache.initialize();
        }
    }
    clearErrors() {
        this.errors = [];
        this.clearErrorEmitter.emit(null);
    }
    addError(message) {
        this.errors.push(message);
        this.errorEmitter.emit(message);
    }
    getErrors() {
        return this.errors.slice();
    }
    printErrors() {
        if (this.errors.length && this.fuse.context.showErrors) {
            this.fuse.context.log.echoBreak();
            this.fuse.context.log.echoBoldRed(`Errors for ${ this.name } bundle`);
            this.errors.forEach(error => this.fuse.context.log.echoError(error));
            this.fuse.context.log.echoBreak();
        }
    }
}
exports.Bundle = Bundle;
}
// default/core/FuseBox.js
_bca95ef7.f[29] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const fs = _bca95ef7.s('fs');
const process = _bca95ef7.s('process');
const realm_utils_1 = _bca95ef7.s('realm-utils');
const Utils_1 = _bca95ef7.r(3);
const ShimCollection_1 = _bca95ef7.r(30);
const Server_1 = _bca95ef7.r(31);
const JSONplugin_1 = _bca95ef7.r(34);
const PathMaster_1 = _bca95ef7.r(19);
const WorkflowContext_1 = _bca95ef7.r(5);
const CollectionSource_1 = _bca95ef7.r(35);
const Arithmetic_1 = _bca95ef7.r(36);
const ModuleCollection_1 = _bca95ef7.r(21);
const UserOutput_1 = _bca95ef7.r(39);
const BundleProducer_1 = _bca95ef7.r(40);
const Bundle_1 = _bca95ef7.r(28);
const File_1 = _bca95ef7.r(7);
const ExtensionOverrides_1 = _bca95ef7.r(58);
const TypescriptConfig_1 = _bca95ef7.r(59);
const appRoot = _bca95ef7.s('app-root-path');
class FuseBox {
    constructor(opts) {
        this.opts = opts;
        this.producer = new BundleProducer_1.BundleProducer(this);
        this.context = new WorkflowContext_1.WorkFlowContext();
        this.context.fuse = this;
        this.collectionSource = new CollectionSource_1.CollectionSource(this.context);
        opts = opts || {};
        let homeDir = appRoot.path;
        if (opts.writeBundles !== undefined) {
            this.context.userWriteBundles = opts.writeBundles;
        }
        if (opts.target !== undefined) {
            const [target, languageLevel] = opts.target.toLowerCase().split('@');
            this.context.target = target;
            const level = languageLevel && Object.keys(File_1.ScriptTarget).find(t => t.toLowerCase() === languageLevel);
            this.context.languageLevel = File_1.ScriptTarget[level] || File_1.ScriptTarget.ES5;
        }
        if (opts.polyfillNonStandardDefaultUsage !== undefined) {
            this.context.polyfillNonStandardDefaultUsage = opts.polyfillNonStandardDefaultUsage;
        }
        if (opts.useJsNext !== undefined) {
            this.context.useJsNext = opts.useJsNext;
        }
        if (opts.dynamicImportsEnabled !== undefined) {
            this.context.dynamicImportsEnabled = opts.dynamicImportsEnabled;
        }
        if (opts.useTypescriptCompiler !== undefined) {
            this.context.useTypescriptCompiler = opts.useTypescriptCompiler;
        }
        if (opts.emitHMRDependencies === true) {
            this.context.emitHMRDependencies = true;
        }
        if (opts.homeDir) {
            homeDir = Utils_1.ensureUserPath(opts.homeDir);
        }
        if (opts.debug !== undefined) {
            this.context.debugMode = opts.debug;
        }
        if (opts.debug !== undefined) {
            this.context.debugMode = opts.debug;
        }
        if (opts.warnings !== undefined) {
            this.context.showWarnings = opts.warnings;
        }
        if (opts.showErrors !== undefined) {
            this.context.showErrors = opts.showErrors;
            if (opts.showErrorsInBrowser === undefined) {
                this.context.showErrorsInBrowser = opts.showErrors;
            }
        }
        if (opts.showErrorsInBrowser !== undefined) {
            this.context.showErrorsInBrowser = opts.showErrorsInBrowser;
        }
        if (opts.ignoreModules) {
            this.context.ignoreGlobal = opts.ignoreModules;
        }
        this.context.debugMode = opts.debug !== undefined ? opts.debug : Utils_1.contains(process.argv, '--debug');
        if (opts.modulesFolder) {
            this.context.customModulesFolder = Utils_1.ensureUserPath(opts.modulesFolder);
        }
        if (opts.sourceMaps) {
            this.context.setSourceMapsProperty(opts.sourceMaps);
        }
        this.context.runAllMatchedPlugins = !!opts.runAllMatchedPlugins;
        this.context.plugins = opts.plugins || [JSONplugin_1.JSONPlugin()];
        if (opts.package) {
            if (realm_utils_1.utils.isPlainObject(opts.package)) {
                const packageOptions = opts.package;
                this.context.defaultPackageName = packageOptions.name || 'default';
                this.context.defaultEntryPoint = packageOptions.main;
            } else {
                this.context.defaultPackageName = opts.package;
            }
        }
        if (opts.cache !== undefined) {
            this.context.useCache = opts.cache ? true : false;
        }
        if (opts.filterFile) {
            this.context.filterFile = opts.filterFile;
        }
        if (opts.log !== undefined) {
            this.context.doLog = opts.log;
            this.context.log.printLog = opts.log;
        }
        if (opts.hash !== undefined) {
            this.context.hash = opts.hash;
        }
        if (opts.alias) {
            this.context.addAlias(opts.alias);
        }
        this.context.initAutoImportConfig(opts.natives, opts.autoImport);
        if (opts.globals) {
            this.context.globals = opts.globals;
        }
        if (opts.shim) {
            this.context.shim = opts.shim;
        }
        if (opts.standalone !== undefined) {
            this.context.standaloneBundle = opts.standalone;
        }
        if (opts.customAPIFile) {
            this.context.customAPIFile = opts.customAPIFile;
        }
        this.context.setHomeDir(homeDir);
        if (opts.cache !== undefined) {
            this.context.setUseCache(opts.cache);
        }
        this.virtualFiles = opts.files;
        if (opts.output) {
            this.context.output = new UserOutput_1.UserOutput(this.context, opts.output);
        }
        if (opts.extensionOverrides) {
            this.context.extensionOverrides = new ExtensionOverrides_1.ExtensionOverrides(opts.extensionOverrides);
        }
        const tsConfig = new TypescriptConfig_1.TypescriptConfig(this.context);
        ;
        tsConfig.setConfigFile(opts.tsConfig);
        this.context.tsConfig = tsConfig;
    }
    static init(opts) {
        return new FuseBox(opts);
    }
    triggerPre() {
        this.context.triggerPluginsMethodOnce('preBundle', [this.context]);
    }
    triggerStart() {
        this.context.triggerPluginsMethodOnce('bundleStart', [this.context]);
    }
    triggerEnd() {
        this.context.triggerPluginsMethodOnce('bundleEnd', [this.context]);
    }
    triggerPost() {
        this.context.triggerPluginsMethodOnce('postBundle', [this.context]);
    }
    copy() {
        const config = Object.assign({}, this.opts);
        config.plugins = [].concat(config.plugins || []);
        return FuseBox.init(config);
    }
    bundle(name, arithmetics) {
        let fuse = this.copy();
        const bundle = new Bundle_1.Bundle(name, fuse, this.producer);
        bundle.arithmetics = arithmetics;
        this.producer.add(name, bundle);
        return bundle;
    }
    dev(opts, fn) {
        opts = opts || {};
        opts.port = opts.port || 4444;
        this.producer.devServerOptions = opts;
        this.producer.runner.bottom(() => {
            let server = new Server_1.Server(this);
            server.start(opts);
            if (opts.open) {
                try {
                    const opn = _bca95ef7.s('opn');
                    opn(typeof opts.open === 'string' ? opts.open : `http://localhost:${ opts.port }`);
                } catch (e) {
                    this.context.log.echoRed('If you want to open the browser, please install "opn" package. "npm install opn --save-dev"');
                }
            }
            if (fn) {
                fn(server);
            }
        });
    }
    register(packageName, opts) {
        this.producer.runner.top(() => {
            return this.producer.register(packageName, opts);
        });
    }
    run(opts) {
        return this.producer.run(opts);
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
            if (this.context.emitHMRDependencies) {
                this.context.emitter.emit('bundle-collected');
            }
            this.context.log.bundleStart(this.context.bundle.name);
            return realm_utils_1.chain(class extends realm_utils_1.Chainable {
                constructor() {
                    super(...arguments);
                    this.globalContents = [];
                }
                setDefaultCollection() {
                    return bundleCollection;
                }
                addDefaultContents() {
                    return self.collectionSource.get(this.defaultCollection).then(cnt => {
                        self.context.log.echoDefaultCollection(this.defaultCollection, cnt);
                    });
                }
                addNodeModules() {
                    return realm_utils_1.each(self.context.nodeModules, collection => {
                        if (collection.cached || collection.info && !collection.info.missing) {
                            return self.collectionSource.get(collection).then(cnt => {
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
                    return { contents: this.globalContents };
                }
            }).then(result => {
                let self = this;
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
    initiateBundle(str, bundleReady) {
        this.context.reset();
        this.context.defer.lock();
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
                this.context.debug('Arithmetic', `Override standalone ${ bundle.standalone }`);
                this.context.standaloneBundle = bundle.standalone;
            }
            if (bundle.cache !== undefined) {
                this.context.debug('Arithmetic', `Override cache ${ bundle.cache }`);
                this.context.useCache = bundle.cache;
            }
            return this.process(data, bundleReady);
        }).then(contents => {
            bundle.finalize();
            return contents;
        }).catch(e => {
            console.log(e.stack || e);
        });
    }
}
exports.FuseBox = FuseBox;
process.on('unhandledRejection', (reason, promise) => {
    console.log(reason.stack);
});
}
// default/ShimCollection.js
_bca95ef7.f[30] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const ModuleCollection_1 = _bca95ef7.r(21);
const File_1 = _bca95ef7.r(7);
class ShimCollection {
    static create(context, name, exports) {
        let entryInfo = {
            isNodeModule: false,
            fuseBoxPath: 'index.js'
        };
        let entryFile = new File_1.File(context, entryInfo);
        entryFile.isLoaded = true;
        entryFile.analysis.skip();
        entryFile.contents = `module.exports = ${ exports }`;
        let collection = new ModuleCollection_1.ModuleCollection(context, name, { missing: false });
        collection.dependencies.set(name, entryFile);
        collection.setupEntry(entryFile);
        return collection;
    }
}
exports.ShimCollection = ShimCollection;
}
// default/devServer/Server.js
_bca95ef7.f[31] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const SocketServer_1 = _bca95ef7.r(32);
const Utils_1 = _bca95ef7.r(3);
const HTTPServer_1 = _bca95ef7.r(33);
const realm_utils_1 = _bca95ef7.s('realm-utils');
const process = _bca95ef7.s('process');
class Server {
    constructor(fuse) {
        this.fuse = fuse;
    }
    start(opts) {
        opts = opts || {};
        let rootDir = this.fuse.context.output.dir;
        const root = opts.root !== undefined ? realm_utils_1.utils.isString(opts.root) ? Utils_1.ensureUserPath(opts.root) : false : rootDir;
        const port = opts.port || 4444;
        if (opts.hmr !== false && this.fuse.context.useCache === true) {
            setTimeout(() => {
                this.fuse.context.log.echo(`HMR is enabled`);
            }, 1000);
        } else {
            setTimeout(() => {
                this.fuse.context.log.echo(`HMR is disabled. Caching should be enabled and {hmr} option should be NOT false`);
            }, 1000);
        }
        this.httpServer = new HTTPServer_1.HTTPServer(this.fuse);
        process.nextTick(() => {
            if (opts.httpServer === false) {
                SocketServer_1.SocketServer.startSocketServer(port, this.fuse);
            } else {
                this.httpServer.launch({
                    root,
                    port
                }, opts);
            }
        });
        return this;
    }
}
exports.Server = Server;
}
// default/devServer/SocketServer.js
_bca95ef7.f[32] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const ws_1 = _bca95ef7.s('ws');
class SocketServer {
    constructor(server, fuse) {
        this.server = server;
        this.fuse = fuse;
        this.clients = new Set();
        this.fuse.producer.sharedEvents.emit('SocketServerReady', this);
        server.on('connection', ws => {
            this.fuse.context.log.echo('Client connected');
            this.clients.add(ws);
            ws.on('message', message => {
                let input = JSON.parse(message);
                if (input.event) {
                    this.onMessage(ws, input.event, input.data);
                }
            });
            ws.on('close', () => {
                this.fuse.context.log.echo('Connection closed');
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
        fuse.context.log.echo(`Launching socket server on ${ port }`);
        return this.server;
    }
    send(type, data) {
        this.clients.forEach(client => {
            client.send(JSON.stringify({
                type,
                data
            }));
        });
    }
    onMessage(client, type, data) {
    }
}
exports.SocketServer = SocketServer;
}
// default/devServer/HTTPServer.js
_bca95ef7.f[33] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const http = _bca95ef7.s('http');
const express = _bca95ef7.s('express');
const SocketServer_1 = _bca95ef7.r(32);
const Utils_1 = _bca95ef7.r(3);
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
    launch(opts, userSettings) {
        this.opts = opts || {};
        const port = this.opts.port || 4444;
        let server = http.createServer();
        SocketServer_1.SocketServer.createInstance(server, this.fuse);
        this.setup();
        if (userSettings && userSettings.proxy) {
            let proxyInstance;
            try {
                proxyInstance = _bca95ef7.s('http-proxy-middleware');
            } catch (e) {
            }
            if (proxyInstance) {
                for (let uPath in userSettings.proxy) {
                    this.app.use(uPath, proxyInstance(userSettings.proxy[uPath]));
                }
            } else {
                this.fuse.context.log.echoWarning('You are using development proxy but \'http-proxy-middleware\' was not installed');
            }
        }
        server.on('request', this.app);
        setTimeout(() => {
            const packageInfo = Utils_1.getFuseBoxInfo();
            server.listen(port, () => {
                const msg = `
-----------------------------------------------------------------
Development server running http://localhost:${ port } @ ${ packageInfo.version }
-----------------------------------------------------------------
`;
                console.log(msg);
            });
        }, 10);
    }
    serveStatic(userPath, userFolder) {
        this.app.use(userPath, express.static(Utils_1.ensureUserPath(userFolder)));
    }
    setup() {
        if (this.opts.root) {
            this.app.use('/', express.static(this.opts.root));
            if (!this.fuse.context.inlineSourceMaps && process.env.NODE_ENV !== 'production') {
                this.fuse.context.log.echoInfo(`You have chosen not to inline source maps`);
                this.fuse.context.log.echoInfo('You source code is exposed at src/');
                this.fuse.context.log.echoWarning('Make sure you are not using dev server for production!');
                this.app.use(this.fuse.context.sourceMapsRoot, express.static(this.fuse.context.homeDir));
            }
        }
    }
}
exports.HTTPServer = HTTPServer;
}
// default/plugins/JSONplugin.js
_bca95ef7.f[34] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class FuseBoxJSONPlugin {
    constructor() {
        this.test = /\.json$/;
    }
    init(context) {
        context.allowExtension('.json');
    }
    transform(file) {
        const context = file.context;
        if (context.useCache) {
            if (file.loadFromCache()) {
                return;
            }
        }
        file.loadContents();
        file.contents = `module.exports = ${ file.contents || {} };`;
        if (context.useCache) {
            context.emitJavascriptHotReload(file);
            context.cache.writeStaticCache(file, file.sourceMap);
        }
    }
}
;
exports.JSONPlugin = () => {
    return new FuseBoxJSONPlugin();
};
}
// default/CollectionSource.js
_bca95ef7.f[35] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
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
}
// default/arithmetic/Arithmetic.js
_bca95ef7.f[36] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const ArithmeticStringParser_1 = _bca95ef7.r(37);
const Config_1 = _bca95ef7.r(2);
const realm_utils_1 = _bca95ef7.s('realm-utils');
const path = _bca95ef7.s('path');
const fs = _bca95ef7.s('fs');
const fsExtra = _bca95ef7.s('fs-extra');
const glob = _bca95ef7.s('glob');
const deleteFolderRecursive = p => {
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
class Arithmetic {
    static parse(str) {
        let parser = new ArithmeticStringParser_1.PropParser(str);
        parser.parse();
        return parser;
    }
    static getFiles(parser, virtualFiles, homeDir) {
        let tsMode = false;
        let collect = list => {
            let data = new Map();
            return realm_utils_1.each(list, (withDeps, filePattern) => {
                if (filePattern.match(/^[a-z0-9_\-@\/]+$/i)) {
                    data.set(filePattern, {
                        deps: withDeps,
                        nodeModule: true
                    });
                    return;
                }
                let fp = path.join(homeDir, filePattern);
                let extname = path.extname(fp);
                if (extname === '.ts' || extname === '.tsx') {
                    tsMode = true;
                }
                if (!extname && !filePattern.match(/\.js$/)) {
                    fp += '.js';
                }
                return new Promise((resolve, reject) => {
                    glob(fp, (err, files) => {
                        for (let i = 0; i < files.length; i++) {
                            data.set(files[i].normalize('NFC'), { deps: withDeps });
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
                    this.tempFolder = path.join(Config_1.Config.TEMP_FOLDER, 'virtual-files', new Date().getTime().toString());
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
}
// default/arithmetic/ArithmeticStringParser.js
_bca95ef7.f[37] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var STATES;
(function (STATES) {
    STATES[STATES['PENDING'] = 0] = 'PENDING';
    STATES[STATES['PLUS'] = 1] = 'PLUS';
    STATES[STATES['MINUS'] = 2] = 'MINUS';
    STATES[STATES['CONSUMING'] = 3] = 'CONSUMING';
    STATES[STATES['EXCLUDING_DEPS'] = 4] = 'EXCLUDING_DEPS';
    STATES[STATES['ENTRY_POINT'] = 5] = 'ENTRY_POINT';
    STATES[STATES['ONLY_DEPS'] = 6] = 'ONLY_DEPS';
}(STATES || (STATES = {})));
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
        let word = this.word.join('');
        if (!word) {
            this.reset();
            return;
        }
        let isEntry = this.has(STATES.ENTRY_POINT);
        if (this.has(STATES.ONLY_DEPS)) {
            this.depsOnly[word] = true;
        } else if (this.has(STATES.EXCLUDING_DEPS)) {
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
            if (char === '!') {
                this.standalone = false;
                return;
            }
            if (char === '^') {
                this.cache = false;
                return;
            }
            if (char === '+') {
                this.set(STATES.PLUS);
                return;
            }
            if (char === '-') {
                this.unset(STATES.PLUS);
                this.set(STATES.MINUS);
                return;
            }
            if (char === '~') {
                this.set(STATES.ONLY_DEPS);
                return;
            }
            if (char === '>') {
                this.set(STATES.ENTRY_POINT);
                return;
            }
            if (!char.match(/\s/)) {
                this.set(STATES.CONSUMING);
            }
        }
        if (this.has(STATES.CONSUMING)) {
            this.unset(STATES.PENDING);
            if (char === '[') {
                this.set(STATES.EXCLUDING_DEPS);
                return;
            }
            if (char === '~') {
                this.set(STATES.ONLY_DEPS);
                return;
            }
            if (char === ']') {
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
}
// default/arithmetic/Fluent.js
_bca95ef7.f[38] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
function strIncludesAnyOf(string, strings, delimiter = false) {
    if (delimiter && typeof strings === 'string' && strings.includes(','))
        strings = strings.split(',');
    for (let i = 0, len = strings.length; i < len; i++)
        if (string.includes(strings[i]))
            return true;
    return false;
}
class FluentBundle {
    constructor(name, fluentInstance) {
        this.name = name;
        this.fluentInstance = fluentInstance;
        this.cmds = [];
        this.str = '';
        this.noDeps = false;
    }
    finishBundle() {
        return this.fluentInstance;
    }
    addCmd(cmd, bundle) {
        this.cmds.push({
            bundle,
            cmd: 'execute'
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
        this.addCmd('execute', bundle);
        if (this.noDeps)
            this.str += `\n >[${ bundle }]`;
        else
            this.str += `\n >${ bundle }`;
        return this;
    }
    add(bundle) {
        this.addCmd('add', bundle);
        if (this.noDeps)
            this.str += `\n +[${ bundle }]`;
        else
            this.str += `\n +${ bundle }`;
        return this;
    }
    include(dep) {
        this.str += `\n +${ dep }`;
        return this;
    }
    exclude(dep) {
        this.str += `\n -${ dep }`;
        return this;
    }
    ignore(dep) {
        this.str += `\n -${ dep }`;
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
        } else {
            instructions = this.bundled[keys[0]].str;
        }
        return instructions;
    }
    static isArithmetic(str) {
        if (strIncludesAnyOf(str, '[,>,],+[,-,**,^,~,!', ','))
            return true;
        return false;
    }
}
exports.Fluent = Fluent;
exports.default = Fluent;
}
// default/core/UserOutput.js
_bca95ef7.f[39] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const Utils_1 = _bca95ef7.r(3);
const path = _bca95ef7.s('path');
const crypto = _bca95ef7.s('crypto');
const fs = _bca95ef7.s('fs');
const shortHash = _bca95ef7.s('shorthash');
class UserOutputResult {
}
class UserOutput {
    constructor(context, original) {
        this.context = context;
        this.original = original;
        this.filename = 'bundle.js';
        this.useHash = false;
        this.setup();
    }
    setName(name) {
        this.filename = name;
        const split = name.split('/');
        if (split.length > 1) {
            this.folderFromBundleName = split.splice(0, split.length - 1).join('/');
        }
    }
    getUniqueHash() {
        return `${ shortHash.unique(this.original) }-${ encodeURIComponent(this.filename) }`;
    }
    setup() {
        if (this.original.indexOf('$name') === -1) {
            this.filename = path.basename(this.original);
            this.original = this.original.replace(this.filename, '$name');
        }
        const dir = path.dirname(this.original);
        this.template = path.basename(this.original);
        this.dir = Utils_1.ensureDir(dir);
        this.useHash = this.context.isHashingRequired();
    }
    read(fname) {
        return new Promise((resolve, reject) => {
            fs.readFile(fname, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data.toString());
            });
        });
    }
    generateHash(content) {
        return Utils_1.hashString(crypto.createHash('md5').update(content, 'utf8').digest('hex'));
    }
    getPath(str, hash) {
        let template = this.template;
        const userExt = path.extname(str);
        const templateExt = path.extname(template);
        if (userExt && templateExt) {
            if (userExt === '.js' || userExt === '.html') {
                template = template.replace(templateExt, '');
            }
        }
        let basename = path.basename(str);
        let dirname = path.dirname(str);
        let fname;
        if (hash) {
            if (template.indexOf('$hash') === -1) {
                fname = template.replace('$name', hash + '-' + basename);
            } else {
                fname = template.replace('$name', basename).replace('$hash', hash);
            }
        } else {
            fname = template.replace('$name', basename).replace(/([-_]*\$hash[-_]*)/, '');
        }
        this.lastGeneratedFileName = fname;
        let result = path.join(this.dir, dirname, fname);
        return result;
    }
    getBundlePath() {
    }
    writeManifest(obj) {
        let fullpath = this.getPath(`${ this.context.bundle.name }.manifest.json`);
        fullpath = Utils_1.ensureUserPath(fullpath);
        fs.writeFileSync(fullpath, JSON.stringify(obj, null, 2));
    }
    getManifest() {
        let fullpath = this.getPath(`${ this.context.bundle.name }.manifest.json`);
        if (fs.existsSync(fullpath)) {
            return _bca95ef7.s(fullpath);
        }
    }
    writeToOutputFolder(userPath, content, hashAllowed = false) {
        let targetPath = path.join(this.dir, userPath);
        Utils_1.ensureUserPath(targetPath);
        let hash;
        if (this.useHash && hashAllowed) {
            hash = this.generateHash(content.toString());
            let fileName = `${ hash }-${ path.basename(targetPath) }`;
            let dirName = path.dirname(targetPath);
            targetPath = path.join(dirName, fileName);
            this.lastWrittenHash = hash;
        }
        return new Promise((resolve, reject) => {
            fs.writeFile(targetPath, content, e => {
                if (e) {
                    return reject(e);
                }
                let result = new UserOutputResult();
                result.content = content;
                result.hash = hash;
                result.path = targetPath;
                result.filename = path.basename(targetPath);
                return resolve(result);
            });
        });
    }
    write(userPath, content, ignoreHash) {
        let hash;
        if (this.useHash) {
            hash = this.generateHash(content.toString());
            this.lastWrittenHash = hash;
        }
        let fullpath = this.getPath(userPath, !ignoreHash ? hash : undefined);
        fullpath = Utils_1.ensureUserPath(fullpath);
        let result = new UserOutputResult();
        return new Promise((resolve, reject) => {
            result.path = fullpath;
            result.hash = hash;
            result.filename = path.basename(fullpath);
            result.relativePath = Utils_1.joinFuseBoxPath(this.folderFromBundleName || '.', result.filename);
            this.lastWrittenPath = fullpath;
            if (this.context.userWriteBundles) {
                fs.writeFile(fullpath, content, e => {
                    if (e) {
                        return reject(e);
                    }
                    return resolve(result);
                });
            } else {
                result.content = content;
                return resolve(result);
            }
        });
    }
    writeCurrent(content) {
        return this.write(this.filename, content).then(out => {
            this.lastPrimaryOutput = out;
            return out;
        });
    }
}
exports.UserOutput = UserOutput;
}
// default/core/BundleProducer.js
_bca95ef7.f[40] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const Utils_1 = _bca95ef7.r(3);
const events_1 = _bca95ef7.s('events');
const Arithmetic_1 = _bca95ef7.r(36);
const SharedCustomPackage_1 = _bca95ef7.r(41);
const BundleRunner_1 = _bca95ef7.r(42);
const chokidar = _bca95ef7.s('chokidar');
const realm_utils_1 = _bca95ef7.s('realm-utils');
const ProducerAbstraction_1 = _bca95ef7.r(43);
const BundleAbstraction_1 = _bca95ef7.r(46);
class BundleProducer {
    constructor(fuse) {
        this.fuse = fuse;
        this.bundles = new Map();
        this.hmrInjected = false;
        this.hmrAllowed = true;
        this.sharedEvents = new events_1.EventEmitter();
        this.writeBundles = true;
        this.userEnvVariables = Object.assign(process.env, { NODE_ENV: 'production' });
        this.injectedCode = new Map();
        this.warnings = new Map();
        this.runner = new BundleRunner_1.BundleRunner(this.fuse);
    }
    run(opts) {
        if (opts) {
            this.chokidarOptions = opts.chokidar;
        }
        this.watch();
        return this.runner.run(opts).then(() => {
            this.sharedEvents.emit('producer-done');
            this.printWarnings();
            return realm_utils_1.each(this.fuse.context.plugins, plugin => {
                if (plugin && realm_utils_1.utils.isFunction(plugin.producerEnd)) {
                    return plugin.producerEnd(this);
                }
            });
        }).then(() => this);
    }
    addUserProcessEnvVariables(data) {
        this.userEnvVariables = Object.assign(this.userEnvVariables, data);
    }
    printWarnings() {
        if (this.warnings.size > 0 && this.fuse.context.showWarnings) {
            this.fuse.context.log.echoBreak();
            this.warnings.forEach(warnings => {
                warnings.forEach(list => {
                    this.fuse.context.log.echoWarning(list);
                });
            });
            this.fuse.context.log.echoBreak();
        }
    }
    addWarning(key, message) {
        let list;
        if (!this.warnings.has(key)) {
            list = [];
            this.warnings.set(key, list);
        } else {
            list = this.warnings.get(key);
        }
        list.push(message);
    }
    getErrors() {
        const errors = [];
        this.bundles.forEach(bundle => errors.push(...bundle.getErrors()));
        return errors;
    }
    devCodeHasBeenInjected(key) {
        return this.injectedCode.has(key);
    }
    getDevInjections() {
        return this.injectedCode;
    }
    injectDevCode(key, code) {
        if (!this.injectedCode.has(key)) {
            this.injectedCode.set(key, code);
        }
    }
    sortBundles() {
        let bundles = [...this.bundles.values()];
        bundles = bundles.sort((a, b) => {
            if (a.webIndexPriority < b.webIndexPriority) {
                return 1;
            }
            if (a.webIndexPriority > b.webIndexPriority) {
                return -1;
            }
            return 0;
        });
        return bundles;
    }
    generateAbstraction(opts) {
        const abstraction = new ProducerAbstraction_1.ProducerAbstraction(opts);
        return realm_utils_1.each(this.bundles, bundle => {
            const bundleAbstraction = new BundleAbstraction_1.BundleAbstraction(bundle.name);
            abstraction.registerBundleAbstraction(bundleAbstraction);
            return bundleAbstraction.parse(bundle.generatedCode.toString());
        }).then(() => {
            return abstraction;
        });
    }
    register(packageName, opts) {
        let instructions = opts.instructions;
        if (!packageName) {
            throw new Error('Package name is required');
        }
        if (!opts.homeDir) {
            throw new Error('Register requires homeDir!');
        }
        let homeDir = Utils_1.ensureUserPath(opts.homeDir);
        if (!instructions) {
            throw new Error('Register requires opts.instructions!');
        }
        let parser = Arithmetic_1.Arithmetic.parse(instructions);
        if (!this.sharedCustomPackages) {
            this.sharedCustomPackages = new Map();
        }
        return Arithmetic_1.Arithmetic.getFiles(parser, false, homeDir).then(data => {
            let pkg = new SharedCustomPackage_1.SharedCustomPackage(packageName, data);
            pkg.init(homeDir, opts.main || 'index.js');
            this.sharedCustomPackages.set(packageName, pkg);
        });
    }
    isShared(name) {
        return this.sharedCustomPackages && this.sharedCustomPackages.get(name);
    }
    getSharedPackage(name) {
        return this.sharedCustomPackages.get(name);
    }
    add(name, bundle) {
        this.bundles.set(name, bundle);
        this.runner.bundle(bundle);
    }
    watch() {
        let settings = new Map();
        let isRequired = false;
        this.bundles.forEach(bundle => {
            if (bundle.watchRule) {
                isRequired = true;
                settings.set(bundle.name, Utils_1.string2RegExp(bundle.watchRule));
            }
        });
        if (!isRequired) {
            return;
        }
        let ready = false;
        chokidar.watch(this.fuse.context.homeDir, this.chokidarOptions || {}).on('all', (event, fp) => {
            if (ready) {
                this.onChanges(settings, fp);
            }
        }).on('ready', () => {
            ready = true;
        });
    }
    onChanges(settings, path) {
        path = Utils_1.ensureFuseBoxPath(path);
        settings.forEach((expression, bundleName) => {
            if (expression.test(path)) {
                const bundle = this.bundles.get(bundleName);
                const defer = bundle.fuse.context.defer;
                bundle.lastChangedFile = bundle.fuse.context.convertToFuseBoxPath(path);
                defer.queue(bundleName, () => {
                    return bundle.exec().then(result => {
                        this.sharedEvents.emit('file-changed', [
                            bundle,
                            path
                        ]);
                        return result;
                    });
                });
            }
        });
    }
}
exports.BundleProducer = BundleProducer;
}
// default/core/SharedCustomPackage.js
_bca95ef7.f[41] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const path = _bca95ef7.s('path');
class SharedCustomPackage {
    constructor(name, data) {
        this.name = name;
        this.data = data;
    }
    init(homeDir, main) {
        this.main = main;
        this.homeDir = homeDir;
        this.mainPath = path.join(homeDir, main);
        this.mainDir = path.dirname(this.mainPath);
    }
}
exports.SharedCustomPackage = SharedCustomPackage;
}
// default/core/BundleRunner.js
_bca95ef7.f[42] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const realm_utils_1 = _bca95ef7.s('realm-utils');
class BundleRunner {
    constructor(fuse) {
        this.fuse = fuse;
        this.topTasks = [];
        this.bundles = [];
        this.bottomTasks = [];
    }
    top(fn) {
        this.topTasks.push(fn);
    }
    bottom(fn) {
        this.bottomTasks.push(fn);
    }
    bundle(bundle) {
        this.bundles.push(bundle);
    }
    executeTop() {
        return Promise.all(this.topTasks.map(fn => fn()));
    }
    executeBottom() {
        return Promise.all(this.bottomTasks.map(fn => fn()));
    }
    executeBundles(runType) {
        if (runType === 'waterall ') {
            return realm_utils_1.each(this.bundles, bundle => bundle.exec());
        }
        return Promise.all(this.bundles.map(bundle => bundle.exec()));
    }
    run(opts = { runType: 'waterall' }) {
        return this.executeTop().then(() => this.executeBundles(opts.runType)).then(() => this.executeBottom());
    }
}
exports.BundleRunner = BundleRunner;
}
// default/quantum/core/ProducerAbstraction.js
_bca95ef7.f[43] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const utils_1 = _bca95ef7.r(44);
const ProducerWarning_1 = _bca95ef7.r(45);
class ProducerAbstraction {
    constructor(opts) {
        this.warnings = new Set();
        this.bundleAbstractions = new Map();
        this.useNumbers = true;
        this.useComputedRequireStatements = false;
        this.opts = opts || {};
        this.quantumCore = this.opts.quantumCore;
        this.opts.customComputedStatementPaths = this.opts.customComputedStatementPaths || new Set();
    }
    registerBundleAbstraction(bundleAbstraction) {
        bundleAbstraction.producerAbstraction = this;
        this.bundleAbstractions.set(bundleAbstraction.name, bundleAbstraction);
    }
    addWarning(msg) {
        this.warnings.add(new ProducerWarning_1.ProducerWarning(msg));
    }
    findFileAbstraction(packageName, resolvedPathRaw) {
        let combinations = utils_1.generateFileCombinations(resolvedPathRaw);
        for (const [, bundle] of this.bundleAbstractions) {
            if (!bundle.packageAbstractions.has(packageName)) {
                continue;
            }
            const pkg = bundle.packageAbstractions.get(packageName);
            const entryFile = pkg.entryFile;
            if (!combinations) {
                combinations = utils_1.generateFileCombinations(entryFile);
            }
            for (const combination of combinations) {
                for (const [, file] of pkg.fileAbstractions) {
                    const found = file.fuseBoxPath === combination;
                    if (found) {
                        return file;
                    }
                }
            }
        }
    }
}
exports.ProducerAbstraction = ProducerAbstraction;
}
// default/quantum/core/utils.js
_bca95ef7.f[44] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const path = _bca95ef7.s('path');
const Utils_1 = _bca95ef7.r(3);
function generateFileCombinations(input) {
    if (!input || input === '.') {
        return undefined;
    }
    let ext = path.extname(input);
    let combinations = [input];
    if (input.endsWith('/')) {
        combinations.push(Utils_1.joinFuseBoxPath(input, 'index.js'), Utils_1.joinFuseBoxPath(input, 'index.jsx'));
    } else {
        if (!ext) {
            combinations.push(`${ input }.js`, `${ input }.jsx`, Utils_1.joinFuseBoxPath(input, 'index.js'), Utils_1.joinFuseBoxPath(input, 'index.jsx'));
        }
    }
    combinations.push(combinations + '.js');
    return combinations;
}
exports.generateFileCombinations = generateFileCombinations;
}
// default/quantum/core/ProducerWarning.js
_bca95ef7.f[45] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class ProducerWarning {
    constructor(msg) {
        this.msg = msg;
    }
}
exports.ProducerWarning = ProducerWarning;
}
// default/quantum/core/BundleAbstraction.js
_bca95ef7.f[46] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const PackageAbstraction_1 = _bca95ef7.r(47);
const ASTTraverse_1 = _bca95ef7.r(9);
const FileAnalysis_1 = _bca95ef7.r(8);
class BundleAbstraction {
    constructor(name) {
        this.name = name;
        this.splitAbstraction = false;
        this.packageAbstractions = new Map();
        this.globalVariableRequired = false;
        this.identifiers = new Map();
        this.hoisted = new Map();
    }
    registerHoistedIdentifiers(identifier, statement, file) {
        let list;
        if (!this.identifiers.has(identifier)) {
            list = new Set();
            this.identifiers.set(identifier, list);
        } else {
            list = this.identifiers.get(identifier);
        }
        list.add({
            statement: statement,
            file: file
        });
    }
    registerPackageAbstraction(packageAbstraction) {
        this.packageAbstractions.set(packageAbstraction.name, packageAbstraction);
    }
    parse(contents) {
        const ast = FileAnalysis_1.acornParse(contents);
        ASTTraverse_1.ASTTraverse.traverse(ast, {
            pre: (node, parent, prop, idx) => {
                if (node.type === 'MemberExpression') {
                    if (node.object && node.object.type === 'Identifier' && node.object.name === 'FuseBox' && node.property && node.property.type === 'Identifier' && node.property.name === 'pkg' && parent.arguments && parent.arguments.length === 3) {
                        let pkgName = parent.arguments[0].value;
                        if (pkgName.charAt(0) !== '@') {
                            pkgName = pkgName.split('@')[0];
                        }
                        const packageAst = parent.arguments[2].body;
                        let packageAbstraction;
                        if (this.packageAbstractions.get(pkgName)) {
                            packageAbstraction = this.packageAbstractions.get(pkgName);
                        } else {
                            packageAbstraction = new PackageAbstraction_1.PackageAbstraction(pkgName, this);
                        }
                        packageAbstraction.loadAst(packageAst);
                        return false;
                    }
                }
            }
        });
    }
}
exports.BundleAbstraction = BundleAbstraction;
}
// default/quantum/core/PackageAbstraction.js
_bca95ef7.f[47] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const FileAbstraction_1 = _bca95ef7.r(48);
const ASTTraverse_1 = _bca95ef7.r(9);
class PackageAbstraction {
    constructor(name, bundleAbstraction) {
        this.name = name;
        this.bundleAbstraction = bundleAbstraction;
        this.fileAbstractions = new Map();
        this.entryFile = 'index.js';
        bundleAbstraction.registerPackageAbstraction(this);
    }
    registerFileAbstraction(fileAbstraction) {
        this.fileAbstractions.set(fileAbstraction.fuseBoxPath, fileAbstraction);
    }
    loadAst(ast) {
        ASTTraverse_1.ASTTraverse.traverse(ast, {
            pre: (node, parent, prop, idx) => {
                if (node.type === 'ReturnStatement' && node.argument.left.type === 'MemberExpression' && node.argument.left.object.name === '___scope___' && node.argument.left.property.name === 'entry' && node.argument.right && node.argument.right.type === 'Literal') {
                    this.entryFile = node.argument.right.value;
                }
                if (node.type === 'CallExpression' && node.callee && node.callee.type === 'MemberExpression') {
                    const callee = node.callee;
                    if (callee.object && callee.object.name === '___scope___' && callee.property.name === 'file') {
                        const fileName = node.arguments[0].value;
                        const fn = node.arguments[1];
                        if (fn && fn.type === 'FunctionExpression') {
                            const fileAbstraction = new FileAbstraction_1.FileAbstraction(fileName, this);
                            fileAbstraction.loadAst(fn.body);
                            return false;
                        }
                    }
                }
            }
        });
    }
}
exports.PackageAbstraction = PackageAbstraction;
}
// default/quantum/core/FileAbstraction.js
_bca95ef7.f[48] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const FileAnalysis_1 = _bca95ef7.r(8);
const ASTTraverse_1 = _bca95ef7.r(9);
const RequireStatement_1 = _bca95ef7.r(49);
const escodegen = _bca95ef7.s('escodegen');
const path = _bca95ef7.s('path');
const Utils_1 = _bca95ef7.r(3);
const AstUtils_1 = _bca95ef7.r(50);
const ExportsInterop_1 = _bca95ef7.r(51);
const UseStrict_1 = _bca95ef7.r(53);
const TypeOfExportsKeyword_1 = _bca95ef7.r(54);
const TypeOfModuleKeyword_1 = _bca95ef7.r(55);
const NamedExport_1 = _bca95ef7.r(56);
const GenericAst_1 = _bca95ef7.r(52);
const ReplaceableBlock_1 = _bca95ef7.r(57);
const globalNames = new Set([
    '__filename',
    '__dirname',
    'exports',
    'module'
]);
const SystemVars = new Set([
    'module',
    'exports',
    'require',
    'window',
    'global'
]);
class FileAbstraction {
    constructor(fuseBoxPath, packageAbstraction) {
        this.fuseBoxPath = fuseBoxPath;
        this.packageAbstraction = packageAbstraction;
        this.treeShakingRestricted = false;
        this.dependents = new Set();
        this.dependencies = new Map();
        this.isEcmaScript6 = false;
        this.shakable = false;
        this.amountOfReferences = 0;
        this.canBeRemoved = false;
        this.namedRequireStatements = new Map();
        this.requireStatements = new Set();
        this.dynamicImportStatements = new Set();
        this.fuseboxIsEnvConditions = new Set();
        this.definedLocally = new Set();
        this.exportsInterop = new Set();
        this.useStrict = new Set();
        this.typeofExportsKeywords = new Set();
        this.typeofModulesKeywords = new Set();
        this.typeofWindowKeywords = new Set();
        this.typeofGlobalKeywords = new Set();
        this.typeofDefineKeywords = new Set();
        this.typeofRequireKeywords = new Set();
        this.namedExports = new Map();
        this.processNodeEnv = new Set();
        this.isEntryPoint = false;
        this.localExportUsageAmount = new Map();
        this.globalVariables = new Set();
        this.fuseBoxDir = Utils_1.ensureFuseBoxPath(path.dirname(fuseBoxPath));
        this.setID(fuseBoxPath);
        packageAbstraction.registerFileAbstraction(this);
        this.core = this.packageAbstraction.bundleAbstraction.producerAbstraction.quantumCore;
        if (this.core && !this.core.opts.shouldBundleProcessPolyfill() && this.isProcessPolyfill()) {
            this.markForRemoval();
        }
    }
    isProcessPolyfill() {
        return this.getFuseBoxFullPath() === 'process/index.js';
    }
    registerHoistedIdentifiers(identifier, statement, resolvedFile) {
        const bundle = this.packageAbstraction.bundleAbstraction;
        bundle.registerHoistedIdentifiers(identifier, statement, resolvedFile);
    }
    getFuseBoxFullPath() {
        return `${ this.packageAbstraction.name }/${ this.fuseBoxPath }`;
    }
    isNotUsedAnywhere() {
        return this.getID().toString() !== '0' && this.dependents.size === 0 && !this.quantumItem && !this.isEntryPoint;
    }
    releaseDependent(file) {
        this.dependents.delete(file);
    }
    markForRemoval() {
        this.canBeRemoved = true;
    }
    loadString(contents) {
        this.ast = FileAnalysis_1.acornParse(contents);
        this.analyse();
    }
    setID(id) {
        this.id = id;
    }
    referenceQuantumSplit(item) {
        item.addFile(this);
        this.quantumItem = item;
    }
    getSplitReference() {
        return this.quantumItem;
    }
    getID() {
        return this.id;
    }
    isTreeShakingAllowed() {
        return this.treeShakingRestricted === false && this.shakable;
    }
    restrictTreeShaking() {
        this.treeShakingRestricted = true;
    }
    addDependency(file, statement) {
        let list;
        if (this.dependencies.has(file)) {
            list = this.dependencies.get(file);
        } else {
            list = new Set();
            this.dependencies.set(file, list);
        }
        list.add(statement);
    }
    getDependencies() {
        return this.dependencies;
    }
    loadAst(ast) {
        ast.type = 'Program';
        this.ast = ast;
        this.analyse();
    }
    findRequireStatements(exp) {
        let list = [];
        this.requireStatements.forEach(statement => {
            if (exp.test(statement.value)) {
                list.push(statement);
            }
        });
        return list;
    }
    wrapWithFunction(args) {
        this.wrapperArguments = args;
    }
    isRequireStatementUsed() {
        return this.requireStatements.size > 0;
    }
    isDirnameUsed() {
        return this.globalVariables.has('__dirname');
    }
    isFilenameUsed() {
        return this.globalVariables.has('__filename');
    }
    isExportStatementInUse() {
        return this.globalVariables.has('exports');
    }
    isModuleStatementInUse() {
        return this.globalVariables.has('module');
    }
    isExportInUse() {
        return this.globalVariables.has('exports') || this.globalVariables.has('module');
    }
    setEnryPoint(globalsName) {
        this.isEntryPoint = true;
        this.globalsName = globalsName;
        this.treeShakingRestricted = true;
    }
    generate(ensureEs5 = false) {
        let code = escodegen.generate(this.ast);
        if (ensureEs5 && this.isEcmaScript6) {
            code = Utils_1.transpileToEs5(code);
        }
        let fn = [
            'function(',
            this.wrapperArguments ? this.wrapperArguments.join(',') : '',
            '){\n'
        ];
        if (this.isDirnameUsed()) {
            fn.push(`var __dirname = ${ JSON.stringify(this.fuseBoxDir) };` + '\n');
        }
        if (this.isFilenameUsed()) {
            fn.push(`var __filename = ${ JSON.stringify(this.fuseBoxPath) };` + '\n');
        }
        fn.push(code, '\n}');
        code = fn.join('');
        return code;
    }
    onNode(node, parent, prop, idx) {
        if (this.core) {
            const processKeyInIfStatement = AstUtils_1.matchesIfStatementProcessEnv(node);
            const value = this.core.producer.userEnvVariables[processKeyInIfStatement];
            if (processKeyInIfStatement) {
                const result = AstUtils_1.compareStatement(node, value);
                const processNode = new ReplaceableBlock_1.ReplaceableBlock(node.test, 'left', node.test.left);
                this.processNodeEnv.add(processNode);
                return processNode.conditionalAnalysis(node, result);
            } else {
                const inlineProcessKey = AstUtils_1.matchesNodeEnv(node);
                if (inlineProcessKey) {
                    const value = this.core.producer.userEnvVariables[inlineProcessKey];
                    const env = new ReplaceableBlock_1.ReplaceableBlock(parent, prop, node);
                    value === undefined ? env.setUndefinedValue() : env.setValue(value);
                    this.processNodeEnv.add(env);
                }
            }
            const isEnvName = AstUtils_1.matchesIfStatementFuseBoxIsEnvironment(node);
            if (isEnvName) {
                let value;
                if (isEnvName === 'isServer') {
                    value = this.core.opts.isTargetServer();
                }
                if (isEnvName === 'isBrowser') {
                    value = this.core.opts.isTargetBrowser();
                }
                if (isEnvName === 'target') {
                    value = this.core.opts.getTarget();
                }
                if (!this.core.opts.isTargetUniveral()) {
                    const isEnvNode = new ReplaceableBlock_1.ReplaceableBlock(node, '', node.test);
                    isEnvNode.identifier = isEnvName;
                    this.fuseboxIsEnvConditions.add(isEnvNode);
                    return isEnvNode.conditionalAnalysis(node, value);
                }
            }
            if (AstUtils_1.matchesDoubleMemberExpression(node, 'FuseBox')) {
                let envName = node.property.name;
                if (envName === 'isServer' || envName === 'isBrowser' || envName === 'target') {
                    let value;
                    if (envName === 'isServer') {
                        value = this.core.opts.isTargetServer();
                    }
                    if (envName === 'isBrowser') {
                        value = this.core.opts.isTargetBrowser();
                    }
                    if (envName === 'target') {
                        value = this.core.opts.getTarget();
                    }
                    const envNode = new ReplaceableBlock_1.ReplaceableBlock(parent, prop, node);
                    envNode.identifier = envName;
                    envNode.setValue(value);
                    this.fuseboxIsEnvConditions.add(envNode);
                }
            }
        }
        if (AstUtils_1.matchesEcmaScript6(node)) {
            this.isEcmaScript6 = true;
        }
        this.namedRequireStatements.forEach((statement, key) => {
            const importedName = AstUtils_1.trackRequireMember(node, key);
            if (importedName) {
                statement.localReferences++;
                statement.usedNames.add(importedName);
            }
        });
        AstUtils_1.isExportComputed(node, isComputed => {
            if (isComputed) {
                this.restrictTreeShaking();
            }
        });
        AstUtils_1.isExportMisused(node, name => {
            const createdExports = this.namedExports.get(name);
            if (createdExports) {
                createdExports.eligibleForTreeShaking = false;
            }
        });
        const matchesExportIdentifier = AstUtils_1.matchesExportReference(node);
        if (matchesExportIdentifier) {
            let ref = this.localExportUsageAmount.get(matchesExportIdentifier);
            if (ref === undefined) {
                this.localExportUsageAmount.set(matchesExportIdentifier, 1);
            } else {
                this.localExportUsageAmount.set(matchesExportIdentifier, ++ref);
            }
        }
        AstUtils_1.matchNamedExport(node, (name, referencedVariableName) => {
            let namedExport;
            if (!this.namedExports.get(name)) {
                namedExport = new NamedExport_1.NamedExport();
                namedExport.name = name;
                this.namedExports.set(name, namedExport);
            } else {
                namedExport = this.namedExports.get(name);
            }
            namedExport.addNode(parent, prop, node, referencedVariableName);
        });
        if (AstUtils_1.matchesSingleFunction(node, 'require')) {
            this.requireStatements.add(new RequireStatement_1.RequireStatement(this, node));
        }
        if (AstUtils_1.matchesSingleFunction(node, '$fsmp$')) {
            this.dynamicImportStatements.add(new RequireStatement_1.RequireStatement(this, node));
        }
        if (AstUtils_1.matchesTypeOf(node, 'module')) {
            this.typeofModulesKeywords.add(new TypeOfModuleKeyword_1.TypeOfModuleKeyword(parent, prop, node));
        }
        if (AstUtils_1.matchesTypeOf(node, 'require')) {
            this.typeofRequireKeywords.add(new GenericAst_1.GenericAst(parent, prop, node));
        }
        if (AstUtils_1.matcheObjectDefineProperty(node, 'exports')) {
            if (!this.globalVariables.has('exports')) {
                this.globalVariables.add('exports');
            }
            this.exportsInterop.add(new ExportsInterop_1.ExportsInterop(parent, prop, node));
        }
        if (AstUtils_1.matchesAssignmentExpression(node, 'exports', '__esModule')) {
            if (!this.globalVariables.has('exports')) {
                this.globalVariables.add('exports');
            }
            this.exportsInterop.add(new ExportsInterop_1.ExportsInterop(parent, prop, node));
        }
        if (AstUtils_1.matchesTypeOf(node, 'exports')) {
            this.typeofExportsKeywords.add(new TypeOfExportsKeyword_1.TypeOfExportsKeyword(parent, prop, node));
        }
        if (AstUtils_1.matchesLiteralStringExpression(node, 'use strict')) {
            this.useStrict.add(new UseStrict_1.UseStrict(parent, prop, node));
        }
        if (AstUtils_1.matchesTypeOf(node, 'global')) {
            this.typeofGlobalKeywords.add(new GenericAst_1.GenericAst(parent, prop, node));
        }
        if (AstUtils_1.matchesTypeOf(node, 'define')) {
            this.typeofDefineKeywords.add(new GenericAst_1.GenericAst(parent, prop, node));
        }
        if (AstUtils_1.matchesTypeOf(node, 'window')) {
            this.typeofWindowKeywords.add(new GenericAst_1.GenericAst(parent, prop, node));
        }
        const requireIdentifier = AstUtils_1.matchRequireIdentifier(node);
        if (requireIdentifier) {
            const identifiedRequireStatement = new RequireStatement_1.RequireStatement(this, node.init, node);
            identifiedRequireStatement.identifier = requireIdentifier;
            this.namedRequireStatements.set(requireIdentifier, identifiedRequireStatement);
            this.requireStatements.add(identifiedRequireStatement);
            return false;
        }
        if (AstUtils_1.matchesDoubleMemberExpression(node, 'FuseBox')) {
            if (node.property.name === 'import') {
                parent.callee = {
                    type: 'Identifier',
                    name: 'require'
                };
                this.requireStatements.add(new RequireStatement_1.RequireStatement(this, parent, parent.$parent));
            }
            return false;
        }
        if (node && node.type === 'Identifier') {
            let globalVariable;
            if (globalNames.has(node.name)) {
                globalVariable = node.name;
            }
            if (node.name === 'global') {
                this.packageAbstraction.bundleAbstraction.globalVariableRequired = true;
            }
            this.detectLocallyDefinedSystemVariables(node);
            if (globalVariable) {
                if (!this.globalVariables.has(globalVariable)) {
                    this.globalVariables.add(globalVariable);
                }
            }
        }
    }
    detectLocallyDefinedSystemVariables(node) {
        let definedName;
        if (SystemVars.has(node.name)) {
            if (node.$prop === 'params') {
                if (node.$parent && node.$parent.type === 'FunctionDeclaration') {
                    definedName = node.name;
                }
            }
            if (node.$prop === 'id') {
                if (node.$parent && node.$parent.type == 'VariableDeclarator') {
                    definedName = node.name;
                }
            }
        }
        if (definedName) {
            if (!this.definedLocally.has(definedName)) {
                this.definedLocally.add(definedName);
            }
        }
    }
    analyse() {
        ASTTraverse_1.ASTTraverse.traverse(this.ast, { pre: (node, parent, prop, idx) => this.onNode(node, parent, prop, idx) });
    }
}
exports.FileAbstraction = FileAbstraction;
}
// default/quantum/core/nodes/RequireStatement.js
_bca95ef7.f[49] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const path = _bca95ef7.s('path');
const Utils_1 = _bca95ef7.r(3);
const FileAnalysis_1 = _bca95ef7.r(8);
function isString(node) {
    return node.type === 'Literal' || node.type === 'StringLiteral';
}
class RequireStatement {
    constructor(file, ast, parentAst) {
        this.file = file;
        this.ast = ast;
        this.parentAst = parentAst;
        this.isComputed = false;
        this.usedNames = new Set();
        this.localReferences = 0;
        this.resolved = false;
        ast.arguments = ast.arguments || [];
        const arg1 = ast.arguments[0];
        this.functionName = ast.callee.name;
        const producer = file.packageAbstraction.bundleAbstraction.producerAbstraction;
        const customComputedStatementPaths = producer.opts.customComputedStatementPaths;
        if (ast.arguments.length === 1 && isString(arg1)) {
            this.value = ast.arguments[0].value;
            let moduleValues = this.value.match(/^([a-z@](?!:).*)$/);
            this.isNodeModule = moduleValues !== null && moduleValues !== undefined;
            if (moduleValues) {
                const moduleValue = moduleValues[0];
                if (moduleValue.charAt(0) === '@') {
                    let matched = moduleValue.match(/(@[\w_-]+\/[\w_-]+)\/?(.*)/i);
                    if (matched) {
                        this.nodeModuleName = matched[1];
                        this.nodeModulePartialRequire = matched[2];
                    }
                } else {
                    const [moduleName, ...partialRequire] = moduleValue.split('/');
                    this.nodeModuleName = moduleName;
                    this.nodeModulePartialRequire = partialRequire.join('/');
                }
            }
        } else {
            this.isComputed = true;
            if (this.functionName === 'require') {
                let showWarning = true;
                customComputedStatementPaths.forEach((regexp, path) => {
                    if (regexp.test(file.getFuseBoxFullPath())) {
                        showWarning = false;
                    }
                });
                if (showWarning) {
                    producer.addWarning(`Computed statement warning in ${ this.file.packageAbstraction.name }/${ this.file.fuseBoxPath }`);
                }
            }
        }
    }
    removeWithIdentifier() {
        const declarator = this.parentAst;
        const declaration = declarator.$parent;
        const index = declaration.declarations.indexOf(declarator);
        declaration.declarations.splice(index, 1);
        if (declaration.declarations.length === 0) {
            const body = declaration.$parent;
            const prop = declaration.$prop;
            if (Array.isArray(body[prop]) && declaration.$idx !== undefined) {
                const arrayIndex = body[prop].indexOf(declaration);
                if (arrayIndex > -1) {
                    body[prop].splice(arrayIndex, 1);
                }
            }
        }
    }
    setFunctionName(name) {
        this.ast.callee.name = name;
    }
    bindID(id) {
        this.ast.callee.name += `.bind({id:${ JSON.stringify(id) }})`;
    }
    isCSSRequested() {
        return this.value && path.extname(this.value) === '.css';
    }
    isRemoteURL() {
        return this.value && /^http(s):/.test(this.value);
    }
    isJSONRequested() {
        return this.value && path.extname(this.value) === '.json';
    }
    setValue(str) {
        this.ast.arguments[0].value = str;
    }
    setExpression(raw) {
        const astStatemet = FileAnalysis_1.acornParse(raw);
        if (astStatemet.body[0].expression) {
            this.ast.arguments = [astStatemet.body[0].expression];
        }
    }
    getValue() {
        return this.ast.arguments[0].value;
    }
    resolve() {
        return this.resolveAbstraction();
    }
    resolveAbstraction() {
        let resolved;
        if (!this.resolved) {
            this.resolved = true;
            if (this.isComputed) {
                return;
            }
            const pkgName = !this.isNodeModule ? this.file.packageAbstraction.name : this.nodeModuleName;
            let resolvedName;
            const producerAbstraction = this.file.packageAbstraction.bundleAbstraction.producerAbstraction;
            if (!this.isNodeModule) {
                if (/^~\//.test(this.value)) {
                    resolvedName = this.value.slice(2);
                } else {
                    resolvedName = Utils_1.joinFuseBoxPath(path.dirname(this.file.fuseBoxPath), this.value);
                }
                resolved = producerAbstraction.findFileAbstraction(pkgName, resolvedName);
            } else {
                resolved = producerAbstraction.findFileAbstraction(pkgName, this.nodeModulePartialRequire);
            }
            if (resolved) {
                this.file.addDependency(resolved, this);
            }
            this.resolvedAbstraction = resolved;
        }
        return this.resolvedAbstraction;
    }
}
exports.RequireStatement = RequireStatement;
}
// default/quantum/core/AstUtils.js
_bca95ef7.f[50] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
function matchesAssignmentExpression(node, part1, part2) {
    if (node.type === 'ExpressionStatement') {
        if (node.expression && node.expression.type === 'AssignmentExpression') {
            const expr = node.expression;
            if (expr.left && expr.left.type === 'MemberExpression') {
                const left = expr.left;
                let part1Matched = false;
                let part2Matched = false;
                if (left.object && left.object.type === 'Identifier') {
                    if (left.object.name === part1) {
                        part1Matched = true;
                    }
                }
                if (left.property && left.property.type === 'Identifier') {
                    if (left.property.name === part2) {
                        part2Matched = true;
                    }
                }
                return part1Matched && part2Matched;
            }
        }
    }
}
exports.matchesAssignmentExpression = matchesAssignmentExpression;
function matchesLiteralStringExpression(node, text) {
    return node.type === 'ExpressionStatement' && node.expression.type === 'Literal' && node.expression.value === text;
}
exports.matchesLiteralStringExpression = matchesLiteralStringExpression;
const ES6_TYPES = new Set([
    'ClassDeclaration',
    'SpreadElement',
    'ArrowFunctionExpression'
]);
function matchesIfStatementProcessEnv(node) {
    if (node.type && node.type === 'IfStatement') {
        if (node.$parent && node.$parent.type === 'IfStatement') {
            return;
        }
        if (node.test && node.test.type === 'BinaryExpression') {
            if (node.test.left) {
                const variableName = matchesNodeEnv(node.test.left);
                return variableName;
            }
        }
    }
}
exports.matchesIfStatementProcessEnv = matchesIfStatementProcessEnv;
function matchesIfStatementFuseBoxIsEnvironment(node) {
    if (node.type && node.type === 'IfStatement') {
        if (node.test && node.test.type === 'MemberExpression') {
            const test = node.test;
            if (test.object.type === 'Identifier' && test.object.name === 'FuseBox' && test.property) {
                return test.property.name;
            }
        }
    }
}
exports.matchesIfStatementFuseBoxIsEnvironment = matchesIfStatementFuseBoxIsEnvironment;
function compareStatement(node, input) {
    const right = node.test.right;
    if (right) {
        const operator = node.test.operator;
        if (right.type === 'Literal') {
            const value = right.value;
            if (operator === '===' || operator === '==') {
                return value === input;
            }
            if (operator === '!==' || operator === '!=') {
                return value !== input;
            }
        }
        if (right.type === 'Identifier' && right.name === 'undefined') {
            if (operator === '!==' || operator === '!=') {
                return input !== undefined;
            }
            if (operator === '===' || operator === '==') {
                return input === undefined;
            }
        }
    }
}
exports.compareStatement = compareStatement;
function matchesNodeEnv(node, veriableName) {
    let isProcess, isEnv;
    isProcess = astQuery(node, [
        '/MemberExpression',
        '.object',
        '/MemberExpression',
        '.object',
        '.name'
    ], 'process');
    if (!isProcess) {
        return false;
    }
    isEnv = astQuery(node, [
        '/MemberExpression',
        '.object',
        '/MemberExpression',
        '.property',
        '.name'
    ], 'env');
    if (!isEnv) {
        return false;
    }
    if (node.property) {
        let value;
        if (node.property.type === 'Literal') {
            value = node.property.value;
        }
        if (node.property.type === 'Identifier') {
            value = node.property.name;
        }
        return veriableName !== undefined ? veriableName === value : value;
    }
}
exports.matchesNodeEnv = matchesNodeEnv;
function matchesEcmaScript6(node) {
    if (node) {
        if (ES6_TYPES.has(node.type)) {
            return true;
        }
        if (node.type === 'VariableDeclaration' && node.kind !== 'var') {
            return true;
        }
    }
    return false;
}
exports.matchesEcmaScript6 = matchesEcmaScript6;
function matchesSingleFunction(node, name) {
    return node.callee && node.callee.type === 'Identifier' && node.callee.name === name;
}
exports.matchesSingleFunction = matchesSingleFunction;
function trackRequireMember(node, name) {
    if (node && node.type === 'MemberExpression') {
        if (node.object && node.object.type === 'Identifier' && node.object.name === name) {
            if (node.property && node.property.type === 'Identifier') {
                return node.property.name;
            }
        }
    }
}
exports.trackRequireMember = trackRequireMember;
function matchRequireIdentifier(node) {
    let name;
    if (node && node.type === 'VariableDeclarator') {
        if (node.id && node.id.type === 'Identifier') {
            name = node.id.name;
            if (node.init && node.init.type === 'CallExpression') {
                if (matchesSingleFunction(node.init, 'require')) {
                    return name;
                }
            }
        }
    }
}
exports.matchRequireIdentifier = matchRequireIdentifier;
function matchesTypeOf(node, name) {
    return node && node.operator === 'typeof' && node.argument && node.argument.type === 'Identifier' && node.argument.name === name;
}
exports.matchesTypeOf = matchesTypeOf;
function isExportComputed(node, fn) {
    if (astQuery(node, [
            '/MemberExpression',
            '.object',
            '.name'
        ], 'exports')) {
        return fn(node.computed === true);
    }
}
exports.isExportComputed = isExportComputed;
function isExportMisused(node, fn) {
    const isMisused = astQuery(node, [
        '/MemberExpression',
        '.object',
        '/MemberExpression',
        '.object',
        '.name'
    ], 'exports');
    if (isMisused) {
        if (node.object.property && node.object.property.name) {
            return fn(node.object.property.name);
        }
    }
}
exports.isExportMisused = isExportMisused;
function matchNamedExport(node, fn) {
    if (astQuery(node, [
            '/ExpressionStatement',
            '.expression',
            '/AssignmentExpression',
            '.left',
            '/MemberExpression',
            '.object',
            '.name'
        ], 'exports')) {
        if (node.expression.left.property.type === 'Identifier') {
            let referencedVariable;
            if (node.expression.right) {
                const right = node.expression.right;
                if (right.object && right.object.type === 'Identifier') {
                    referencedVariable = right.object.name;
                }
            }
            fn(node.expression.left.property.name, referencedVariable);
            return true;
        }
    }
}
exports.matchNamedExport = matchNamedExport;
function matchesDoubleMemberExpression(node, part1, part2) {
    const matches = node.type === 'MemberExpression' && node.object && node.object.type === 'Identifier' && node.object && node.object.name === part1 && node.property;
    if (!part2) {
        return matches;
    }
    return node.property && node.property.name === part2;
}
exports.matchesDoubleMemberExpression = matchesDoubleMemberExpression;
function matchesExportReference(node) {
    if (node.type === 'MemberExpression' && node.object && node.object.type === 'Identifier' && node.object && node.object.name === 'exports' && node.property) {
        if (node.property.type === 'Identifier') {
            return node.property.name;
        }
    }
}
exports.matchesExportReference = matchesExportReference;
function matcheObjectDefineProperty(node, name) {
    if (astQuery(node, [
            '/ExpressionStatement',
            '.expression',
            '/CallExpression',
            '.callee',
            '/MemberExpression',
            '.object',
            '.name'
        ], 'Object')) {
        return astQuery(node, [
            '/ExpressionStatement',
            '.expression',
            '/CallExpression',
            '.arguments',
            0,
            '.name'
        ], name);
    }
}
exports.matcheObjectDefineProperty = matcheObjectDefineProperty;
function astQuery(node, args, value) {
    let obj = node;
    for (const i in args) {
        if (obj === undefined) {
            return;
        }
        let spec = args[i];
        let item;
        let lookForType = false;
        let lookForProp = false;
        if (typeof spec === 'number') {
            item = spec;
            lookForProp = true;
        } else {
            item = spec.slice(1);
            if (spec.charAt(0) === '/') {
                lookForType = true;
            }
            if (spec.charAt(0) === '.') {
                lookForProp = true;
            }
        }
        if (lookForType) {
            if (!obj.type) {
                return;
            }
            if (obj.type !== item) {
                obj = undefined;
            }
        }
        if (lookForProp) {
            obj = obj[item];
        }
    }
    if (value !== undefined) {
        return obj === value;
    }
    return obj;
}
}
// default/quantum/core/nodes/ExportsInterop.js
_bca95ef7.f[51] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const GenericAst_1 = _bca95ef7.r(52);
class ExportsInterop extends GenericAst_1.GenericAst {
}
exports.ExportsInterop = ExportsInterop;
}
// default/quantum/core/nodes/GenericAst.js
_bca95ef7.f[52] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class GenericAst {
    constructor(ast, astProp, node) {
        this.ast = ast;
        this.astProp = astProp;
        this.node = node;
    }
    remove() {
        let target = this.ast[this.astProp];
        if (target instanceof Array) {
            let idx = target.indexOf(this.node);
            target.splice(idx, 1);
        }
    }
    replaceWithString(value) {
        let ast = {
            type: 'Literal',
            value: value
        };
        if (value === undefined) {
            ast = {
                type: 'Identifier',
                name: 'undefined'
            };
        }
        if (this.astProp) {
            if (Array.isArray(this.ast[this.astProp]) && this.node.$idx > -1) {
                this.ast[this.astProp][this.node.$idx] = ast;
            } else {
                this.ast[this.astProp] = ast;
            }
        }
    }
}
exports.GenericAst = GenericAst;
}
// default/quantum/core/nodes/UseStrict.js
_bca95ef7.f[53] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const GenericAst_1 = _bca95ef7.r(52);
class UseStrict extends GenericAst_1.GenericAst {
}
exports.UseStrict = UseStrict;
}
// default/quantum/core/nodes/TypeOfExportsKeyword.js
_bca95ef7.f[54] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const GenericAst_1 = _bca95ef7.r(52);
class TypeOfExportsKeyword extends GenericAst_1.GenericAst {
}
exports.TypeOfExportsKeyword = TypeOfExportsKeyword;
}
// default/quantum/core/nodes/TypeOfModuleKeyword.js
_bca95ef7.f[55] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const GenericAst_1 = _bca95ef7.r(52);
class TypeOfModuleKeyword extends GenericAst_1.GenericAst {
}
exports.TypeOfModuleKeyword = TypeOfModuleKeyword;
}
// default/quantum/core/nodes/NamedExport.js
_bca95ef7.f[56] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const GenericAst_1 = _bca95ef7.r(52);
class NamedExport {
    constructor() {
        this.isUsed = false;
        this.eligibleForTreeShaking = true;
        this.nodes = new Set();
    }
    addNode(ast, prop, node, referencedVariableName) {
        this.referencedVariableName = referencedVariableName;
        this.nodes.add(new GenericAst_1.GenericAst(ast, prop, node));
    }
    remove() {
        this.nodes.forEach(item => item.remove());
    }
}
exports.NamedExport = NamedExport;
}
// default/quantum/core/nodes/ReplaceableBlock.js
_bca95ef7.f[57] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const GenericAst_1 = _bca95ef7.r(52);
class ReplaceableBlock extends GenericAst_1.GenericAst {
    constructor() {
        super(...arguments);
        this.undefinedValue = false;
        this.isConditional = false;
        this.markedForRemoval = false;
    }
    setValue(value) {
        this.value = value;
    }
    setUndefinedValue() {
        this.undefinedValue = true;
    }
    setFunctionName(name) {
        let target = this.node.$parent;
        ;
        const $idx = this.node.$idx;
        if (target instanceof Array && $idx !== undefined) {
            this.ast[this.astProp][$idx] = {
                type: 'Identifier',
                name: name
            };
        } else {
            this.ast[this.astProp] = {
                type: 'Identifier',
                name: name
            };
        }
    }
    setIFStatementAST(ast) {
        this.ifStatementAST = ast;
    }
    conditionalAnalysis(node, evaluatedValue) {
        this.setConditional();
        this.setIFStatementAST(node);
        if (evaluatedValue === false) {
            if (node.alternate) {
                this.setActiveAST(node.alternate);
                return node.alternate;
            } else {
                this.markForRemoval();
                return false;
            }
        } else {
            this.setActiveAST(node.consequent);
            return node.consequent;
        }
    }
    markForRemoval() {
        this.markedForRemoval = true;
    }
    setConditional() {
        this.isConditional = true;
    }
    setActiveAST(ast) {
        this.activeAST = ast;
    }
    handleActiveCode() {
        const parent = this.ifStatementAST.$parent;
        const prop = this.ifStatementAST.$prop;
        if (this.markedForRemoval) {
            if (parent[prop]) {
                if (Array.isArray(parent[prop])) {
                    const index = parent[prop].indexOf(this.ifStatementAST);
                    if (index > -1) {
                        parent[prop].splice(index, 1);
                    }
                }
            }
        } else {
            if (parent && prop && this.activeAST) {
                if (parent[prop]) {
                    if (Array.isArray(parent[prop])) {
                        const index = parent[prop].indexOf(this.ifStatementAST);
                        if (index > -1) {
                            if (prop === 'body' && this.activeAST.body) {
                                parent[prop].splice(index, 1, ...this.activeAST.body);
                            } else {
                                parent[prop][index] = this.activeAST;
                            }
                        }
                    }
                }
            }
        }
    }
    replaceWithValue() {
        if (this.undefinedValue) {
            this.replaceWithString();
        } else {
            if (this.value !== undefined) {
                this.replaceWithString(this.value);
            }
        }
    }
}
exports.ReplaceableBlock = ReplaceableBlock;
}
// default/core/ExtensionOverrides.js
_bca95ef7.f[58] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const fs = _bca95ef7.s('fs');
const path = _bca95ef7.s('path');
class ExtensionOverrides {
    constructor(overrides) {
        this.overrides = [];
        overrides.forEach(override => this.add(override));
    }
    isValid(override) {
        return typeof override === 'string' && override.indexOf('.') === 0;
    }
    add(override) {
        if (this.isValid(override)) {
            this.overrides.push(override);
        }
    }
    setOverrideFileInfo(file) {
        if (this.overrides.length === 0 || !file.belongsToProject()) {
            return;
        }
        const fileInfo = path.parse(file.info.absPath);
        for (let overrideExtension of this.overrides) {
            const overridePath = path.resolve(fileInfo.dir, `${ fileInfo.name }${ overrideExtension }`);
            if (overrideExtension.indexOf(fileInfo.ext) > -1 && fs.existsSync(overridePath)) {
                file.absPath = file.info.absPath = overridePath;
                file.hasExtensionOverride = true;
                file.context.log.echoInfo(`Extension override found. Mapping ${ file.info.fuseBoxPath } to ${ path.basename(file.info.absPath) }`);
            }
        }
    }
    getPathOverride(pathStr) {
        if (this.overrides.length === 0) {
            return;
        }
        const fileInfo = path.parse(pathStr);
        for (let overrideExtension of this.overrides) {
            const overridePath = path.resolve(fileInfo.dir, `${ fileInfo.name }${ overrideExtension }`);
            if (overrideExtension.indexOf(fileInfo.ext) > -1 && fs.existsSync(overridePath)) {
                return overridePath;
            }
        }
    }
}
exports.ExtensionOverrides = ExtensionOverrides;
}
// default/core/TypescriptConfig.js
_bca95ef7.f[59] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const path = _bca95ef7.s('path');
const Utils_1 = _bca95ef7.r(3);
const CACHED = {};
class TypescriptConfig {
    constructor(context) {
        this.context = context;
    }
    getConfig() {
        return this.config;
    }
    defaultSetup() {
        const compilerOptions = this.config.compilerOptions = this.config.compilerOptions || {};
        if (this.context.useSourceMaps) {
            compilerOptions.sourceMap = true;
            compilerOptions.inlineSources = true;
        }
    }
    setConfigFile(customTsConfig) {
        this.customTsConfig = customTsConfig;
    }
    read() {
        const cacheKey = this.customTsConfig || this.context.homeDir;
        if (CACHED[cacheKey]) {
            this.config = CACHED[cacheKey];
        } else {
            let url, configFile;
            let config = { compilerOptions: {} };
            ;
            let tsConfigOverride;
            if (typeof this.customTsConfig === 'string') {
                configFile = Utils_1.ensureUserPath(this.customTsConfig);
            } else {
                url = path.join(this.context.homeDir, 'tsconfig.json');
                let tsconfig = Utils_1.findFileBackwards(url, this.context.appRoot);
                if (tsconfig) {
                    configFile = tsconfig;
                }
            }
            if (configFile) {
                this.context.log.echoStatus(`Typescript config:  ${ configFile.replace(this.context.appRoot, '') }`);
                config = _bca95ef7.s(configFile);
            }
            if (Array.isArray(this.customTsConfig)) {
                tsConfigOverride = this.customTsConfig[0];
            }
            config.compilerOptions.module = 'commonjs';
            if (!('target' in config.compilerOptions)) {
                config.compilerOptions.target = this.context.languageLevel;
            }
            if (tsConfigOverride) {
                config.compilerOptions = Object.assign(config.compilerOptions, tsConfigOverride);
            }
            this.config = config;
            this.defaultSetup();
            CACHED[cacheKey] = this.config;
        }
    }
}
exports.TypescriptConfig = TypescriptConfig;
}
// default/FuseProcess.js
_bca95ef7.f[60] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const child_process_1 = _bca95ef7.s('child_process');
class FuseProcess {
    constructor(bundle) {
        this.bundle = bundle;
    }
    setFilePath(filePath) {
        this.filePath = filePath;
    }
    kill() {
        if (this.node) {
            this.node.kill();
        }
    }
    start() {
        this.kill();
        this.exec();
        return this;
    }
    require(opts = {}) {
        function getMainExport(mdl) {
            return mdl && mdl.FuseBox && mdl.FuseBox.mainFile ? mdl.FuseBox.import(mdl.FuseBox.mainFile) : mdl;
        }
        return new Promise((resolve, reject) => {
            let cache = require.cache, cached = cache[this.filePath], closePromise, exps;
            if (cached) {
                try {
                    if (opts.close)
                        closePromise = opts.close(cached.exports);
                    else {
                        exps = getMainExport(cached.exports);
                        if (exps) {
                            closePromise = exps.close ? cached.close() : exps.default && exps.default.close ? exps.default.close() : console.warn(`Bundle ${ this.bundle.name } doesn't export a close() function and no close was given`);
                        }
                    }
                } catch (x) {
                    console.error(`Exception while closing bundle ${ this.bundle.name }.`);
                    reject(x);
                }
                delete cache[this.filePath];
            }
            if (!(closePromise instanceof Promise)) {
                closePromise = Promise.resolve(true);
            }
            closePromise.then(() => {
                var exps = false;
                try {
                    exps = _bca95ef7.s(this.filePath);
                } catch (x) {
                    reject(x);
                }
                if (exps)
                    resolve(exps);
            }).catch(reject);
        });
    }
    exec() {
        const node = child_process_1.spawn('node', [this.filePath], { stdio: 'inherit' });
        node.on('close', code => {
            if (code === 8) {
                console.error('Error detected, waiting for changes...');
            }
        });
        this.node = node;
        return this;
    }
}
exports.FuseProcess = FuseProcess;
}
// default/plugins/HotReloadPlugin.js
_bca95ef7.f[61] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class HotReloadPluginClass {
    constructor(opts = {}) {
        this.dependencies = ['fusebox-hot-reload'];
        this.port = '';
        this.uri = '';
        this.reload = false;
        if (opts.port) {
            this.port = opts.port;
        }
        if (opts.uri) {
            this.uri = opts.uri;
        }
        if (opts.reload === true) {
            this.reload = true;
        }
    }
    init() {
    }
    bundleEnd(context) {
        context.source.addContent(`FuseBox.import("fusebox-hot-reload").connect(${ this.port }, ${ JSON.stringify(this.uri) }, ${ this.reload ? 'true' : 'false' })`);
    }
}
;
exports.HotReloadPlugin = options => {
    return new HotReloadPluginClass(options);
};
}
// default/BundleTestRunner.js
_bca95ef7.f[62] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class BundleTestRunner {
    constructor(bundle, opts) {
        this.bundle = bundle;
        this.opts = opts || {};
        this.reporter = opts.reporter || 'fuse-test-reporter';
        this.fuse = bundle.FuseBox;
    }
    start() {
        if (this.bundle.registerGlobals) {
            this.bundle.registerGlobals();
        }
        const FuseBoxTestRunner = this.fuse.import('fuse-test-runner').FuseBoxTestRunner;
        const runner = new FuseBoxTestRunner(this.opts);
        runner.start();
    }
}
exports.BundleTestRunner = BundleTestRunner;
}
// default/quantum/plugin/QuantumOptions.js
_bca95ef7.f[63] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const Utils_1 = _bca95ef7.r(3);
class QuantumOptions {
    constructor(opts) {
        this.removeExportsInterop = false;
        this.removeUseStrict = true;
        this.ensureES5 = true;
        this.replaceProcessEnv = true;
        this.containedAPI = false;
        this.processPolyfill = false;
        this.replaceTypeOf = true;
        this.showWarnings = true;
        this.hoisting = false;
        this.globalRequire = true;
        this.extendServerImport = false;
        this.shimsPath = 'shims.js';
        this.optsTarget = 'browser';
        this.treeshake = false;
        this.quantumVariableName = '$fsx';
        opts = opts || {};
        if (opts.target) {
            this.optsTarget = opts.target;
        }
        if (opts.api) {
            this.apiCallback = opts.api;
        }
        if (opts.manifest !== undefined) {
            if (typeof opts.manifest === 'string') {
                this.manifestFile = opts.manifest;
            }
            if (opts.manifest === true) {
                this.manifestFile = 'manifest.json';
            }
        }
        if (opts.uglify) {
            this.uglify = opts.uglify;
        }
        if (opts.processPolyfill !== undefined) {
            this.processPolyfill = opts.processPolyfill;
        }
        if (opts.shimsPath) {
            this.shimsPath = opts.shimsPath;
        }
        if (opts.warnings !== undefined) {
            this.showWarnings = opts.warnings;
        }
        if (opts.globalRequire !== undefined) {
            this.globalRequire = opts.globalRequire;
        }
        if (opts.replaceTypeOf !== undefined) {
            this.replaceTypeOf = opts.replaceTypeOf;
        }
        if (opts.containedAPI !== undefined) {
            this.containedAPI = opts.containedAPI;
        }
        if (Array.isArray(opts.polyfills)) {
            this.polyfills = opts.polyfills;
        }
        if (opts.removeExportsInterop !== undefined) {
            this.removeExportsInterop = opts.removeExportsInterop;
        }
        if (opts.replaceProcessEnv !== undefined) {
            this.replaceProcessEnv = opts.replaceProcessEnv;
        }
        if (opts.removeUseStrict !== undefined) {
            this.removeUseStrict = opts.removeUseStrict;
        }
        if (opts.webIndexPlugin) {
            this.webIndexPlugin = opts.webIndexPlugin;
        }
        if (opts.hoisting !== undefined) {
            if (typeof opts.hoisting === 'boolean') {
                this.hoisting = opts.hoisting;
            } else {
                this.hoisting = true;
                const hoistingOptions = opts.hoisting;
                this.hoistedNames = hoistingOptions.names;
            }
        }
        if (opts.bakeApiIntoBundle) {
            this.bakeApiIntoBundle = opts.bakeApiIntoBundle;
        }
        if (opts.extendServerImport !== undefined) {
            this.extendServerImport = opts.extendServerImport;
        }
        if (opts.ensureES5 !== undefined) {
            this.ensureES5 = opts.ensureES5;
        }
        if (opts.treeshake !== undefined) {
            if (typeof opts.treeshake === 'boolean') {
                this.treeshake = opts.treeshake;
            } else {
                this.treeshake = true;
                this.treeshakeOptions = opts.treeshake;
            }
        }
        if (this.isContained()) {
            let randomHash = Utils_1.hashString(new Date().getTime().toString() + Math.random());
            if (randomHash.indexOf('-') === 0) {
                randomHash = randomHash.slice(1);
            }
            this.quantumVariableName = '_' + randomHash;
        }
    }
    shouldBundleProcessPolyfill() {
        return this.processPolyfill === true;
    }
    enableContainedAPI() {
        return this.containedAPI = true;
    }
    shouldReplaceTypeOf() {
        return this.replaceTypeOf;
    }
    getPromisePolyfill() {
        if (this.polyfills && this.polyfills.indexOf('Promise') > -1) {
            return Utils_1.readFuseBoxModule('fuse-box-responsive-api/promise-polyfill.js');
        }
    }
    getManifestFilePath() {
        return this.manifestFile;
    }
    canBeRemovedByTreeShaking(file) {
        if (this.treeshakeOptions) {
            if (this.treeshakeOptions.shouldRemove) {
                return this.treeshakeOptions.shouldRemove(file);
            }
        }
        return true;
    }
    isContained() {
        return this.containedAPI;
    }
    throwContainedAPIError() {
        throw new Error(`
           - Can't use contained api with more than 1 bundle
           - Use only 1 bundle and bake the API e.g {bakeApiIntoBundle : "app"}
           - Make sure code splitting is not in use 
        `);
    }
    shouldRemoveUseStrict() {
        return this.removeUseStrict;
    }
    shouldEnsureES5() {
        return this.ensureES5;
    }
    shouldDoHoisting() {
        return this.hoisting;
    }
    getHoistedNames() {
        return this.hoistedNames;
    }
    isHoistingAllowed(name) {
        if (this.hoistedNames) {
            return this.hoistedNames.indexOf(name) > -1;
        }
        return true;
    }
    shouldExtendServerImport() {
        return this.extendServerImport;
    }
    shouldShowWarnings() {
        return this.showWarnings;
    }
    shouldUglify() {
        return this.uglify;
    }
    shouldBakeApiIntoBundle() {
        return this.bakeApiIntoBundle;
    }
    shouldTreeShake() {
        return this.treeshake;
    }
    shouldRemoveExportsInterop() {
        return this.removeExportsInterop;
    }
    shouldReplaceProcessEnv() {
        return this.replaceProcessEnv;
    }
    getTarget() {
        return this.optsTarget;
    }
    isTargetElectron() {
        return this.optsTarget === 'electron';
    }
    isTargetUniveral() {
        return this.optsTarget === 'universal';
    }
    isTargetNpm() {
        return this.optsTarget === 'npm';
    }
    isTargetServer() {
        return this.optsTarget === 'server' || this.optsTarget === 'electron' || this.optsTarget === 'npm';
    }
    isTargetBrowser() {
        return this.optsTarget === 'browser';
    }
}
exports.QuantumOptions = QuantumOptions;
}
// default/quantum/plugin/ComputerStatementRule.js
_bca95ef7.f[64] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class ComputedStatementRule {
    constructor(path, rules) {
        this.path = path;
        this.rules = rules;
    }
}
exports.ComputedStatementRule = ComputedStatementRule;
}
// default/quantum/plugin/QuantumPlugin.js
_bca95ef7.f[65] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const QuantumOptions_1 = _bca95ef7.r(63);
const QuantumCore_1 = _bca95ef7.r(66);
class QuantumPluginClass {
    constructor(coreOpts) {
        this.coreOpts = coreOpts || {};
    }
    init(context) {
        context.bundle.producer.writeBundles = false;
        context.bundle.producer.hmrAllowed = false;
        context.bundle.producer.bundles.forEach(bundle => {
            const plugins = bundle.context.plugins;
            plugins.forEach((plugin, index) => {
                if (plugin.constructor.name === 'UglifyJSPluginClass') {
                    this.coreOpts.uglify = plugin.options || {};
                    delete plugins[index];
                }
                if (plugin.constructor.name === 'UglifyESPluginClass') {
                    this.coreOpts.uglify = {
                        es6: true,
                        ...plugin.options
                    };
                    delete plugins[index];
                }
                if (plugin.constructor.name === 'WebIndexPluginClass') {
                    this.coreOpts.webIndexPlugin = plugin;
                    delete plugins[index];
                }
                if (plugin.constructor.name === 'HotReloadPluginClass') {
                    delete plugins[index];
                }
            });
        });
    }
    producerEnd(producer) {
        let core = new QuantumCore_1.QuantumCore(producer, new QuantumOptions_1.QuantumOptions(this.coreOpts));
        return core.consume();
    }
}
;
exports.QuantumPlugin = opts => {
    return new QuantumPluginClass(opts);
};
}
// default/quantum/plugin/QuantumCore.js
_bca95ef7.f[66] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const FlatFileGenerator_1 = _bca95ef7.r(67);
const realm_utils_1 = _bca95ef7.s('realm-utils');
const StatementModifaction_1 = _bca95ef7.r(68);
const EnvironmentConditionModification_1 = _bca95ef7.r(69);
const BundleWriter_1 = _bca95ef7.r(70);
const InteropModifications_1 = _bca95ef7.r(71);
const UseStrictModification_1 = _bca95ef7.r(72);
const BundleAbstraction_1 = _bca95ef7.r(46);
const PackageAbstraction_1 = _bca95ef7.r(47);
const ResponsiveAPI_1 = _bca95ef7.r(73);
const TypeOfModifications_1 = _bca95ef7.r(74);
const TreeShake_1 = _bca95ef7.r(75);
const ProcessEnvModification_1 = _bca95ef7.r(76);
const Utils_1 = _bca95ef7.r(3);
const ComputerStatementRule_1 = _bca95ef7.r(64);
const Bundle_1 = _bca95ef7.r(28);
const DynamicImportStatements_1 = _bca95ef7.r(77);
const Hoisting_1 = _bca95ef7.r(78);
class QuantumCore {
    constructor(producer, opts) {
        this.producer = producer;
        this.index = 0;
        this.writer = new BundleWriter_1.BundleWriter(this);
        this.requiredMappings = new Set();
        this.customStatementSolutions = new Set();
        this.computedStatementRules = new Map();
        this.splitFiles = new Set();
        this.opts = opts;
        this.api = new ResponsiveAPI_1.ResponsiveAPI(this);
        this.log = producer.fuse.context.log;
        this.log.echoBreak();
        this.log.groupHeader('Launching quantum core');
        if (this.opts.apiCallback) {
            this.opts.apiCallback(this);
        }
        this.context = this.producer.fuse.context;
    }
    solveComputed(path, rules) {
        this.customStatementSolutions.add(Utils_1.string2RegExp(path));
        if (rules && rules.mapping) {
            this.requiredMappings.add(Utils_1.string2RegExp(rules.mapping));
        }
        this.computedStatementRules.set(path, new ComputerStatementRule_1.ComputedStatementRule(path, rules));
    }
    getCustomSolution(file) {
        let fullPath = file.getFuseBoxFullPath();
        let computedRule = this.computedStatementRules.get(fullPath);
        if (computedRule) {
            return computedRule;
        }
    }
    consume() {
        this.log.echoInfo('Generating abstraction, this may take a while');
        return this.producer.generateAbstraction({
            quantumCore: this,
            customComputedStatementPaths: this.customStatementSolutions
        }).then(abstraction => {
            abstraction.quantumCore = this;
            this.producerAbstraction = abstraction;
            this.log.echoInfo('Abstraction generated');
            return realm_utils_1.each(abstraction.bundleAbstractions, bundleAbstraction => {
                return this.prepareFiles(bundleAbstraction);
            }).then(() => this.prepareSplitFiles()).then(() => abstraction);
        }).then(abstraction => {
            return realm_utils_1.each(abstraction.bundleAbstractions, bundleAbstraction => {
                return this.processBundle(bundleAbstraction);
            });
        }).then(() => this.treeShake()).then(() => this.render()).then(() => {
            this.compriseAPI();
            return this.writer.process();
        }).then(() => {
            this.printStat();
        });
    }
    printStat() {
        let apiStyle = 'Optimised numbers (Best performance)';
        if (this.api.hashesUsed()) {
            apiStyle = 'Hashes (Might cause issues)';
        }
        this.log.printOptions('Stats', {
            warnings: this.producerAbstraction.warnings.size,
            apiStyle: apiStyle,
            target: this.opts.optsTarget,
            uglify: this.opts.shouldUglify(),
            removeExportsInterop: this.opts.shouldRemoveExportsInterop(),
            removeUseStrict: this.opts.shouldRemoveUseStrict(),
            replaceProcessEnv: this.opts.shouldReplaceProcessEnv(),
            ensureES5: this.opts.shouldEnsureES5(),
            treeshake: this.opts.shouldTreeShake()
        });
        if (this.opts.shouldShowWarnings()) {
            this.producerAbstraction.warnings.forEach(warning => {
                this.log.echoBreak();
                this.log.echoYellow('Warnings:');
                this.log.echoYellow('Your quantum bundle might not work');
                this.log.echoYellow(`  - ${ warning.msg }`);
                this.log.echoGray('');
                this.log.echoGray('  * Set { warnings : false } if you want to hide these messages');
                this.log.echoGray('  * Read up on the subject http://fuse-box.org/page/quantum#computed-statement-resolution');
            });
        }
    }
    compriseAPI() {
        if (this.producerAbstraction.useComputedRequireStatements) {
            this.api.addComputedRequireStatetements();
        }
    }
    handleMappings(fuseBoxFullPath, id) {
        this.requiredMappings.forEach(regexp => {
            if (regexp.test(fuseBoxFullPath)) {
                this.api.addMapping(fuseBoxFullPath, id);
            }
        });
    }
    prepareSplitFiles() {
        let bundle;
        const splitConfig = this.context.quantumSplitConfig;
        if (!splitConfig) {
            return;
        }
        let items = splitConfig.getItems();
        items.forEach(quantumItem => {
            quantumItem.getFiles().forEach(file => {
                if (!this.producer.bundles.get(quantumItem.name)) {
                    this.log.echoInfo(`Create split bundle ${ quantumItem.name }`);
                    const fusebox = this.context.fuse.copy();
                    const bundleName = splitConfig.resolve(quantumItem.name);
                    bundle = new Bundle_1.Bundle(bundleName, fusebox, this.producer);
                    this.producer.bundles.set(quantumItem.name, bundle);
                    bundle.webIndexed = false;
                    bundle.quantumItem = quantumItem;
                    const bnd = new BundleAbstraction_1.BundleAbstraction(quantumItem.name);
                    bnd.splitAbstraction = true;
                    let pkg = new PackageAbstraction_1.PackageAbstraction(file.packageAbstraction.name, bnd);
                    this.producerAbstraction.registerBundleAbstraction(bnd);
                    bundle.bundleAbstraction = bnd;
                    bundle.packageAbstraction = pkg;
                } else {
                    bundle = this.producer.bundles.get(quantumItem.name);
                }
                this.log.echoInfo(`Adding ${ file.fuseBoxPath } to ${ quantumItem.name }`);
                file.packageAbstraction.fileAbstractions.delete(file.fuseBoxPath);
                bundle.packageAbstraction.registerFileAbstraction(file);
                file.packageAbstraction = bundle.packageAbstraction;
            });
        });
    }
    prepareFiles(bundleAbstraction) {
        let entryId;
        if (this.producer.entryPackageFile && this.producer.entryPackageName) {
            entryId = `${ this.producer.entryPackageName }/${ this.producer.entryPackageFile }`;
        }
        const splitConfig = this.context.quantumSplitConfig;
        const globals = this.producer.fuse.context.globals;
        let globalsName;
        if (globals) {
            for (let i in globals) {
                globalsName = globals[i];
            }
        }
        bundleAbstraction.packageAbstractions.forEach(packageAbstraction => {
            packageAbstraction.fileAbstractions.forEach((fileAbstraction, key) => {
                let fileId = fileAbstraction.getFuseBoxFullPath();
                const id = this.index;
                this.handleMappings(fileId, id);
                this.index++;
                if (fileId === entryId) {
                    fileAbstraction.setEnryPoint(globalsName);
                }
                fileAbstraction.setID(id);
                const quantumItem = this.context.requiresQuantumSplitting(fileAbstraction.fuseBoxPath);
                if (quantumItem && splitConfig) {
                    if (quantumItem.entry === fileAbstraction.fuseBoxPath) {
                        quantumItem.entryId = fileAbstraction.getID();
                    }
                    this.api.useCodeSplitting();
                    fileAbstraction.referenceQuantumSplit(quantumItem);
                }
            });
        });
    }
    processBundle(bundleAbstraction) {
        this.log.echoInfo(`Process bundle ${ bundleAbstraction.name }`);
        return realm_utils_1.each(bundleAbstraction.packageAbstractions, packageAbstraction => {
            const fileSize = packageAbstraction.fileAbstractions.size;
            this.log.echoInfo(`Process package ${ packageAbstraction.name } `);
            this.log.echoInfo(`  Files: ${ fileSize } `);
            return realm_utils_1.each(packageAbstraction.fileAbstractions, fileAbstraction => {
                return this.modify(fileAbstraction);
            });
        }).then(() => this.hoist());
    }
    treeShake() {
        if (this.opts.shouldTreeShake()) {
            const shaker = new TreeShake_1.TreeShake(this);
            return shaker.shake();
        }
    }
    render() {
        return realm_utils_1.each(this.producerAbstraction.bundleAbstractions, bundleAbstraction => {
            const generator = new FlatFileGenerator_1.FlatFileGenerator(this, bundleAbstraction);
            generator.init();
            return realm_utils_1.each(bundleAbstraction.packageAbstractions, packageAbstraction => {
                return realm_utils_1.each(packageAbstraction.fileAbstractions, fileAbstraction => {
                    return generator.addFile(fileAbstraction, this.opts.shouldEnsureES5());
                });
            }).then(() => {
                this.log.echoInfo(`Render bundle ${ bundleAbstraction.name }`);
                const bundleCode = generator.render();
                this.producer.bundles.get(bundleAbstraction.name).generatedCode = new Buffer(bundleCode);
            });
        });
    }
    hoist() {
        if (!this.api.hashesUsed() && this.opts.shouldDoHoisting()) {
            let hoisting = new Hoisting_1.Hoisting(this);
            return hoisting.start();
        }
    }
    modify(file) {
        const modifications = [
            StatementModifaction_1.StatementModification,
            DynamicImportStatements_1.DynamicImportStatementsModifications,
            EnvironmentConditionModification_1.EnvironmentConditionModification,
            InteropModifications_1.InteropModifications,
            UseStrictModification_1.UseStrictModification,
            TypeOfModifications_1.TypeOfModifications,
            ProcessEnvModification_1.ProcessEnvModification
        ];
        return realm_utils_1.each(modifications, modification => modification.perform(this, file));
    }
}
exports.QuantumCore = QuantumCore;
}
// default/quantum/plugin/FlatFileGenerator.js
_bca95ef7.f[67] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class FlatFileGenerator {
    constructor(core, bundleAbstraction) {
        this.core = core;
        this.bundleAbstraction = bundleAbstraction;
        this.contents = [];
    }
    addGlobal(code) {
        this.contents.push(code);
    }
    init() {
        if (this.core.opts.isTargetBrowser() || this.core.opts.isTargetUniveral()) {
            if (this.core.opts.isContained()) {
                this.contents.push('(function(){\n/*$$CONTAINED_API_PLACEHOLDER$$*/');
            } else {
                this.contents.push(`(function(${ this.core.opts.quantumVariableName }){`);
            }
        } else {
            if (this.core.opts.isContained()) {
                this.contents.push('/*$$CONTAINED_API_PLACEHOLDER$$*/');
            }
        }
    }
    addFile(file, ensureES5 = false) {
        if (file.canBeRemoved) {
            return;
        }
        let args = [];
        if (file.isExportInUse()) {
            args.push('module');
        }
        if (file.isExportStatementInUse()) {
            args.push('exports');
        }
        if (args.length) {
            file.wrapWithFunction(args);
        }
        let fileId = file.getID();
        if (file.isEntryPoint) {
            this.entryId = fileId;
            this.globalsName = file.globalsName;
        }
        this.contents.push(`// ${ file.packageAbstraction.name }/${ file.fuseBoxPath }`);
        this.contents.push(`${ this.core.opts.quantumVariableName }.f[${ JSON.stringify(fileId) }] = ${ file.generate(ensureES5) }`);
    }
    addHoistedVariables() {
        this.bundleAbstraction.hoisted.forEach((item, key) => {
            this.contents.push(`var ${ key } = ${ this.core.opts.quantumVariableName }.r(${ item.getID() });`);
        });
    }
    render() {
        if (this.bundleAbstraction) {
            this.addHoistedVariables();
        }
        if (this.bundleAbstraction) {
            if (this.bundleAbstraction.globalVariableRequired) {
                const defineGlobalFn = 'var global = window';
                if (this.core.opts.isTargetBrowser()) {
                    this.contents.push(defineGlobalFn);
                }
            }
        }
        if (this.entryId !== undefined) {
            const req = `${ this.core.opts.quantumVariableName }.r(${ JSON.stringify(this.entryId) })`;
            if (this.globalsName) {
                if (this.core.opts.isTargetNpm() || this.core.opts.isTargetServer()) {
                    this.contents.push(`module.exports = ${ req }`);
                }
                if (this.core.opts.isTargetBrowser()) {
                    if (this.globalsName === '*') {
                        this.contents.push(`var r = ${ req }`);
                        this.contents.push(`if (r){for(var i in r){ window[i] = r[i] }}`);
                    } else {
                        this.contents.push(`window['${ this.globalsName }']=${ req }`);
                    }
                }
            } else {
                this.contents.push(req);
            }
        }
        if (this.core.opts.isTargetBrowser() || this.core.opts.isTargetUniveral()) {
            if (this.core.opts.isContained()) {
                this.contents.push('})();');
            } else {
                this.contents.push(`})(${ this.core.opts.quantumVariableName });`);
            }
        }
        return this.contents.join('\n');
    }
}
exports.FlatFileGenerator = FlatFileGenerator;
}
// default/quantum/plugin/modifications/StatementModifaction.js
_bca95ef7.f[68] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const realm_utils_1 = _bca95ef7.s('realm-utils');
class StatementModification {
    static perform(core, file) {
        return realm_utils_1.each(file.requireStatements, statement => {
            if (statement.isComputed) {
                let customSolution = core.getCustomSolution(file);
                if (customSolution && !core.api.hashesUsed()) {
                    if (customSolution.rules) {
                        customSolution.rules.fn(statement, core);
                    }
                    statement.setFunctionName(`${ core.opts.quantumVariableName }.p`);
                } else {
                    if (core.opts.isTargetServer() || core.opts.isTargetUniveral()) {
                        core.api.useServerRequire();
                        statement.setFunctionName(`${ core.opts.quantumVariableName }.s`);
                    } else {
                        statement.setFunctionName(`${ core.opts.quantumVariableName }.r`);
                    }
                }
            } else {
                let resolvedFile = statement.resolve();
                if (resolvedFile) {
                    if (resolvedFile.isProcessPolyfill() && !core.opts.shouldBundleProcessPolyfill()) {
                        return statement.removeWithIdentifier();
                    }
                    if (!resolvedFile.dependents.has(file)) {
                        resolvedFile.dependents.add(file);
                    }
                    resolvedFile.amountOfReferences++;
                    if (statement.identifier) {
                        file.registerHoistedIdentifiers(statement.identifier, statement, resolvedFile);
                    }
                    statement.setFunctionName(`${ core.opts.quantumVariableName }.r`);
                    statement.setValue(resolvedFile.getID());
                } else {
                    if (core.opts.isTargetNpm()) {
                        statement.setFunctionName('require');
                    } else if (core.opts.isTargetServer() || core.opts.isTargetUniveral()) {
                        core.api.useServerRequire();
                        statement.setFunctionName(`${ core.opts.quantumVariableName }.s`);
                    } else {
                        statement.setFunctionName(`${ core.opts.quantumVariableName }.r`);
                    }
                }
            }
        });
    }
}
exports.StatementModification = StatementModification;
}
// default/quantum/plugin/modifications/EnvironmentConditionModification.js
_bca95ef7.f[69] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const realm_utils_1 = _bca95ef7.s('realm-utils');
class EnvironmentConditionModification {
    static perform(core, file) {
        return realm_utils_1.each(file.fuseboxIsEnvConditions, replacable => {
            if (core.opts.isTargetUniveral()) {
                if (replacable.identifier === 'isServer') {
                    replacable.setFunctionName(`${ core.opts.quantumVariableName }.cs`);
                }
                if (replacable.identifier === 'isBrowser') {
                    replacable.setFunctionName(`${ core.opts.quantumVariableName }.cb`);
                }
            } else {
                if (replacable.isConditional) {
                    replacable.handleActiveCode();
                } else {
                    replacable.replaceWithValue();
                }
            }
        });
    }
}
exports.EnvironmentConditionModification = EnvironmentConditionModification;
}
// default/quantum/plugin/BundleWriter.js
_bca95ef7.f[70] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const realm_utils_1 = _bca95ef7.s('realm-utils');
const Bundle_1 = _bca95ef7.r(28);
const Utils_1 = _bca95ef7.r(3);
const fs = _bca95ef7.s('fs');
class BundleWriter {
    constructor(core) {
        this.core = core;
        this.bundles = new Map();
    }
    getUglifyJSOptions() {
        const mainOptions = {};
        return {
            ...this.core.opts.shouldUglify() || {},
            ...mainOptions
        };
    }
    createBundle(name, code) {
        let bundle = new Bundle_1.Bundle(name, this.core.producer.fuse.copy(), this.core.producer);
        if (code) {
            bundle.generatedCode = new Buffer(code);
        }
        this.bundles.set(bundle.name, bundle);
        return bundle;
    }
    addShims() {
        const producer = this.core.producer;
        if (producer.fuse.context.shim) {
            const shims = [];
            for (let name in producer.fuse.context.shim) {
                let item = producer.fuse.context.shim[name];
                if (item.source) {
                    let shimPath = Utils_1.ensureUserPath(item.source);
                    if (!fs.existsSync(shimPath)) {
                        console.warn(`Shim erro: Not found: ${ shimPath }`);
                    } else {
                        shims.push(fs.readFileSync(shimPath).toString());
                    }
                }
            }
            if (shims.length) {
                this.createBundle(this.core.opts.shimsPath, shims.join('\n'));
            }
        }
    }
    uglifyBundle(bundle) {
        this.core.log.echoInfo(`Uglifying ${ bundle.name }...`);
        const result = Utils_1.uglify(bundle.generatedCode, this.getUglifyJSOptions());
        if (result.error) {
            this.core.log.echoBoldRed(`  → Error during uglifying ${ bundle.name }`).error(result.error);
            throw result.error;
        }
        bundle.generatedCode = result.code;
        this.core.log.echoInfo(`Done Uglifying ${ bundle.name }`);
        this.core.log.echoGzip(result.code);
    }
    process() {
        const producer = this.core.producer;
        const bundleManifest = {};
        this.addShims();
        producer.bundles.forEach(bundle => {
            this.bundles.set(bundle.name, bundle);
        });
        if (this.core.opts.isContained() && producer.bundles.size > 1) {
            this.core.opts.throwContainedAPIError();
        }
        let apiName2bake = this.core.opts.shouldBakeApiIntoBundle();
        if (!apiName2bake) {
            this.createBundle('api.js');
        }
        producer.bundles = this.bundles;
        const splitConfig = this.core.context.quantumSplitConfig;
        let splitFileOptions;
        if (splitConfig) {
            splitFileOptions = {
                c: {
                    b: splitConfig.resolveOptions.browser || './',
                    's': splitConfig.resolveOptions.server || './'
                },
                i: {}
            };
            this.core.api.setBundleMapping(splitFileOptions);
        }
        let index = 1;
        const writeBundle = bundle => {
            return bundle.context.output.writeCurrent(bundle.generatedCode).then(output => {
                bundleManifest[bundle.name] = {
                    fileName: output.filename,
                    hash: output.hash,
                    absPath: output.path,
                    webIndexed: !bundle.quantumItem,
                    relativePath: output.relativePath
                };
                if (bundle.quantumItem) {
                    splitFileOptions.i[bundle.quantumItem.name] = [
                        output.relativePath,
                        bundle.quantumItem.entryId
                    ];
                }
            });
        };
        return realm_utils_1.each(producer.bundles, bundle => {
            if (bundle.name === 'api.js') {
                bundle.webIndexPriority = 1000;
                if (this.core.opts.isContained()) {
                    this.core.opts.throwContainedAPIError();
                }
                bundle.generatedCode = new Buffer(this.core.api.render());
            } else {
                bundle.webIndexPriority = 1000 - index;
            }
            if (apiName2bake !== bundle.name) {
                if (this.core.opts.shouldUglify()) {
                    this.uglifyBundle(bundle);
                }
                index++;
                return writeBundle(bundle);
            }
        }).then(() => {
            if (apiName2bake) {
                let targetBundle = producer.bundles.get(apiName2bake);
                if (!targetBundle) {
                    this.core.log.echoBoldRed(`  → Error. Can't find bundle name ${ targetBundle }`);
                } else {
                    const generatedAPIBundle = this.core.api.render();
                    if (this.core.opts.isContained()) {
                        targetBundle.generatedCode = new Buffer(targetBundle.generatedCode.toString().replace('/*$$CONTAINED_API_PLACEHOLDER$$*/', generatedAPIBundle.toString()));
                    } else {
                        targetBundle.generatedCode = new Buffer(generatedAPIBundle + '\n' + targetBundle.generatedCode);
                    }
                    if (this.core.opts.shouldUglify()) {
                        this.uglifyBundle(targetBundle);
                    }
                }
                return writeBundle(targetBundle);
            }
        }).then(() => {
            const manifestPath = this.core.opts.getManifestFilePath();
            if (manifestPath) {
                this.core.producer.fuse.context.output.writeToOutputFolder(manifestPath, JSON.stringify(bundleManifest, null, 2));
            }
            if (this.core.opts.webIndexPlugin) {
                return this.core.opts.webIndexPlugin.producerEnd(producer);
            }
        }).then(() => {
            this.core.producer.bundles.forEach(bundle => {
                if (bundle.onDoneCallback) {
                    bundle.process.setFilePath(bundle.fuse.context.output.lastWrittenPath);
                    bundle.onDoneCallback(bundle.process);
                }
            });
        });
    }
}
exports.BundleWriter = BundleWriter;
}
// default/quantum/plugin/modifications/InteropModifications.js
_bca95ef7.f[71] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const realm_utils_1 = _bca95ef7.s('realm-utils');
class InteropModifications {
    static perform(core, file) {
        if (core.opts.shouldRemoveExportsInterop()) {
            return realm_utils_1.each(file.exportsInterop, interop => {
                return interop.remove();
            });
        }
    }
}
exports.InteropModifications = InteropModifications;
}
// default/quantum/plugin/modifications/UseStrictModification.js
_bca95ef7.f[72] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const realm_utils_1 = _bca95ef7.s('realm-utils');
class UseStrictModification {
    static perform(core, file) {
        if (core.opts.shouldRemoveUseStrict()) {
            return realm_utils_1.each(file.useStrict, useStrict => {
                return useStrict.remove();
            });
        }
    }
}
exports.UseStrictModification = UseStrictModification;
}
// default/quantum/plugin/ResponsiveAPI.js
_bca95ef7.f[73] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const path = _bca95ef7.s('path');
const Utils_1 = _bca95ef7.r(3);
const Config_1 = _bca95ef7.r(2);
class ResponsiveAPI {
    constructor(core) {
        this.core = core;
        this.computedStatements = false;
        this.hashes = false;
        this.isServerFunction = false;
        this.isBrowserFunction = false;
        this.customMappings = {};
        this.lazyLoading = false;
        this.customStatementResolve = false;
        this.serverRequire = false;
        this.ajaxRequired = false;
        this.codeSplitting = false;
        this.jsonLoader = false;
        this.loadRemoteScript = false;
        this.cssLoader = false;
    }
    addComputedRequireStatetements() {
        this.computedStatements = true;
        this.hashes = true;
    }
    addLazyLoading() {
        this.lazyLoading = true;
        if (this.core.opts.isTargetUniveral()) {
            this.ajaxRequired = true;
        }
        if (this.core.opts.isTargetBrowser()) {
            this.ajaxRequired = true;
        }
    }
    useCodeSplitting() {
        this.codeSplitting = true;
    }
    addJSONLoader() {
        this.jsonLoader = true;
    }
    addCSSLoader() {
        this.cssLoader = true;
    }
    addRemoteLoading() {
        this.loadRemoteScript = true;
    }
    hashesUsed() {
        return this.hashes;
    }
    addMapping(fuseBoxPath, id) {
        this.customMappings[fuseBoxPath] = id;
        this.customStatementResolve = true;
    }
    setBundleMapping(data) {
        this.bundleMapping = data;
    }
    addIsServerFunction() {
        this.isServerFunction = true;
    }
    addIsBrowserFunction() {
        this.isBrowserFunction = true;
    }
    useServerRequire() {
        this.serverRequire = true;
    }
    considerStatement(statement) {
        this.addLazyLoading();
        if (statement.isComputed) {
            this.addRemoteLoading();
            this.addCSSLoader();
            this.addJSONLoader();
        }
        if (statement.isRemoteURL()) {
            this.addRemoteLoading();
        }
        if (statement.isCSSRequested()) {
            this.loadRemoteScript = true;
            this.addCSSLoader();
        }
        if (statement.isJSONRequested()) {
            this.addJSONLoader();
        }
    }
    render() {
        const promisePolyfill = this.core.opts.getPromisePolyfill();
        const options = {
            browser: this.core.opts.isTargetBrowser(),
            universal: this.core.opts.isTargetUniveral(),
            server: this.core.opts.isTargetServer(),
            globalRequire: this.core.opts.globalRequire,
            isServerFunction: this.isServerFunction,
            isBrowserFunction: this.isBrowserFunction,
            computedStatements: this.computedStatements,
            hashes: this.hashes,
            serverRequire: this.serverRequire,
            customStatementResolve: this.customStatementResolve,
            lazyLoading: this.lazyLoading,
            codeSplitting: this.codeSplitting,
            ajaxRequired: this.ajaxRequired,
            jsonLoader: this.jsonLoader,
            cssLoader: this.cssLoader,
            promisePolyfill: false,
            loadRemoteScript: this.loadRemoteScript,
            isContained: this.core.opts.isContained(),
            extendServerImport: this.core.opts.shouldExtendServerImport()
        };
        const variables = {};
        const raw = {};
        let replaceRaw = {};
        if (Object.keys(this.customMappings).length > 0) {
            variables.customMappings = this.customMappings;
        }
        if (promisePolyfill) {
            options.promisePolyfill = true;
            raw.promisePolyfill = promisePolyfill;
        }
        if (this.bundleMapping) {
            variables.bundleMapping = this.bundleMapping;
        }
        if (this.core.opts.quantumVariableName !== '$fsx') {
            replaceRaw = { '$fsx': this.core.opts.quantumVariableName };
        }
        return Utils_1.jsCommentTemplate(path.join(Config_1.Config.FUSEBOX_MODULES, 'fuse-box-responsive-api/index.js'), options, variables, raw, replaceRaw);
    }
}
exports.ResponsiveAPI = ResponsiveAPI;
}
// default/quantum/plugin/modifications/TypeOfModifications.js
_bca95ef7.f[74] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const realm_utils_1 = _bca95ef7.s('realm-utils');
class TypeOfModifications {
    static perform(core, file) {
        if (!core.opts.shouldReplaceTypeOf()) {
            return;
        }
        return realm_utils_1.each(file.typeofExportsKeywords, keyword => {
            if (!file.definedLocally.has('exports')) {
                keyword.replaceWithString('object');
            }
        }).then(() => {
            return realm_utils_1.each(file.typeofModulesKeywords, keyword => {
                if (!file.definedLocally.has('module')) {
                    keyword.replaceWithString('object');
                }
            });
        }).then(() => {
            return realm_utils_1.each(file.typeofGlobalKeywords, keyword => {
                if (core.opts.isTargetBrowser()) {
                    if (!file.definedLocally.has('global')) {
                        keyword.replaceWithString('undefined');
                    }
                }
                if (core.opts.isTargetServer()) {
                    if (!file.definedLocally.has('global')) {
                        keyword.replaceWithString('object');
                    }
                }
            });
        }).then(() => {
            return realm_utils_1.each(file.typeofWindowKeywords, keyword => {
                if (core.opts.isTargetBrowser()) {
                    if (!file.definedLocally.has('window')) {
                        keyword.replaceWithString('object');
                    }
                }
                if (core.opts.isTargetServer()) {
                    if (!file.definedLocally.has('window')) {
                        keyword.replaceWithString('undefined');
                    }
                }
            });
        }).then(() => {
            return realm_utils_1.each(file.typeofDefineKeywords, keyword => {
                keyword.replaceWithString('undefined');
            });
        }).then(() => {
            return realm_utils_1.each(file.typeofRequireKeywords, keyword => {
                if (!file.definedLocally.has('require')) {
                    keyword.replaceWithString('function');
                }
            });
        });
    }
}
exports.TypeOfModifications = TypeOfModifications;
}
// default/quantum/plugin/TreeShake.js
_bca95ef7.f[75] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const realm_utils_1 = _bca95ef7.s('realm-utils');
class TreeShake {
    constructor(core) {
        this.core = core;
    }
    shake() {
        return this.eachFile(file => this.shakeExports(file)).then(() => this.releaseReferences()).then(() => this.removeUnusedExports());
    }
    releaseReferences() {
        return this.eachFile(file => {
            if (file.isNotUsedAnywhere() && this.core.opts.canBeRemovedByTreeShaking(file)) {
                return this.eachFile(target => target.releaseDependent(file));
            }
        });
    }
    removeUnusedExports() {
        return this.eachFile(file => {
            let uknownStatements = new Set();
            file.namedExports.forEach(fileExport => {
                if (!fileExport.isUsed && file.isTreeShakingAllowed() && fileExport.eligibleForTreeShaking) {
                    const isDangerous = fileExport.name === '__esModule' || fileExport.name === 'default';
                    if (!isDangerous) {
                        this.core.log.echoInfo(`tree shaking: Remove ${ fileExport.name } from ${ file.getFuseBoxFullPath() }`);
                        fileExport.remove();
                        if (fileExport.referencedVariableName) {
                            file.requireStatements.forEach(s => {
                                if (s.identifier === fileExport.referencedVariableName) {
                                    s.localReferences--;
                                    uknownStatements.add(s);
                                }
                            });
                        }
                    }
                }
            });
            uknownStatements.forEach(statement => {
                if (statement.localReferences === 0) {
                    let targetFile = statement.resolve();
                    if (targetFile) {
                        targetFile.releaseDependent(file);
                    }
                    statement.removeWithIdentifier();
                }
            });
            if (file.isNotUsedAnywhere() && this.core.opts.canBeRemovedByTreeShaking(file)) {
                this.core.log.echoInfo(`tree shaking: Mark for removal ${ file.getFuseBoxFullPath() }`);
                file.markForRemoval();
            }
        });
    }
    shakeExports(target) {
        return this.eachFile(file => {
            const dependencies = file.getDependencies();
            if (dependencies.has(target)) {
                const dependency = dependencies.get(target);
                dependency.forEach(statement => {
                    if (statement.usedNames.size > 0) {
                        target.shakable = true;
                    } else {
                        target.restrictTreeShaking();
                    }
                    target.namedExports.forEach(fileExport => {
                        const nameIsUsed = statement.usedNames.has(fileExport.name);
                        if (nameIsUsed) {
                            fileExport.isUsed = true;
                        } else {
                            if (target.localExportUsageAmount.get(fileExport.name) && target.localExportUsageAmount.get(fileExport.name) > 1) {
                                fileExport.isUsed = true;
                            }
                        }
                    });
                });
            }
        });
    }
    eachFile(fn) {
        return realm_utils_1.each(this.core.producerAbstraction.bundleAbstractions, bundleAbstraction => {
            return realm_utils_1.each(bundleAbstraction.packageAbstractions, packageAbstraction => {
                return realm_utils_1.each(packageAbstraction.fileAbstractions, fileAbstraction => {
                    return fn(fileAbstraction);
                });
            });
        });
    }
}
exports.TreeShake = TreeShake;
}
// default/quantum/plugin/modifications/ProcessEnvModification.js
_bca95ef7.f[76] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const realm_utils_1 = _bca95ef7.s('realm-utils');
class ProcessEnvModification {
    static perform(core, file) {
        if (core.opts.shouldReplaceProcessEnv()) {
            return realm_utils_1.each(file.processNodeEnv, env => {
                if (env.isConditional) {
                    env.handleActiveCode();
                } else {
                    env.replaceWithValue();
                }
            });
        }
    }
}
exports.ProcessEnvModification = ProcessEnvModification;
}
// default/quantum/plugin/modifications/DynamicImportStatements.js
_bca95ef7.f[77] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const realm_utils_1 = _bca95ef7.s('realm-utils');
class DynamicImportStatementsModifications {
    static perform(core, file) {
        return realm_utils_1.each(file.dynamicImportStatements, statement => {
            let target = statement.resolve();
            if (target) {
                const splitConfig = core.context.quantumSplitConfig;
                if (splitConfig) {
                    const config = splitConfig.findByEntry(target);
                    if (config) {
                        statement.setValue(config.name);
                        core.api.considerStatement(statement);
                    }
                }
            } else {
                core.api.considerStatement(statement);
            }
            statement.setFunctionName(`${ core.opts.quantumVariableName }.l`);
        });
    }
}
exports.DynamicImportStatementsModifications = DynamicImportStatementsModifications;
}
// default/quantum/plugin/Hoisting.js
_bca95ef7.f[78] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const realm_utils_1 = _bca95ef7.s('realm-utils');
class Hoisting {
    constructor(core) {
        this.core = core;
    }
    start() {
        this.core.log.echoInfo(`Launch hoisting`);
        const bundleAbstractions = this.core.producerAbstraction.bundleAbstractions;
        return realm_utils_1.each(bundleAbstractions, bundleAbstraction => {
            const hoistedCollection = new Map();
            const actuallyHoisted = new Map();
            bundleAbstraction.identifiers.forEach((collection, identifier) => {
                if (this.core.opts.isHoistingAllowed(identifier)) {
                    const statements = new Map();
                    let firstId;
                    let firstFile;
                    collection.forEach(item => {
                        const fileID = firstId = item.file.getID();
                        firstFile = item.file;
                        let list;
                        if (!statements.get(fileID)) {
                            list = new Set();
                            statements.set(fileID, list);
                        } else {
                            list = statements.get(fileID);
                        }
                        list.add(item.statement);
                    });
                    if (statements.size === 1) {
                        const requireStatements = statements.get(firstId);
                        if (requireStatements.size > 1) {
                            this.core.log.echoInfo(`Hoisting: ${ identifier } will be hoisted in bundle "${ bundleAbstraction.name }"`);
                            actuallyHoisted.set(identifier, firstFile);
                            hoistedCollection.set(identifier, statements.get(firstId));
                        }
                    }
                }
            });
            bundleAbstraction.hoisted = actuallyHoisted;
            hoistedCollection.forEach((hoisted, key) => {
                hoisted.forEach(requireStatement => requireStatement.removeWithIdentifier());
            });
        });
    }
}
exports.Hoisting = Hoisting;
}
// default/plugins/ReplacePlugin.js
_bca95ef7.f[79] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class ReplacePluginClass {
    constructor(options = {}) {
        this.options = options;
        this.test = /.*/;
    }
    transform(file) {
        file.loadContents();
        for (let key in this.options) {
            if (this.options.hasOwnProperty(key)) {
                const regexp = new RegExp(key, 'g');
                file.contents = file.contents.replace(regexp, this.options[key]);
            }
        }
    }
}
exports.ReplacePlugin = options => {
    return new ReplacePluginClass(options);
};
}
// default/plugins/VuePlugin.js
_bca95ef7.f[80] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const fs = _bca95ef7.s('fs');
const path = _bca95ef7.s('path');
let vueCompiler;
let vueTranspiler;
let typescriptTranspiler;
let babelCore;
let babelConfig;
class VuePluginClass {
    constructor(options = {}) {
        this.options = options;
        this.test = /\.vue$/;
    }
    init(context) {
        context.allowExtension('.vue');
    }
    transform(file) {
        const context = file.context;
        context.log.echoWarning(`VuePlugin is deprecated and will be removed in a future release. Please migrate to the new VueComponentPlugin: http://fuse-box.org/plugins/vue-component-plugin`);
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
            vueCompiler = _bca95ef7.s('vue-template-compiler');
            vueTranspiler = _bca95ef7.s('vue-template-es2015-compiler');
        }
        let result = vueCompiler.parseComponent(file.contents, this.options);
        if (result.template && result.template.type === 'template') {
            let templateLang = result.template.attrs ? result.template.attrs.lang : null;
            return compileTemplateContent(context, templateLang, result.template.content).then(html => {
                var styles = extractStyle(result.styles);
                if (styles.some)
                    file.addStringDependency('fuse-box-css');
                file.contents = compileScript(file, this.options, context, html, result.script, styles);
                file.analysis.parseUsingAcorn();
                file.analysis.analyze();
                if (context.useCache) {
                    context.emitJavascriptHotReload(file);
                    context.cache.writeStaticCache(file, file.sourceMap);
                }
                return true;
            }).catch(err => {
                console.error(err);
            });
        }
    }
}
;
function extractStyle(styleList) {
    var rv = {
        scoped: '',
        global: '',
        some: false
    };
    if (styleList)
        for (let s in styleList) {
            let style = styleList[s], content = style.content;
            if (style.lang)
                console.error('Not supported yet: vue single-file-component style languages other than CSS');
            if ('style' === style.type)
                rv[style.scoped ? 'scoped' : 'global'] += content;
        }
    rv.some = !!(rv.global || rv.scoped);
    return rv;
}
function toFunction(code) {
    return vueTranspiler('function render () {' + code + '}');
}
function compileTemplateContent(context, engine, content) {
    return new Promise((resolve, reject) => {
        if (!engine) {
            return resolve(content);
        }
        const cons = _bca95ef7.s('consolidate');
        if (!cons[engine]) {
            return content;
        }
        cons[engine].render(content, {
            filename: 'base',
            basedir: context.homeDir,
            includeDir: context.homeDir
        }, (err, html) => {
            if (err) {
                return reject(err);
            }
            resolve(html);
        });
    });
}
function compileScript(file, options, context, html, script, styles) {
    let lang = script.attrs.lang;
    if (lang === 'babel') {
        return compileBabel(file, options, context, html, script, styles);
    } else {
        return compileTypeScript(file, options, context, html, script, styles);
    }
}
function compileTypeScript(file, options, context, html, script, styles) {
    if (!typescriptTranspiler) {
        typescriptTranspiler = _bca95ef7.s('typescript');
    }
    try {
        const jsTranspiled = typescriptTranspiler.transpileModule(script.content, context.tsConfig.getConfig());
        return reduceVueToScript(file, jsTranspiled.outputText, html, styles);
    } catch (err) {
        console.log(err);
    }
    return '';
}
function compileBabel(file, options, context, html, script, styles) {
    if (!babelCore) {
        babelCore = _bca95ef7.s('babel-core');
        if (options.babel !== undefined) {
            babelConfig = options.babel.config;
        } else {
            let babelRcPath = path.join(context.appRoot, `.babelrc`);
            if (fs.existsSync(babelRcPath)) {
                let babelRcConfig = fs.readFileSync(babelRcPath).toString();
                if (babelRcConfig)
                    babelConfig = JSON.parse(babelRcConfig);
            }
        }
        if (babelConfig === undefined) {
            babelConfig = { plugins: ['transform-es2015-modules-commonjs'] };
        }
    }
    try {
        let jsTranspiled = babelCore.transform(script.content, babelConfig);
        return reduceVueToScript(file, jsTranspiled.code, html, styles);
    } catch (err) {
        console.log(err);
    }
    return '';
}
function reduceVueToScript(file, jsContent, html, styles) {
    const compiled = vueCompiler.compile(html);
    var cssInclude = '';
    if (styles.global)
        cssInclude += styles.global;
    if (styles.scoped)
        console.error('Functionality not yet supported: scoped style');
    if (cssInclude)
        cssInclude = 'require("fuse-box-css")(' + JSON.stringify(file.info.fuseBoxPath) + ',' + JSON.stringify(cssInclude) + ');';
    return `var _p = {};
var _v = function(exports){${ jsContent }
};${ cssInclude }
_p.render = ` + toFunction(compiled.render) + `
_p.staticRenderFns = [ ` + compiled.staticRenderFns.map(toFunction).join(',') + ` ];
var _e = {}; _v(_e); Object.assign(_e.default.options||_e.default, _p)
module.exports = _e
    `;
}
exports.VuePlugin = options => {
    return new VuePluginClass(options);
};
}
// default/plugins/vue/VuePlugin.js
_bca95ef7.f[81] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const CSSplugin_1 = _bca95ef7.r(82);
const Utils_1 = _bca95ef7.r(3);
const VueTemplateFile_1 = _bca95ef7.r(83);
const VueStyleFile_1 = _bca95ef7.r(92);
const VueScriptFile_1 = _bca95ef7.r(94);
const path = _bca95ef7.s('path');
const fs = _bca95ef7.s('fs');
const realm_utils_1 = _bca95ef7.s('realm-utils');
class VueComponentClass {
    constructor(options) {
        this.test = /\.vue$/;
        this.hasProcessedVueFile = false;
        this.options = Object.assign({}, {
            script: [],
            template: [],
            style: []
        }, options);
        this.options.script = Array.isArray(this.options.script) ? this.options.script : [this.options.script];
        this.options.template = Array.isArray(this.options.template) ? this.options.template : [this.options.template];
        this.options.style = Array.isArray(this.options.style) ? this.options.style : [this.options.style];
    }
    init(context) {
        context.allowExtension('.vue');
    }
    getDefaultExtension(block) {
        switch (block.type) {
        case 'template':
            return 'html';
        case 'script':
            return 'js';
        case 'style':
            return 'css';
        }
    }
    createVirtualFile(file, block, scopeId, pluginChain) {
        let extension = block.lang || this.getDefaultExtension(block);
        let src = `./${ block.type }.${ extension }`;
        if (block.src) {
            let srcExtension = path.extname(block.src) || '';
            if (srcExtension.indexOf('.') > -1) {
                srcExtension = srcExtension.substr(1);
                extension = srcExtension;
                src = block.src;
            } else {
                extension = block.lang ? `${ block.lang }` : '' || this.getDefaultExtension(block);
                src = `${ block.src }.${ extension }`;
            }
        }
        file.context.allowExtension(`.${ extension }`);
        const fileInfo = file.collection.pm.resolve(src, file.info.absDir);
        switch (block.type) {
        case 'script':
            return new VueScriptFile_1.VueScriptFile(file, fileInfo, block, scopeId, pluginChain);
        case 'template':
            return new VueTemplateFile_1.VueTemplateFile(file, fileInfo, block, scopeId, pluginChain);
        case 'style':
            return new VueStyleFile_1.VueStyleFile(file, fileInfo, block, scopeId, pluginChain);
        }
    }
    addToCacheObject(cacheItem, path, contents, sourceMap, file) {
        cacheItem[path] = {
            contents,
            sourceMap
        };
        cacheItem.override = file.hasExtensionOverride ? file.info.absPath : '';
    }
    isFileInCacheData(block, override, path) {
        return block[path] || override && override.indexOf(path) > -1;
    }
    bundleEnd(context) {
        if (context.useCache && this.hasProcessedVueFile) {
            context.source.addContent(`
        var process = FuseBox.import('process');

        if (process.env.NODE_ENV !== "production") {
          var api = FuseBox.import('vue-hot-reload-api');
          var Vue = FuseBox.import('vue');

          api.install(Vue);

          FuseBox.addPlugin({
            hmrUpdate: function (data) {
              var componentWildcardPath = '~/' + data.path.substr(0, data.path.lastIndexOf('/') + 1) + '*.vue';
              var isComponentStyling = (data.type === "css" && !!FuseBox.import(componentWildcardPath));

              if (data.type === "js" && /.vue$/.test(data.path) || isComponentStyling) {
                var fusePath = '~/' + data.path;

                FuseBox.flush();

                FuseBox.flush(function (file) {
                  return file === data.path;
                });

                FuseBox.dynamic(data.path, data.content);

                if (!isComponentStyling) {
                  var component = FuseBox.import(fusePath).default;
                  api.reload(component._vueModuleId||component.options._vueModuleId, component);
                }

                return true;
              }
            }
          });
        }
        `);
        }
    }
    async transform(file) {
        this.hasProcessedVueFile = true;
        const vueCompiler = _bca95ef7.s('vue-template-compiler');
        const bundle = file.context.bundle;
        let cacheValid = false;
        if (file.context.useCache && file.loadFromCache()) {
            const data = file.cacheData;
            cacheValid = true;
            if (bundle && bundle.lastChangedFile) {
                const lastChangedFusePath = Utils_1.ensurePublicExtension(bundle.lastChangedFile);
                if (this.isFileInCacheData(data.template, data.template.override, lastChangedFusePath) || this.isFileInCacheData(data.script, data.script.override, lastChangedFusePath) || this.isFileInCacheData(data.styles, data.styles.override, lastChangedFusePath)) {
                    cacheValid = false;
                }
            }
        }
        if (!cacheValid) {
            file.isLoaded = false;
            file.cached = false;
            file.analysis.skipAnalysis = false;
        }
        const concat = new Utils_1.Concat(true, '', '\n');
        file.loadContents();
        const cache = {
            template: {},
            script: {},
            styles: {}
        };
        const component = vueCompiler.parseComponent(fs.readFileSync(file.info.absPath).toString());
        const hasScopedStyles = component.styles && !!component.styles.find(style => style.scoped);
        const moduleId = `data-v-${ Utils_1.hashString(file.info.absPath) }`;
        const scopeId = hasScopedStyles ? moduleId : null;
        concat.add(null, `var _options = { _vueModuleId: '${ moduleId }'}`);
        if (hasScopedStyles) {
            concat.add(null, `Object.assign(_options, {_scopeId: '${ scopeId }'})`);
        }
        if (component.template) {
            const templateFile = this.createVirtualFile(file, component.template, scopeId, this.options.template);
            templateFile.setPluginChain(component.template, this.options.template);
            if (cacheValid) {
                const templateCacheData = file.cacheData.template[templateFile.info.fuseBoxPath];
                this.addToCacheObject(cache.template, templateFile.info.fuseBoxPath, templateCacheData.contents, templateCacheData.sourceMap, templateFile);
            } else {
                await templateFile.process();
                this.addToCacheObject(cache.template, templateFile.info.fuseBoxPath, templateFile.contents, templateFile.sourceMap, templateFile);
                concat.add(null, templateFile.contents);
            }
        }
        if (component.script) {
            const scriptFile = this.createVirtualFile(file, component.script, scopeId, this.options.script);
            scriptFile.setPluginChain(component.script, this.options.script);
            if (cacheValid) {
                const scriptCacheData = file.cacheData.script[scriptFile.info.fuseBoxPath];
                scriptFile.isLoaded = true;
                scriptFile.contents = scriptCacheData.contents;
                scriptFile.sourceMap = scriptCacheData.sourceMap;
                this.addToCacheObject(cache.script, scriptFile.info.fuseBoxPath, scriptCacheData.contents, scriptCacheData.sourceMap, scriptFile);
            } else {
                await scriptFile.process();
                this.addToCacheObject(cache.script, scriptFile.info.fuseBoxPath, scriptFile.contents, scriptFile.sourceMap, scriptFile);
                concat.add(null, scriptFile.contents, scriptFile.sourceMap);
                concat.add(null, `Object.assign(exports.default.options||exports.default, _options)`);
            }
        } else {
            if (!cacheValid) {
                concat.add(null, 'exports.default = {}');
                concat.add(null, `Object.assign(exports.default.options||exports.default, _options)`);
            }
        }
        if (component.styles && component.styles.length > 0) {
            file.addStringDependency('fuse-box-css');
            const styleFiles = await realm_utils_1.each(component.styles, styleBlock => {
                const styleFile = this.createVirtualFile(file, styleBlock, scopeId, this.options.style);
                styleFile.setPluginChain(styleBlock, this.options.style);
                if (cacheValid) {
                    const CSSPlugin = this.options.style.find(plugin => plugin instanceof CSSplugin_1.CSSPluginClass);
                    styleFile.isLoaded = true;
                    styleFile.contents = file.cacheData.styles[styleFile.info.fuseBoxPath].contents;
                    styleFile.sourceMap = file.cacheData.styles[styleFile.info.fuseBoxPath].sourceMap;
                    cache.styles[styleFile.info.fuseBoxPath] = {
                        contents: styleFile.contents,
                        sourceMap: styleFile.sourceMap
                    };
                    styleFile.fixSourceMapName();
                    return (CSSPlugin.transform(styleFile) || Promise.resolve()).then(() => styleFile);
                } else {
                    return styleFile.process().then(() => styleFile).then(() => {
                        this.addToCacheObject(cache.styles, styleFile.info.fuseBoxPath, styleFile.contents, styleFile.sourceMap, styleFile);
                        if (styleFile.cssDependencies) {
                            styleFile.cssDependencies.forEach(path => {
                                cache.styles[path] = 1;
                            });
                        }
                        return styleFile;
                    });
                }
            });
            await realm_utils_1.each(styleFiles, styleFile => {
                if (styleFile.alternativeContent) {
                    concat.add(null, styleFile.alternativeContent);
                } else {
                    concat.add(null, `require('fuse-box-css')('${ styleFile.info.fuseBoxPath }', ${ JSON.stringify(styleFile.contents) })`, styleFile.sourceMap);
                }
            });
        }
        if (file.context.useCache) {
            concat.add(null, `
        var process = FuseBox.import('process');

        if (process.env.NODE_ENV !== "production") {
          var api = require('vue-hot-reload-api');

          process.env.vueHMR = process.env.vueHMR || {};

          if (!process.env.vueHMR['${ moduleId }']) {
            process.env.vueHMR['${ moduleId }'] = true;
            api.createRecord('${ moduleId }', module.exports.default);
          }
        }
      `);
            file.addStringDependency('vue-hot-reload-api');
        }
        file.addStringDependency('vue');
        if (!cacheValid) {
            file.contents = concat.content.toString();
            file.sourceMap = concat.sourceMap.toString();
            file.analysis.parseUsingAcorn();
            file.analysis.analyze();
        }
        if (file.context.useCache && !cacheValid) {
            file.setCacheData(cache);
            file.context.cache.writeStaticCache(file, file.sourceMap);
            file.context.emitJavascriptHotReload(file);
        }
    }
}
exports.VueComponentPlugin = (options = {}) => {
    return new VueComponentClass(options);
};
}
// default/plugins/stylesheet/CSSplugin.js
_bca95ef7.f[82] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const path = _bca95ef7.s('path');
const File_1 = _bca95ef7.r(7);
const realm_utils_1 = _bca95ef7.s('realm-utils');
const Utils_1 = _bca95ef7.r(3);
const ensureCSSExtension = file => {
    let str = file instanceof File_1.File ? file.info.fuseBoxPath : file;
    const ext = path.extname(str);
    if (ext !== '.css') {
        return str.replace(ext, '.css');
    }
    return str;
};
class CSSPluginClass {
    constructor(opts = {}) {
        this.test = /\.css$/;
        this.minify = false;
        this.options = opts;
        if (opts.minify !== undefined) {
            this.minify = opts.minify;
        }
    }
    injectFuseModule(file) {
        file.addStringDependency('fuse-box-css');
    }
    init(context) {
        context.allowExtension('.css');
    }
    getFunction() {
        return `require("fuse-box-css")`;
    }
    inject(file, options, alternative) {
        const resolvedPath = realm_utils_1.utils.isFunction(options.inject) ? options.inject(ensureCSSExtension(file)) : ensureCSSExtension(file);
        const result = options.inject !== false ? `${ this.getFunction() }("${ resolvedPath }");` : '';
        if (alternative) {
            file.addAlternativeContent(result);
        } else {
            file.contents = result;
        }
        return resolvedPath;
    }
    transformGroup(group) {
        const debug = text => group.context.debugPlugin(this, text);
        debug(`Start group transformation on "${ group.info.fuseBoxPath }"`);
        let concat = new Utils_1.Concat(true, '', '\n');
        group.subFiles.forEach(file => {
            debug(`  -> Concat ${ file.info.fuseBoxPath }`);
            concat.add(file.info.fuseBoxPath, file.contents, file.generateCorrectSourceMap());
            file.sourceMap = undefined;
        });
        let options = group.groupHandler.options || {};
        const cssContents = concat.content;
        if (options.outFile) {
            let outFile = Utils_1.ensureUserPath(ensureCSSExtension(options.outFile));
            const bundleDir = path.dirname(outFile);
            const sourceMapsName = path.basename(options.outFile) + '.map';
            concat.add(null, `/*# sourceMappingURL=${ sourceMapsName } */`);
            debug(`Writing ${ outFile }`);
            return Utils_1.write(outFile, concat.content).then(() => {
                const resolvedPath = this.inject(group, options);
                this.emitHMR(group, resolvedPath);
                const sourceMapsFile = Utils_1.ensureUserPath(path.join(bundleDir, sourceMapsName));
                return Utils_1.write(sourceMapsFile, concat.sourceMap);
            });
        } else {
            debug(`Inlining ${ group.info.fuseBoxPath }`);
            const safeContents = JSON.stringify(cssContents.toString());
            group.addAlternativeContent(`${ this.getFunction() }("${ group.info.fuseBoxPath }", ${ safeContents });`);
        }
        this.emitHMR(group);
    }
    emitHMR(file, resolvedPath) {
        let emitRequired = false;
        const bundle = file.context.bundle;
        if (bundle && bundle.lastChangedFile) {
            const lastFile = file.context.convertToFuseBoxPath(bundle.lastChangedFile);
            if (Utils_1.isStylesheetExtension(bundle.lastChangedFile)) {
                if (lastFile === file.info.fuseBoxPath || file.context.getItem('HMR_FILE_REQUIRED', []).indexOf(file.info.fuseBoxPath) > -1) {
                    emitRequired = true;
                }
                if (file.subFiles.find(subFile => subFile.info.fuseBoxPath === bundle.lastChangedFile)) {
                    emitRequired = true;
                }
            }
        }
        if (emitRequired) {
            if (resolvedPath) {
                file.context.sourceChangedEmitter.emit({
                    type: 'hosted-css',
                    path: resolvedPath
                });
            } else {
                file.context.sourceChangedEmitter.emit({
                    type: 'css',
                    content: file.alternativeContent,
                    path: file.info.fuseBoxPath
                });
            }
        }
    }
    transform(file) {
        if (!file.context.sourceMapsProject) {
            file.sourceMap = undefined;
        }
        if (file.hasSubFiles()) {
            return;
        }
        this.injectFuseModule(file);
        const debug = text => file.context.debugPlugin(this, text);
        file.loadContents();
        let filePath = file.info.fuseBoxPath;
        let context = file.context;
        file.contents = this.minify ? this.minifyContents(file.contents) : file.contents;
        if (this.options.group) {
            const bundleName = this.options.group;
            let fileGroup = context.getFileGroup(bundleName);
            if (!fileGroup) {
                fileGroup = context.createFileGroup(bundleName, file.collection, this);
            }
            fileGroup.addSubFile(file);
            debug(`  grouping -> ${ bundleName }`);
            file.addAlternativeContent(`require("~/${ bundleName }")`);
            return;
        }
        if (typeof file.sourceMap === 'string') {
            file.sourceMap = file.generateCorrectSourceMap();
        }
        let outFileFunction;
        if (this.options.outFile !== undefined) {
            if (!realm_utils_1.utils.isFunction(this.options.outFile)) {
                context.fatal(`Error in CSSConfig. outFile is expected to be a function that resolves a path`);
            } else {
                outFileFunction = this.options.outFile;
            }
        }
        if (outFileFunction) {
            const userPath = Utils_1.ensureUserPath(outFileFunction(ensureCSSExtension(file)));
            const utouchedPath = outFileFunction(file.info.fuseBoxPath);
            const resolvedPath = this.inject(file, this.options, true);
            return Utils_1.write(userPath, file.contents).then(() => {
                this.emitHMR(file, resolvedPath);
                if (file.sourceMap && file.context.sourceMapsProject) {
                    const fileDir = path.dirname(userPath);
                    const sourceMapPath = path.join(fileDir, path.basename(utouchedPath) + '.map');
                    return Utils_1.write(sourceMapPath, file.sourceMap).then(() => {
                        file.sourceMap = undefined;
                    });
                }
            });
        } else {
            let safeContents = JSON.stringify(file.contents);
            file.sourceMap = undefined;
            file.addAlternativeContent(`${ this.getFunction() }("${ filePath }", ${ safeContents })`);
            this.emitHMR(file);
        }
    }
    minifyContents(contents) {
        return contents.replace(/\s{2,}/g, ' ').replace(/\t|\r|\n/g, '').trim();
    }
}
exports.CSSPluginClass = CSSPluginClass;
exports.CSSPlugin = opts => {
    return new CSSPluginClass(opts);
};
}
// default/plugins/vue/VueTemplateFile.js
_bca95ef7.f[83] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const VueBlockFile_1 = _bca95ef7.r(84);
class VueTemplateFile extends VueBlockFile_1.VueBlockFile {
    toFunction(code) {
        const vueTranspiler = _bca95ef7.s('vue-template-es2015-compiler');
        return vueTranspiler(`function render () {${ code }}`);
    }
    async process() {
        const vueCompiler = _bca95ef7.s('vue-template-compiler');
        this.loadContents();
        return this.pluginChain.reduce((chain, plugin) => {
            return chain.then(() => {
                const promise = plugin.transform(this);
                return promise || Promise.resolve(this);
            }).then(() => {
                this.contents = JSON.parse(this.contents.replace('module.exports.default =', '').replace('module.exports =', '').trim());
            }).then(() => vueCompiler.compile(this.contents));
        }, Promise.resolve()).then(compiled => {
            return `Object.assign(_options, {
        _scopeId: ${ this.scopeId ? JSON.stringify(this.scopeId) : null },
        render: ${ this.toFunction(compiled.render) },
        staticRenderFns: [${ compiled.staticRenderFns.map(t => this.toFunction(t)).join(',') }]
      })`;
        }).then(contents => {
            this.contents = contents;
        });
    }
}
exports.VueTemplateFile = VueTemplateFile;
}
// default/plugins/vue/VueBlockFile.js
_bca95ef7.f[84] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const fs = _bca95ef7.s('fs');
const Utils_1 = _bca95ef7.r(3);
const File_1 = _bca95ef7.r(7);
const CSSplugin_1 = _bca95ef7.r(82);
const LESSPlugin_1 = _bca95ef7.r(85);
const SassPlugin_1 = _bca95ef7.r(86);
const StylusPlugin_1 = _bca95ef7.r(87);
const HTMLplugin_1 = _bca95ef7.r(88);
const BabelPlugin_1 = _bca95ef7.r(89);
const CoffeePlugin_1 = _bca95ef7.r(90);
const ConsolidatePlugin_1 = _bca95ef7.r(91);
const PLUGIN_LANG_MAP = new Map().set('css', new CSSplugin_1.CSSPluginClass()).set('less', new LESSPlugin_1.LESSPluginClass()).set('scss', new SassPlugin_1.SassPluginClass({ importer: true })).set('styl', new StylusPlugin_1.StylusPluginClass()).set('html', new HTMLplugin_1.FuseBoxHTMLPlugin()).set('js', new BabelPlugin_1.BabelPluginClass()).set('ts', null).set('coffee', new CoffeePlugin_1.CoffeePluginClass());
class VueBlockFile extends File_1.File {
    constructor(file, info, block, scopeId, pluginChain) {
        super(file.context, info);
        this.file = file;
        this.info = info;
        this.block = block;
        this.scopeId = scopeId;
        this.pluginChain = pluginChain;
        this.collection = file.collection;
        this.context.extensionOverrides && this.context.extensionOverrides.setOverrideFileInfo(this);
        this.ignoreCache = true;
    }
    setPluginChain(block, pluginChain) {
        const defaultExtension = Utils_1.extractExtension(this.info.fuseBoxPath);
        if (pluginChain.length === 0 && !block.lang) {
            if (defaultExtension === 'js' && this.context.useTypescriptCompiler) {
                pluginChain.push(PLUGIN_LANG_MAP.get('ts'));
            } else if (block.type === 'template' && Utils_1.extractExtension(this.info.absPath) !== 'html') {
                pluginChain.push(new ConsolidatePlugin_1.ConsolidatePluginClass({ engine: Utils_1.extractExtension(this.info.absPath) }));
            } else {
                pluginChain.push(PLUGIN_LANG_MAP.get(defaultExtension));
            }
        }
        if (pluginChain.length === 0 && block.lang) {
            if (defaultExtension === 'js' && this.context.useTypescriptCompiler || block.lang === 'ts') {
                pluginChain.push(PLUGIN_LANG_MAP.get('ts'));
            } else {
                const PluginToUse = PLUGIN_LANG_MAP.get(block.lang.toLowerCase());
                if (!PluginToUse) {
                    if (block.type === 'template') {
                        pluginChain.push(new ConsolidatePlugin_1.ConsolidatePluginClass({ engine: block.lang.toLowerCase() }));
                    } else {
                        const message = `VueComponentClass - cannot find a plugin to transpile lang="${ block.lang }"`;
                        this.context.log.echoError(message);
                        return Promise.reject(new Error(message));
                    }
                } else {
                    pluginChain.push(PluginToUse);
                }
                if (block.type === 'style' && !(PluginToUse instanceof CSSplugin_1.CSSPluginClass)) {
                    pluginChain.push(PLUGIN_LANG_MAP.get('css'));
                }
            }
        }
        const pluginChainString = this.pluginChain.map(plugin => {
            return plugin ? plugin.constructor.name : 'TypeScriptCompiler';
        }).join(' \u2192 ');
        this.context.debug('VueComponentClass', `using ${ pluginChainString } for ${ this.info.fuseBoxPath }`);
    }
    loadContents() {
        if (this.isLoaded) {
            return;
        }
        if (this.block.src || this.hasExtensionOverride) {
            try {
                this.contents = fs.readFileSync(this.info.absPath).toString();
            } catch (e) {
                this.context.log.echoError(`VueComponentPlugin - Could not load external file ${ this.info.absPath }`);
            }
        } else {
            this.contents = this.block.content;
        }
        this.isLoaded = true;
    }
}
exports.VueBlockFile = VueBlockFile;
}
// default/plugins/stylesheet/LESSPlugin.js
_bca95ef7.f[85] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
let less;
class LESSPluginClass {
    constructor(options = {}) {
        this.test = /\.less$/;
        this.options = options;
    }
    init(context) {
        context.allowExtension('.less');
    }
    transform(file) {
        file.addStringDependency('fuse-box-css');
        if (file.isCSSCached('less')) {
            return;
        }
        const context = file.context;
        const options = { ...this.options };
        file.loadContents();
        const sourceMapDef = {
            sourceMapBasepath: '.',
            sourceMapRootpath: file.info.absDir
        };
        if (!less) {
            less = _bca95ef7.s('less');
        }
        options.filename = file.context.homeDir + (options.filename || file.info.fuseBoxPath);
        if ('sourceMapConfig' in context) {
            options.sourceMap = {
                ...sourceMapDef,
                ...options.sourceMap || {}
            };
        }
        let paths = [file.info.absDir];
        if (Array.isArray(options.paths)) {
            paths = options.paths.concat(paths);
        }
        options.paths = paths;
        const cssDependencies = file.context.extractCSSDependencies(file, {
            paths: options.paths,
            content: file.contents,
            sassStyle: true,
            extensions: [
                'less',
                'css'
            ]
        });
        file.cssDependencies = cssDependencies;
        return less.render(file.contents, options).then(output => {
            if (output.map) {
                file.sourceMap = output.map;
            }
            file.contents = output.css;
            if (context.useCache) {
                file.analysis.dependencies = cssDependencies;
                context.cache.writeStaticCache(file, file.sourceMap, 'less');
                file.analysis.dependencies = [];
            }
        }).catch(err => {
            file.contents = '';
            file.addError(`${ err.message }\n      at ${ err.filename }:${ err.line }:${ err.column }`);
        });
    }
}
exports.LESSPluginClass = LESSPluginClass;
exports.LESSPlugin = opts => {
    return new LESSPluginClass(opts);
};
}
// default/plugins/stylesheet/SassPlugin.js
_bca95ef7.f[86] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const path = _bca95ef7.s('path');
const Config_1 = _bca95ef7.r(2);
let sass;
class SassPluginClass {
    constructor(options = {}) {
        this.options = options;
        this.test = /\.(scss|sass)$/;
    }
    init(context) {
        context.allowExtension('.scss');
        context.allowExtension('.sass');
        this.context = context;
    }
    transform(file) {
        file.addStringDependency('fuse-box-css');
        const context = file.context;
        if (file.isCSSCached('sass')) {
            return;
        }
        file.bustCSSCache = true;
        file.loadContents();
        if (!file.contents) {
            return;
        }
        if (!sass) {
            sass = _bca95ef7.s('node-sass');
        }
        const defaultMacro = {
            '$homeDir': file.context.homeDir,
            '$appRoot': context.appRoot,
            '~': Config_1.Config.NODE_MODULES_DIR + '/'
        };
        const options = Object.assign({
            data: file.contents,
            file: context.homeDir + '/' + file.info.fuseBoxPath,
            sourceMap: true,
            outFile: file.info.fuseBoxPath,
            sourceMapContents: true
        }, this.options);
        options.includePaths = [];
        if (typeof this.options.includePaths !== 'undefined') {
            this.options.includePaths.forEach(path => {
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
                let file = path.normalize(url);
                if (context.extensionOverrides) {
                    file = context.extensionOverrides.getPathOverride(file) || file;
                }
                done({ file });
            };
        }
        options.includePaths.push(file.info.absDir);
        const cssDependencies = file.context.extractCSSDependencies(file, {
            paths: options.includePaths,
            content: file.contents,
            sassStyle: true,
            importer: options.importer,
            extensions: [
                'css',
                options.indentedSyntax ? 'sass' : 'scss'
            ]
        });
        file.cssDependencies = cssDependencies;
        return new Promise((resolve, reject) => {
            return sass.render(options, (err, result) => {
                if (err) {
                    const errorFile = err.file === 'stdin' ? file.absPath : err.file;
                    file.contents = '';
                    file.addError(`${ err.message }\n      at ${ errorFile }:${ err.line }:${ err.column }`);
                    return resolve();
                }
                file.sourceMap = result.map && result.map.toString();
                file.contents = result.css.toString();
                if (context.useCache) {
                    file.analysis.dependencies = cssDependencies;
                    context.cache.writeStaticCache(file, file.sourceMap, 'sass');
                    file.analysis.dependencies = [];
                }
                return resolve();
            });
        });
    }
}
exports.SassPluginClass = SassPluginClass;
exports.SassPlugin = options => {
    return new SassPluginClass(options);
};
}
// default/plugins/stylesheet/StylusPlugin.js
_bca95ef7.f[87] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
let stylus;
class StylusPluginClass {
    constructor(options = {}) {
        this.options = options;
        this.test = /\.styl$/;
    }
    init(context) {
        context.allowExtension('.styl');
    }
    transform(file) {
        file.addStringDependency('fuse-box-css');
        if (file.isCSSCached('styl')) {
            return;
        }
        file.bustCSSCache = true;
        const context = file.context;
        const options = { ...this.options };
        const sourceMapDef = {
            comment: false,
            sourceRoot: file.info.absDir
        };
        file.loadContents();
        if (!stylus)
            stylus = _bca95ef7.s('stylus');
        options.filename = file.info.fuseBoxPath;
        if (!options.paths) {
            options.paths = [];
        }
        options.paths.push(file.info.absDir);
        if ('sourceMapConfig' in context) {
            options.sourcemap = {
                ...sourceMapDef,
                ...this.options.sourcemap || {}
            };
        }
        const cssDependencies = file.context.extractCSSDependencies(file, {
            paths: options.paths,
            content: file.contents,
            sassStyle: true,
            extensions: [
                'styl',
                'css'
            ]
        });
        file.cssDependencies = cssDependencies;
        return new Promise((res, rej) => {
            const renderer = stylus(file.contents, options);
            return renderer.render((err, css) => {
                if (err)
                    return rej(err);
                if (renderer.sourcemap) {
                    file.sourceMap = JSON.stringify(renderer.sourcemap);
                }
                file.contents = css;
                if (context.useCache) {
                    file.analysis.dependencies = cssDependencies;
                    context.cache.writeStaticCache(file, file.sourceMap, 'styl');
                    file.analysis.dependencies = [];
                }
                return res(css);
            });
        });
    }
}
exports.StylusPluginClass = StylusPluginClass;
exports.StylusPlugin = options => {
    return new StylusPluginClass(options);
};
}
// default/plugins/HTMLplugin.js
_bca95ef7.f[88] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class FuseBoxHTMLPlugin {
    constructor(opts = {}) {
        this.useDefault = true;
        this.test = /\.html$/;
        if (opts.useDefault !== undefined) {
            this.useDefault = opts.useDefault;
        }
    }
    init(context) {
        context.allowExtension('.html');
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
            file.contents = `module.exports.default =  ${ JSON.stringify(file.contents) }`;
        } else {
            file.contents = `module.exports =  ${ JSON.stringify(file.contents) }`;
        }
        if (context.useCache) {
            context.emitJavascriptHotReload(file);
            context.cache.writeStaticCache(file, file.sourceMap);
        }
    }
}
exports.FuseBoxHTMLPlugin = FuseBoxHTMLPlugin;
;
exports.HTMLPlugin = options => {
    return new FuseBoxHTMLPlugin(options);
};
}
// default/plugins/js-transpilers/BabelPlugin.js
_bca95ef7.f[89] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const fs = _bca95ef7.s('fs');
const path = _bca95ef7.s('path');
const Utils_1 = _bca95ef7.r(3);
let babelCore;
class BabelPluginClass {
    constructor(opts = {}) {
        this.extensions = ['.jsx'];
        this.test = /\.(j|t)s(x)?$/;
        this.limit2project = true;
        this.config = {};
        this.configPrinted = false;
        this.configLoaded = false;
        if (opts.config === undefined && opts.test === undefined && opts.limit2project === undefined && opts.extensions === undefined && Object.keys(opts).length) {
            this.config = opts;
            return;
        }
        if (opts.config) {
            this.config = opts.config;
        }
        if (opts.extensions !== undefined) {
            this.extensions = opts.extensions;
            if (opts.test === undefined) {
                this.test = Utils_1.string2RegExp(opts.extensions.join('|'));
            }
        }
        if (opts.test !== undefined) {
            this.test = opts.test;
        }
        if (opts.limit2project !== undefined) {
            this.limit2project = opts.limit2project;
        }
    }
    handleBabelRc() {
        if (this.configLoaded)
            return;
        let babelRcConfig;
        let babelRcPath = path.join(this.context.appRoot, `.babelrc`);
        if (fs.existsSync(babelRcPath)) {
            babelRcConfig = fs.readFileSync(babelRcPath).toString();
            if (babelRcConfig) {
                babelRcConfig = Object.assign({}, JSON.parse(babelRcConfig), this.config);
            }
        }
        if (babelRcConfig) {
            this.config = babelRcConfig;
        }
        this.configLoaded = true;
    }
    init(context) {
        this.context = context;
        if (Array.isArray(this.extensions)) {
            this.extensions.forEach(ext => context.allowExtension(ext));
        }
        this.handleBabelRc();
    }
    transform(file, ast) {
        file.wasTranspiled = true;
        if (!babelCore) {
            babelCore = _bca95ef7.s('babel-core');
        }
        if (this.configPrinted === false && this.context.doLog === true) {
            file.context.debug('BabelPlugin', `\n\tConfiguration: ${ JSON.stringify(this.config) }`);
            this.configPrinted = true;
        }
        if (this.context.useCache) {
            if (file.loadFromCache()) {
                return;
            }
        }
        file.loadContents();
        if (this.limit2project === false || file.collection.name === file.context.defaultPackageName) {
            let result;
            try {
                result = babelCore.transform(file.contents, this.config);
            } catch (e) {
                file.analysis.skip();
                console.error(e);
                return;
            }
            if (result.ast) {
                file.analysis.loadAst(result.ast);
                let sourceMaps = result.map;
                file.context.setCodeGenerator(ast => {
                    const result = babelCore.transformFromAst(ast);
                    sourceMaps = result.map;
                    return result.code;
                });
                file.contents = result.code;
                file.analysis.analyze();
                if (sourceMaps) {
                    sourceMaps.file = file.info.fuseBoxPath;
                    sourceMaps.sources = [file.context.sourceMapsRoot + '/' + file.info.fuseBoxPath];
                    if (!file.context.inlineSourceMaps) {
                        delete sourceMaps.sourcesContent;
                    }
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
exports.BabelPlugin = (opts = {}) => {
    return new BabelPluginClass(opts);
};
}
// default/plugins/js-transpilers/CoffeePlugin.js
_bca95ef7.f[90] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
let coffee;
class CoffeePluginClass {
    constructor(options = {}) {
        this.test = /\.coffee$/;
        this.options = Object.assign({
            bare: true,
            sourceMap: false,
            sourceRoot: '',
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
            coffee = _bca95ef7.s('coffee-script');
        }
        return new Promise((res, rej) => {
            try {
                let options = Object.assign({}, this.options, { filename: file.absPath });
                file.contents = coffee.compile(file.contents, options);
                res(file.contents);
            } catch (err) {
                rej(err);
            }
        });
    }
}
exports.CoffeePluginClass = CoffeePluginClass;
exports.CoffeePlugin = options => {
    return new CoffeePluginClass(options);
};
}
// default/plugins/ConsolidatePlugin.js
_bca95ef7.f[91] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class ConsolidatePluginClass {
    constructor(options) {
        if (!options.engine) {
            const message = 'ConsolidatePlugin - requires an engine to be provided in the options';
            throw new Error(message);
        }
        this.engine = options.engine;
        this.extension = options.extension || `.${ options.engine }`;
        this.useDefault = options.useDefault !== undefined ? options.useDefault : true;
        this.test = new RegExp(this.extension);
    }
    init(context) {
        context.allowExtension(this.extension);
    }
    async transform(file) {
        const consolidate = _bca95ef7.s('consolidate');
        if (file.context.useCache) {
            const cached = file.context.cache.getStaticCache(file);
            if (cached) {
                file.isLoaded = true;
                file.contents = cached.contents;
                return Promise.resolve();
            }
        }
        file.loadContents();
        if (!consolidate[this.engine]) {
            const message = `ConsolidatePlugin - consolidate did not recognise the engine "${ this.engine }"`;
            file.context.log.echoError(message);
            return Promise.reject(new Error(message));
        }
        try {
            file.contents = await consolidate[this.engine].render(file.contents, {
                cache: false,
                filename: 'base',
                basedir: file.context.homeDir,
                includeDir: file.context.homeDir
            });
            if (this.useDefault) {
                file.contents = `module.exports.default = ${ JSON.stringify(file.contents) }`;
            } else {
                file.contents = `module.exports = ${ JSON.stringify(file.contents) }`;
            }
        } catch (e) {
            file.context.log.echoError(`ConsolidatePlugin - could not process template, ${ e }`);
            return Promise.reject(e);
        }
        if (file.context.useCache) {
            file.context.emitJavascriptHotReload(file);
            file.context.cache.writeStaticCache(file, file.sourceMap);
        }
    }
}
exports.ConsolidatePluginClass = ConsolidatePluginClass;
exports.ConsolidatePlugin = options => {
    return new ConsolidatePluginClass(options);
};
}
// default/plugins/vue/VueStyleFile.js
_bca95ef7.f[92] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const VueBlockFile_1 = _bca95ef7.r(84);
const CSSplugin_1 = _bca95ef7.r(82);
const PostCSSPlugins_1 = _bca95ef7.r(93);
class VueStyleFile extends VueBlockFile_1.VueBlockFile {
    fixSourceMapName() {
        if (this.context.useSourceMaps && this.sourceMap) {
            const jsonSourceMaps = JSON.parse(this.sourceMap);
            jsonSourceMaps.sources = jsonSourceMaps.sources.map(source => {
                const fileName = source.substr(source.lastIndexOf('/') + 1);
                const dirPath = this.relativePath.substr(0, this.relativePath.lastIndexOf('/') + 1);
                return `${ dirPath }${ fileName }`;
            });
            this.sourceMap = JSON.stringify(jsonSourceMaps);
        }
    }
    async applyScopeIdToStyles(scopeId) {
        const postcss = _bca95ef7.s('postcss');
        const plugins = [
            PostCSSPlugins_1.TrimPlugin(),
            PostCSSPlugins_1.AddScopeIdPlugin({ id: scopeId })
        ];
        return postcss(plugins).process(this.contents, { map: false }).then(result => {
            this.contents = result.css;
        });
    }
    async process() {
        this.loadContents();
        if (!this.contents) {
            return Promise.resolve();
        }
        const pluginChainString = this.pluginChain.map(plugin => plugin.constructor.name).join(' \u2192 ');
        this.context.debug('VueComponentClass', `using ${ pluginChainString } for ${ this.info.fuseBoxPath }`);
        return this.pluginChain.reduce((chain, plugin) => {
            return chain.then(() => {
                if (plugin instanceof CSSplugin_1.CSSPluginClass && this.block.scoped) {
                    return this.applyScopeIdToStyles(this.scopeId);
                }
                return Promise.resolve();
            }).then(() => {
                const promise = plugin.transform(this);
                return promise || Promise.resolve();
            });
        }, Promise.resolve(this)).then(() => {
            this.fixSourceMapName();
            return Promise.resolve();
        });
    }
}
exports.VueStyleFile = VueStyleFile;
}
// default/plugins/vue/PostCSSPlugins.js
_bca95ef7.f[93] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const postcss = _bca95ef7.s('postcss');
exports.AddScopeIdPlugin = postcss.plugin('add-scope-id', function (opts) {
    const selectorParser = _bca95ef7.s('postcss-selector-parser');
    return function (root) {
        const keyframes = Object.create(null);
        root.each(function rewriteSelector(node) {
            if (!node.selector) {
                if (node.type === 'atrule') {
                    if (node.name === 'media' || node.name === 'supports') {
                        node.each(rewriteSelector);
                    } else if (/-?keyframes$/.test(node.name)) {
                        keyframes[node.params] = node.params = node.params + '-' + opts.id;
                    }
                }
                return;
            }
            node.selector = selectorParser(function (selectors) {
                selectors.each(function (selector) {
                    let node = null;
                    selector.each(function (n) {
                        if (n.type === 'combinator' && n.value === '>>>') {
                            n.value = ' ';
                            n.spaces.before = n.spaces.after = '';
                            return false;
                        }
                        if (n.type === 'tag' && n.value === '/deep/') {
                            let next = n.next();
                            if (next.type === 'combinator' && next.value === ' ') {
                                next.remove();
                            }
                            n.remove();
                            return false;
                        }
                        if (n.type !== 'pseudo' && n.type !== 'combinator') {
                            node = n;
                        }
                    });
                    selector.insertAfter(node, selectorParser.attribute({ attribute: opts.id }));
                });
            }).process(node.selector).result;
        });
        if (Object.keys(keyframes).length) {
            root.walkDecls(decl => {
                if (/-?animation-name$/.test(decl.prop)) {
                    decl.value = decl.value.split(',').map(v => keyframes[v.trim()] || v.trim()).join(',');
                }
                if (/-?animation$/.test(decl.prop)) {
                    decl.value = decl.value.split(',').map(v => {
                        const vals = v.split(/\s+/);
                        const name = vals[0];
                        if (keyframes[name]) {
                            return [keyframes[name]].concat(vals.slice(1)).join(' ');
                        } else {
                            return v;
                        }
                    }).join(',');
                }
            });
        }
    };
});
exports.TrimPlugin = postcss.plugin('trim', function (opts) {
    return function (css) {
        css.walk(function (node) {
            if (node.type === 'rule' || node.type === 'atrule') {
                node.raws.before = node.raws.after = '\n';
            }
        });
    };
});
}
// default/plugins/vue/VueScriptFile.js
_bca95ef7.f[94] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const VueBlockFile_1 = _bca95ef7.r(84);
class VueScriptFile extends VueBlockFile_1.VueBlockFile {
    async process() {
        const typescriptTranspiler = _bca95ef7.s('typescript');
        this.loadContents();
        if (this.pluginChain.length > 1) {
            const message = 'VueComponentClass - only one script transpiler can be used in the plugin chain';
            this.context.log.echoError(message);
            return Promise.reject(new Error(message));
        }
        if (this.pluginChain[0] === null) {
            const transpiled = typescriptTranspiler.transpileModule(this.contents.trim(), this.context.tsConfig.getConfig());
            if (this.context.useSourceMaps && transpiled.sourceMapText) {
                const jsonSourceMaps = JSON.parse(transpiled.sourceMapText);
                jsonSourceMaps.sources = [this.context.sourceMapsRoot + '/' + this.relativePath.replace(/\.js(x?)$/, '.ts$1')];
                this.sourceMap = JSON.stringify(jsonSourceMaps);
            }
            this.contents = transpiled.outputText;
            this.context.debug('VueComponentClass', `using TypeScript for ${ this.info.fuseBoxPath }`);
            return Promise.resolve();
        }
        this.pluginChain[0].init(this.context);
        this.collection = { name: 'default' };
        return this.pluginChain[0].transform(this);
    }
}
exports.VueScriptFile = VueScriptFile;
}
// default/plugins/images/ImageBase64Plugin.js
_bca95ef7.f[95] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const path = _bca95ef7.s('path');
const SVG2Base64_1 = _bca95ef7.r(96);
const base64Img = _bca95ef7.s('base64-img');
class ImageBase64PluginClass {
    constructor(opts) {
        this.test = /\.(gif|png|jpg|jpeg|svg)$/i;
        this.opts = opts || {};
    }
    init(context) {
        context.allowExtension('.gif');
        context.allowExtension('.png');
        context.allowExtension('.jpg');
        context.allowExtension('.jpeg');
        context.allowExtension('.svg');
    }
    transform(file) {
        const context = file.context;
        const cached = context.cache.getStaticCache(file);
        if (cached) {
            file.isLoaded = true;
            file.contents = cached.contents;
        } else {
            let exportsKey = this.opts.useDefault ? 'module.exports.default' : 'module.exports';
            const ext = path.extname(file.absPath);
            if (ext === '.svg') {
                file.loadContents();
                let content = SVG2Base64_1.SVG2Base64.get(file.contents);
                file.contents = `${ exportsKey } = ${ JSON.stringify(content) }`;
                return;
            }
            file.isLoaded = true;
            const data = base64Img.base64Sync(file.absPath);
            file.contents = `${ exportsKey } = ${ JSON.stringify(data) }`;
            context.cache.writeStaticCache(file, undefined);
        }
    }
}
;
exports.ImageBase64Plugin = opts => {
    return new ImageBase64PluginClass(opts);
};
}
// default/lib/SVG2Base64.js
_bca95ef7.f[96] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class SVG2Base64 {
    static get(content) {
        content = content.replace(/"/g, '\'');
        content = content.replace(/\s+/g, ' ');
        content = content.replace(/[{}\|\\\^~\[\]`"<>#%]/g, match => {
            return '%' + match[0].charCodeAt(0).toString(16).toUpperCase();
        });
        return 'data:image/svg+xml;charset=utf8,' + content.trim();
    }
}
exports.SVG2Base64 = SVG2Base64;
}
// default/plugins/stylesheet/CSSResourcePlugin.js
_bca95ef7.f[97] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const Utils_1 = _bca95ef7.r(3);
const path = _bca95ef7.s('path');
const realm_utils_1 = _bca95ef7.s('realm-utils');
const fs = _bca95ef7.s('fs');
const PostCSSResourcePlugin_1 = _bca95ef7.r(98);
const SVG2Base64_1 = _bca95ef7.r(96);
const base64Img = _bca95ef7.s('base64-img');
const postcss = _bca95ef7.s('postcss');
const IMG_CACHE = {};
let resourceFolderChecked = false;
const copyFile = (source, target) => {
    return new Promise((resolve, reject) => {
        fs.exists(source, exists => {
            if (!exists) {
                return resolve();
            }
            let rd = fs.createReadStream(source);
            rd.on('error', err => {
                return reject(err);
            });
            let wr = fs.createWriteStream(target);
            wr.on('error', err => {
                return reject(err);
            });
            wr.on('close', ex => {
                return resolve();
            });
            rd.pipe(wr);
        });
    });
};
const generateNewFileName = str => {
    let s = str.split('node_modules');
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
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    let fname = hash.toString() + ext;
    if (fname.charAt(0) === '-') {
        fname = '_' + fname.slice(1);
    }
    return fname;
};
class CSSResourcePluginClass {
    constructor(opts = {}) {
        this.test = /\.css$/;
        this.resolveFn = p => path.join('/css-resources', p);
        if (opts.dist) {
            this.distFolder = Utils_1.ensureDir(opts.dist);
        }
        if (opts.inline) {
            this.inlineImages = opts.inline;
        }
        if (opts.macros) {
            this.macros = opts.macros;
        }
        if (realm_utils_1.utils.isFunction(opts.resolve)) {
            this.resolveFn = opts.resolve;
        }
        if (realm_utils_1.utils.isFunction(opts.resolveMissing)) {
            this.resolveMissingFn = opts.resolveMissing;
        }
    }
    init(context) {
        context.allowExtension('.css');
    }
    createResouceFolder(file) {
        if (resourceFolderChecked === false) {
            resourceFolderChecked = true;
            if (this.distFolder) {
                return;
            }
            this.distFolder = Utils_1.ensureDir(path.join(file.context.output.dir, 'css-resources'));
        }
    }
    transform(file) {
        file.addStringDependency('fuse-box-css');
        file.loadContents();
        let contents = file.contents;
        if (this.distFolder) {
            this.createResouceFolder(file);
        }
        const currentFolder = file.info.absDir;
        const files = {};
        const tasks = [];
        return postcss([PostCSSResourcePlugin_1.PostCSSResourcePlugin({
                fn: url => {
                    if (this.macros) {
                        for (let key in this.macros) {
                            url = url.replace('$' + key, this.macros[key]);
                        }
                    }
                    let urlFile = path.isAbsolute(url) ? url : path.resolve(currentFolder, url);
                    urlFile = urlFile.replace(/[?\#].*$/, '');
                    if (file.context.extensionOverrides && file.belongsToProject()) {
                        urlFile = file.context.extensionOverrides.getPathOverride(urlFile) || urlFile;
                    }
                    if (this.inlineImages) {
                        if (IMG_CACHE[urlFile]) {
                            return IMG_CACHE[urlFile];
                        }
                        if (!fs.existsSync(urlFile)) {
                            if (this.resolveMissingFn) {
                                urlFile = this.resolveMissingFn(urlFile, this);
                                if (!urlFile || !fs.existsSync(urlFile)) {
                                    file.context.debug('CSSResourcePlugin', `Can't find (resolved) file ${ urlFile }`);
                                    return;
                                }
                            } else {
                                file.context.debug('CSSResourcePlugin', `Can't find file ${ urlFile }`);
                                return;
                            }
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
                            return `data:${ fontsExtensions[ext] };charset=utf-8;base64,${ content }`;
                        }
                        if (ext === '.svg') {
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
                }
            })]).process(contents).then(result => {
            file.contents = result.css;
            return Promise.all(tasks);
        });
    }
}
exports.CSSResourcePlugin = options => {
    return new CSSResourcePluginClass(options);
};
}
// default/lib/postcss/PostCSSResourcePlugin.js
_bca95ef7.f[98] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const postcss = _bca95ef7.s('postcss');
const extractValue = input => {
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
exports.PostCSSResourcePlugin = postcss.plugin('css-resource', function (opts) {
    opts = opts || {};
    return (css, result) => {
        css.walkDecls(declaration => {
            if (declaration.prop) {
                if (declaration.prop.indexOf('background') === 0 || declaration.prop.indexOf('src') === 0 || declaration.prop.indexOf('mask-image') > -1) {
                    let re = /url\(([^\)]+)\)/gm;
                    let match;
                    const v = declaration.value;
                    while (match = re.exec(v)) {
                        const value = match[1];
                        const url = extractValue(value);
                        if (typeof opts.fn === 'function' && url) {
                            const result = opts.fn(url);
                            if (typeof result === 'string') {
                                declaration.value = declaration.value.replace(match[0], `url("${ result }")`);
                            }
                        }
                    }
                }
            }
        });
    };
});
}
// default/plugins/EnvPlugin.js
_bca95ef7.f[99] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class EnvPluginClass {
    constructor(env) {
        this.env = env;
    }
    bundleStart(context) {
        const producer = context.bundle.producer;
        if (producer) {
            producer.addUserProcessEnvVariables(this.env);
        }
        context.source.addContent(`var __process_env__ = ${ JSON.stringify(this.env) };`);
    }
}
exports.EnvPlugin = options => {
    return new EnvPluginClass(options);
};
}
// default/plugins/ConcatPlugin.js
_bca95ef7.f[100] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class ConcatPluginClass {
    constructor(opts = {}) {
        this.delimiter = '\n';
        this.test = /\.txt$/;
        if (opts.ext) {
            this.ext = opts.ext;
        }
        if (opts.name) {
            this.bundleName = opts.name;
        }
        if (opts.delimiter) {
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
        file.alternativeContent = `module.exports = require("./${ this.bundleName }")`;
    }
    transformGroup(group) {
        let contents = [];
        group.subFiles.forEach(file => {
            contents.push(file.contents);
        });
        let text = contents.join(this.delimiter);
        group.contents = `module.exports = ${ JSON.stringify(text) }`;
    }
}
;
exports.ConcatPlugin = options => {
    return new ConcatPluginClass(options);
};
}
// default/plugins/stylesheet/PostCSSPlugin.js
_bca95ef7.f[101] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
let postcss;
class PostCSSPluginClass {
    constructor(processors = [], options = {}) {
        this.processors = processors;
        this.options = options;
        this.test = /\.css$/;
        this.dependencies = [];
    }
    init(context) {
        context.allowExtension('.css');
    }
    transform(file) {
        file.addStringDependency('fuse-box-css');
        if (file.isCSSCached('postcss')) {
            return;
        }
        file.bustCSSCache = true;
        file.loadContents();
        const {
            sourceMaps = true,
            paths = [],
            ...postCssOptions
        } = this.options;
        paths.push(file.info.absDir);
        const cssDependencies = file.context.extractCSSDependencies(file, {
            paths: paths,
            content: file.contents,
            extensions: ['css']
        });
        file.cssDependencies = cssDependencies;
        if (!postcss) {
            postcss = _bca95ef7.s('postcss');
        }
        return postcss(this.processors).process(file.contents, postCssOptions).then(result => {
            file.contents = result.css;
            if (file.context.useCache) {
                file.analysis.dependencies = cssDependencies;
                file.context.cache.writeStaticCache(file, sourceMaps && file.sourceMap, 'postcss');
                file.analysis.dependencies = [];
            }
            return result.css;
        });
    }
}
function PostCSS(processors, opts) {
    if (Array.isArray(processors)) {
        const options = extractPlugins(opts);
        return new PostCSSPluginClass(processors.concat(options.plugins), options.postCssOptions);
    }
    const options = extractPlugins(processors);
    return new PostCSSPluginClass(options.plugins, options.postCssOptions);
}
exports.PostCSS = PostCSS;
function extractPlugins(opts) {
    const {
        plugins = [],
        ...otherOptions
    } = opts || {};
    if (plugins.length > 0) {
        console.warn(`The postcss "plugin" option is deprecated. Please use PostCssPlugin(plugins, options) instead.`);
    }
    return {
        plugins,
        postCssOptions: otherOptions
    };
}
}
// default/plugins/TypeScriptHelpers.js
_bca95ef7.f[102] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const Config_1 = _bca95ef7.r(2);
const fs = _bca95ef7.s('fs');
const path = _bca95ef7.s('path');
class TypeScriptHelpersClass {
    constructor(opts = {}) {
        this.test = /\.tsx?$/;
        this.registeredHelpers = new Map();
        let folder = path.join(Config_1.Config.FUSEBOX_MODULES, 'fuse-typescript-helpers');
        let files = fs.readdirSync(folder);
        files.forEach(fileName => {
            let contents = fs.readFileSync(path.join(folder, fileName)).toString();
            let name = fileName.replace(/\.js/, '');
            this.registeredHelpers.set(name, contents);
        });
    }
    init(context) {
        context.setItem('ts_helpers', new Set());
    }
    bundleEnd(context) {
        let helpers = context.getItem('ts_helpers');
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
        let helpers = file.context.getItem('ts_helpers');
        this.registeredHelpers.forEach((cont, name) => {
            let regexp = new RegExp(name, 'gm');
            if (regexp.test(file.contents)) {
                if (name === '__decorate') {
                    patchDecorate = true;
                    if (file.headerContent && file.headerContent.indexOf('var __decorate = __fsbx_decorate(arguments)') === 0) {
                        patchDecorate = false;
                    }
                }
                if (!helpers.has(name)) {
                    helpers.add(name);
                }
            }
        });
        if (patchDecorate) {
            file.addHeaderContent('var __decorate = __fsbx_decorate(arguments)');
        }
    }
}
exports.TypeScriptHelpers = options => {
    return new TypeScriptHelpersClass(options);
};
}
// default/plugins/images/SVGPlugin.js
_bca95ef7.f[103] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class SVGSimplePlugin {
    constructor() {
        this.test = /\.svg$/;
    }
    init(context) {
        context.allowExtension('.svg');
    }
    transform(file) {
        file.loadContents();
        let content = file.contents;
        content = content.replace(/"/g, '\'');
        content = content.replace(/\s+/g, ' ');
        content = content.replace(/[{}\|\\\^~\[\]`"<>#%]/g, match => {
            return '%' + match[0].charCodeAt(0).toString(16).toUpperCase();
        });
        let data = 'data:image/svg+xml;charset=utf8,' + content.trim();
        file.contents = `module.exports = ${ JSON.stringify(data) }`;
    }
}
;
exports.SVGPlugin = () => {
    return new SVGSimplePlugin();
};
}
// default/plugins/js-transpilers/BublePlugin.js
_bca95ef7.f[104] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
let bubleCore;
class BublePluginClass {
    constructor(config) {
        this.test = /\.(j|t)s(x)?$/;
        this.config = {};
        this.configPrinted = false;
        this.config = config || {};
        if (config.test !== undefined) {
            this.test = config.test;
            delete config.test;
        }
    }
    init(context) {
        this.context = context;
        context.allowExtension('.jsx');
    }
    transform(file, ast) {
        if (!bubleCore) {
            bubleCore = _bca95ef7.s('buble');
        }
        if (this.configPrinted === false && this.context.doLog === true) {
            file.context.debug('BublePlugin', `\n\tConfiguration: ${ JSON.stringify(this.config) }`);
            this.configPrinted = true;
        }
        if (this.context.useCache) {
            if (file.loadFromCache()) {
                return;
            }
        }
        let result;
        try {
            const config = {
                ...this.config,
                output: file.info.fuseBoxPath,
                source: file.info.absPath
            };
            result = bubleCore.transform(file.contents, config);
        } catch (e) {
            file.analysis.skip();
            console.error(e);
            return;
        }
        if (result.ast) {
            file.analysis.loadAst(result.ast);
            let sourceMaps = result.map;
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
exports.BublePlugin = opts => {
    return new BublePluginClass(opts);
};
}
// default/plugins/Markdownplugin.js
_bca95ef7.f[105] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
let marked;
class FuseBoxMarkdownPlugin {
    constructor(opts = {}) {
        this.useDefault = true;
        this.options = {
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false
        };
        this.test = /\.md$/;
        if (opts.useDefault !== undefined) {
            this.useDefault = opts.useDefault;
        }
        this.options = Object.assign(this.options, opts);
    }
    init(context) {
        context.allowExtension('.md');
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
        if (!marked) {
            marked = _bca95ef7.s('marked');
        }
        if (this.options.renderer) {
            this.options.renderer = new marked.Renderer();
        }
        marked.setOptions(this.options);
        const html = marked(file.contents);
        if (this.useDefault) {
            file.contents = `module.exports.default =  ${ JSON.stringify(html) }`;
        } else {
            file.contents = `module.exports =  ${ JSON.stringify(html) }`;
        }
        if (context.useCache) {
            context.emitJavascriptHotReload(file);
            context.cache.writeStaticCache(file, file.sourceMap);
        }
    }
}
;
exports.MarkdownPlugin = options => {
    return new FuseBoxMarkdownPlugin(options);
};
}
// default/plugins/BannerPlugin.js
_bca95ef7.f[106] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class BannerPluginClass {
    constructor(banner) {
        this.test = /\.js$/;
        this.banner = banner || '';
    }
    preBundle(context) {
        context.source.addContent(this.banner);
    }
}
exports.BannerPlugin = banner => {
    return new BannerPluginClass(banner);
};
}
// default/plugins/UglifyESPlugin.js
_bca95ef7.f[107] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const BundleSource_1 = _bca95ef7.r(6);
class UglifyESPluginClass {
    constructor(options = {}) {
        this.options = options;
    }
    postBundle(context) {
        const mainOptions = {};
        const UglifyES = _bca95ef7.s('uglify-es');
        const concat = context.source.getResult();
        const source = concat.content.toString();
        const sourceMap = concat.sourceMap;
        const newSource = new BundleSource_1.BundleSource(context);
        context.source = newSource;
        const newConcat = context.source.getResult();
        if ('sourceMapConfig' in context) {
            if (context.sourceMapConfig.bundleReference) {
                mainOptions.inSourceMap = JSON.parse(sourceMap);
                mainOptions.outSourceMap = context.sourceMapConfig.bundleReference;
            }
        }
        let timeStart = process.hrtime();
        const result = UglifyES.minify(source, {
            ...this.options,
            ...mainOptions
        });
        let took = process.hrtime(timeStart);
        let bytes = Buffer.byteLength(result.code, 'utf8');
        context.log.echoBundleStats('Bundle (Uglified)', bytes, took);
        newConcat.add(null, result.code, result.map || sourceMap);
    }
}
exports.UglifyESPlugin = options => {
    return new UglifyESPluginClass(options);
};
}
// default/plugins/UglifyJSPlugin.js
_bca95ef7.f[108] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const BundleSource_1 = _bca95ef7.r(6);
class UglifyJSPluginClass {
    constructor(options = {}) {
        this.options = options;
    }
    postBundle(context) {
        const mainOptions = {};
        const UglifyJs = _bca95ef7.s('uglify-js');
        if (UglifyJs.mangle_properties !== undefined) {
            mainOptions.fromString = true;
        }
        const includeSourceMaps = context.source.includeSourceMaps;
        const concat = context.source.getResult();
        const source = concat.content.toString();
        const sourceMap = concat.sourceMap;
        const newSource = new BundleSource_1.BundleSource(context);
        newSource.includeSourceMaps = includeSourceMaps;
        context.source = newSource;
        const newConcat = context.source.getResult();
        if ('sourceMapConfig' in context) {
            if (context.sourceMapConfig.bundleReference) {
                mainOptions.inSourceMap = JSON.parse(sourceMap);
                mainOptions.outSourceMap = context.sourceMapConfig.bundleReference;
            }
        }
        if (includeSourceMaps) {
            mainOptions.inSourceMap = JSON.parse(sourceMap);
            mainOptions.outSourceMap = `${ context.output.filename }.js.map`;
        }
        let timeStart = process.hrtime();
        var opt = {
            ...this.options,
            ...mainOptions
        };
        const result = UglifyJs.minify(source, opt);
        if (result.error) {
            const message = `UglifyJSPlugin - ${ result.error.message }`;
            context.log.echoError(message);
            return Promise.reject(result.error);
        }
        let took = process.hrtime(timeStart);
        let bytes = Buffer.byteLength(result.code, 'utf8');
        context.log.echoBundleStats('Bundle (Uglified)', bytes, took);
        newConcat.add(null, result.code, result.map || sourceMap);
    }
}
exports.UglifyJSPlugin = options => {
    return new UglifyJSPluginClass(options);
};
}
// default/plugins/SourceMapPlainJsPlugin.js
_bca95ef7.f[109] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const acorn = _bca95ef7.s('acorn');
const SourceMap = _bca95ef7.s('source-map');
class SourceMapPlainJsPluginClass {
    constructor(options = {}) {
        this.test = /\.js$/;
        this.ext = '.js';
        if (options.test) {
            this.test = options.test;
        }
        if (options.ext) {
            this.ext = options.ext;
        }
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
            if (token.type.label === 'eof')
                return true;
            const lineInfo = acorn.getLineInfo(fileContent, token.start);
            const mapping = {
                original: lineInfo,
                generated: lineInfo,
                source: filePath,
                name: false
            };
            if (token.type.label === 'name')
                mapping.name = token.value;
            smGenerator.addMapping(mapping);
        });
        smGenerator.setSourceContent(filePath, fileContent);
        return JSON.stringify(smGenerator.toJSON());
    }
}
exports.SourceMapPlainJsPlugin = options => {
    return new SourceMapPlainJsPluginClass(options);
};
}
// default/plugins/RawPlugin.js
_bca95ef7.f[110] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const realm_utils_1 = _bca95ef7.s('realm-utils');
const Utils_1 = _bca95ef7.r(3);
class RawPluginClass {
    constructor(options = []) {
        this.test = /.*/;
        if (realm_utils_1.utils.isPlainObject(options)) {
            if ('extensions' in (options || {}))
                this.extensions = options.extensions;
        }
        if (realm_utils_1.utils.isArray(options)) {
            this.extensions = [];
            options.forEach(str => {
                this.extensions.push('.' + Utils_1.extractExtension(str));
            });
            this.test = Utils_1.string2RegExp(options.join('|'));
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
                file.sourceMap = undefined;
                file.contents = cached.contents;
                return;
            }
        }
        file.loadContents();
        file.sourceMap = undefined;
        file.contents = `module.exports = ${ JSON.stringify(file.contents) }`;
        if (context.useCache) {
            context.emitJavascriptHotReload(file);
            context.cache.writeStaticCache(file, file.sourceMap);
        }
    }
}
exports.RawPlugin = options => {
    return new RawPluginClass(options);
};
}
// default/plugins/OptimizeJSPlugin.js
_bca95ef7.f[111] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class OptimizeJSClass {
    constructor(opts) {
        this.test = /\.(j|t)s(x)?$/;
        this.opts = null;
        if (opts !== null)
            this.opts = opts;
    }
    static init(config) {
        return new OptimizeJSClass(config);
    }
    init(context) {
        this.context = context;
    }
    transform(file, ast) {
        const optimizeJs = _bca95ef7.s('optimize-js');
        let output;
        try {
            output = optimizeJs(file.contents, this.opts);
            if (this.context.doLog === true) {
                file.context.debug('OptimizeJSPlugin', `\n\tOptimized: ${ JSON.stringify(this.opts) }`);
            }
            file.contents = output;
        } catch (error) {
            this.context.log.echoWarning('error in OptimizeJSPlugin');
        }
        file.analysis.analyze();
    }
}
;
exports.OptimizeJSPlugin = OptimizeJSClass.init;
}
// default/sparky/Sparky.js
_bca95ef7.f[112] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const SparkTask_1 = _bca95ef7.r(113);
const SparkFlow_1 = _bca95ef7.r(114);
const realm_utils_1 = _bca95ef7.s('realm-utils');
const WorkflowContext_1 = _bca95ef7.r(5);
const Log_1 = _bca95ef7.r(4);
const context = new WorkflowContext_1.WorkFlowContext();
context.doLog = process.env.SPARKY_LOG !== 'false';
exports.log = new Log_1.Log(context);
class Sparky {
    static flush() {
        this.tasks = new Map();
    }
    static task(name, ...args) {
        let callback;
        let dependencies = [];
        if (arguments.length === 2) {
            callback = arguments[1];
        }
        if (arguments.length === 3) {
            dependencies = [].concat(arguments[1]);
            callback = arguments[2];
        }
        this.tasks.set(name, new SparkTask_1.SparkTask(name, dependencies, callback));
        if (this.launch === false && this.testMode === false) {
            this.launch = true;
            process.nextTick(() => this.start());
        }
        return this;
    }
    static src(glob, opts) {
        const flow = new SparkFlow_1.SparkFlow();
        let globs = Array.isArray(glob) ? glob : [glob];
        return flow.glob(globs, opts);
    }
    static watch(glob, opts) {
        const flow = new SparkFlow_1.SparkFlow();
        let globs = Array.isArray(glob) ? glob : [glob];
        return flow.watch(globs, opts);
    }
    static start(tname) {
        const taskName = tname || process.argv[2] || 'default';
        if (!this.tasks.get(taskName)) {
            exports.log.echoWarning(`Task with such name ${ taskName } was not found!`);
            return Promise.reject('Task not found');
        }
        const task = this.tasks.get(taskName);
        exports.log.echoHeader(`Launch "${ taskName }"`);
        return Promise.all([
            Promise.all(task.parallelDependencies.map(name => this.resolve(name))),
            realm_utils_1.each(task.waterfallDependencies, name => this.resolve(name))
        ]).then(() => {
            return this.execute(task.fn());
        });
    }
    static execute(result) {
        if (result instanceof SparkFlow_1.SparkFlow) {
            return result.exec();
        }
        return result;
    }
    static resolve(name) {
        if (!this.tasks.get(name)) {
            return exports.log.echoWarning(`Task with such name ${ name } was not found!`);
        }
        exports.log.echoHeader(` Resolve "${ name }"`);
        return this.start(name);
    }
}
Sparky.launch = false;
Sparky.testMode = false;
Sparky.tasks = new Map();
exports.Sparky = Sparky;
}
// default/sparky/SparkTask.js
_bca95ef7.f[113] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class SparkTask {
    constructor(name, dependencies, fn) {
        this.name = name;
        this.fn = fn;
        this.parallelDependencies = [];
        this.waterfallDependencies = [];
        dependencies.forEach(dependency => {
            if (dependency.charAt(0) === '&') {
                dependency = dependency.slice(1);
                this.parallelDependencies.push(dependency);
            } else {
                this.waterfallDependencies.push(dependency);
            }
        });
    }
}
exports.SparkTask = SparkTask;
}
// default/sparky/SparkFlow.js
_bca95ef7.f[114] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const glob = _bca95ef7.s('glob');
const fs = _bca95ef7.s('fs-extra');
const chokidar = _bca95ef7.s('chokidar');
const realm_utils_1 = _bca95ef7.s('realm-utils');
const Utils_1 = _bca95ef7.r(3);
const SparkyFile_1 = _bca95ef7.r(115);
const Sparky_1 = _bca95ef7.r(112);
const SparkyFilePattern_1 = _bca95ef7.r(116);
class SparkFlow {
    constructor() {
        this.activities = [];
        this.initialWatch = false;
    }
    glob(globs, opts) {
        this.activities.push(() => this.getFiles(globs, opts));
        return this;
    }
    stopWatching() {
        if (this.watcher) {
            this.watcher.close();
        }
    }
    watch(globs, opts) {
        this.files = [];
        Sparky_1.log.echoStatus(`Watch ${ globs }`);
        this.activities.push(() => new Promise((resolve, reject) => {
            var chokidarOptions = { cwd: opts ? opts.base : null };
            this.watcher = chokidar.watch(globs, chokidarOptions).on('all', (event, fp) => {
                if (event === 'addDir' || event === 'unlinkDir')
                    return;
                if (this.initialWatch) {
                    this.files = [];
                    Sparky_1.log.echoStatus(`Changed ${ fp }`);
                }
                let info = SparkyFilePattern_1.parse(fp, opts);
                this.files.push(new SparkyFile_1.SparkyFile(info.filepath, info.root));
                if (this.initialWatch) {
                    this.exec();
                }
            }).on('ready', () => {
                this.initialWatch = true;
                Sparky_1.log.echoStatus(`Resolved ${ this.files.length } files`);
                this.activities[0] = undefined;
                resolve();
            });
        }));
        return this;
    }
    completed(fn) {
        this.completedCallback = fn;
        return this;
    }
    getFiles(globs, opts) {
        this.files = [];
        const getFilePromises = [];
        globs.forEach(g => {
            getFilePromises.push(this.getFile(g, opts));
        });
        return Promise.all(getFilePromises).then(results => {
            this.files = [].concat.apply([], results);
            return this.files;
        });
    }
    getFile(globString, opts) {
        let info = SparkyFilePattern_1.parse(globString, opts);
        return new Promise((resolve, reject) => {
            if (!info.isGlob) {
                return resolve([new SparkyFile_1.SparkyFile(info.filepath, info.root)]);
            }
            glob(info.glob, (err, files) => {
                if (err) {
                    return reject(err);
                }
                return resolve(files.map(file => new SparkyFile_1.SparkyFile(file, info.root)));
            });
        });
    }
    clean(dest) {
        this.activities.push(() => new Promise((resolve, reject) => {
            fs.remove(Utils_1.ensureDir(dest), err => {
                if (err)
                    return reject(err);
                return resolve();
            });
        }));
        return this;
    }
    plugin(plugin) {
        this.activities.push(() => {
        });
        return this;
    }
    file(mask, fn) {
        this.activities.push(() => {
            let regexp = Utils_1.string2RegExp(mask);
            return realm_utils_1.each(this.files, file => {
                if (regexp.test(file.filepath)) {
                    Sparky_1.log.echoStatus(`Captured file ${ file.homePath }`);
                    return fn(file);
                }
            });
        });
        return this;
    }
    dest(dest) {
        Sparky_1.log.echoStatus(`Copy to ${ dest }`);
        this.activities.push(() => Promise.all(this.files.map(file => file.copy(dest))));
        return this;
    }
    exec() {
        return realm_utils_1.each(this.activities, activity => activity && activity()).then(() => {
            if (this.completedCallback) {
                this.completedCallback(this.files);
            }
            this.files = [];
        });
    }
}
exports.SparkFlow = SparkFlow;
}
// default/sparky/SparkyFile.js
_bca95ef7.f[115] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const fs = _bca95ef7.s('fs-extra');
const path = _bca95ef7.s('path');
const Mustache = _bca95ef7.s('mustache');
const Utils_1 = _bca95ef7.r(3);
const Config_1 = _bca95ef7.r(2);
class SparkyFile {
    constructor(filepath, root) {
        this.savingRequired = false;
        this.filepath = path.normalize(filepath);
        this.root = path.normalize(root);
        let hp = path.relative(this.root, this.filepath);
        this.homePath = path.isAbsolute(hp) ? hp.slice(1) : hp;
        this.name = path.basename(this.filepath);
    }
    read() {
        this.contents = fs.readFileSync(this.filepath);
        return this;
    }
    write(contents) {
        this.contents = contents;
        fs.writeFileSync(this.filepath, contents);
        return this;
    }
    template(obj) {
        if (!this.contents) {
            this.read();
        }
        this.contents = Mustache.render(this.contents.toString(), obj);
        this.savingRequired = true;
    }
    save() {
        this.savingRequired = false;
        if (this.contents) {
            let contents = this.contents;
            if (typeof this.contents === 'object') {
                this.contents = JSON.stringify(contents, null, 2);
            }
            fs.writeFileSync(this.filepath, this.contents);
        }
        return this;
    }
    ext(ext) {
        this.extension = ext;
        return this;
    }
    json(fn) {
        if (!this.contents) {
            this.read();
        }
        if (typeof fn === 'function') {
            let contents = this.contents.toString() ? JSON.parse(this.contents.toString()) : {};
            const response = fn(contents);
            this.contents = response ? response : contents;
            this.savingRequired = true;
        }
        return this;
    }
    plugin(plugin) {
        if (!this.contents) {
            this.read();
        }
    }
    setContent(cnt) {
        this.contents = cnt;
        this.savingRequired = true;
        return this;
    }
    copy(dest) {
        return new Promise((resolve, reject) => {
            const isTemplate = dest.indexOf('$') > -1;
            if (isTemplate) {
                if (!path.isAbsolute(dest)) {
                    dest = path.join(Config_1.Config.PROJECT_ROOT, dest);
                }
                dest = dest.replace('$name', this.name).replace('$path', this.filepath);
            } else {
                dest = path.join(dest, this.homePath);
                dest = Utils_1.ensureUserPath(dest);
            }
            if (this.extension) {
                dest = Utils_1.replaceExt(dest, '.' + this.extension);
                delete this.extension;
            }
            fs.copy(this.filepath, dest, err => {
                if (err)
                    return reject(err);
                this.filepath = dest;
                if (this.savingRequired) {
                    this.save();
                }
                return resolve();
            });
        });
    }
}
exports.SparkyFile = SparkyFile;
}
// default/sparky/SparkyFilePattern.js
_bca95ef7.f[116] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const path = _bca95ef7.s('path');
const Config_1 = _bca95ef7.r(2);
function parse(str, opts) {
    const base = opts ? opts.base || '' : '';
    const isGlob = /[*{}}]/.test(str);
    const isAbsolutePath = path.isAbsolute(str);
    let root, filepath, glob;
    if (!isGlob) {
        root = isAbsolutePath ? path.dirname(str) : path.join(Config_1.Config.PROJECT_ROOT, base);
        filepath = isAbsolutePath ? path.normalize(str) : path.join(Config_1.Config.PROJECT_ROOT, base, str);
    } else {
        if (isAbsolutePath) {
            root = path.normalize(str.split('*')[0]);
            glob = path.normalize(str);
        } else {
            glob = path.join(Config_1.Config.PROJECT_ROOT, base, str);
            root = path.join(Config_1.Config.PROJECT_ROOT, base);
        }
    }
    return {
        isGlob: isGlob,
        root: root,
        glob: glob,
        filepath: filepath
    };
}
exports.parse = parse;
}
// default/cli/Cli.js
_bca95ef7.f[117] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const yargs = _bca95ef7.s('yargs');
const Sparky_1 = _bca95ef7.r(112);
;
;
class FuseBoxCLI {
    constructor(settings = {}) {
        this._tasks = {};
        this.optionValues = {};
        if (FuseBoxCLI.initialized) {
            throw new Error('CLI was already initialized! Use .shutdown() first');
        }
        FuseBoxCLI.initialized = true;
        this.initYargs();
        this.initTaskRegisterer();
        this.initRunners();
        this.addOptions(settings.options);
        this.addTaskDescriptions(settings.taskDescriptions);
    }
    addOption(name, option) {
        option['global'] = false;
        this.optionValues[name] = yargs.option(name, option).argv[name];
        return this;
    }
    addOptions(options = {}) {
        Object.keys(options).forEach(name => {
            this.addOption(name, options[name]);
        });
        return this;
    }
    addTaskDescription(name, desc) {
        this._tasks[name] = {
            active: false,
            ...this._tasks[name],
            name,
            desc
        };
        return this;
    }
    addTaskDescriptions(descriptions = {}) {
        Object.keys(descriptions).forEach(name => {
            this.addTaskDescription(name, descriptions[name]);
        });
        return this;
    }
    addTask(name) {
        this._tasks[name] = {
            ...this._tasks[name],
            name,
            active: true
        };
        return this;
    }
    showHelp(exitProcess = false) {
        yargs.getUsageInstance().getCommands().splice(0);
        Object.keys(this._tasks).forEach(name => {
            const task = this._tasks[name];
            if (!task.active)
                return;
            let taskName = task.name;
            let taskDesc = task.desc || '';
            if (task.name === 'default') {
                taskName = '\b\b* default\0\0';
                taskDesc = taskDesc || 'The default task';
            }
            yargs.command(taskName + '\0', '\b' + taskDesc);
        });
        yargs.showHelp('log');
        if (exitProcess)
            process.exit(0);
        return this;
    }
    run() {
        if (!yargs.argv.help)
            return;
        this.shutDown();
        this.showHelp(true);
        return this;
    }
    parse(argv = process.argv) {
        yargs.parse(argv);
        Object.keys(this.optionValues).forEach(name => {
            this.optionValues[name] = yargs.argv[name];
        });
        return this;
    }
    shutDown() {
        FuseBoxCLI.initialized = false;
        Sparky_1.Sparky.start = Sparky_1.Sparky['$start'] || Sparky_1.Sparky.start;
        Sparky_1.Sparky.task = Sparky_1.Sparky['$task'] || Sparky_1.Sparky.task;
        delete Sparky_1.Sparky['$start'];
        delete Sparky_1.Sparky['$task'];
        process.removeAllListeners('exit');
        return this;
    }
    initYargs() {
        yargs.reset().usage('Usage: $0 <task> [options]').updateStrings({ 'Commands:': 'Tasks:' }).help(false).version(false).option('help', {
            alias: 'h',
            desc: 'Show help',
            type: 'boolean',
            global: false
        });
    }
    initRunners() {
        const self = this;
        process.on('exit', () => this.run());
        Sparky_1.Sparky['$start'] = Sparky_1.Sparky.start;
        Sparky_1.Sparky.start = function () {
            self.run();
            return Sparky_1.Sparky['$start'].apply(this, arguments);
        };
    }
    initTaskRegisterer() {
        const self = this;
        Sparky_1.Sparky['$task'] = Sparky_1.Sparky.task;
        Sparky_1.Sparky.task = function (name) {
            self.addTask(name);
            return Sparky_1.Sparky['$task'].apply(this, arguments);
        };
    }
    get tasks() {
        return this._tasks;
    }
    get options() {
        return this.optionValues;
    }
    get $yargs() {
        return yargs;
    }
}
FuseBoxCLI.initialized = false;
function CLI(settings) {
    return new FuseBoxCLI(settings);
}
exports.CLI = CLI;
}
// default/plugins/stylesheet/CSSModules.js
_bca95ef7.f[118] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const postcss = _bca95ef7.s('postcss');
class CSSModulesClass {
    constructor(options = {}) {
        this.test = /\.css$/;
        this.useDefault = true;
        this.options = options;
        if (this.options.useDefault !== undefined) {
            this.useDefault = this.options.useDefault;
        }
    }
    init(context) {
        context.allowExtension('.css');
    }
    transform(file) {
        file.addStringDependency('fuse-box-css');
        return new Promise((resolve, reject) => {
            file.loadContents();
            return postcss([_bca95ef7.s('postcss-modules')({
                    root: file.info.absDir,
                    getJSON: (cssFileName, json) => {
                        let exportsKey = this.useDefault ? 'module.exports.default' : 'module.exports';
                        const cnt = [];
                        if (this.useDefault) {
                            cnt.push(`Object.defineProperty(exports, "__esModule", { value: true });`);
                        }
                        cnt.push(`${ exportsKey } = ${ JSON.stringify(json) };`);
                        file.addAlternativeContent(cnt.join('\n'));
                    }
                })]).process(file.contents, {}).then(result => {
                file.contents = result.css;
                return resolve();
            });
        });
    }
}
exports.CSSModules = options => {
    return new CSSModulesClass(options);
};
}
// default/plugins/CopyPlugin.js
_bca95ef7.f[119] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const realm_utils_1 = _bca95ef7.s('realm-utils');
const Utils_1 = _bca95ef7.r(3);
const fs = _bca95ef7.s('fs-extra');
const path = _bca95ef7.s('path');
class CopyPluginClass {
    constructor(options = {}) {
        this.options = options;
        this.test = /.*/;
        this.useDefault = true;
        this.resolve = '/assets/';
        this.dest = 'assets';
        options = options || {};
        if (options.useDefault !== undefined) {
            this.useDefault = options.useDefault;
        }
        if (options.resolve !== undefined) {
            this.resolve = options.resolve;
        }
        if (options.dest !== undefined) {
            this.dest = options.dest;
        }
        if (realm_utils_1.utils.isArray(options.files)) {
            this.extensions = [];
            options.files.forEach(str => {
                this.extensions.push('.' + Utils_1.extractExtension(str));
            });
            this.test = Utils_1.string2RegExp(options.files.join('|'));
        }
    }
    init(context) {
        if (Array.isArray(this.extensions)) {
            return this.extensions.forEach(ext => context.allowExtension(ext));
        }
    }
    transform(file) {
        const context = file.context;
        file.isLoaded = true;
        let userFile = (!context.hash ? Utils_1.hashString(file.info.fuseBoxPath) + '-' : '') + path.basename(file.info.fuseBoxPath);
        let userPath = path.join(this.dest, userFile);
        let exportsKey = this.useDefault ? 'module.exports.default' : 'module.exports';
        file.alternativeContent = `${ exportsKey } = "${ Utils_1.joinFuseBoxPath(this.resolve, userFile) }";`;
        if (fs.existsSync(userPath)) {
            return;
        }
        return new Promise((resolve, reject) => {
            fs.readFile(file.absPath, (err, data) => {
                if (err) {
                    return reject();
                }
                return context.output.writeToOutputFolder(userPath, data, true).then(result => {
                    if (result.hash) {
                        file.alternativeContent = `${ exportsKey } = "${ Utils_1.joinFuseBoxPath(this.resolve, result.filename) }";`;
                    }
                    return resolve();
                }).catch(reject);
            });
        });
    }
}
exports.CopyPlugin = options => {
    return new CopyPluginClass(options);
};
}
// default/plugins/WebIndexPlugin.js
_bca95ef7.f[120] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const fs = _bca95ef7.s('fs');
const Utils_1 = _bca95ef7.r(3);
class WebIndexPluginClass {
    constructor(opts) {
        this.opts = opts;
    }
    producerEnd(producer) {
        let bundlePaths = [];
        let bundles = producer.sortBundles();
        bundles.forEach(bundle => {
            let pass = true;
            if (this.opts.bundles) {
                if (this.opts.bundles.indexOf(bundle.name) === -1) {
                    pass = false;
                }
            }
            pass = pass && bundle.webIndexed;
            if (pass) {
                const output = bundle.context.output;
                if (output && output.lastPrimaryOutput) {
                    if (this.opts.resolve) {
                        bundlePaths.push(this.opts.resolve(output));
                    } else {
                        bundlePaths.push(Utils_1.joinFuseBoxPath(this.opts.path ? this.opts.path : '/', output.folderFromBundleName || '/', output.lastPrimaryOutput.filename));
                    }
                }
            }
        });
        let html = this.opts.templateString || `<!DOCTYPE html>
<html>
<head>
    <title>$title</title>
    $charset
    $description
    $keywords
    $author
</head>
<body>
    $bundles
</body>
</html>`;
        if (this.opts.template) {
            let filePath = Utils_1.ensureAbsolutePath(this.opts.template);
            html = fs.readFileSync(filePath).toString();
        }
        let jsTags = bundlePaths.map(bundle => `<script ${ this.opts.async ? 'async' : '' } type="text/javascript" src="${ bundle }"></script>`).join('\n');
        let macro = {
            title: this.opts.title ? this.opts.title : '',
            charset: this.opts.charset ? `<meta charset="${ this.opts.charset }">` : '',
            description: this.opts.description ? `<meta name="description" content="${ this.opts.description }">` : '',
            keywords: this.opts.keywords ? `<meta name="keywords" content="${ this.opts.keywords }">` : '',
            author: this.opts.author ? `<meta name="author" content="${ this.opts.author }">` : '',
            bundles: jsTags
        };
        for (let key in macro) {
            html = html.replace('$' + key, macro[key]);
        }
        producer.fuse.context.output.writeToOutputFolder(this.opts.target || 'index.html', html);
    }
}
;
exports.WebIndexPlugin = opts => {
    return new WebIndexPluginClass(opts || {});
};
}
// default/plugins/PlainJSPlugin.js
_bca95ef7.f[121] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
class PlainJSPluginClass {
    constructor() {
        this.test = /\.js$/;
    }
    transform(file) {
        let context = file.context;
        if (context.useCache) {
            if (file.loadFromCache()) {
                return;
            }
        }
        if (context.useCache) {
            context.emitJavascriptHotReload(file);
            context.cache.writeStaticCache(file, file.sourceMap);
        }
    }
}
;
exports.PlainJSPlugin = () => {
    return new PlainJSPluginClass();
};
}
module.exports = _bca95ef7.r(0)