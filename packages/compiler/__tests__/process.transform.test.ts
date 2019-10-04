import { compileModule } from '../program/compileModule';
describe('Process transform test', () => {
  describe('process.env.***', () => {
    it.only('should replace process.env.NODE_ENV', () => {
      const result = compileModule({
        bundleProps: { target: 'browser', env: { NODE_ENV: 'development' } },
        code: `
          console.log(process.env.NODE_ENV);
      `,
      });
      expect(result.code).toMatchSnapshot();
    });
  });
  describe('process.xxx', () => {
    it('should transform process.version', () => {
      const result = compileModule({
        code: `
          console.log(process.version);
      `,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should transform process.versions', () => {
      const result = compileModule({
        code: `console.log(process.versions);`,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should transform process.title', () => {
      const result = compileModule({
        code: `console.log(process.title);`,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should transform process.umask', () => {
      const result = compileModule({
        code: `console.log(process.umask);`,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should transform process.browser', () => {
      const result = compileModule({
        code: `console.log(process.browser);`,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should transform process.cwd', () => {
      const result = compileModule({
        code: `console.log(process.cwd());`,
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should transform process.env', () => {
      const result = compileModule({
        code: `console.log(process.env);`,
        bundleProps: {
          target: 'browser',
          env: { foo: 'bar' },
        },
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should transform process.env (not add twice)', () => {
      const result = compileModule({
        code: `
        alert(process.env)
        console.log(process.env);
        `,
        bundleProps: {
          target: 'browser',
          env: { foo: 'bar' },
        },
      });
      expect(result.code).toMatchSnapshot();
    });

    it('should inject process if a variable is not recognized', () => {
      const result = compileModule({
        code: `
        console.log(process.some());
        `,
      });

      expect(result.code).toMatchSnapshot();
    });
  });
});
