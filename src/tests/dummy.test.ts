import { FuseTestEnv } from "./stubs/FuseTestEnv";
import { QuantumPlugin } from "../index";
import { should } from "fuse-test-runner";

export class Dummy {
    "should"() {
        return FuseTestEnv.create({
            testFolder: "_current_test",
            project: {
                distFiles: {
                    "hello.js": "exports.remoteFN = function(){ return 'some result from a remote file'}"
                },
                plugins: [
                    QuantumPlugin()
                ],
                files: {
                    "index.ts": `export function getRemoteFile(){ 
                        return import("./hello.js")

                    }`
                }
            }
        }).simple().then(test => test.browser(window => {
            const firstFile = window.$fsx.r(0);
            return firstFile.getRemoteFile().then(result => {
                should(result.remoteFN()).equal(`some result from a remote file`);
            });
        }));
    }
}