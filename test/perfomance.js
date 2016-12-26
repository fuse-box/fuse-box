const should = require("should");
const build = require(`../${process.env.TRAVIS ? "dist" : "build"}/commonjs/index.js`);
const FuseBox = build.FuseBox;

function runFuse (options, str) {
	options = Object.assign({
		log: false,
		cache: false,
		plugins: [build.JSONPlugin()],
	}, options);

	return new FuseBox(options).bundle(str);
}

function test (n, plugins) {
	const files = {};
	const range = [...Array(n).keys()];

	range.reduceRight((prev, cur, idx, array) => {
		if (idx + 1 === array.length - 1) {
			files[`file-${prev}.js`] = `module.exports = 'content';`
		}

		files[`file-${cur}.js`] = `require('file-${prev}.js');`;

		return cur;
	});

	const startTime = new Date().getTime();
	return runFuse({files}, '**/*.js').then(root => {
		return new Date().getTime() - startTime;
	});
}

const data = [
	[10, 70],
	[100, 120],
	[1000, 1000],
	[2000, 2200]
];

describe('Pefomance test', function () {
	this.timeout(10000);

	data.forEach(value => {
		it(`Should create an assembly from ${value[0]} files of less than ${value[1]} ms`, () => {
			return test(value[0]).then(diff => {
				should.equal(diff <= value[1], true, `Actual diff: ${diff}`);

				return true;
			});
		});
	});
});