const should = require('should');
const sinon = require('sinon');
const getTestEnv = require('./fixtures/lib').getTestEnv;
const build = require(`../dist/commonjs/index.js`);
const BannerPlugin = build.BannerPlugin;

const banner = `/** This is my header for bundle. */`;

describe('BannerPlugin', () => {
    it(`Should call 'context.source.addContent' with right banner param`, () => {
        const bannerPluginInst = BannerPlugin(banner);

        let addContentSpy;

        const stub = sinon.stub(bannerPluginInst, 'preBundle', (context) => {
            addContentSpy = sinon.spy(context.source, 'addContent');

            bannerPluginInst.preBundle.restore();

            bannerPluginInst.preBundle(context);

            context.source.addContent.restore();
        });

        return getTestEnv({
            'entry.js': '',
        }, '>entry.js', { plugins: [bannerPluginInst] }, true).then((concat) => {
            const code = concat.content.toString();

            addContentSpy.called.should.equal(true);
            addContentSpy.calledWith(banner).should.equal(true);

            addContentSpy.reset();

            (code.match(new RegExp(banner.replace(/(\/|\*)/g, '\\$1'))) !== null).should.equal(true);

            return true;
        });
    });
});
