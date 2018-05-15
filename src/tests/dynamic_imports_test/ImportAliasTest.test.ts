import { should } from "fuse-test-runner";
import { FuseTestEnv } from "../stubs/FuseTestEnv";


export class ImportAliasTest {
    "Should split using an alias"() {
        return FuseTestEnv.create(
            {
                //testFolder : "_current_test",
                project: {
                    alias: {
                        "foo": "~/foo-bar/module/",
                    },
                    files: {
                        "index.ts": `
                            export async function getRemoteFile(){ 
                                const module = await import("foo/hello")
                                return module.foo();
                            }
                        `,
                        "foo-bar/module/hello.js" : `
                            export function foo(){
                                return "hello world"
                            }
                        `
                    }
                }
            }
        ).simple().then(test => test.browser(window => {
            const index = window.FuseBox.import("./index");
            return index.getRemoteFile().then(result => {
                should(result).equal("hello world");
            })
        }));
    }
}