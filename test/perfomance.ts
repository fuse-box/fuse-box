import should = require("should");
const ensureImport = should;
const build = require(`../dist/commonjs/index.js`);
const FuseBox = build.FuseBox;

const IS_CI = 'CI' in process.env;

const options = {
    log: false,
    cache: false,
    plugins: [build.JSONPlugin()],
};

function runFuse(opts, str) {
    (options as any).files = opts.files

    return new FuseBox(options).bundle(str);
}

function test(fN, iN) {
    const files = {};
    const range = [...Array(fN).keys()];
    const itterations = [...Array(iN || 1).keys()];

    range.reduceRight((prev, cur, idx, array) => {
        if (idx + 1 === array.length - 1) {
            files[`file-${prev}.js`] = `module.exports = 'content';`
        }

        files[`file-${cur}.js`] = `require('file-${prev}.js');`;

        return cur;
    });

    const startTime = new Date().getTime();
    return itterations.reduce((prev, cur) => {
        return prev.then(() => {
            return runFuse({ files }, '**/*.js');
        });
    }, Promise.resolve(true)).then(() => {
        return new Date().getTime() - startTime;
    });
}

const data = [
    /** [files, maxTime, itteration] */
    [10, 100],
    [100, 150],
    [1000, 1500],
    //[2000, 3000],
    //[10, 12000, 1000],
    //[1200, 12000, 10]
];

describe('Perfomance test', function() {
    this.timeout(IS_CI ? 10000 * 100 : 20000);

    data.forEach(value => {
        it(`Should create an assembly from ${value[0]} files${value[2] ? ' ' + value[2] + ' times' : ''} of less than ${value[1]} ms`, () => {
            return test(value[0], value[2]).then(diff => {
                if (!IS_CI) {
                    should.equal(diff <= value[1], true, `Actual diff: ${diff}`);
                }

                return true;
            });
        });
    });
});