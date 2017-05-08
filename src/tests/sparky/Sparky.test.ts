import { Sparky } from "../../index";
import { getStubsFolder, TestFolder } from "../stubs/TestEnvironment";
import * as path from "path";

Sparky.testMode = true;

const STUBS = getStubsFolder();
const FOO = path.join(STUBS, "sparky/foo");


export class SparkyTest {
    "Should copy 1 file with glob"() {
        Sparky.flush();
        const testFolder = new TestFolder();
        testFolder.make();

        Sparky.task("default", () => {
            return Sparky.src(`${FOO}/**/c.txt`).dest(`${testFolder.folder}/$name`)
        });
        return Sparky.start("default").then(() => {
            testFolder.shouldFindFile("c.txt");
        });
    }

    "Should copy 1 file without glob"() {
        const testFolder = new TestFolder();
        Sparky.flush();
        testFolder.make();

        Sparky.task("default", () => {
            return Sparky.src(`${FOO}/c.txt`).dest(`${testFolder.folder}/$name`)
        });
        return Sparky.start("default").then(() => {
            testFolder.shouldFindFile("c.txt");
            testFolder.clean();
        });
    }

    "Should copy 1 file without glob and without $name"() {
        const testFolder = new TestFolder();
        Sparky.flush();
        testFolder.make();

        Sparky.task("default", () => {
            return Sparky.src(`${FOO}/c.txt`).dest(`${testFolder.folder}/`)
        });
        return Sparky.start("default").then(() => {
            testFolder.shouldFindFile("c.txt");
            testFolder.clean();
        });
    }

    "Should copy text files with $name"() {
        const testFolder = new TestFolder();
        Sparky.flush();
        testFolder.make();

        Sparky.task("default", () => {
            return Sparky.src(`${FOO}/**.txt`).dest(`${testFolder.folder}/$name`)
        });
        return Sparky.start("default").then(() => {
            testFolder.shouldFindFile("c.txt");
            testFolder.shouldFindFile("cc.txt");
            testFolder.clean();
        });
    }

    "Should find local logo.png"() {
        const testFolder = new TestFolder();
        Sparky.flush();
        testFolder.make();

        Sparky.task("default", () => {
            return Sparky.src(`logo.png`).dest(`${testFolder.folder}/`)
        });
        return Sparky.start("default").then(() => {
            testFolder.shouldFindFile("logo.png");
            testFolder.clean();
        });
    }

    "Should find all files with logo"() {
        const testFolder = new TestFolder();
        Sparky.flush();
        testFolder.make();

        Sparky.task("default", () => {
            return Sparky.src(`logo.**`).dest(`${testFolder.folder}/`)
        });
        return Sparky.start("default").then(() => {
            testFolder.shouldFindFile("logo.png");
            testFolder.shouldFindFile("logo.svg");
            testFolder.clean();
        });
    }

    "Should copy files (glob) keeping the folder structure"() {
        const testFolder = new TestFolder();
        Sparky.flush();
        testFolder.make();

        Sparky.task("default", () => {
            return Sparky.src(`${FOO}/**/**.css`).dest(`${testFolder.folder}/`)
        });
        return Sparky.start("default").then(() => {
            testFolder.shouldFindFile("woo/boo/poo.css");
            testFolder.shouldFindFile("woo/boo/aaa.css");
            testFolder.clean();
        });
    }

    "Should copy files (glob) without keeping the folder structure"() {
        const testFolder = new TestFolder();
        Sparky.flush();
        testFolder.make();

        Sparky.task("default", () => {
            return Sparky.src(`${FOO}/**/**.css`).dest(`${testFolder.folder}/$name`)
        });
        return Sparky.start("default").then(() => {
            testFolder.shouldFindFile("poo.css");
            testFolder.shouldFindFile("aaa.css");
            testFolder.clean();
        });
    }

    "Should copy all files"() {
        const testFolder = new TestFolder("aaaa");
        Sparky.flush();
        testFolder.make();

        Sparky.task("default", () => {
            return Sparky.src(`src/tests/stubs/sparky/**/**.html`).dest(`${testFolder.folder}/`)
        });
        return Sparky.start("default").then(() => {

            testFolder.clean();
        });
    }

    "Should accept an array and copy both files"() {
        const testFolder = new TestFolder('testingArray');
        Sparky.flush();
        testFolder.make();

        Sparky.task("default", () => {
            return Sparky.src([
                'src/tests/stubs/sparky/foo/a.html',
                'src/tests/stubs/sparky/foo/b.html']).dest(`${testFolder.folder}/$name`)
        });
        return Sparky.start("default").then(() => {
            testFolder.shouldFindFile("a.html");
            testFolder.shouldFindFile("b.html");
            testFolder.clean();
        });
    }
}