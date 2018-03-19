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
    async?: boolean;
    pre?: { relType: 'fetch' | 'load' };
    resolve?: { (output: UserOutput): string };
    emitBundles?: (bundles: string[]) => string;
}
export class WebIndexPluginClass implements Plugin {
    constructor(public opts?: IndexPluginOptions) {

    }

    private generate(producer: BundleProducer) {
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
                    if( this.opts.resolve){
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

        let jsTags = this.opts.emitBundles
            ? this.opts.emitBundles(bundlePaths)
            : bundlePaths.map(bundle => `<script ${this.opts.async ? 'async' : ''} type="text/javascript" src="${bundle}"></script>`).join('\n');

        let preloadTags;
        if (this.opts.pre) {
            preloadTags = bundlePaths.map(bundle =>
                `<link rel="pre${this.opts.pre.relType}" as="script" href="${bundle}">`
            ).join("\n");
        }
        let cssInjection = [];
        if ( producer.injectedCSSFiles.size > 0 ){
            producer.injectedCSSFiles.forEach(f => {
                const resolvedFile = this.opts.path ? path.join(this.opts.path, f) : path.join("/", f);
                cssInjection.push(`<link rel="stylesheet" href="${resolvedFile}"/>`)
            })
        }

        let macro = {
            css : cssInjection.join('\n'),
            title: this.opts.title ? this.opts.title : "",
            charset: this.opts.charset ? `<meta charset="${this.opts.charset}">` : "",
            description: this.opts.description ? `<meta name="description" content="${this.opts.description}">` : "",
            keywords: this.opts.keywords ? `<meta name="keywords" content="${this.opts.keywords}">` : "",
            author: this.opts.author ? `<meta name="author" content="${this.opts.author}">` : "",
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

export const WebIndexPlugin = (opts?: IndexPluginOptions) => {
    return new WebIndexPluginClass(opts || {});
};
