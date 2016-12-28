const should = require('should');
const getTestEnv = require('./fixtures/lib').getTestEnv;
const UglifyJSPlugin = require('../dist/commonjs/plugins/UglifyJSPlugin').UglifyJSPlugin;

const file = `
var longVar = 'str1';
var longVar2 = 'str2';

module.exports = function () {return longVar + ' ' + longVar2;}
`;

describe('UglifyJSPlugin', () => {
	it('Should return compressed js', () => {
		return getTestEnv({
			'index.js': file
		}, '>index.js', null, [UglifyJSPlugin()]).then(root => {
			let result = root.FuseBox.import('./index.js');
			
			result().should.equal('str1 str2');
			
			return true;
		});
	});
});