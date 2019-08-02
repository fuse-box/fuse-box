import { sparky } from './src/sparky/sparky';
import { IBumpVersionType } from './src/sparky/bumpVersion';
import { npmPublish } from './src/sparky/npmPublish';

const TypeDoc = require("typedoc")
const typedocApp = new TypeDoc.Application({
  experimentalDecorators: true,
  logger: "console",
  mode:   "modules",
  module: "CommonJS",
  target: "ES6",
  ignoreCompilerErrors: true,
  excludePrivate: true,
  excludeExternals: true,
  allowJs: false,
  exclude: "**/*.test.ts",
})

const typedocProject = typedocApp.convert(typedocApp.expandInputFiles([
  "src/core/FuseBox.ts",
]))

class Context {
  npmTag: 'latest' | 'alpha' | 'next';
  versionBumpType: IBumpVersionType;
}
const { src, rm, task, exec } = sparky(Context);

task('transpile', async c => {
  await src('src/**/**.ts')
    .filter(file => {
      return !(/([_]+(benchmark|playground))/.test(file) || /__test(s)?__/.test(file));
    })
    .tsc({ target: 'ES2017', outDir: './dist', declaration: true, module: 'CommonJS' })
    .exec();
});

task('clean', async () => {
  await rm('dist');
});

// replacing the path (since we copy everything to dist)
task('fix-env', async () => {
  const package_json = require('./dist/package.json');
  await src('dist/env.js')
    .contentsOf('env.js', str => {
      str = str.replace(/FUSE_ROOT\s*=\s*(appRoot.path)/, 'FUSE_ROOT = __dirname;');
      str = str.replace(/VERSION\s*=\s*[^;]+/, `VERSION = '${package_json.version}'`);
      return str;
    })
    .write()
    .exec();
});

// bump version to automate
task('bump-version', async ctx => {
  await src('package.json')
    .bumpVersion('package.json', { type: ctx.versionBumpType || 'alpha' })
    .write()
    .dest('dist/', __dirname)
    .exec();
});

// copy essential modules (will reside alongside with everything else)
task('copy-modules', async () => {
  await src('./modules/**/**.*')
    .dest('dist/modules', 'modules')
    .exec();
});

task('copy-various', async () => {
  await src('./src/production/api/production.api.js')
    .dest('dist/', 'src')
    .exec();
});

task('publish', async ctx => {
  await exec('dist');
  await npmPublish({ path: 'dist/', tag: ctx.npmTag || 'next' });
});

task('publish-alpha', async ctx => {
  ctx.versionBumpType = 'alpha';
  ctx.npmTag = 'alpha';
  await exec('publish');
});

task('dist', async ctx => {
  ctx.versionBumpType = 'alpha';
  await exec('clean');
  await exec('transpile');
  await exec('copy-modules');
  await exec('copy-various');
  await exec('bump-version');
  await exec('fix-env');
});


task("document", async ctx => {
  //    const configuration = context.getConfig()
  //    console.dir(context.getConfig().context.tsConfig)
  //    process.exit()
  console.log(typedocProject == null)
  if (typedocProject) { // Project may not have converted correctly
    const outputDir = "docs/api"
    // Rendered docs
    await typedocApp.generateDocs(typedocProject, outputDir)
  }
})
