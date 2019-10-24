import { pluginTypeChecker } from 'fuse-box-typechecker';
import { fusebox, sparky, pluginJSON, pluginLink } from '../../../../src';
class Context {
  public runServer?: boolean;
  public getConfig = () =>
    fusebox({
      homeDir: '../',
      target: 'server',
      entry: 'api/src/handler/healthcheck.ts',
      output: 'dist/healthcheck/$name',
      tsConfig: './tsconfig.json',
      dependencies: {
        ignoreAllExternal: false,
        include: ['tslib'],
      },
      //modules: ['node_modules'],
      plugins: [
        // pluginTypeChecker({
        //   basePath: './',
        //   tsConfig: './tsconfig.json',
        //   dev_print: true,
        // }),
        pluginJSON({ useDefault: true }),
        pluginLink(/\.(docx)$/, { useDefault: true, resourcePublicRoot: '/data' }),
      ],
      watch: false,
    });
}

const { task, rm } = sparky(Context);

task('default', async ctx => {
  await rm('dist/healthcheck');
  const fuse = ctx.getConfig();
  await fuse.runDev(h =>
    h.ctx.ict.on('bundle_resolve_module', props => {
      if (props.module.props.absPath.includes('lodash')) {
        // console.log(props.module);
      }
      return props;
    }),
  );
});
