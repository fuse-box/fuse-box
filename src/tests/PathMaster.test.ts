import * as appRoot from "app-root-path";
import * as path from "path";
import { PathMaster } from "../core/PathMaster";
import { WorkFlowContext } from "../core/WorkflowContext";
import { should } from "fuse-test-runner";

const testFolder = path.join(appRoot.path, "src/tests/fixtures/path-test");
const getTestFolder = (name) => {
    return path.join(testFolder, name);
};
const testFolderShouldEqual = (a, b) => {
    a = a.replace(/\\/g, "/"); //for Windows OS
    let matched = a.indexOf(b) === a.length - b.length;
    if (!matched) {
        throw new Error(`${a} is not ${b}`);
    }
};

const pm = new PathMaster(new WorkFlowContext(), testFolder);

export class PathMasterTest {
    "Should detect node module"() {
        let result = pm.resolve("foo/lib");
        should(result.isNodeModule).beTrue();
    }

    "Should not detect a node module"() {
        let result = pm.resolve("./foo/lib");
        should(result.isNodeModule).beFalse();
    }

    "Should propertly detect a node module name"() {
        let result = pm.resolve("foo/lib");
        should(result.nodeModuleName).equal("foo");
    }

    "Should detect a partial require from a node_module"() {
        let result = pm.resolve("foo/lib/bar.js");
        should(result.nodeModuleExplicitOriginal).equal("lib/bar.js");
        should(result.isNodeModule).beTrue();
    }

    "Should property join a local file"() {
        let result = pm.resolve("../foo.js", getTestFolder("lib/bar"));
        testFolderShouldEqual(result.absPath, "/lib/foo.js");
    }

    "Should property join a local folder with index"() {
        let result = pm.resolve("../", getTestFolder("lib/bar"));
        testFolderShouldEqual(result.absPath, "/lib/index.js");
    }

    "Should property join a local file with extension"() {
        let result = pm.resolve("../some.js", getTestFolder("lib/bar"));
        testFolderShouldEqual(result.absPath, "/lib/some.js");
    }

    "Should property join a local file without extension"() {
        let result = pm.resolve("../some", getTestFolder("lib/bar"));
        testFolderShouldEqual(result.absPath, "/lib/some.js");
    }

    "Should resolve the same folder (index.js)"() {
        let result = pm.resolve("./", getTestFolder("lib/"));
        testFolderShouldEqual(result.absPath, "/lib/index.js");
    }

    "Should resolve the same folder but deeper"() {
        let result = pm.resolve("./../", getTestFolder("lib/bar"));
        testFolderShouldEqual(result.absPath, "/lib/index.js");
    }

    "Should resolve libs folder"() {
        let result = pm.resolve("./", getTestFolder("lib/bar"));
        testFolderShouldEqual(result.absPath, "/lib/bar/index.js");
    }

    "Should recognize a json file"() {
        let result = pm.resolve("./bar/data.json", getTestFolder("lib/"));
        testFolderShouldEqual(result.absPath, "/lib/bar/data.json");
    }

    "Should recognize an xml file"() {
        let result = pm.resolve("./bar/data.xml", getTestFolder("lib/"));
        testFolderShouldEqual(result.absPath, "/lib/bar/data.xml");
    }

    "Should recognize an css file"() {
        let result = pm.resolve("./bar/data.css", getTestFolder("lib/"));
        testFolderShouldEqual(result.absPath, "/lib/bar/data.css");
    }

    "Should give  cheerio version"() {
        let result = pm.resolve("cheerio", getTestFolder("lib/"));
        should(result.nodeModuleInfo.version).equal("0.22.0");
    }

    "Should give propery entry (cheerio)"() {
        let result = pm.resolve("cheerio", getTestFolder("lib/"));
        testFolderShouldEqual(result.nodeModuleInfo.entry, "node_modules/cheerio/index.js");
    }

    "Should give proper root (cheerio)"() {
        let result = pm.resolve("cheerio", getTestFolder("lib/"));
        testFolderShouldEqual(result.nodeModuleInfo.root, "node_modules/cheerio");
    }

