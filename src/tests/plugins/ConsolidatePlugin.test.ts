import { ConsolidatePlugin } from "../../index";
import { createEnv } from "../stubs/TestEnvironment";
import { should } from "fuse-test-runner";

export class ConsolidatePluginTest {
    "Should compile a template using consolidate"() {
        return createEnv({
            project: {
                files: {
                    "template.pug": "p Compiled with Pug"
                },
                plugins: [ConsolidatePlugin({
                  engine: 'pug'
                })],
                instructions: "template.pug"
            },
        }).then((result) => {
          const template = result.project.FuseBox.import('./template.pug');
          should(template.default).equal("<p>Compiled with Pug</p>");
        });
    }

    "Should allow user to override extension"() {
        return createEnv({
            project: {
                files: {
                    "template.foobar": "p Compiled with Pug"
                },
                plugins: [ConsolidatePlugin({
                  engine: 'pug',
                  extension: '.foobar'
                })],
                instructions: "template.foobar"
            },
        }).then((result) => {
          const template = result.project.FuseBox.import('./template.foobar');
          should(template.default).equal("<p>Compiled with Pug</p>");
        });
    }

    "Should allow user to override default exports"() {
        return createEnv({
            project: {
                files: {
                    "template.pug": "p Compiled with Pug"
                },
                plugins: [ConsolidatePlugin({
                  engine: 'pug',
                  useDefault: false
                })],
                instructions: "template.pug"
            },
        }).then((result) => {
          const template = result.project.FuseBox.import('./template.pug');
          should(template).equal("<p>Compiled with Pug</p>");
        });
    }
}
