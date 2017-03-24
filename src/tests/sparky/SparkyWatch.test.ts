import { Sparky } from "../../index";
import { getStubsFolder, TestFolder } from "../stubs/TestEnvironment";
import * as path from "path";
import * as fs from "fs"
import { should } from "fuse-test-runner";

Sparky.testMode = true;

const STUBS = getStubsFolder();
const FOO = path.join(STUBS, "sparky/foo");


export class SparkyWatchTest {
    "Should watch one file"() {
        Sparky.flush();
        const testFolder = new TestFolder();
        testFolder.make();
        let flow, testFile;

        Sparky.task("default", () => {
            testFile = `${FOO}/c.txt`;
            let chain = Sparky.watch(`${FOO}/**/c.txt`)
            flow = chain;
            return chain.dest(`${testFolder.folder}/$name`)
        });
        return Sparky.start("default").then(() => {
            testFolder.shouldFindFile("c.txt");
            fs.writeFileSync(testFile, "foo-bar")
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    should(testFolder.readFile("c.txt")).equal("foo-bar");
                    flow.stopWatching();
                    // revert file contents back
                    fs.writeFileSync(testFile, "foo")
                    return resolve();
                }, 200)
            });
        });
    }

    "Should watch two files"() {
        Sparky.flush();
        const testFolder = new TestFolder();
        testFolder.make();
        let flow, firstFile, secondFile;

        Sparky.task("default", () => {
            firstFile = `${FOO}/c.txt`;
            secondFile = `${FOO}/cc.txt`;

            let chain = Sparky.watch(`${FOO}/**/*.txt`)
            flow = chain;
            return chain.dest(`${testFolder.folder}/$name`)
        });
        return Sparky.start("default").then(() => {
            // should be copied
            testFolder.shouldFindFile("c.txt");
            testFolder.shouldFindFile("cc.txt");

            // modifying the source files
            fs.writeFileSync(firstFile, "foo-bar")
            fs.writeFileSync(secondFile, "foo-mar")
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    should(testFolder.readFile("c.txt")).equal("foo-bar");
                    should(testFolder.readFile("cc.txt")).equal("foo-mar");
                    flow.stopWatching();
                    // revert file contents back
                    fs.writeFileSync(firstFile, "foo")
                    fs.writeFileSync(secondFile, "foo")
                    return resolve();
                }, 200)
            });
        });
    }

    "Should watch two JSON files by modify only one"() {
        Sparky.flush();
        const testFolder = new TestFolder();
        testFolder.make();
        let flow, firstFile, secondFile;

        Sparky.task("default", () => {
            firstFile = `${FOO}/d.json`;
            secondFile = `${FOO}/e.json`;

            let chain =
                Sparky.watch(`${FOO}/**/*.json`)
            flow = chain;
            return chain.dest(`${testFolder.folder}/$name`)
        });
        return Sparky.start("default").then(() => {
            // should be copied
            testFolder.shouldFindFile("d.json");
            testFolder.shouldFindFile("e.json");

            // modifying the source files
            fs.writeFileSync(firstFile, `{ "a" : 1}`)

            return new Promise((resolve, reject) => {
                setTimeout(() => {

                    should(JSON.parse(testFolder.readFile("d.json"))).deepEqual({ a: 1 });
                    flow.stopWatching();
                    // revert file contents back
                    fs.writeFileSync(firstFile, "")
                    fs.writeFileSync(secondFile, JSON.stringify({ hello: "world" }))
                    return resolve();
                }, 200)
            });
        });
    }
}