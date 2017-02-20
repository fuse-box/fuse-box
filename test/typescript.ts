import should = require('should');
const getTestEnv = require('./fixtures/lib').getTestEnv;
const build = require(`../dist/commonjs/index.js`);
const BannerPlugin = build.BannerPlugin;


describe('Typescript tests', () => {
    it(`Should pass contents to any plugin that has jsx|js from transpiled file`, () => {

        let hasHapened = false;
        const fakePlugin = {
            test: /\.(j|t)s(x)?$/,
            transform: () => {
                hasHapened = true;
            }
        }

        return getTestEnv({
            'index.ts': 'export const hello = 1'
        }, '>index.ts', { plugins: [fakePlugin] }, true).then((concat) => {
            hasHapened.should.equal(true);
            return true;
        });
    });
});