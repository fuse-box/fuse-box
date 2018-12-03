import { breakCache } from "./CacheBreaker";

// kill cache if required beforehand
breakCache();

export { Plugin, WorkFlowContext } from "./core/WorkflowContext";
export { Bundle } from "./core/Bundle";
export { BundleProducer } from "./core/BundleProducer";
export { FuseBoxOptions } from "./core/FuseBox";
export { IQuantumExtensionParams } from "./quantum/plugin/QuantumOptions";
export { ComputedStatementRule } from "./quantum/plugin/ComputerStatementRule";
export { QuantumPlugin } from "./quantum/plugin/QuantumPlugin";
export { ReplacePlugin } from "./plugins/ReplacePlugin";
export { VuePlugin } from "./plugins/VuePlugin";
export { VueComponentPlugin } from "./plugins/vue/VuePlugin";
export { ImageBase64Plugin } from "./plugins/images/ImageBase64Plugin";
export { CSSResourcePlugin } from "./plugins/stylesheet/CSSResourcePlugin";
export { HotReloadPlugin } from "./plugins/HotReloadPlugin";
export { EnvPlugin } from "./plugins/EnvPlugin";
export { ConcatPlugin } from "./plugins/ConcatPlugin";
export { StylusPlugin } from "./plugins/stylesheet/StylusPlugin";
export { PostCSS } from "./plugins/stylesheet/PostCSSPlugin";
export { PostCSS as PostCSSPlugin } from "./plugins/stylesheet/PostCSSPlugin";
export { SVGPlugin } from "./plugins/images/SVGPlugin";
export { BabelPlugin } from "./plugins/js-transpilers/BabelPlugin";
export { BublePlugin } from "./plugins/js-transpilers/BublePlugin";
export { CoffeePlugin } from "./plugins/js-transpilers/CoffeePlugin";
export { LESSPlugin } from "./plugins/stylesheet/LESSPlugin";
export { CSSPlugin } from "./plugins/stylesheet/CSSplugin";
export { HTMLPlugin } from "./plugins/HTMLplugin";
export { MarkdownPlugin } from "./plugins/Markdownplugin";
export { JSONPlugin } from "./plugins/JSONplugin";
export { BannerPlugin } from "./plugins/BannerPlugin";
export { SassPlugin } from "./plugins/stylesheet/SassPlugin";
export { TerserPlugin } from "./plugins/TerserPlugin";
export { UglifyESPlugin } from "./plugins/UglifyESPlugin";
export { UglifyJSPlugin } from "./plugins/UglifyJSPlugin";
export { SourceMapPlainJsPlugin } from "./plugins/SourceMapPlainJsPlugin";
export { RawPlugin } from "./plugins/RawPlugin";
export { OptimizeJSPlugin } from "./plugins/OptimizeJSPlugin";
export { Fluent } from "./arithmetic/Fluent";
export { FuseBox } from "./core/FuseBox";
export { Sparky } from "./sparky/Sparky";
<<<<<<< HEAD
export { SparkyContext } from './sparky/SparkyContext';
export { CSSModules } from "./plugins/stylesheet/CSSModules";
export { PurgeCSSPlugin } from "./plugins/stylesheet/PurgeCSSPlugin";
=======
export { SparkyContext } from "./sparky/SparkyContext";
export { CSSModules, CSSModulesPlugin } from "./plugins/stylesheet/CSSModules";
>>>>>>> upstream/master
export { CopyPlugin } from "./plugins/CopyPlugin";
export { WebIndexPlugin } from "./plugins/WebIndexPlugin";
export { PlainJSPlugin } from "./plugins/PlainJSPlugin";
export { ConsolidatePlugin } from "./plugins/ConsolidatePlugin";
export { File } from "./core/File";
import * as _SparkyCollection from "./sparky/index";
export const SparkyCollection = _SparkyCollection;
