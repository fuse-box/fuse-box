import * as path from 'path';
import { each } from 'realm-utils';
import { FuseBox } from '../../core/FuseBox';
import * as fs from 'fs';
import * as appRoot from 'app-root-path';
import { removeFolder } from '../../Utils';
import * as fsExtra from 'fs-extra';




export function createEnv(opts: any) {
    const name = opts.name || `test-${new Date().getTime()}`;

    let tmpFolder = path.join(appRoot.path, '.fusebox', 'tests', name);


    fsExtra.ensureDirSync(tmpFolder);
    let localPath = path.join(tmpFolder, name);

    const output : any = {
        modules: {},
    };

    const modulesFolder = path.join(localPath, 'modules');
    // creating modules
    return each(opts.modules, (moduleParams, name) => {
        return new Promise((resolve, reject) => {
            moduleParams.outFile = path.join(modulesFolder, name, 'index.js');
            moduleParams.package = name;
            moduleParams.cache = false;
            moduleParams.log = false;

            moduleParams.tsConfig = path.join(appRoot.path, 'test', 'fixtures', 'tsconfig.json');

            FuseBox.init(moduleParams).bundle(moduleParams.instructions, () => {
                if (moduleParams.onDone) {
                    moduleParams.onDone({
                        localPath,
                        filePath: moduleParams.outFile,
                        projectDir: path.join(localPath, 'project'),
                    });
                }
                output.modules[name] = require(moduleParams.outFile);
                return resolve();
            });
        });
    }).then(() => {

        const projectOptions = opts.project;
        projectOptions.outFile = path.join(localPath, 'project', 'index.js');
        projectOptions.cache = false;
        projectOptions.log = false;
        projectOptions.tsConfig = path.join(appRoot.path, 'test', 'fixtures', 'tsconfig.json');
        projectOptions.modulesFolder = modulesFolder;
        return new Promise((resolve, reject) => {
            FuseBox.init(projectOptions).bundle(projectOptions.instructions, () => {
                const contents = fs.readFileSync(projectOptions.outFile);
                const length = contents.buffer.byteLength;
                output.project = require(projectOptions.outFile);
                output.projectSize = length;
                output.projectContents = contents;

                return resolve();
            });
        });
    }).then(() => {

        removeFolder(localPath);
        return output;
    });
}
