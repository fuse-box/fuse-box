import * as path from 'path';
import { outputConfigConverter } from '../OutputConfigConverter';

describe('Output Config converter', () => {
  // values for those keys aren't hardcoded
  // since they can change
  // we verify the consistency
  it('should get default configuration ', () => {
    const res = outputConfigConverter({
      defaultRoot: 'dist',
    });
    expect(res.distRoot).toEqual(path.join(__dirname, 'dist'));
    expect(res.app).toBeTruthy();
    expect(res.vendor).toBeTruthy();
    expect(res.codeSplitting).toBeTruthy();
  });

  it('should give user root ', () => {
    const res = outputConfigConverter({
      defaultRoot: __dirname,
      publicConfig: {
        distRoot: 'build',
      },
    });
    expect(res.distRoot).toEqual(path.join(__dirname, 'build'));
  });

  it('should give default app if non specified ', () => {
    const res = outputConfigConverter({
      defaultRoot: __dirname,
      publicConfig: {
        distRoot: 'build',
      },
    });
    expect(res.distRoot).toEqual(path.join(__dirname, 'build'));
    expect(res.app).toBeTruthy();
  });

  it('should give user vendor and a default app ', () => {
    const res = outputConfigConverter({
      defaultRoot: __dirname,
      publicConfig: {
        distRoot: 'build',
        vendor: 'external.$hash.js',
      },
    });
    expect(res.distRoot).toEqual(path.join(__dirname, 'build'));
    expect(res.app).toBeTruthy();
    expect(res.vendor.path).toEqual('external.$hash.js');
  });

  it('should give users app and vendor ', () => {
    const res = outputConfigConverter({
      defaultRoot: __dirname,
      publicConfig: {
        app: 'myapp.$hash.js',
        distRoot: 'build',
        vendor: 'external.$hash.js',
      },
    });
    expect(res.distRoot).toEqual(path.join(__dirname, 'build'));
    expect(res.app.path).toEqual('myapp.$hash.js');
    expect(res.vendor.path).toEqual('external.$hash.js');
  });

  it('should give custom configs for users app and vendor ', () => {
    const res = outputConfigConverter({
      defaultRoot: __dirname,
      publicConfig: {
        app: { maxBundleSize: 10, path: 'foo.js' },
        distRoot: 'build',
        vendor: { maxBundleSize: 20, path: 'bar.js' },
      },
    });
    expect(res.distRoot).toEqual(path.join(__dirname, 'build'));

    expect(res.app.path).toEqual('foo.js');
    expect(res.app.maxBundleSize).toEqual(10);

    expect(res.vendor.path).toEqual('bar.js');
    expect(res.vendor.maxBundleSize).toEqual(20);
  });
});
