import { } from "../core/File";
import { Plugin } from "../core/WorkflowContext";
import { BundleProducer } from "../core/BundleProducer";
import * as fs from "fs";
import { ensureAbsolutePath, joinFuseBoxPath } from "../Utils";
import { UserOutput } from "../core/UserOutput";
import * as path from "path";

export interface IndexPluginOptions {
    title?: string;
    charset?: string;
    description?: string;
    keywords?: string;
    author?: string;
    bundles?: string[];
    path?: string;
    target?: string;
    template?: string;
    templateString?: string;
    appendBundles?: boolean;
    engine?: string;
    locals?: {[key:string]: any}
    async?: boolean;
    scriptAttributes?: string;
    pre?: { relType: 'fetch' | 'load' };
    resolve?: { (output: UserOutput): string };
    emitBundles?: (bundles: string[]) => string;
}
export class WebIndexPluginClass implements Plugin {
    constructor(public opts?: IndexPluginOptions) {

    }

    private async generate(producer: BundleProducer) {
        let bundlePaths = [];
        let bundles = producer.sortBundles();
        bundles.forEach((bundle) => {
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
                        bundlePaths.push(this.opts.resolve(output))
                    } else {
                        bundlePaths.push(
                            joinFuseBoxPath(this.opts.path ? this.opts.path : "/", output.folderFromBundleName || "/",
                                output.lastPrimaryOutput.filename)
                        )
                    }
                }

            }
        });


        let html = this.opts.templateString || `<!DOCTYPE html><html>
<head>
<title>$title</title>
$charset
$description
$keywords
$preload
$author
$css
</head>
<body>
$bundles
</body>
</html>`;
        if (this.opts.engine) {
            const engine = this.opts.engine;
            const consolidate = require('consolidate');
            if (!consolidate[engine]) {
                const message = `ConsolidatePlugin - consolidate did not recognise the engine "${engine}"`;
                throw new Error(message);
            }
            if (!this.opts.template) {
                throw new Error("WebIndexPlugin with engine option requires 'template option specified' ");
            }
            const filePath = ensureAbsolutePath(this.opts.template);
            html = await consolidate[engine](filePath, this.opts.locals || {});
        } else {
            if (this.opts.template) {
                let filePath = ensureAbsolutePath(this.opts.template);
                html = fs.readFileSync(filePath).toString();

                if (this.opts.appendBundles && html.indexOf('$bundles') === -1) {
                    if (html.indexOf('</body>') !== -1) {
                        html = html.replace('</body>', '$bundles</body>');
                    } else if (html.indexOf('</head>') !== -1) {
                        html = html.replace('</head>', '$bundles</head>');
                    } else {
                        html = `${html}$bundles`;
                    }
                }
            }
        }

                // Generate preload and prefetch resource tags by tag type.
        // ex. pre: {relType: 'load', tagTypes: ['style', 'script']}
        let preloadTags = '';
        let preloadCSS = false;
        let preloadJS = false;

        if (this.opts.pre && Array.isArray(this.opts.pre.tagTypes)) {
            // CSS
            if (
                this.opts.pre.tagTypes.indexOf('style') >= 0 &&
                producer.injectedCSSFiles.size > 0
            ) {
                preloadCSS = true;

                producer.injectedCSSFiles.forEach((f) => {
                    const resolvedFile = this.opts.path
                        ? path.join(this.opts.path, f)
                        : path.join('/', f);

                    preloadTags += `<link rel="pre${
                        this.opts.pre.relType
                    }" as="style" href="${resolvedFile}">`;
                });
            }

            // JS
            if (this.opts.pre.tagTypes.indexOf('script') >= 0 && bundlePaths.length > 0) {
                preloadJS = true;

                preloadTags += bundlePaths
                    .map((bundle) => {
                        `<link rel="pre${this.opts.pre.relType}" as="script" href="${bundle}">`;
                    })
                    .join('\n');
            }
        }

        // Do not add CSS link tags if being preloaded.
        if (preloadCSS === false) {
            let cssInjection = [];
            if (producer.injectedCSSFiles.size > 0) {
                producer.injectedCSSFiles.map((f) => {
                    const resolvedFile = this.opts.path
                        ? path.join(this.opts.path, f)
                        : path.join('/', f);
                    cssInjection.push(`<link rel="stylesheet" href="${resolvedFile}"/>`);
                });
            }
        }

        // Do not add JavaScript script tags if being preloaded.
        if (preloadJS === false) {
            let jsTags = this.opts.emitBundles
                ? this.opts.emitBundles(bundlePaths)
                : bundlePaths
                      .map(
                          (bundle) =>
                              `<script ${this.opts.async ? 'async' : ''} ${
                                  this.opts.scriptAttributes ? this.opts.scriptAttributes : ''
                              } type="text/javascript" src="${bundle}"></script>`
                      )
                      .join('\n');
        }

        let macro = {
            css: preloadCSS === true ? '' : cssInjection.join('\n'),
            title: this.opts.title ? this.opts.title : '',
            charset: this.opts.charset ? `<meta charset="${this.opts.charset}">` : '',
            description: this.opts.description
                ? `<meta name="description" content="${this.opts.description}">`
                : '',
            keywords: this.opts.keywords
                ? `<meta name="keywords" content="${this.opts.keywords}">`
                : '',
            author: this.opts.author ? `<meta name="author" content="${this.opts.author}">` : '',
            bundles: preloadJS === true ? '' : jsTags,
            preload: this.opts.pre ? preloadTags : ''
        };
        
        for (let key in macro) {
            html = html.replace('$' + key, macro[key])
        }
        producer.fuse.context
            .output.writeToOutputFolder(this.opts.target || "index.html", html);
    }
    producerEnd(producer: BundleProducer) {
        this.generate(producer);
        producer.sharedEvents.on('file-changed', () => {
            this.generate(producer);
        });
    }
};

export const WebIndexPlugin = (opts?: IndexPluginOptions) => {
    return new WebIndexPluginClass(opts || {});
};
