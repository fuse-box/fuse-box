import { Plugin, WorkFlowContext } from "../core/WorkflowContext";
import { should } from "fuse-test-runner";
import { createEnv, createFuseBox } from "./stubs/TestEnvironment";
import { joinFuseBoxPath } from "../Utils";
import * as fs from "fs";

class ModifyTestEnvPlugin implements Plugin {
    preBundle(context: WorkFlowContext) {
        context.bundle.split("foo.js", "foobundle > foo.js");
    }
}

export class BundleSplitTest {
    "Should split bundles"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `
						import { foo } from "./foo.js"
                        export function bar(){return foo() + 1}
                    `,
                    "foo.js": `
                        export function foo(){return 1}
                    `
                },
                plugins: [new ModifyTestEnvPlugin()],
                instructions: "> index.js",
            },
        }).then((result) => {
            const fuse = result.project.FuseBox;
            should(fuse.exists("./foo.js")).beFalse();

            const cfg = fuse.global("__fsbx__bundles__");
            should(cfg.bundles["foobundle"]).beObject();
        });
    }

    "Should support source maps for split bundles"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `
    					import { foo } from "./foo.js"
                        export function bar(){return foo() + 1}
                    `,
                    "foo.js": `
                        export function foo(){return 1}
                    `
                },
                sourceMaps: true,
                hash: true,
                plugins: [new ModifyTestEnvPlugin()],
                instructions: "> index.js",
            },
        }).then((result) => {
            const fuse = result.project.FuseBox;
            const cfg = fuse.global("__fsbx__bundles__");
            const file = joinFuseBoxPath(result.dist, cfg.bundles["foobundle"].file);
            const contents = fs.readFileSync(file).toString();
            should(contents).findString("//# sourceMappingURL=foobundle.js.map");
        });
    }

    "Should split bundles - tested via separate testing environment"() {
        const fuse = createFuseBox({
            files: {
                "index.js": `
                        export function bar(){return foo() + 1}
                    `,
                "foo.js": `
                        export function foo(){return 1}
                    `
            },
        });
        fuse.bundle("index")
            .split("foo.js", "foobundle > foo.js")
            .instructions('> index.js + foo.js');

        return fuse.runAndLoad(["index"], ({ index }, dist) => {
            const fuseLoader = index.FuseBox;
            should(fuseLoader.exists("./foo.js")).beFalse();

            const cfg = fuseLoader.global("__fsbx__bundles__");
            should(cfg.bundles["foobundle"]).beObject();
        });
    }

    "Should support source maps for split bundles - tested via separate testing environment"() {
        const fuse = createFuseBox({
            files: {
                "index.js": `
                        export function bar(){return foo() + 1}
                    `,
                "foo.js": `
                        export function foo(){return 1}
                    `
            },
            sourceMaps: true,
            hash: true,
        });
        fuse.bundle("zzz/index")
            .split("foo.js", "foobundle > foo.js")
            .instructions('> index.js + foo.js');

        return fuse.runAndLoad(["zzz/index"], (bundles, dist) => {
            const index = bundles["zzz/index"];
            const cfg = index.FuseBox.global("__fsbx__bundles__");
            const file = joinFuseBoxPath(dist, cfg.bundles["foobundle"].file);
            const contents = fs.readFileSync(file).toString();
            should(contents).findString("//# sourceMappingURL=foobundle.js.map");
        });
    }
}

