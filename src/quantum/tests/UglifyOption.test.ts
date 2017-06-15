import * as log from "fliplog";
import { should } from "fuse-test-runner";
import { createOptimisedBundleEnv } from "../../tests/stubs/TestEnvironment";

export class TreeShakeTest {
    "Should not tree shake Foo2"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: false
            },
            project: {
                files: {
                    "index.ts": `
                        import { Foo1 } from "./foo";
                        console.log(Foo1);
                    `,
                    "foo.ts": `
                        class Foo1 {}
                        class Foo2 {}
                        exports.Foo1 = Foo1;
                        exports.Foo2 = Foo2;

                    `
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString(`exports.Foo2`);
        });
    }

    "Should throw & log an error in uglify with invalid syntax if log=error"() {
        log.startCapturing()
        return createOptimisedBundleEnv({
            stubs: false,
            options: {
                treeshake: false,
                uglify: true,
                ensureES5: false,
            },
            project: {
                log: 'error,notify',
                files: {
                    "index.js": `
                        // const {...eh} = {...{canada: true}}
                        function* generator() {
                            console.log(yeild)
                        }
                        let fs = 1
                        module.exports = {[fs]: fs}
                    `,
                },
                plugins: [],
                instructions: ">index.js",
            },
        }).then(result => {
        })
        .catch(e => {
            log.stopCapturing()
            should(log.savedLog.join('')).findString('uglify-js')
            should(e).beInstanceOf(Error);
        };
    }
}
