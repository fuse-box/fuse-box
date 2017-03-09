import { Arithmetic } from "../arithmetic/Arithmetic";
import { should } from "fuse-test-runner";

export class ArithmeticTest {
    "Should parse a simple test"() {
        let result = Arithmetic.parse(`src/**/*.js  -[main/app.js]`);
        should(result.including)
            .deepEqual({ "src/**/*.js": true });

        should(result.excluding)
            .deepEqual({ "main/app.js": false });
    }

    "Should parse a simple test with extra space"() {
        let result = Arithmetic.parse(`src/**/*.js  -[main/app.js] `);
        should(result.including)
            .deepEqual({ "src/**/*.js": true });

        should(result.excluding)
            .deepEqual({ "main/app.js": false });
    }

    "Should parse only one condition (including deps)"() {
        let result = Arithmetic.parse(`src/**/*.js`);
        should(result.including)
            .deepEqual({ "src/**/*.js": true });
    }

    "Should parse only one condition (excluding deps)"() {
        let result = Arithmetic.parse(`[src/**/*.js]`);
        should(result.including)
            .deepEqual({ "src/**/*.js": false });
    }

    "Should 3 conditions"() {
        let result = Arithmetic.parse(`src/**/*.js  -main/app.js src/lib/service.js`);
        should(result.including)
            .deepEqual({ "src/**/*.js": true, "src/lib/service.js": true });

        should(result.excluding)
            .deepEqual({ "main/app.js": true });
    }

    "Should 3 conditions (one without deps)"() {
        let result = Arithmetic.parse(`src/**/*.js  -[main/app.js] src/lib/service.js`);
        should(result.including)
            .deepEqual({ "src/**/*.js": true, "src/lib/service.js": true });

        should(result.excluding)
            .deepEqual({ "main/app.js": false });
    }

    "Should understand extra spaces and pluses"() {
        let result = Arithmetic.parse(`   + src/**/*.js  - main/app.js] + src/lib/service.js`);
        should(result.including)
            .deepEqual({ "src/**/*.js": true, "src/lib/service.js": true });

        should(result.excluding)
            .deepEqual({ "main/app.js": true });
    }

    "Should understand an entry point with deps"() {
        let result = Arithmetic.parse(` > main/app  -path`);

        should(result.entry)
            .deepEqual({ "main/app": true });

        should(result.excluding)
            .deepEqual({ "path": true });
    }

    "Should include an entry point"() {
        let result = Arithmetic.parse(` > main/app.js`);

        should(result.entry)
            .deepEqual({ "main/app.js": true });

        should(result.including)
            .deepEqual({ "main/app.js": true });
    }

    "Should understand an entry point without deps"() {
        let result = Arithmetic.parse(` > [main/app.js]  -path`);

        should(result.entry)
            .deepEqual({ "main/app.js": false });

        should(result.excluding)
            .deepEqual({ "path": true });
    }

    "Should add explicit require"() {
        let result = Arithmetic.parse(` > [main/app.js]  @blueprint/core`);

        should(result.including)
            .deepEqual({ "main/app.js": false, "@blueprint/core": true });
    }

    "Should exclude explicit require"() {
        let result = Arithmetic.parse(` > [main/app.js]  - @blueprint/core`);

        should(result.excluding)
            .deepEqual({ "@blueprint/core": true });
    }

    "Should get deps only"() {
        let result = Arithmetic.parse(`~ index.ts `);

        should(result.including).deepEqual({});
        should(result.excluding).deepEqual({});
        should(result.depsOnly).deepEqual({ "index.ts": true });
    }

    "Should get deps only and additional dependency"() {
        let result = Arithmetic.parse(` ~ index.ts  + path`);

        should(result.including).deepEqual({ path: true });
        should(result.excluding).deepEqual({});
        should(result.depsOnly).deepEqual({ "index.ts": true });
    }

    "Should get deps only minus additional dependency"() {
        let result = Arithmetic.parse(`~ index.ts - path`);

        should(result.including).deepEqual({});
        should(result.excluding).deepEqual({ path: true });
        should(result.depsOnly).deepEqual({ "index.ts": true });
    }
}
