import { EnvironmentType } from '../config/EnvironmentType';
import { pluginCSS } from '../plugins/core/plugin_css';
import { pluginSass } from '../plugins/core/plugin_sass';
import { runBrowserTest, runServerTest } from '../testUtils/integrationHelper';
import { readFile } from '../utils/utils';

describe('CSS integration test', () => {
  describe('CSS', () => {
    describe('Browser', () => {
      it('should have js css during development', async () => {
        const css = 'body { color: red }';
        const env = await runBrowserTest({
          env: EnvironmentType.DEVELOPMENT,
          files: { 'index.ts': `import "./main.css"`, 'main.css': css },
          config: {
            target: 'browser',
          },
        });

        const scope = await env.response.eval();
        expect(scope.$createdDOMElements).toHaveLength(1);
        expect(scope.$createdDOMElements[0].innerHTML).toEqual(css);
      });

      it('should extract css for production', async () => {
        const env = await runBrowserTest({
          env: EnvironmentType.PRODUCTION,
          files: { 'index.ts': `import "./main.css"`, 'main.css': 'body { color: red }' },
          config: {
            target: 'browser',
          },
        });

        const r = await env.response.eval();

        const dist = env.workspace.getDist();

        const app = dist.getAppContents();
        expect(app).not.toMatch(/cssHandler/); // should not include dev css
        expect(dist.findFile(/\.css$/)).toBeTruthy();
        expect(r.entry()).toBeTruthy();
      });

      it('should extract 2 css files for production', async () => {
        const env = await runBrowserTest({
          env: EnvironmentType.PRODUCTION,
          files: {
            'index.ts': `
            import "./main.css";
            import "./second.css"
          `,
            'main.css': 'body { color: #000010 }',
            'second.css': 'h1 { color: #00c011 }',
          },
          config: {
            target: 'browser',
          },
        });

        await env.response.eval();

        const dist = env.workspace.getDist();

        const app = dist.getAppContents();
        expect(app).not.toMatch(/cssHandler/); // should not include dev css
        const css = readFile(dist.findFile(/\.css$/));
        expect(css).toEqual('body{color:#000010}h1{color:#00c011}');
      });

      it('should extract css for production (require) top level', async () => {
        const env = await runBrowserTest({
          env: EnvironmentType.PRODUCTION,
          files: {
            'index.ts': `
            console.log(1)
            require("./main.css")
          `,
            'main.css': 'body { color: red }',
          },
          config: {
            target: 'browser',
          },
        });

        const r = await env.response.eval();

        const dist = env.workspace.getDist();

        const app = dist.getAppContents();
        expect(app).not.toMatch(/cssHandler/); // should not include dev css
        expect(dist.findFile(/\.css$/)).toBeTruthy();
        expect(r.entry()).toBeTruthy();
      });

      it('should extract css for production (require) nested', async () => {
        const env = await runBrowserTest({
          env: EnvironmentType.PRODUCTION,
          files: {
            'index.ts': `
            function foo(){
              require("./main.css")
            }
          `,
            'main.css': 'body { color: red }',
          },
          config: {
            target: 'browser',
          },
        });

        const r = await env.response.eval();

        const dist = env.workspace.getDist();

        const app = dist.getAppContents();
        expect(app).not.toMatch(/cssHandler/); // should not include dev css
        expect(dist.findFile(/\.css$/)).toBeTruthy();
        expect(r.entry()).toBeTruthy();
      });

      it('should ignore development css (require)', async () => {
        const env = await runBrowserTest({
          env: EnvironmentType.PRODUCTION,
          files: {
            'index.ts': `
            function foo(){
              if ( process.env.NODE_ENV === "development"){
                require("./main.css")
              }
            }
          `,
            'main.css': 'body { color: red }',
          },
          config: {
            target: 'browser',
          },
        });

        const r = await env.response.eval();

        const dist = env.workspace.getDist();

        expect(dist.findFile(/\.css$/)).toBeFalsy();
        expect(r.entry()).toBeTruthy();
      });

      it('should work correctly with css modules', async () => {
        const env = await runBrowserTest({
          env: EnvironmentType.PRODUCTION,
          config: {
            plugins: [pluginSass('main.scss', { asModule: {} })],
          },
          files: {
            'index.ts': `
            import * as foo from "./main.scss"
            export { foo }
          `,
            'main.scss': '.item { color: red }',
          },
        });

        const r = await env.response.eval();
        const result = r.entry();

        expect(result.foo.item).toBeTruthy();
        const dist = env.workspace.getDist();

        expect(dist.findFile(/\.css$/)).toBeTruthy();
      });
    });

    describe('Server', () => {
      it('should ignore css during development', async () => {
        const css = 'body { color: red }';
        const env = await runServerTest({
          env: EnvironmentType.DEVELOPMENT,
          files: { 'index.ts': `import "./main.css";console.log(1)`, 'main.css': css },
        });

        env.response.eval();
        const scope = await env.response.eval();

        expect(scope.entry()).toBeTruthy();
      });

      it('should ignore css during production', async () => {
        const css = 'body { color: red }';
        const env = await runServerTest({
          env: EnvironmentType.PRODUCTION,
          files: { 'index.ts': `import "./main.css";console.log(1)`, 'main.css': css },
        });

        env.response.eval();
        const scope = await env.response.eval();
        expect(scope.entry()).toBeTruthy();
      });

      it('should ignore css for production (require) nested', async () => {
        const env = await runServerTest({
          env: EnvironmentType.PRODUCTION,
          files: {
            'index.ts': `
            function foo(){
              require("./main.css")
            }
          `,
            'main.css': 'body { color: red }',
          },
        });

        const r = await env.response.eval();

        const dist = env.workspace.getDist();

        expect(dist.findFile(/\.css$/)).toBeFalsy();
        expect(r.entry()).toBeTruthy();
      });

      it('should work correctly with css modules', async () => {
        const env = await runServerTest({
          env: EnvironmentType.PRODUCTION,
          config: {
            plugins: [pluginSass('main.scss', { asModule: {} })],
          },
          files: {
            'index.ts': `
            import * as foo from "./main.scss"
            export { foo }
          `,
            'main.scss': '.item { color: red }',
          },
        });

        const r = await env.response.eval();
        const result = r.entry();

        expect(result.foo.item).toBeTruthy();
        const dist = env.workspace.getDist();

        expect(dist.findFile(/\.css$/)).toBeFalsy();
      });
    });
  });
});
