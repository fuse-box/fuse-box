import { outputConfigConverter } from '../OutputConfigConverter';

describe('Output Config converter', () => {
  // values for those keys aren't hardcoded
  // since they can change
  // we verify the consistency
  it('should get default configuration ', () => {
    const res = outputConfigConverter({
      defaultRoot: 'dist',
    });
    expect(res.root).toEqual('dist');
    expect(res.app).toBeTruthy();
    expect(res.vendor).toBeTruthy();
    expect(res.codeSplitting).toBeTruthy();
  });

  it('should give user root ', () => {
    const res = outputConfigConverter({
      defaultRoot: __dirname,
      publicConfig: {
        root: 'build',
      },
    });
    expect(res.root).toEqual('build');
  });

  it('should give default app if non specified ', () => {
    const res = outputConfigConverter({
      defaultRoot: __dirname,
      publicConfig: {
        root: 'build',
      },
    });
    expect(res.root).toEqual('build');
    expect(res.app).toBeTruthy();
  });

  it('should give user vendor and a default app ', () => {
    const res = outputConfigConverter({
      defaultRoot: __dirname,
      publicConfig: {
        root: 'build',
        vendor: 'external.$hash.js',
      },
    });
    expect(res.root).toEqual('build');
    expect(res.app).toBeTruthy();
    expect(res.vendor.path).toEqual('external.$hash.js');
  });

  it('should give users app and vendor ', () => {
    const res = outputConfigConverter({
      defaultRoot: __dirname,
      publicConfig: {
        app: 'myapp.$hash.js',
        root: 'build',
        vendor: 'external.$hash.js',
      },
    });
    expect(res.root).toEqual('build');
    expect(res.app.path).toEqual('myapp.$hash.js');
    expect(res.vendor.path).toEqual('external.$hash.js');
  });

  it('should give custom configs for users app and vendor ', () => {
    const res = outputConfigConverter({
      defaultRoot: __dirname,
      publicConfig: {
        app: { maxBundleSize: 10, path: 'foo.js' },
        root: 'build',
        vendor: { maxBundleSize: 20, path: 'bar.js' },
      },
    });
    expect(res.root).toEqual('build');

    expect(res.app.path).toEqual('foo.js');
    expect(res.app.maxBundleSize).toEqual(10);

    expect(res.vendor.path).toEqual('bar.js');
    expect(res.vendor.maxBundleSize).toEqual(20);
  });
});