    "Should give proper absPath (cheerio)"() {
        let result = pm.resolve("cheerio", getTestFolder("lib/"));
        testFolderShouldEqual(result.absPath, "node_modules/cheerio/index.js");
    }

    "Should give proper absDir (cheerio)"() {
        let result = pm.resolve("cheerio", getTestFolder("lib/"));
        testFolderShouldEqual(result.absDir, "node_modules/cheerio");
    }

    "Should find node lib 'path' in asset folder"() {
        let result = pm.resolve("path", getTestFolder("lib/"));
        should(result.nodeModuleInfo.version).equal("0.0.0");
    }
    "Should give information explicit cheerio require (absPath)"() {
        let result = pm.resolve("cheerio/lib/static", getTestFolder("lib/"));
        testFolderShouldEqual(result.absPath, "lib/static.js");
    }

    "Should give information explicit cheerio require (absDir)"() {
        let result = pm.resolve("cheerio/lib/static", getTestFolder("lib/"));
        testFolderShouldEqual(result.absDir, "lib");
    }

    "Should give explicit cheerio require (entry)"() {
        let result = pm.resolve("cheerio/lib/static", getTestFolder("lib/"));
        testFolderShouldEqual(result.nodeModuleInfo.entry, "node_modules/cheerio/index.js");
    }

    "Should give explicit cheerio require (root)"() {
        let result = pm.resolve("cheerio/lib/static", getTestFolder("lib/"));
        testFolderShouldEqual(result.nodeModuleInfo.root, "node_modules/cheerio");
    }

    // fusebox path ******************************************************
    // Local files
    "Should give a proper fusebox path (json)"() {
        let result = pm.resolve("./bar/data.json", getTestFolder("lib/"));
        should(result.fuseBoxPath).equal("lib/bar/data.json");
    }

    "Should give a proper fusebox path (js without ext)"() {
        let result = pm.resolve("./bar/data", getTestFolder("lib/"));
        should(result.fuseBoxPath).equal("lib/bar/data.js");
    }

    "Should give a proper fusebox path (js with ext)"() {
        let result = pm.resolve("./bar/data", getTestFolder("lib/"));
        should(result.fuseBoxPath).equal("lib/bar/data.js");
    }

    "Should give a proper fusebox path (on folder)"() {
        let result = pm.resolve("./bar", getTestFolder("lib/"));
        should(result.fuseBoxPath).equal("lib/bar/index.js");
    }

    // Fusebox path external files

    "Should give give a proper fusebox path on cheerio (without ext)"() {
        let result = pm.resolve("cheerio/lib/static", getTestFolder("lib/"));
        should(result.fuseBoxPath).equal("lib/static.js");
    }

    "Should give give a proper fusebox path on cheerio (with ext)"() {
        let result = pm.resolve("cheerio/lib/static.js", getTestFolder("lib/"));
        should(result.fuseBoxPath).equal("lib/static.js");
    }

    "Should not go beyond the limits"() {
        let result = pm.resolve("../", getTestFolder("./"), getTestFolder("./") + "index.js");
        should(result.fuseBoxPath).equal("index.js");
    }

    "Should resolve tilda path (on folder)"() {
        let result = pm.resolve("~/foo", getTestFolder("./bar/data.json"));
        testFolderShouldEqual(result.absPath, "path-test/foo/index.js");
        should(result.fuseBoxPath).equal("foo/index.js");
    }

    "Should resolve tilda file (on file without ext)"() {
        let result = pm.resolve("~/some", getTestFolder("./bar/data.json"));

        testFolderShouldEqual(result.absPath, "path-test/some.js");
        should(result.fuseBoxPath).equal("some.js");
    }

    "Should resolve tilda file (on file with ext)"() {
        let result = pm.resolve("~/some.js", getTestFolder("./bar/data.json"));

        testFolderShouldEqual(result.absPath, "path-test/some.js");
        should(result.fuseBoxPath).equal("some.js");
    }

    "Should handle sub module with @ operator"() {
        let result = pm.resolve("@angular/core", getTestFolder("./bar/data.json"));
        should(result.nodeModuleName).equal("@angular/core");
        should(result.fuseBoxPath).equal("bundles/core.umd.js");
    }
}
