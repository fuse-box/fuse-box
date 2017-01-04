const should = require('should');
const getTestEnv = require('./fixtures/lib').getTestEnv;
const build = require(`../${process.env.TRAVIS ? "dist" : "build"}/commonjs/index.js`);

const UglifyJSPlugin = build.UglifyJSPlugin;

const file = `
var longVar = 'str1';
var longVar2 = 'str2';

module.exports = function () {return longVar + ' ' + longVar2;}
`;

describe('UglifyJSPlugin', () => {
	it('Should return compressed js 1', () => {
		return getTestEnv({
			'index.js': file
		}, '>index.js', {plugins: [UglifyJSPlugin()]}).then(root => {
			let result = root.FuseBox.import('./index.js');
			
			result().should.equal('str1 str2');
			
			return true;
		});
	});

	it('Should return compressed js 2', () => {
		return getTestEnv({
			'index.js': file
		}, '>index.js', {
			plugins: [UglifyJSPlugin()],
			globals: {default: '__compressed__'}
		}).then(root => {
			let result = root.FuseBox.import('./index.js');

			('__compressed__' in root).should.equal(true);
			root.__compressed__().should.equal('str1 str2');
			
			return true;
		});
	});
});