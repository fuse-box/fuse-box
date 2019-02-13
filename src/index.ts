import { breakCache } from "./CacheBreaker";
import * as _SparkyCollection from "./sparky/index";
import { ensureTypescriptInstalled } from "./Utils";

ensureTypescriptInstalled();
// kill cache if required beforehand
breakCache();

export { Fluent } from "./arithmetic/Fluent";
export { Bundle } from "./core/Bundle";
export { BundleProducer } from "./core/BundleProducer";
export { File } from "./core/File";
export { FuseBox, FuseBoxOptions } from "./core/FuseBox";
export { Plugin, WorkFlowContext } from "./core/WorkflowContext";
export { BannerPlugin } from "./plugins/BannerPlugin";
export { ConcatPlugin } from "./plugins/ConcatPlugin";
export { ConsolidatePlugin } from "./plugins/ConsolidatePlugin";
export { CopyPlugin } from "./plugins/CopyPlugin";
export { EnvPlugin } from "./plugins/EnvPlugin";
export { HotReloadPlugin } from "./plugins/HotReloadPlugin";
export { HTMLPlugin } from "./plugins/HTMLplugin";
export { ImageBase64Plugin } from "./plugins/images/ImageBase64Plugin";
export { SVGPlugin } from "./plugins/images/SVGPlugin";
export { Babel7Plugin } from "./plugins/js-transpilers/Babel7Plugin";
export { BabelPlugin } from "./plugins/js-transpilers/BabelPlugin";
export { BublePlugin } from "./plugins/js-transpilers/BublePlugin";
export { CoffeePlugin } from "./plugins/js-transpilers/CoffeePlugin";
export { JSONPlugin } from "./plugins/JSONplugin";
export { MarkdownPlugin } from "./plugins/Markdownplugin";
export { OptimizeJSPlugin } from "./plugins/OptimizeJSPlugin";
export { PlainJSPlugin } from "./plugins/PlainJSPlugin";
export { RawPlugin } from "./plugins/RawPlugin";
export { ReplacePlugin } from "./plugins/ReplacePlugin";
export { SourceMapPlainJsPlugin } from "./plugins/SourceMapPlainJsPlugin";
export { StyledComponentsPlugin } from "./plugins/StyledComponentsPlugin";
export { CSSModulesPlugin } from "./plugins/stylesheet/CSSModules";
export { CSSPlugin } from "./plugins/stylesheet/CSSplugin";
export { CSSResourcePlugin } from "./plugins/stylesheet/CSSResourcePlugin";
export { LESSPlugin } from "./plugins/stylesheet/LESSPlugin";
export { PostCSS, PostCSS as PostCSSPlugin } from "./plugins/stylesheet/PostCSSPlugin";
export { SassPlugin } from "./plugins/stylesheet/SassPlugin";
export { StylusPlugin } from "./plugins/stylesheet/StylusPlugin";
export { TerserPlugin } from "./plugins/TerserPlugin";
export { UglifyJSPlugin } from "./plugins/UglifyJSPlugin";
export { VueComponentPlugin } from "./plugins/vue/VuePlugin";
export { WebIndexPlugin } from "./plugins/WebIndexPlugin";
export { ComputedStatementRule } from "./quantum/plugin/ComputerStatementRule";
export { IQuantumExtensionParams } from "./quantum/plugin/QuantumOptions";
export { QuantumPlugin } from "./quantum/plugin/QuantumPlugin";
export { Sparky } from "./sparky/Sparky";
export { SparkyContext } from "./sparky/SparkyContext";

export const SparkyCollection = _SparkyCollection;
