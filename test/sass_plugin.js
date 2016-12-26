const should = require('should');
const getTestEnv = require('./fixtures/lib').getTestEnv;
const SassPlugin = require('../dist/commonjs/plugins/SassPlugin').SassPlugin;
const RawPlugin = require('../dist/commonjs/plugins/RawPlugin').RawPlugin;

const file = `
$c1: #ccc;

body {
	background-color: $c1;
}
`;

describe('SassPlugin', () => {
	it('Should return compiled css', () => {
		return getTestEnv({
			'style.scss': file
		}, '>style.scss', null, [[SassPlugin({}), RawPlugin()]]).then(root => {
			let result = root.FuseBox.import('./style.scss');
			
			result.should.equal('body {\n  background-color: #ccc; }\n');
			
			return true
		});
	});
});