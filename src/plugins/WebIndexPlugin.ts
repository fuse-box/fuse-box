import { } from "../core/File";
import { Plugin } from "../core/WorkflowContext";
import { BundleProducer } from "../core/BundleProducer";
import * as fs from "fs";
import { ensureAbsolutePath, joinFuseBoxPath } from "../Utils";
import { UserOutput } from "../core/UserOutput";

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
    async?: boolean;
    resolve ?: {(output : UserOutput) : string};
}
export class WebIndexPluginClass implements Plugin {
    constructor(public opts?: IndexPluginOptions) {

    }
    producerEnd(producer: BundleProducer) {
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
            let filePath = ensureAbsolutePath(this.opts.template);
            html = fs.readFileSync(filePath).toString();
        }

        let jsTags = bundlePaths.map(bundle =>
            `<script ${this.opts.async ? 'async' : ''} type="text/javascript" src="${bundle}"></script>`
        ).join("\n");

        let macro = {
            title: this.opts.title ? this.opts.title : "",
            charset: this.opts.charset ? `<meta charset="${this.opts.charset}">` : "",
            description: this.opts.description ? `<meta name="description" content="${this.opts.description}">` : "",
            keywords: this.opts.keywords ? `<meta name="keywords" content="${this.opts.keywords}">` : "",
            author: this.opts.author ? `<meta name="author" content="${this.opts.author}">` : "",
            bundles: jsTags
        }
        for (let key in macro) {
            html = html.replace('$' + key, macro[key])
        }
        producer.fuse.context
            .output.writeToOutputFolder(this.opts.target || "index.html", html);
    }
};

export const WebIndexPlugin = (opts?: IndexPluginOptions) => {
    return new WebIndexPluginClass(opts || {});
};
