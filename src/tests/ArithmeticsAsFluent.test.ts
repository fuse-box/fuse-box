import { Arithmetic, Fluent } from "../arithmetic/Arithmetic";
import { should } from "fuse-test-runner";

export class ArithmeticAsFluentTest {
    public name: string = "ArithmeticAsFluentTest"

    "should parse multiple bundles extending from a single bundle fluently"() {
        const result = Fluent
        .init()
        .startBundle("cool")
        .ignoreDeps()
        .and(">ooo.js")
        .add("ahhhh.js")
        .add("fuse.magic.ts")
        .add("*/**.js")
        .include("path")
        .include("fs")
        .exclude("magic-in-me")
        .finishBundle();

        const singleBundle = result.finish();
        const multipleBundles = result
        .startBundle("canada")
        .includeDeps()
        .execute("/src/eh.js")
        .add("webworkerfile.js")
        .exclude("fs")
        .finishBundle()
        .finish();

        // single & multi
        should(Fluent.isArithmetic(singleBundle)).beTrue();
        should(typeof singleBundle).deepEqual("string");
        should(typeof multipleBundles).deepEqual("object");

        // data
        const cool = multipleBundles["cool"];
        const coolParsed = Arithmetic.parse(cool);

        // str
        should(Fluent.isArithmetic(cool)).beTrue();
        should(typeof cool).deepEqual("string");
        should(cool).deepEqual(coolParsed.str);
        should(cool)
        .deepEqual(`>ooo.js\n +[ahhhh.js]\n +[fuse.magic.ts]\n +[*/**.js]\n +path\n +fs\n -magic-in-me`);

        // parsed
        should(coolParsed.excluding).deepEqual({
            "magic-in-me": true,
        });
        should(coolParsed.including).deepEqual({
            "ooo.js": true,
            "ahhhh.js": false,
            "fuse.magic.ts": false,
            "*/**.js": false,
            path: true,
            fs: true,
        });
        should(coolParsed.entry).deepEqual({
            "ooo.js": true,
        });

        // data
        const canada = multipleBundles["canada"];
        const canadaParsed = Arithmetic.parse(canada);

        // str
        should(typeof canada)
        .deepEqual("string");
        should(Fluent.isArithmetic(canada))
        .beTrue();
        should(canada)
        .deepEqual(canadaParsed.str);
        should(canada.replace(/\s/gmi, ""))
        .deepEqual(`>/src/eh.js+webworkerfile.js-fs`);

        // parsed
        should(canadaParsed.depsOnly)
        .deepEqual({});
        should(canadaParsed.excluding)
        .deepEqual({
            fs: true,
        });
        should(canadaParsed.including)
        .deepEqual({
            "/src/eh.js": true,
            "webworkerfile.js": true,
        });
        should(canadaParsed.entry)
        .deepEqual({
            "/src/eh.js": true,
        });
    }

    "should parse multiple bundles fluently"() {
        const multipleBundles = Fluent
        .init()
        .startBundle("coolbundle")
        .ignoreDeps()
        .and(">ooo.js")
        .add("ahhhh.js")
        .add("fuse.magic.ts")
        .add("*/**.js")
        .include("path")
        .include("fs")
        .exclude("magic-in-me")
        .finishBundle()

        .startBundle("webworker")
        .includeDeps()
        .execute("/src/eh.js")
        .add("webworkerfile.js")
        .exclude("fs")
        .finishBundle()
        .finish();

        should(typeof multipleBundles).deepEqual("object");
    }
    "should handle a single bundle fluently"() {
        const result = Fluent
        .init()
        .startBundle("coolbundle")
        .ignoreDeps()
        .and(">ooo.js")
        .add("ahhhh.js")
        .add("fuse.magic.ts")
        .add("*/**.js")
        .include("path")
        .include("fs")
        .exclude("magic-in-me")
        .finishBundle();

        const singleBundle = result.finish();
        should(typeof singleBundle).deepEqual("string");
    }

    "isArithmetic should detect arithmetics properly"() {
        const isArithmetic = Fluent.isArithmetic("!^>[index.js] +[**/*.js] -path");
        const isNotArithmetic = Fluent.isArithmetic("eh...");
        should(isArithmetic).beTrue();
        should(isNotArithmetic).beFalse();
    }

    "should parse a single bundle fluently with no cache and no api"() {
        const singleBundle = Fluent
        .init()
        .startBundle("coolbundle")
        .ignoreDeps()
        .execute("main/app.js")
        .exclude("path")
        .include("inferno")
        .noCache()
        .noApi()
        .finishBundle()
        .finish();

        should(typeof singleBundle).deepEqual("string");
        let parsed = Arithmetic.parse(singleBundle);

        // no api / not standalone
        should(parsed.standalone).beFalse();
        should(parsed.str.includes("!")).beTrue();

        // no cache
        should(parsed.cache).beFalse();
        should(parsed.str.includes("^")).beTrue();

        should(parsed.entry)
        .deepEqual({ "main/app.js": false });

        should(parsed.excluding)
        .deepEqual({ "path": true });

        should(parsed.including)
        .deepEqual({ "main/app.js": false, "inferno": true });
    }
}
