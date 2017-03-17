import {string2RegExp, replaceExt, findFileBackwards, replaceAliasRequireStatement, ensureFuseBoxPath} from "../Utils";
import {should} from "fuse-test-runner";
import * as path from "path";
import {getStubsFolder} from "./stubs/TestEnvironment";

export class UtilsTest {
    "Should convert string to regex (1)"() {
        should("/etc/lib/styles/hello/hello/match.css").match(
            string2RegExp("lib/styles/*/hello/*.css")
        );
        should("/etc/lib/styles/match.css").notMatch(
            string2RegExp("lib/styles/*/hello/*.css")
        );

        should("/etc/lib/styles/hello.css").notMatch(
            string2RegExp("lib/styles/*/hello/*.css")
        );

        should("libs/styles/hello.css").notMatch(
            string2RegExp("lib/styles/*/hello/*.css")
        );
    }

    "Should pass ^ $"() {
        should("lib/styles/hello/hello/match.css").match(
            string2RegExp("^lib/styles/*/hello/*.css")
        );

        should("/sdfsd/lib/styles/hello/hello/match.css").notMatch(
            string2RegExp("^lib/styles/*/hello/*.css")
        );

        should("lib/styles/hello/hello/match.css").match(
            string2RegExp("^lib/styles/*/hello/*.css$")
        );

        should("lib/styles/hell111o/aasdfsd.css").notMatch(
            string2RegExp("^lib/styles/*/hello/*.css$")
        );
    }

    "Should convert string to regex (extensions)"() {
        should("libs/styles/hello.css").match(
            string2RegExp("*.css")
        );

        should("libs/styles/hello.css").notMatch(
            string2RegExp("^*.css")
        );
    }

    "Should understand **"() {
        should("libs/styles/hello.css").notMatch(
            string2RegExp("libs/*")
        );
        should("libs/styles/hello.css").match(
            string2RegExp("libs/**")
        );
    }

    "Should understand just *"() {
        should("libs/styles/hello.css").match(
            string2RegExp("*")
        );
    }


    "Should replaceExt correctly with ext"() {

        let res = replaceExt("a/hello.ts", ".js");
        should(res).equal("a/hello.js");
    }

    "Should replaceExt correctly with ext (capital case)"() {

        let res = replaceExt("a/hello.TS", ".js");
        should(res).equal("a/hello.js");
    }

    "Should replaceExt correctly without ext"() {

        let res = replaceExt("a/hello", ".js");
        should(res).equal("a/hello.js");
    }

    "Should find file backwards"() {
        let rootFolder = path.join(getStubsFolder(), "foo");
        let res = findFileBackwards(path.join(rootFolder, "a/b/c/tsconfig.json"), rootFolder);
        res = ensureFuseBoxPath(res); // windows OS fix
        should(res).match(/\/a\/b\/tsconfig.json$/);
    }

    "Should replace alias"() {
        let res = replaceAliasRequireStatement("foo/bar", "foo", "~/hello/world/foo/");
        res = ensureFuseBoxPath(res); // windows OS fix
        should(res).equal("~/hello/world/foo/bar");

    }
}