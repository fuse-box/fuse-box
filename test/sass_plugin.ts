import should = require('should');
const build = require(`../dist/commonjs/index.js`);
const getTestEnv = require('./fixtures/lib').getTestEnv;
const SassPlugin = build.SassPlugin;
const RawPlugin = build.RawPlugin;

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
        }, '>style.scss', {
            plugins: [
                [SassPlugin({}), RawPlugin()]
            ]
        }).then(root => {
            let result = root.FuseBox.import('./style.scss');

            result.should.equal(`body {
  background-color: #ccc; }

/*# sourceMappingURL=style.scss.map */`);

            return true
        });
    });
});