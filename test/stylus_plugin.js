const should = require('should');
const getTestEnv = require('./fixtures/lib').getTestEnv;
const StylusPlugin = require('../dist/commonjs/plugins/StylusPlugin').StylusPlugin;
const RawPlugin = require('../dist/commonjs/plugins/RawPlugin').RawPlugin;

describe('StylusPlugin', () => {
	it('test #1', done => {
		getTestEnv({
			'style.styl': `
				body
					color white
			`
		}, '>style.styl', null, [[StylusPlugin({}), RawPlugin()]]).then(root => {
			let result = root.FuseBox.import('./style.styl');
			
			result.should.equal('body {\n  color: #fff;\n}\n');
			
			done();
		}).catch(done);
	});
});