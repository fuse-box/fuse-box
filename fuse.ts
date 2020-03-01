import { IBumpVersionType } from './src/sparky/bumpVersion';
import { npmPublish } from './src/sparky/npmPublish';
import { sparky } from './src/sparky/sparky';
import { tsc } from './src/sparky/tsc';

class Context {
  npmTag: string;
  versionBumpType: IBumpVersionType;
}
const { exec, rm, src, task } = sparky(Context);

function runTypeChecker() {
  const typeChecker = require('fuse-box-typechecker').TypeChecker({
    basePath: './',
    name: 'typecheck',
    throwOnGlobal: true,
    throwOnSemantic: true,
    throwOnSyntactic: true,
    tsConfig: './src/tsconfig.json',
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
    ['src/index.ts', 'src/threading/worker_threads/ProcessThread.ts'],
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

      str = str.replace(
        /WORKER_THREAD\s*=\s*[^;]+/,
        `WORKER_THREAD = path.resolve(__dirname, 'threading/worker_threads/ProcessThread.js')`,
      );
      return str;
    })
    .write()
    .exec();
});

// bump version to automate
task('bump-version', async ctx => {
  await src('package.json')
    .bumpVersion('package.json', { type: ctx.npmTag as any })
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

  await npmPublish({ path: 'dist/', tag: ctx.npmTag });
});

task('publish-next', async ctx => {
  ctx.npmTag = 'next';
  await exec('publish');
});
task('publish-alpha', async ctx => {
  ctx.npmTag = 'alpha';
  await exec('publish');
});

task('dist-alpha', async ctx => {
  ctx.npmTag = 'alpha';
  await exec('dist');
});

task('public-alpha', async ctx => {
  ctx.npmTag = 'alpha';
  await exec('publish');
});

task('dist', async ctx => {
  await exec('clean');
  //await exec('typecheck');
  await exec('transpile');
  await exec('copy-modules');
  await exec('copy-various');
  await exec('bump-version');
  await exec('fix-env');
});

task('document', async ctx => {
  const TypeDoc = require('typedoc');
  const typedocApp = new TypeDoc.Application({
    allowJs: false,
    exclude: '**/*.test.ts',
    excludeExternals: true,
    excludePrivate: true,
    experimentalDecorators: true,
    ignoreCompilerErrors: true,
    logger: 'console',
    mode: 'modules',
    module: 'CommonJS',
    target: 'ES6',
  });

  const typedocProject = typedocApp.convert(typedocApp.expandInputFiles(['src/core/FuseBox.ts']));

  if (typedocProject) {
    // Project may not have converted correctly
    const outputDir = 'docs/api';
    // Rendered docs
    await typedocApp.generateDocs(typedocProject, outputDir);
  }
});

task('dev-thread', async ctx => {
  const { fusebox } = require('./dist');
  const fuse = fusebox({
    cache: { enabled: true },
    dependencies: { serverIgnoreExternals: true },
    entry: 'src/threading/worker_threads/ProcessThread.ts',
    logging: { level: 'succinct' },
    target: 'server',
  });
  await fuse.runDev({
    bundles: { app: 'fuse_thread.js', distRoot: 'dist/dev-threads' },
  });
  //onComplete(({ server }) => server.start());
});
