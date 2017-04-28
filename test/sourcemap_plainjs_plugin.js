const build = require(`../dist/commonjs/index.js`);
const getTestEnv = require("./fixtures/lib").getTestEnv;
const should = require("should");
const file1 = `
module.exports = 'file1';
`;
const file2 = `
module.exports = 'file2';
`;

const defConf = {
    sourceMaps: true,
    outFile: 'sourcemaps.js',
    plugins: [build.SourceMapPlainJsPlugin()],
};

const expectedSourceMaps = `{"version":3,"sources":["index.js","file1.js","file2.js"],"names":["require","false","module","exports"],"mappings":";;;;AAAAA,OAAOC,CAACA,YAAYA,CAACA,CAACD,OAAOC,CAACA,YAAYA;;;;;ACC1CC,MAAMD,CAACE,QAAQF,EAAEA,OAAOA;;;;;;ACAxBC,MAAMD,CAACE,QAAQF,EAAEA,OAAOA","file":"","sourcesContent":["require('./file1.js');require('./file2.js')","\nmodule.exports = 'file1';\n","\nmodule.exports = 'file2';\n"]}`;
describe("SourceMapPlainJsPlugin", function() {
    it("Should create right sourcemap for plain js", () => {
        return getTestEnv({
            "index.js": `require('./file1.js');require('./file2.js')`,
            "file1.js": file1,
            "file2.js": file2,
        }, ">index.js", defConf, true).then(concat => {

            concat._sourceMap.should.be.okay;
            (concat.content.toString().match(/\/\/#\ssourceMappingURL=sourcemaps\.js\.map$/) !== null).should.equal(true);

            return true;
        });
    });

    it("Should create right sourcemap for minified plain js", () => {
        return getTestEnv({
            "index.js": `require('./file1.js');require('./file2.js')`,
            "file1.js": file1,
            "file2.js": file2,
        }, ">index.js", Object.assign(defConf, {
            plugins: [
                build.UglifyJSPlugin(),
                build.SourceMapPlainJsPlugin(),
            ],
        }), true).then(concat => {
            concat._sourceMap.should.be.okay;
            (concat.content.toString().match(/\/\/#\ssourceMappingURL=sourcemaps\.js\.map$/) !== null).should.equal(true);

            return true;
        });
    });
});
