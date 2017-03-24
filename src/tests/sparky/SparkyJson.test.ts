import { Sparky } from "../../index";
import { getStubsFolder, TestFolder } from "../stubs/TestEnvironment";
import * as path from "path";
import { should } from "fuse-test-runner";

Sparky.testMode = true;

const STUBS = getStubsFolder();
const FOO = path.join(STUBS, "sparky/foo");


export class SparkyJsonTest {
    "Should modify json (all files)"() {
        Sparky.flush();
        const testFolder = new TestFolder("pukka");
        testFolder.make();
        const random = Math.random();
        Sparky.task("default", () => {
            return Sparky.src(`${FOO}/d.json`)
                .dest(`${testFolder.folder}/$name`)
                .file("**", file => file.json((obj) => { obj.version = random; }).save())
        });
        return Sparky.start("default").then(() => {
            testFolder.shouldFindFile("d.json");
            should(testFolder.readFile("d.json")).findString(random.toString())
        });
    }

    "Should modify json (1 file)"() {
        Sparky.flush();
        const testFolder = new TestFolder("pukka");
        testFolder.make();
        const random = Math.random();
        Sparky.task("default", () => {
            return Sparky.src(`${FOO}/d.json`)
                .dest(`${testFolder.folder}/$name`)
                .file("d.json", file => file.json((obj) => { obj.version = random; }).save())
        });
        return Sparky.start("default").then(() => {
            testFolder.shouldFindFile("d.json");
            should(testFolder.readFile("d.json")).findString(random.toString())
        });
    }

    "Should change exisiting JSON"() {
        Sparky.flush();
        const testFolder = new TestFolder();
        testFolder.make();
        const random = Math.random();
        Sparky.task("default", () => {
            return Sparky.src(`${FOO}/e.json`)
                .dest(`${testFolder.folder}/$name`)
                .file("**", file => file.json((obj) => { obj.sup = random; }).save())
        });
        return Sparky.start("default").then(() => {
            should(JSON.parse(testFolder.readFile("e.json"))).deepEqual({
                hello: "world",
                sup: random
            });
        });
    }

    "Should override existing"() {
        Sparky.flush();
        const testFolder = new TestFolder();
        testFolder.make();
        const random = Math.random();
        Sparky.task("default", () => {
            return Sparky.src(`${FOO}/e.json`)
                .dest(`${testFolder.folder}/$name`)
                .file("**", file => file.json((obj) => { return { foo: random } }).save())
        });
        return Sparky.start("default").then(() => {
            should(JSON.parse(testFolder.readFile("e.json"))).deepEqual({ foo: random });
        });
    }



    "without SAVE: Should modify json (all files)"() {
        Sparky.flush();
        const testFolder = new TestFolder("pukka");
        testFolder.make();
        const random = Math.random();
        Sparky.task("default", () => {
            return Sparky.src(`${FOO}/d.json`)
                .file("**", file => file.json((obj) => { obj.version = random; }))
                .dest(`${testFolder.folder}/$name`)

        });
        return Sparky.start("default").then(() => {
            testFolder.shouldFindFile("d.json");
            should(testFolder.readFile("d.json")).findString(random.toString())
        });
    }

    "without SAVE: Should modify json (1 file)"() {
        Sparky.flush();
        const testFolder = new TestFolder("pukka");
        testFolder.make();
        const random = Math.random();
        Sparky.task("default", () => {
            return Sparky.src(`${FOO}/d.json`)
                .file("d.json", file => file.json((obj) => { obj.version = random; }))
                .dest(`${testFolder.folder}/$name`)

        });
        return Sparky.start("default").then(() => {
            testFolder.shouldFindFile("d.json");
            should(testFolder.readFile("d.json")).findString(random.toString())
        });
    }

    "without SAVE: Should change exisiting JSON"() {
        Sparky.flush();
        const testFolder = new TestFolder();
        testFolder.make();
        const random = Math.random();
        Sparky.task("default", () => {
            return Sparky.src(`${FOO}/e.json`)
                .file("**", file => file.json((obj) => { obj.sup = random; }))
                .dest(`${testFolder.folder}/$name`)

        });
        return Sparky.start("default").then(() => {
            should(JSON.parse(testFolder.readFile("e.json"))).deepEqual({
                hello: "world",
                sup: random
            });
        });
    }

    "without SAVE: Should override existing"() {
        Sparky.flush();
        const testFolder = new TestFolder();
        testFolder.make();
        const random = Math.random();
        Sparky.task("default", () => {
            return Sparky.src(`${FOO}/e.json`)
                .file("**", file => file.json((obj) => { return { foo: random } }))
                .dest(`${testFolder.folder}/$name`)

        });
        return Sparky.start("default").then(() => {
            should(JSON.parse(testFolder.readFile("e.json"))).deepEqual({ foo: random });
        });
    }

}