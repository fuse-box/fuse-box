import { should } from "fuse-test-runner";
import { createDefaultPackageAbstraction, createBundleAbstraction } from "./helper";
import { FileAbstraction } from "../core/FileAbstraction";

export class AbstractPathResolving {
    "Should resolve an abstract 'js' file"() {
        const files = new Map<string, string>();
        files.set("foo/bar/index.js", "require('./world')");
        files.set("foo/bar/world.js", "");

        const pkg = createDefaultPackageAbstraction(files);

        const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
        const worldReference = indexFile.findRequireStatements(/.*/)[0]

        const res = worldReference.resolve();

        should(res)
            .beOkay()
            .mutate((res: FileAbstraction​​) => res.fuseBoxPath)
            .equal("foo/bar/world.js");
    }

    "Should resolve an abstract 'jsx' file"() {
        const files = new Map<string, string>();
        files.set("foo/bar/index.js", "require('./world')");
        files.set("foo/bar/world.jsx", "");

        const pkg = createDefaultPackageAbstraction(files);

        const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
        const worldReference = indexFile.findRequireStatements(/.*/)[0]

        const res = worldReference.resolve();

        should(res)
            .beOkay()
            .mutate((res: FileAbstraction​​) => res.fuseBoxPath)
            .equal("foo/bar/world.jsx");
    }

    "Should resolve an abstract  folder 'js' file"() {
        const lookup = "foo/bar/world/index.js";
        const files = new Map<string, string>();
        files.set("foo/bar/index.js", "require('./world')");
        files.set(lookup, "");

        const pkg = createDefaultPackageAbstraction(files);

        const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
        const worldReference = indexFile.findRequireStatements(/.*/)[0]

        const res = worldReference.resolve();

        should(res)
            .beOkay()
            .mutate((res: FileAbstraction​​) => res.fuseBoxPath)
            .equal(lookup);
    }

    "Should resolve an abstract folder 'jsx' file"() {
        const lookup = "foo/bar/world/index.jsx";
        const files = new Map<string, string>();
        files.set("foo/bar/index.js", "require('./world')");
        files.set(lookup, "");
        files.set("foo/bar/test.js", "");

        const pkg = createDefaultPackageAbstraction(files);

        const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
        const worldReference = indexFile.findRequireStatements(/.*/)[0]

        const res = worldReference.resolve();

        should(res)
            .beOkay()
            .mutate((res: FileAbstraction​​) => res.fuseBoxPath)
            .equal(lookup);
    }

    "Should resolve an abstract  folder 'js' file with opened slash"() {
        const lookup = "foo/bar/world/index.js";
        const files = new Map<string, string>();
        files.set("foo/bar/index.js", "require('./world/')");
        files.set(lookup, "");

        const pkg = createDefaultPackageAbstraction(files);

        const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
        const worldReference = indexFile.findRequireStatements(/.*/)[0]
        const res = worldReference.resolve();

        should(res)
            .beOkay()
            .mutate((res: FileAbstraction​​) => res.fuseBoxPath)
            .equal(lookup);
    }

    "Should resolve an abstract  folder 'jsx' file with opened slash"() {
        const lookup = "foo/bar/world/index.jsx";
        const files = new Map<string, string>();
        files.set("foo/bar/index.js", "require('./world/')");
        files.set(lookup, "");

        const pkg = createDefaultPackageAbstraction(files);

        const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
        const worldReference = indexFile.findRequireStatements(/.*/)[0]

        const res = worldReference.resolve();

        should(res)
            .beOkay()
            .mutate((res: FileAbstraction​​) => res.fuseBoxPath)
            .equal(lookup);
    }

