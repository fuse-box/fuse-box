import { fusebox, pluginJSON, pluginLink, sparky } from 'fuse-box';
import { TypeChecker } from 'fuse-box-typechecker';
// tslint:disable-next-line: no-submodule-imports
import { BundleType } from 'fuse-box/bundle/bundle;
// tslint:disable-next-line: no-submodule-imports
import { fastHash, fileExists, joinFuseBoxPath, path2RegexPattern } from 'fuse-box/utils/utils';
import * as path from 'path';

class Context {
    public runServer?: boolean;
    public getConfig = (entryName: string) =>
        fusebox({
            homeDir: './',
            target: 'server',
            entry: `./src/handler/${entryName}.ts`,
            output: `./dist/${entryName}/code/$name`,
            tsConfig: './tsconfig.json',
            resources: {
                resourceFolder: '../assets'
            },
            dependencies: {
                ignoreAllExternal: false,
                ignorePackages: ['aws-lambda'],
                include: ['tslib']
            },
            plugins: [
                (ctx) => {
                    ctx.ict.on('bundle_resolve_module', (props) => {
                        if (props.module.props.absPath.includes('lib/winston.js')) {
                            console.log(props.module.props);
                        }
                        return props;
                    });
                },
                (ctx) => {
                    ctx.ict.on('bundle_resolve_module', (props) => {
                        if (!props.module.captured && props.module.props.extension === '.node') {
                            const target = props.module.props.absPath;
                            const name = fastHash(target) + path.extname(target);
                            const location = path.join('../node-native', name);
                            const destination = path.join(props.module.props.ctx.writer.outputDirectory, location);

                            props.module.captured = true;
                            props.module.props.ctx.log.info('node-native', 'Captured $file with pluginNodeNative', {
                                file: props.module.props.absPath
                            });

                            if (!fileExists(destination)) {
                                props.module.props.ctx.taskManager.copyFile(props.module.props.absPath, destination);
                            }

                            props.module.contents = `module.exports = require("${location}");`;
                        }
                        return props;
                    });
                },
                (ctx) => {
                    ctx.ict.on('bundle_resolve_module', (props) => {
                        if (!props.module.captured && props.module.props.extension === '.graphql') {
                            props.module.captured = true;
                            props.module.props.ctx.log.info('graphql', 'Captured $file with pluginGraphQL', {
                                file: props.module.props.absPath
                            });
                            props.module.read();
                            props.module.contents = `Object.defineProperty(exports, "__esModule", { value: true });\nmodule.exports.default = ${JSON.stringify(
                                props.module.contents
                            )}`;
                        }
                        return props;
                    });
                },
                pluginJSON({ useDefault: true }),
                pluginLink(/\.(docx)$/, { useDefault: false, resourcePublicRoot: '../assets' }),
                (ctx) => {
                    ctx.ict.on('before_bundle_write', (props) => {
                        const bundle = props.bundle;
                        if (bundle.props.type === BundleType.PROJECT_JS) {
                            bundle.setCustomName('app');
                            bundle.addContent(`FuseBox.expose({ default: { alias: '*', pkg: 'default' } });`);
                        }
                        return props;
                    });
                }
            ],
            watch: false,
            useSingleBundle: true
        });
}
function runTypeChecker() {
    const typeChecker = TypeChecker({
        tsConfig: './tsconfig.json',
        basePath: './',
        name: 'typecheck',
        homeDir: './',
        isPlugin: false,
        printFirstRun: false,
        tsConfigJsonContent: {}
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
    task(`build:${handler}`, async (ctx) => {
        await rm(`dist/${handler}/code`);
        await ctx.getConfig(handler).runDev();
    });
}

task(`build`, async (ctx) => {
    await exec('typecheck');
    for (const handler of handlers) {
        await exec(`build:${handler}`);
    }
});
