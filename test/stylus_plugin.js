const should = require('should');
const build = require(`../dist/commonjs/index.js`);

const getTestEnv = require('./fixtures/lib').getTestEnv;
const StylusPlugin = build.StylusPlugin;
const RawPlugin = build.RawPlugin;

describe('StylusPlugin', () => {
    it('Should return compiled css', () => {
        return getTestEnv({
            'style.styl': `
				body
					color white
			`,
        }, '>style.styl', {
            plugins: [
                [StylusPlugin({}), RawPlugin()],
            ],
        }).then(root => {
            let result = root.FuseBox.import('./style.styl');

            result.should.equal('body {\n  color: #fff;\n}\n');

            return true;
        });
    });
});
