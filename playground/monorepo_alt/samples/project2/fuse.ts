import { sparky, fusebox } from '../../../../src';
import { pluginTypeChecker } from 'fuse-box-typechecker';

class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      target: 'browser',
      output: './dist',
      homeDir: '../../',
      entry: 'samples/project2/src/index.ts',
      webIndex: {
        template: 'src/index.html',
      },
      logging: { level: 'verbose' },
      cache: false,
      devServer: true,
      plugins: [
        pluginTypeChecker({
          basePath:'playground/monorepo_alt/samples/project2',
          tsConfig: './tsconfig.json',
        }),
      ],
    });
  }
}
const { task, rm } = sparky<Context>(Context);

task('default', async ctx => {
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runDev();
});

task('preview', async ctx => {
  await rm('./dist');
  ctx.runServer = true;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
task('dist', async ctx => {
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
