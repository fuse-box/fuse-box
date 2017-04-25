import { } from "../core/File";
import { Plugin } from "../core/WorkflowContext";
import { BundleProducer } from "../core/BundleProducer";
import * as path from "path";
import * as fs from "fs";
import { ensureAbsolutePath } from "../Utils";

export interface IndexPluginOptions {
    title?: string;
    bundles?: string[];
    path?: string;
    template?: string;
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
            if (pass) {
                bundlePaths.push(
                    path.join(this.opts.path ? this.opts.path : "/",
                        bundle.context.output.lastGeneratedFileName)
                )
            }
        });

        let html = `<!DOCTYPE html>
<html>
<head>
    <title>$title</title>
    $bundles
</head>
<body>
</body>
</html>`;
        if (this.opts.template) {
            let filePath = ensureAbsolutePath(this.opts.template);
            html = fs.readFileSync(filePath).toString();
        }

        let jsTags = bundlePaths.map(bundle =>
            `<script type="text/javascript" src="${bundle}"></script>`
        ).join("\n");

        let macro = {
            title: this.opts.title ? this.opts.title : "",
            bundles: jsTags
        }
        for (let key in macro) {
            html = html.replace('$' + key, macro[key])
        }
        producer.fuse.context
            .output.write("index.html", html, true);
    }
};

export const WebIndexPlugin = (opts?: IndexPluginOptions) => {
    return new WebIndexPluginClass(opts || {});
};
