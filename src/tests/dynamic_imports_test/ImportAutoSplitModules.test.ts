import { should } from "fuse-test-runner";
import { FuseTestEnv } from "../stubs/FuseTestEnv";


export class ImportAutoSplitModules {
    "Should auto split node module"() {
        return FuseTestEnv.create(
            {
                project: {
                    files: {
                        "index.ts": `
                            export async function getRemoteFile(){ 
                                const module = await import("./foo")
                                return module.foo();
                            }
                        `,
                        "foo.ts" : `
                            export function foo(){
                                return "hello"
                            }
                        `
                    }
                }
            }
        ).simple().then(test => test.browser(window => {
            const index = window.FuseBox.import("./index");
            return index.getRemoteFile().then(result => {
                should(result).equal("hello");
            });
        }));
    }
}