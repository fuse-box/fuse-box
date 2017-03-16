import { string2RegExp } from "../Utils";
import { should } from "fuse-test-runner";
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
}
