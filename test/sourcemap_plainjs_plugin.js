const build = require(`../${process.env.TRAVIS ? "dist" : "build"}/commonjs/index.js`);
const getTestEnv = require('./fixtures/lib').getTestEnv;

const file1 = `
module.exports = 'file1';
`;
const file2 = `
module.exports = 'file2';
`;

const defConf = {
	sourceMap: {
		bundleReference: 'sourcemaps.js.map'
	},
	plugins: [build.SourceMapPlainJsPlugin()]
};

describe('SourceMapPlainJsPlugin', function () {
	it('Should create right sourcemap for plain js', () => {
		return getTestEnv({
			'index.js': `require('./file1.js');require('./file2.js')`,
			'file1.js': file1,
			'file2.js': file2
		}, '>index.js', defConf, true).then(concat => {
			concat.sourceMap.should.equal(`{"version":3,"sources":["index.js","file1.js","file2.js"],"names":["require","false","module","exports"],"mappings":";;;;AAAAA,OAAOC,CAACA,YAAYA,CAACA,CAACD,OAAOC,CAACA,YAAYA;;;;;ACC1CC,MAAMD,CAACE,QAAQF,EAAEA,OAAOA;;;;;;ACAxBC,MAAMD,CAACE,QAAQF,EAAEA,OAAOA","file":"","sourcesContent":["require('./file1.js');require('./file2.js')","\\nmodule.exports = 'file1';\\n","\\nmodule.exports = 'file2';\\n"]}`);
			(concat.content.toString().match(/\/\/#\ssourceMappingURL=sourcemaps\.js\.map$/) !== null).should.equal(true);

			return true;
		});
	});

	it('Should create right sourcemap for minified plain js', () => {
		return getTestEnv({
			'index.js': `require('./file1.js');require('./file2.js')`,
			'file1.js': file1,
			'file2.js': file2
		}, '>index.js', Object.assign(defConf, {plugins: [
			build.UglifyJSPlugin(),
			build.SourceMapPlainJsPlugin()
		]}), true).then(concat => {
			concat.sourceMap.should.equal(`{"version":3,"sources":["index.js","file1.js","file2.js"],"names":["require","false","module","exports"],"mappings":"kFAAAA,EAAQC,cAAcD,EAAQC,sDCC9BC,EAAOC,QAAUF,gDCAjBC,EAAOC,QAAUF","file":"","sourcesContent":["require('./file1.js');require('./file2.js')","\\nmodule.exports = 'file1';\\n","\\nmodule.exports = 'file2';\\n"]}`);
			(concat.content.toString().match(/\/\/#\ssourceMappingURL=sourcemaps\.js\.map$/) !== null).should.equal(true);

			return true;
		});
	});
});