    "Should resolve js file with tilde"() {
        const lookup = "foo/bar/world.js"
        const files = new Map<string, string>();
        files.set("foo/bar/index.js", "require('~/foo/bar/world')");
        files.set(lookup, "");

        const pkg = createDefaultPackageAbstraction(files);

        const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
        const worldReference = indexFile.findRequireStatements(/.*/)[0]

        const res = worldReference.resolve();

        should(res)
            .beOkay()
            .mutate((res: FileAbstraction​​) => res.fuseBoxPath)
            .equal(lookup);
    }

    "Should not resolve a file"() {

        const files = new Map<string, string>();
        files.set("foo/bar/index.js", "require('../world')");
        files.set("foo/bar/world.js", "");

        const pkg = createDefaultPackageAbstraction(files);

        const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
        const worldReference = indexFile.findRequireStatements(/.*/)[0]

        const res = worldReference.resolve();

        should(res)
            .beUndefined()
    }

    "Should resolve a simple node module"() {
        const bundleAbstraction = createBundleAbstraction({
            "default": {
                files: {
                    "index.js": "require('foo')"
                }
            },
            "foo": {
                files: {
                    "index.js": ""
                }
            }
        });

        let programIndex = bundleAbstraction.packageAbstractions.get("default").fileAbstractions.get("index.js");

        let fooRequired = programIndex.findRequireStatements(/.*/)[0]
        const rq = fooRequired.resolve();
        should(rq.packageAbstraction.name).equal("foo")
        should(rq.fuseBoxPath).equal("index.js");
    }
    "Should resolve an explicit require statement from node module"() {
        const bundleAbstraction = createBundleAbstraction({
            "default": {
                files: {
                    "index.js": "require('foo/stuff')"
                }
            },
            "foo": {
                files: {
                    "index.js": "",
                    "stuff.js": ""
                }
            }
        });

        let programIndex = bundleAbstraction.packageAbstractions.get("default").fileAbstractions.get("index.js");

        let fooRequired = programIndex.findRequireStatements(/.*/)[0]
        const rq = fooRequired.resolve();
        should(rq.packageAbstraction.name).equal("foo")
        should(rq.fuseBoxPath).equal("stuff.js");
    }

    "Should resolve an explicit require statement (folder) from node module"() {
        const bundleAbstraction = createBundleAbstraction({
            "default": {
                files: {
                    "index.js": "require('foo/stuff')"
                }
            },
            "foo": {
                files: {
                    "index.js": "",
                    "stuff/index.js": ""
                }
            }
        });

        let programIndex = bundleAbstraction.packageAbstractions.get("default").fileAbstractions.get("index.js");

        let fooRequired = programIndex.findRequireStatements(/.*/)[0]
        const rq = fooRequired.resolve();
        should(rq.packageAbstraction.name).equal("foo")
        should(rq.fuseBoxPath).equal("stuff/index.js");
    }

    "Should resolve scoped repository"() {
        const bundleAbstraction = createBundleAbstraction({
            "default": {
                files: {
                    "index.js": "require('@angular/core')"
                }
            },
            "@angular/core": {
                files: {
                    "index.js": ""
                }
            }
        });

        let programIndex = bundleAbstraction.packageAbstractions.get("default").fileAbstractions.get("index.js");

        let angularCoreRq = programIndex.findRequireStatements(/.*/)[0]
        const rq = angularCoreRq.resolve();
        should(rq.packageAbstraction.name).equal("@angular/core")
        should(rq.fuseBoxPath).equal("index.js");
    }


    "Should find an abstraction with priority on a file"() {
        const files = new Map<string, string>();
        files.set("foo/bar/index.js", "require('./world')");
        files.set("foo/bar/world/index.js", "");
        files.set("foo/bar/world.js", "");


        const pkg = createDefaultPackageAbstraction(files);

        const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
        const worldReference = indexFile.findRequireStatements(/.*/)[0]

        const res = worldReference.resolve();

        should(res)
            .beOkay()
            .mutate((res: FileAbstraction​​) => res.fuseBoxPath)
            .equal("foo/bar/world.js");
    }
}
