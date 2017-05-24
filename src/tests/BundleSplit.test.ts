import { Plugin, WorkFlowContext } from "../core/WorkflowContext";
import { should } from "fuse-test-runner";
import { createEnv } from "./stubs/TestEnvironment";
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
}

