import { Plugin } from "../core/WorkflowContext";
import { BundleProducer } from "../core/BundleProducer";
import * as fs from "fs";
import { ensureAbsolutePath, joinFuseBoxPath } from "../Utils";
import { UserOutput } from "../core/UserOutput";
import * as path from "path";
import * as Consolidate from "consolidate";

export interface ConsolidateWebIndexPluginOptions {
    engine: string;
    extension?: string;
    template?: string;
    baseDir?: string;
    includeDir?: string;
    bundles?: string[];
    path?: string;
    target?: string;
    appendBundles?: boolean;
    async?: boolean;
    scriptAttributes?: string;
    pre?: { relType: 'fetch' | 'load' };
    resolve?: { (output: UserOutput): string };
    emitBundles?: (bundles: string[]) => string;
}
export class WebConsolidateWebIndexPluginClass implements Plugin {

    constructor(public opts?: ConsolidateWebIndexPluginOptions) {
        if (!opts.engine) {
            const message = "ConsolidateWebIndexPlugin - requires an engine to be provided in the options"
            throw new Error(message);
        }
        if (!opts.template) {
            const message = "ConsolidateWebIndexPlugin - requires an template to be provided in the options"
            throw new Error(message);
        }
    }

    private async generate(producer: BundleProducer) {
        if (!Consolidate[this.opts.engine]) {
            const message = `ConsolidateWebIndexPlugin - consolidate did not recognise the engine "${this.opts.engine}"`;
            throw new Error(message);
        }

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

        let html = await Consolidate[this.opts.engine].render(this.opts.template, {
            cache: false,
            filename: 'base',
            basedir: this.opts.baseDir,
            includeDir: this.opts.includeDir
        })

        if (html) {
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

        let jsTags = this.opts.emitBundles
            ? this.opts.emitBundles(bundlePaths)
            : bundlePaths.map(bundle => `<script ${this.opts.async ? 'async' : ''} ${this.opts.scriptAttributes ? this.opts.scriptAttributes : ''} type="text/javascript" src="${bundle}"></script>`).join('\n');

        let preloadTags;
        if (this.opts.pre) {
            preloadTags = bundlePaths.map(bundle =>
                `<link rel="pre${this.opts.pre.relType}" as="script" href="${bundle}">`
            ).join("\n");
        }
        let cssInjection = [];
        if (producer.injectedCSSFiles.size > 0) {
            producer.injectedCSSFiles.forEach(f => {
                const resolvedFile = this.opts.path ? path.join(this.opts.path, f) : path.join("/", f);
                cssInjection.push(`<link rel="stylesheet" href="${resolvedFile}"/>`)
            })
        }

        let macro = {
            css: cssInjection.join('\n'),
            bundles: jsTags,
            preload: this.opts.pre ? preloadTags : "",
        }
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

export const WebConsolidateWebIndexPlugin = (opts?: ConsolidateWebIndexPluginOptions) => {
    return new WebConsolidateWebIndexPluginClass(opts);
};
