const build = require(`../dist/commonjs/index.js`);
const should = require("should");

const getAbsoluteEntryPath = build.getAbsoluteEntryPath;
const Module = build.Module;
const FuseBox = build.FuseBox;
const Arithmetic = build.Arithmetic;

describe("Arithmetic", () => {
    it("Should parse a simple test", () => {
        let result = Arithmetic.parse(`src/**/*.js  -[main/app.js]`);
        result.including.should.deepEqual({ 'src/**/*.js': true });
        result.excluding.should.deepEqual({ 'main/app.js': false });
    });

    it("Should parse a simple test with extra space", () => {
        let result = Arithmetic.parse(`src/**/*.js  -[main/app.js] `);
        result.including.should.deepEqual({ 'src/**/*.js': true });
        result.excluding.should.deepEqual({ 'main/app.js': false });
    });

    it("Should parse only one condition (including deps)", () => {
        let result = Arithmetic.parse(`src/**/*.js`);
        result.including.should.deepEqual({ 'src/**/*.js': true });
    });

    it("Should parse only one condition (excluding deps)", () => {
        let result = Arithmetic.parse(`[src/**/*.js]`);
        result.including.should.deepEqual({ 'src/**/*.js': false });
    });

    it("Should 3 conditions", () => {
        let result = Arithmetic.parse(`src/**/*.js  -main/app.js src/lib/service.js`);
        result.including.should.deepEqual({ 'src/**/*.js': true, 'src/lib/service.js': true });
        result.excluding.should.deepEqual({ 'main/app.js': true });
    });

    it("Should 3 conditions (one without deps)", () => {
        let result = Arithmetic.parse(`src/**/*.js  -[main/app.js] src/lib/service.js`);
        result.including.should.deepEqual({ 'src/**/*.js': true, 'src/lib/service.js': true });
        result.excluding.should.deepEqual({ 'main/app.js': false });
    });

    it("Should understand extra spaces and pluses", () => {
        let result = Arithmetic.parse(`   + src/**/*.js  - main/app.js] + src/lib/service.js`);
        result.including.should.deepEqual({ 'src/**/*.js': true, 'src/lib/service.js': true });
        result.excluding.should.deepEqual({ 'main/app.js': true });
    });

    it("Should understand an entry point with deps", () => {
        let result = Arithmetic.parse(` > main/app  -path`);

        result.excluding.should.deepEqual({ 'path': true });
        result.entry.should.deepEqual({ "main/app": true })
    });

    it("Should include an entry point", () => {
        let result = Arithmetic.parse(` > main/app`);
        result.entry.should.deepEqual({ "main/app": true })
        result.including.should.deepEqual({ "main/app": true })
    });


    it("Should understand an entry point without deps", () => {
        let result = Arithmetic.parse(` > [main/app]  -path`);

        result.excluding.should.deepEqual({ 'path': true });
        result.entry.should.deepEqual({ "main/app": false })
    });

})