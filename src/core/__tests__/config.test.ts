import { createConfig } from '../config';
import { env } from '../env';

describe('Config test', () => {
  it('should set homeDir automatically', () => {
    const config = createConfig({});
    expect(config.homeDir).toEqual(env.APP_ROOT);
  });
  it('should set homeDir manually', () => {
    const config = createConfig({ homeDir: __dirname });
    expect(config.homeDir).toEqual(__dirname);
  });

  it('should have default modules', () => {
    const config = createConfig({});
    expect(config.modules).toEqual([env.FUSE_MODULES]);
  });

  it('should have default modules and user modules', () => {
    const config = createConfig({ modules: ['foo'] });
    expect(config.modules).toEqual([env.FUSE_MODULES, 'foo']);
  });

  it('should have output undefined', () => {
    const config = createConfig({});
    expect(config.output).toBeUndefined();
  });

  it('should have output set', () => {
    const config = createConfig({ output: 'dist/$name' });
    expect(config.output).toEqual('dist/$name');
  });

  it('should have alias undefined', () => {
    const config = createConfig({});
    expect(config.alias).toBeUndefined();
  });

  it('should have alias set', () => {
    const config = createConfig({ alias: { foo: 'bar' } });
    expect(config.alias).toEqual({ foo: 'bar' });
  });

  it('should have production not set', () => {
    const config = createConfig({});
    expect(config.production).toEqual(undefined);
  });

  it('should have production set', () => {
    const config = createConfig({ production: {} });
    expect(config.production).toEqual({});
  });

  it('should have webIndex not set', () => {
    const config = createConfig({});
    expect(config.webIndex).toEqual(undefined);
  });

  it('should have webIndex set', () => {
    const config = createConfig({ webIndex: {} });
    expect(config.webIndex).toEqual({});
  });

  it('should have logging not set', () => {
    const config = createConfig({});
    expect(config.logging).toEqual(undefined);
  });

  it('should have logging  set', () => {
    const config = createConfig({ logging: { level: 'succinct' } });
    expect(config.logging).toEqual({ level: 'succinct' });
  });

  it('should not have plugins', () => {
    const config = createConfig({});
    expect(config.plugins).toEqual([]);
  });

  it('should have user plugins', () => {
    const config = createConfig({ plugins: [() => {}] });
    expect(config.plugins).toHaveLength(1);
  });

  it('should not have entry', () => {
    const config = createConfig({});
    expect(config.entry).toBeUndefined();
  });

  it('should not entry', () => {
    const config = createConfig({ entry: 'foo' });
    expect(config.options.entries).toEqual(['foo']);
  });

  it('Should setup options case 1', () => {
    const config = createConfig({});
    expect(config.options).toEqual({
      vendorSourceMap: false,
      projectSourceMap: true,
      cssSourceMap: true,
      sourceRoot: '/src',
    });
  });

  it('Should setup options (vendor false)', () => {
    const config = createConfig({
      sourceMap: {
        vendor: true,
      },
    });
    expect(config.options).toEqual({
      vendorSourceMap: true,
      projectSourceMap: true,
      cssSourceMap: true,
      sourceRoot: '/src',
    });
  });

  it('Should setup options (project false)', () => {
    const config = createConfig({
      sourceMap: {
        project: false,
      },
    });
    expect(config.options).toEqual({
      vendorSourceMap: false,
      projectSourceMap: false,
      cssSourceMap: true,
      sourceRoot: '/src',
    });
  });

  it('Should setup options (project false)', () => {
    const config = createConfig({
      sourceMap: {
        sourceRoot: '/foo',
      },
    });
    expect(config.options).toEqual({
      vendorSourceMap: false,
      projectSourceMap: true,
      cssSourceMap: true,
      sourceRoot: '/foo',
    });
  });
});
