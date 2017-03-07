const should = require('should');
const getTestEnv = require('./fixtures/lib.js').getTestEnv;

describe('Events', (done) => {

    it('Register event after-import', (done) => {
        getTestEnv({
            'index.js': 'exports.bar = 1; require(\'./foo/bar\')',
            'foo/bar.js': 'module.exports = {bar : 1}',
        }, '**/*.js').then(root => {
            let results = [];
            root.FuseBox.on('after-import', (exports, require, module, __filename, __dirname, pkg) => {

                results.push([exports, __filename, __dirname, pkg]);
            });

            let result = root.FuseBox.import('./index');
            setTimeout(() => {
                results.should.deepEqual([
                    [{}, 'foo/bar.js', 'foo', 'default'],
                    [{ bar: 1 }, 'index.js', './', 'default'],
                ]);
                done();
            }, 10);
        }).catch(done);
    });

    it('Register before-import', (done) => {
        getTestEnv({
            'index.js': 'exports.bar = 1; require(\'./foo/bar\')',
            'foo/bar.js': 'module.exports = {bar : 1}',
        }, '**/*.js').then(root => {
            let results = [];
            root.FuseBox.on('before-import', (exports, require, module, __filename, __dirname, pkg) => {

                results.push([exports, __filename, __dirname, pkg]);
            });

            let result = root.FuseBox.import('./index');
            setTimeout(() => {
                results.should.deepEqual([
                    [{ bar: 1 }, 'index.js', './', 'default'],
                    [{}, 'foo/bar.js', 'foo', 'default'],
                ]);
                done();
            }, 10);
        }).catch(done);
    });

    it('Register before-import deeper', (done) => {
        getTestEnv({
            'index.js': 'exports.bar = 1; require(\'./foo/bar\')',
            'foo/bar/a/b/c.js': 'module.exports = {bar : 1}',
        }, '**/*.js').then(root => {
            let results = [];
            root.FuseBox.on('before-import', (exports, require, module, __filename, __dirname, pkg) => {

                results.push([exports, __filename, __dirname, pkg]);
            });

            let result = root.FuseBox.import('./foo/bar/a/b/c');
            setTimeout(() => {

                results.should.deepEqual([
                    [{}, 'foo/bar/a/b/c.js', 'foo/bar/a/b', 'default'],
                ]);
                done();
            }, 10);
        }).catch(done);
    });

});
