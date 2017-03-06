import { Arithmetic, Fluent } from '../arithmetic/Arithmetic';
import { should } from "fuse-test-runner";

export class ArithmeticTest {
    "should parse multiple bundles extending from a single bundle fluently"() {
      const result = Fluent
        .init()
        .startBundle('coolbundle')
        .ignoreDeps()
        .and('>ooo.js')
        .add('ahhhh.js')
        .add('fuse.magic.ts')
        .add('*/**.js')
        .include('path')
        .include('fs')
        .exclude('magic-in-me')
        .finishBundle()

      const singleBundle = result.finish()

      const multipleBundles = result
        .startBundle('webworker')
        .includeDeps()
        .execute('/src/eh.js')
        .add('webworkerfile.js')
        .exclude('fs')
        .finishBundle()
        .finish()

      should(typeof singleBundle).deepEqual('string')
      should(typeof multipleBundles).deepEqual('object')
    }

    "should parse multiple bundles fluently"() {
      const multipleBundles = Fluent
        .init()
        .startBundle('coolbundle')
        .ignoreDeps()
        .and('>ooo.js')
        .add('ahhhh.js')
        .add('fuse.magic.ts')
        .add('*/**.js')
        .include('path')
        .include('fs')
        .exclude('magic-in-me')
        .finishBundle()

        .startBundle('webworker')
        .includeDeps()
        .execute('/src/eh.js')
        .add('webworkerfile.js')
        .exclude('fs')
        .finishBundle()
        .finish()

      should(typeof multipleBundles).deepEqual('object')
    }
    "should handle a single bundle fluently"() {
      const result = Fluent
        .init()
        .startBundle('coolbundle')
        .ignoreDeps()
        .and('>ooo.js')
        .add('ahhhh.js')
        .add('fuse.magic.ts')
        .add('*/**.js')
        .include('path')
        .include('fs')
        .exclude('magic-in-me')
        .finishBundle()

      const singleBundle = result.finish()

      should(typeof singleBundle).deepEqual('string')
    }

    "isArithmetic should detect arithmetics properly"() {
      const isArithmeticTrue = Fluent.isArithmetic('!^>[index.js] +[**/*.js] -path')
      const isArithmeticFalse = Fluent.isArithmetic('eh...')
      should(isArithmeticTrue).deepEqual(true)
      should(isArithmeticFalse).deepEqual(false)
    }

    "should parse a single bundle fluently"() {
      const singleBundle = Fluent
        .init()
        .startBundle('coolbundle')
        .ignoreDeps()
        .execute('main/app.js')
        .exclude('path')
        .include('inferno')
        .noCache()
        .noApi()
        .finishBundle()
        .finish()

      should(typeof singleBundle).deepEqual('string')
      let parsed = Arithmetic.parse(singleBundle);

      should(parsed.str.includes('!'))
          .deepEqual(true)

      should(parsed.str.includes('^'))
          .deepEqual(true)

      should(parsed.entry)
          .deepEqual({ "main/app.js": false })

      should(parsed.excluding)
          .deepEqual({ 'path': true });

      should(parsed.including)
          .deepEqual({ 'main/app.js': false, 'inferno': true });

    }

    "Should parse a simple test"() {
        let result = Arithmetic.parse(`src/**/*.js  -[main/app.js]`);
        should(result.including)
            .deepEqual({ 'src/**/*.js': true })

        should(result.excluding)
            .deepEqual({ 'main/app.js': false })
    }

    "Should parse a simple test with extra space"() {
        let result = Arithmetic.parse(`src/**/*.js  -[main/app.js] `);
        should(result.including)
            .deepEqual({ 'src/**/*.js': true })

        should(result.excluding)
            .deepEqual({ 'main/app.js': false })
    }

    "Should parse only one condition (including deps)"() {
        let result = Arithmetic.parse(`src/**/*.js`);
        should(result.including)
            .deepEqual({ 'src/**/*.js': true })
    }

    "Should parse only one condition (excluding deps)"() {
        let result = Arithmetic.parse(`[src/**/*.js]`);
        should(result.including)
            .deepEqual({ 'src/**/*.js': false })
    }

    "Should 3 conditions"() {
        let result = Arithmetic.parse(`src/**/*.js  -main/app.js src/lib/service.js`);
        should(result.including)
            .deepEqual({ 'src/**/*.js': true, 'src/lib/service.js': true });

        should(result.excluding)
            .deepEqual({ 'main/app.js': true });
    }

    "Should 3 conditions (one without deps)"() {
        let result = Arithmetic.parse(`src/**/*.js  -[main/app.js] src/lib/service.js`);
        should(result.including)
            .deepEqual({ 'src/**/*.js': true, 'src/lib/service.js': true });

        should(result.excluding)
            .deepEqual({ 'main/app.js': false });
    }

    "Should understand extra spaces and pluses"() {
        let result = Arithmetic.parse(`   + src/**/*.js  - main/app.js] + src/lib/service.js`);
        should(result.including)
            .deepEqual({ 'src/**/*.js': true, 'src/lib/service.js': true });

        should(result.excluding)
            .deepEqual({ 'main/app.js': true });
    }

    "Should understand an entry point with deps"() {
        let result = Arithmetic.parse(` > main/app  -path`);

        should(result.entry)
            .deepEqual({ "main/app": true })

        should(result.excluding)
            .deepEqual({ 'path': true });
    }

    "Should include an entry point"() {
        let result = Arithmetic.parse(` > main/app.js`);

        should(result.entry)
            .deepEqual({ "main/app.js": true })

        should(result.including)
            .deepEqual({ "main/app.js": true })
    }


    "Should understand an entry point without deps"() {
        let result = Arithmetic.parse(` > [main/app.js]  -path`);

        should(result.entry)
            .deepEqual({ "main/app.js": false })

        should(result.excluding)
            .deepEqual({ 'path': true });
    }

    "Should add explicit require"() {
        let result = Arithmetic.parse(` > [main/app.js]  @blueprint/core`);

        should(result.including)
            .deepEqual({ 'main/app.js': false, '@blueprint/core': true })
    }

    "Should exclude explicit require"() {
        let result = Arithmetic.parse(` > [main/app.js]  - @blueprint/core`);

        should(result.excluding)
            .deepEqual({ '@blueprint/core': true });
    }

    "Should get deps only"() {
        let result = Arithmetic.parse(`~ index.ts `);

        should(result.including).deepEqual({})
        should(result.excluding).deepEqual({})
        should(result.depsOnly).deepEqual({ "index.ts": true });
    }

    "Should get deps only and additional dependency"() {
        let result = Arithmetic.parse(` ~ index.ts  + path`);

        should(result.including).deepEqual({ path: true })
        should(result.excluding).deepEqual({})
        should(result.depsOnly).deepEqual({ "index.ts": true });
    }

    "Should get deps only minus additional dependency"() {
        let result = Arithmetic.parse(`~ index.ts - path`);

        should(result.including).deepEqual({})
        should(result.excluding).deepEqual({ path: true })
        should(result.depsOnly).deepEqual({ "index.ts": true });
    }
}
