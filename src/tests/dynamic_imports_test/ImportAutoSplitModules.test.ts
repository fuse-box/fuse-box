import { should } from "fuse-test-runner";
import { FuseTestEnv } from "../stubs/FuseTestEnv";


export class ImportAutoSplitModules {
    "Should auto split file"() {
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

    "Should auto split a package"() {
        return FuseTestEnv.create(
            {
                project: {
                    files: {
                        "index.ts": `
                            export async function asyncOp(){ 
                                const path = await import("path")
                                return path.join("a", "b");
                            }
                        `
                    }
                }
            }
        ).simple().then(test => test.browser(window => {
            const index = window.FuseBox.import("./index");
            return index.asyncOp().then(result => {
                should(result).equal("a/b");
            });
        }));
    }
}