import { should } from "fuse-test-runner";
import { CSSDependencyExtractor } from "../lib/CSSDependencyExtractor";
import * as path from "path";
import * as appRoot from "app-root-path";


const stubs = path.join(appRoot.path, "src/tests/stubs/css/path1");

export class DependencyExtractorTest {
    "Should extract"() {
        let extractor = CSSDependencyExtractor.init({
            paths: [stubs],
            extensions: ["scss"],
            content: `
            @import "hello";
            body {
                background-color: blue;
            }
            `
        });
        let deps = extractor.getDependencies();
        let expected = ["tests/stubs/css/path1/foo.scss", "tests/stubs/css/path1/woo.scss", "tests/stubs/css/path1/hello.scss"]
        deps.forEach((dep, index) => {
            should(dep).findString(expected[index])
        });

    }
}