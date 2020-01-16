import { outputConfigConverter } from '../OutputConfig';

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
        root: 'build',
        app: 'myapp.$hash.js',
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
        root: 'build',
        app: { path: 'foo.js', maxBundleSize: 10 },
        vendor: { path: 'bar.js', maxBundleSize: 20 },
      },
    });
    expect(res.root).toEqual('build');

    expect(res.app.path).toEqual('foo.js');
    expect(res.app.maxBundleSize).toEqual(10);

    expect(res.vendor.path).toEqual('bar.js');
    expect(res.vendor.maxBundleSize).toEqual(20);
  });
});
