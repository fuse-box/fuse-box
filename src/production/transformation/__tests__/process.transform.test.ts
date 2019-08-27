import { Project } from 'ts-morph';
import { processProductionTransformation } from '../processTransformation';
import { createContext } from '../../../core/Context';
import { IPublicConfig } from '../../../config/IPublicConfig';
import '../../../utils/test_utils';

function createFile(config: IPublicConfig, contents: string) {
  const project = new Project();
  config.target = config.target || 'browser';
  const ctx = createContext(config);
  const file = project.createSourceFile('src/MyClass.ts', contents);
  return { ctx, file };
}
describe('Production / Process transform', () => {
  describe('global replacement', () => {
    it('should add global 1', () => {
      const props = createFile(
        {},
        `
      console.log(global.Symbol)
    `,
      );
      processProductionTransformation(props);
      expect(props.file.getText()).toMatchJSONSnapshot();
    });

    it('should add global 2', () => {
      const props = createFile(
        {},
        `
      console.log(global.Symbol)
      console.log(global.Symbol)
    `,
      );
      processProductionTransformation(props);
      expect(props.file.getText()).toMatchJSONSnapshot();
    });

    it('should not add global', () => {
      const props = createFile(
        { target: 'server' },
        `
      console.log(global.Symbol)
    `,
      );
      processProductionTransformation(props);
      expect(props.file.getText()).toMatchJSONSnapshot();
    });
  });
  describe('process.* (1 member)', () => {
    it('should not touch process (server)', () => {
      const props = createFile(
        { target: 'server' },
        `
      console.log(process.version)
    `,
      );
      processProductionTransformation(props);
      expect(props.file.getText()).toContain(`console.log(process.version)`);
    });

    it('should replace version', () => {
      const props = createFile(
        {},
        `
      console.log(process.version)
    `,
      );
      processProductionTransformation(props);
      expect(props.file.getText()).toContain(`console.log('1.0.0')`);
    });

    it('should replace versions', () => {
      const props = createFile(
        {},
        `
      console.log(process.versions)
    `,
      );
      processProductionTransformation(props);
      expect(props.file.getText()).toContain(`console.log({})`);
    });

    it('should replace browser', () => {
      const props = createFile(
        {},
        `
      console.log(process.browser)
    `,
      );
      processProductionTransformation(props);
      expect(props.file.getText()).toContain(`console.log(true)`);
    });

    it('should replace title', () => {
      const props = createFile(
        {},
        `
      console.log(process.title)
    `,
      );
      processProductionTransformation(props);
      expect(props.file.getText()).toContain(`console.log('browser')`);
    });

    it('should replace umask', () => {
      const props = createFile(
        {},
        `
      console.log(process.umask())
    `,
      );
      processProductionTransformation(props);
      expect(props.file.getText()).toContain(`console.log(0)`);
    });

    it('should replace whole env', () => {
      const props = createFile(
        {},
        `
      console.log(process.env)
    `,
      );
      processProductionTransformation(props);
      const text = props.file.getText();
      expect(text).toMatchJSONSnapshot();
    });

    it('should replace whole process mentioned 2 times', () => {
      const props = createFile(
        {},
        `
      console.log(process.env)
      console.log(process.env)
    `,
      );
      processProductionTransformation(props);
      const text = props.file.getText();
      expect(text).toMatchJSONSnapshot();
    });

    it('should replace cwd call', () => {
      const props = createFile(
        {},
        `
      console.log(process.cwd())
    `,
      );
      processProductionTransformation(props);
      expect(props.file.getText()).toContain(`console.log('/')`);
    });

    it('should process (cannnot replace everything)', () => {
      const props = createFile(
        {},
        `
      process.nextTick()
    `,
      );
      processProductionTransformation(props);
      const text = props.file.getText();

      expect(text).toContain('const process = require("process")');
      expect(text).toContain('process.nextTick()');
    });

    it('should not add process 2 times', () => {
      const props = createFile(
        {},
        `
      process.nextTick()
      process.nextTick()
    `,
      );
      processProductionTransformation(props);
      const text = props.file.getText();

      expect(text).toMatchJSONSnapshot();
    });

    it('should trasnform many', () => {
      const props = createFile(
        {},
        `
      console.log(process.version, process.cwd(), process.env)
    `,
      );
      processProductionTransformation(props);

      expect(props.file.getText()).toContain("console.log('1.0.0', '/', __env)");
    });
  });

  describe('process.env.* (2 members)', () => {
    it('should replace NODE_ENV 1 ', () => {
      const props = createFile(
        {},
        `
        console.log(process.env.NODE_ENV);
    `,
      );
      processProductionTransformation(props);
      const text = props.file.getText();

      expect(text).toContain('console.log("development");');
    });

    it('should replace NODE_ENV 2 ', () => {
      const props = createFile(
        {},
        `
        if(process.env.NODE_ENV === "development") {}
    `,
      );
      processProductionTransformation(props);
      const text = props.file.getText();
      expect(text).toContain('if("development" === "development") {}');
    });

    it('should replace with undefined ', () => {
      const props = createFile(
        {},
        `
        console.log(process.env.FOO)
    `,
      );
      processProductionTransformation(props);
      const text = props.file.getText();
      expect(text).toContain('console.log(undefined)');
    });
  });
});
