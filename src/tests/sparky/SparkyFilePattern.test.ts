import { parse } from "../../sparky/SparkyFilePattern";
import { should } from "fuse-test-runner";
import { Config } from "../../Config";
import * as path from "path";

export class SparkyFilePatternTest {
    "Should understand glob with *"() {
        const result = parse("**/")
        should(result.isGlob).beTrue();
    }
    "Should understand glob with {"() {
        const result = parse(".{html,js}")
        should(result.isGlob).beTrue();
    }

    "Should be glob false"() {
        const result = parse("hello.js")
        should(result.isGlob).beFalse();
    }

    "Should give abs root for a file"() {
        const result = parse("hello.js")
        should(result.root).equal(Config.PROJECT_ROOT);
    }

    "Should give abs path for a file"() {
        const result = parse("hello.js")
        should(result.filepath).equal(path.join(Config.PROJECT_ROOT, "hello.js"));
    }

    "Should extract glob root"() {
        const result = parse("**/**.js")
        should(result.glob).equal(path.join(Config.PROJECT_ROOT, "**/**.js"));
        should(result.root).equal(path.join(Config.PROJECT_ROOT));
    }

    "Should extract glob abs root"() {
        const result = parse("/a/b/**/**.js")
        should(result.glob).equal(path.normalize("/a/b/**/**.js"));
        should(result.root).equal(path.normalize("/a/b/"));
    }

    "Should understand 'base' option"() {
        const result = parse("./b/file.js", { base: "./a" });
        should(result.filepath).equal(path.join(Config.PROJECT_ROOT, "./a/b/file.js"))
        should(result.root).equal(path.join(Config.PROJECT_ROOT, "./a"))
    }
}