import { createEnv } from './stubs/TestEnvironment';
import { should } from 'fuse-test-runner';


export class AutoImportTest {
    'Should access a dynamic module (without ext)'() {
        return createEnv({
            project: {
                files: {
                    'hello.ts': `module.exports = require("./stuff/boo");`,
                },
                instructions: 'hello.ts',
            },
        }).then((result) => {
            const fuse = result.project.FuseBox;
            fuse.dynamic('stuff/boo.js', 'module.exports = {hello : \'dynamic\'}');

            should(fuse.import('./hello'))
                .deepEqual({ hello: 'dynamic' });
        });
    }
}
