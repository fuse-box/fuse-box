import { } from "../core/File";
import { Plugin } from "../core/WorkflowContext";
import { BundleProducer } from "../core/BundleProducer";
import * as fs from "fs";
import { ensureAbsolutePath, joinFuseBoxPath } from "../Utils";

export interface IndexPluginOptions {
    title?: string;
    bundles?: string[];
    path?: string;
    target?: string;
    template?: string;
    async?: boolean;
}
export class WebIndexPluginClass implements Plugin {
    constructor(public opts?: IndexPluginOptions) {

    }
    producerEnd(producer: BundleProducer) {
        let bundlePaths = [];
        producer.bundles.forEach((bundle, name) => {
            let pass = true;
            if (this.opts.bundles) {
                if (this.opts.bundles.indexOf(name) == -1) {
                    pass = false;
                }
            }
            pass = bundle.webIndexed;
            if (pass) {
                const output = bundle.context.output;
                if (output && output.lastPrimaryOutput) {
                    bundlePaths.push(
                        joinFuseBoxPath(this.opts.path ? this.opts.path : "/", output.folderFromBundleName || "/",
                            output.lastPrimaryOutput.filename)
                    )
                }

            }
        });

        let html = `<!DOCTYPE html>
<html>
<head>
    <title>$title</title>
</head>
<body>
</body>
$bundles
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
            bundles: jsTags
        }
        for (let key in macro) {
            html = html.replace('$' + key, macro[key])
        }
        producer.fuse.context
            .output.write(this.opts.target || "index.html", html, true);
    }
};

export const WebIndexPlugin = (opts?: IndexPluginOptions) => {
    return new WebIndexPluginClass(opts || {});
};
