import { TypeChecker } from 'fuse-box-typechecker';
import { fusebox, pluginJSON, pluginLink, sparky } from '../../../../src';
// tslint:disable-next-line: no-submodule-imports

// tslint:disable-next-line: no-submodule-imports

import * as path from 'path';
import { IBundleType } from '../../../../src/bundle/bundle';
import { fastHash, fileExists } from '../../../../src/utils/utils';

class Context {
  public runServer?: boolean;
  public getConfig = (entryName: string) =>
    fusebox({
      dependencies: {
        ignoreAllExternal: false,
        ignorePackages: ['aws-lambda'],
        include: ['tslib'],
      },
      entry: `./src/handler/${entryName}.ts`,
      homeDir: './',
      modules: ['./node_modules'],
      output: `./dist/${entryName}/code/$name`,
      plugins: [
        ctx => {
          ctx.ict.on('bundle_resolve_module', props => {
            if (props.module.absPath.includes('lib/winston.js')) {
              //console.log(props.module.props);
            }
            return props;
          });
        },
        ctx => {
          ctx.ict.on('bundle_resolve_module', props => {
            if (!props.module.captured && props.module.extension === '.node') {
              const target = props.module.absPath;
              const name = fastHash(target) + path.extname(target);
              const location = path.join('../node-native', name);
              const destination = path.join(props.module.props.ctx.writer.outputDirectory, location);

              props.module.captured = true;
              props.module.ctx.log.info('node-native', 'Captured $file with pluginNodeNative', {
                file: props.module.absPath,
              });

              if (!fileExists(destination)) {
                props.module.ctx.taskManager.copyFile(props.module.absPath, destination);
              }

              props.module.contents = `module.exports = require("${location}");`;
            }
            return props;
          });
        },
        ctx => {
          ctx.ict.on('bundle_resolve_module', props => {
            if (!props.module.captured && props.module.extension === '.graphql') {
              props.module.captured = true;
              props.module.ctx.log.info('graphql', 'Captured $file with pluginGraphQL', {
                file: props.module.absPath,
              });
              props.module.read();
              props.module.contents = `Object.defineProperty(exports, "__esModule", { value: true });\nmodule.exports.default = ${JSON.stringify(
                props.module.contents,
              )}`;
            }
            return props;
          });
        },
        pluginJSON({ useDefault: true }),
        pluginLink(/\.(docx)$/, { resourcePublicRoot: '../assets', useDefault: false }),
        ctx => {
          ctx.ict.on('before_bundle_write', props => {
            const bundle = props.bundle;
            if (bundle.props.type === IBundleType.JS_APP) {
              bundle.setCustomName('app');
              bundle.addContent(`FuseBox.expose({ default: { alias: '*', pkg: 'default' } });`);
            }
            return props;
          });
        },
      ],
      resources: {
        resourceFolder: '../assets',
      },
      target: 'server',
      tsConfig: './tsconfig.json',
      useSingleBundle: true,
      watch: false,
    });
}
function runTypeChecker() {
  const typeChecker = TypeChecker({
    basePath: './',
    homeDir: './',
    isPlugin: false,
    name: 'typecheck',
    printFirstRun: false,
    tsConfig: './tsconfig.json',
    tsConfigJsonContent: {},
  });
  // to run it right away
  typeChecker.printSettings();

  return typeChecker.inspectAndPrint();
}

const { exec, rm, task } = sparky(Context);

task('typecheck', () => {
  runTypeChecker();
});

const handlers = ['healthcheck'];
for (const handler of handlers) {
  task(`build:${handler}`, async ctx => {
    await rm(`dist/${handler}/code`);
    await ctx.getConfig(handler).runDev();
  });
}

task(`build`, async ctx => {
  //await exec('typecheck');
  for (const handler of handlers) {
    await exec(`build:${handler}`);
  }
});
