import { IBumpVersionType } from './src/sparky/bumpVersion';
import { npmPublish } from './src/sparky/npmPublish';
import { sparky } from './src/sparky/sparky';
import { tsc } from './src/sparky/tsc';

class Context {
  npmTag: 'latest' | 'alpha' | 'next';
  versionBumpType: IBumpVersionType;
}
const { src, rm, task, exec } = sparky(Context);

function runTypeChecker() {
  const typeChecker = require('fuse-box-typechecker').TypeChecker({
    tsConfig: './src/tsconfig.json',
    basePath: './',
    name: 'typecheck',
    throwOnSyntactic: true,
    throwOnSemantic: true,
    throwOnGlobal: true,
  });
  // to run it right away
  typeChecker.printSettings();

  return typeChecker.inspectAndPrint();
}
task('transpile', async c => {
  await tsc(
    {
      declaration: true,
      module: 'CommonJS',
      skipLibCheck: true,
      target: 'ES2017',
      outDir: 'dist',
    },
    'src/index.ts',
  );
});

task('clean', async () => {
  await rm('dist');
});

task('typecheck', () => {
  runTypeChecker();
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
    .bumpVersion('package.json', { type: 'next' })
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
  await npmPublish({ path: 'dist/', tag: 'next' });
});

task('publish-next', async ctx => {
  await exec('publish');
});

task('dist', async ctx => {
  await exec('clean');
  await exec('typecheck');
  await exec('transpile');
  await exec('copy-modules');
  await exec('copy-various');
  await exec('bump-version');
  await exec('fix-env');
});

task('document', async ctx => {
  const TypeDoc = require('typedoc');
  const typedocApp = new TypeDoc.Application({
    experimentalDecorators: true,
    logger: 'console',
    mode: 'modules',
    module: 'CommonJS',
    target: 'ES6',
    ignoreCompilerErrors: true,
    excludePrivate: true,
    excludeExternals: true,
    allowJs: false,
    exclude: '**/*.test.ts',
  });

  const typedocProject = typedocApp.convert(typedocApp.expandInputFiles(['src/core/FuseBox.ts']));

  if (typedocProject) {
    // Project may not have converted correctly
    const outputDir = 'docs/api';
    // Rendered docs
    await typedocApp.generateDocs(typedocProject, outputDir);
  }
});
