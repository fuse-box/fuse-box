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
    engine?: string | null;
    locals?: {[key: string]: any};
    appendBundles?: boolean;
    async?: boolean;
    scriptAttributes?: string;
    pre?: { relType: "fetch" | "load" };
    resolve?: (output: UserOutput) => string;
    emitBundles?: (bundles: string[]) => string;
}

export class WebIndexPluginClass implements Plugin {
    private template = `<!DOCTYPE html><html>
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

    constructor(public opts?: IndexPluginOptions) {

    }

    public producerEnd(producer: BundleProducer) {
        this.generate(producer);
        producer.sharedEvents.on("file-changed", () => {
            this.generate(producer);
        });
    }

    private async generate(producer: BundleProducer) {
        const bundlePaths = [];
        const bundles = producer.sortBundles();
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
                        bundlePaths.push(
                            joinFuseBoxPath(this.opts.path ? this.opts.path : "/", output.folderFromBundleName || "/",
                                output.lastPrimaryOutput.filename)
                        );
                    }
                }

            }
        });

        let html = this.opts.templateString || this.template;

        if (this.opts.template) {
            const filePath = ensureAbsolutePath(this.opts.template);
            html = fs.readFileSync(filePath).toString();

            if (this.opts.appendBundles && html.indexOf("$bundles") === -1) {
                if (html.indexOf("</body>") !== -1) {
                    html = html.replace("</body>", "$bundles</body>");
                } else if (html.indexOf("</head>") !== -1) {
                    html = html.replace("</head>", "$bundles</head>");
                } else {
                    html = `${html}$bundles`;
                }
            }
        }

        const jsTags = this.opts.emitBundles
            ? this.opts.emitBundles(bundlePaths)
            : bundlePaths.map(
                bundle =>
                    `<script ${
                        this.opts.async ? "async" : ""
                    } ${
                        this.opts.scriptAttributes ? this.opts.scriptAttributes : ""
                    } type="text/javascript" src="${bundle}"></script>`
            ).join("\n");

        let preloadTags;
        if (this.opts.pre) {
            preloadTags = bundlePaths.map(bundle =>
                `<link rel="pre${this.opts.pre.relType}" as="script" href="${bundle}">`
            ).join("\n");
        }
        const cssInjection = [];
        if (producer.injectedCSSFiles.size > 0) {
            producer.injectedCSSFiles.forEach(f => {
                const resolvedFile = this.opts.path ? path.join(this.opts.path, f) : path.join("/", f);
                cssInjection.push(`<link rel="stylesheet" href="${resolvedFile}"/>`);
            });
        }

        const macro = {
            css : cssInjection.join("\n"),
            title: this.opts.title ? this.opts.title : "",
            charset: this.opts.charset ? `<meta charset="${this.opts.charset}">` : "",
            description: this.opts.description ? `<meta name="description" content="${this.opts.description}">` : "",
            keywords: this.opts.keywords ? `<meta name="keywords" content="${this.opts.keywords}">` : "",
            author: this.opts.author ? `<meta name="author" content="${this.opts.author}">` : "",
            bundles: jsTags,
            preload: this.opts.pre ? preloadTags : "",
        };

        if (this.opts.engine && this.opts.template) {
            html = await require('consolidate')[this.opts.engine](ensureAbsolutePath(this.opts.template), {...macro, ...this.opts.locals})
        } else {
            for (const key in macro) {
                if (macro.hasOwnProperty(key)) {
                    html = html.replace("$" + key, macro[key]);
                }
            }
        }

        producer.fuse.context
            .output.writeToOutputFolder(this.opts.target || "index.html", html);
    }
}

export const WebIndexPlugin = (opts?: IndexPluginOptions) => {
    return new WebIndexPluginClass(opts || {});
};
