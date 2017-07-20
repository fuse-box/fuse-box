import { should } from "fuse-test-runner";
import { createOptimisedBundleEnv } from "../../tests/stubs/TestEnvironment";

export class InlineRequireHeresyTest {
    "Should handle inline require and a call right away"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                removeUseStrict: false
            },
            project: {
                files: {
                    "index.ts": `
                        if ('object' !== 'undefined')
                            Object.defineProperty(exports, 
                                    'babelPluginFlowReactPropTypes_proptype_StyleSheet', 
                                        { value: require('./foo') });
                        }
                    `,
                    "foo.ts": "export function hello(){}"
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).notFindString('require');
            should(contents).findString('value: $fsx.r(1)');
        });
    }

}
