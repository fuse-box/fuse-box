const should = require('should');
const getTestEnv = require('./fixtures/lib').getTestEnv;
const RawPlugin = require('../dist/commonjs/plugins/RawPlugin').RawPlugin;

const rawFile = `
this is
	raw
		content
`

describe('RawPlugin', () => {
	it('test #1', done => {
		getTestEnv({
			'file.raw': rawFile
		}, '>file.raw', null, [RawPlugin({extensions: '.raw'})]).then(root => {
			let result = root.FuseBox.import('./file.raw');
			
			result.should.equal('\nthis is\n\traw\n\t\tcontent\n');
			
			done();
		}).catch(done);
	});

	it('test #2', done => {
		getTestEnv({
			'entry.js': `
				require('./file1.raw');
				require('./file2.onemoreraw');
			`,
			'file1.raw': rawFile,
			'file2.onemoreraw': rawFile
		}, '>entry.js', null, [[/raw$/, RawPlugin({extensions: ['.raw', '.onemoreraw']})]]).then(root => {
			const fileRaw1 = root.FuseBox.import('./file1.raw');
			const fileRaw2 = root.FuseBox.import('./file2.onemoreraw');

			fileRaw1.should.equal('\nthis is\n\traw\n\t\tcontent\n');
			fileRaw2.should.equal('\nthis is\n\traw\n\t\tcontent\n');

			done();
		}).catch(done);
	});
});