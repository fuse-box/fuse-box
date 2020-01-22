import * as path from 'path';
import { testUtils } from '../../utils/test_utils';
import { findTsConfig } from '../findTSConfig';
testUtils();
const cases = path.join(__dirname, 'cases');

describe('Find typescript config', () => {
  it('Should find by directory', () => {
    const data = findTsConfig({
      directory: path.join(cases, 'case1/src/foo/bar'),
      root: cases,
    });

    expect(data).toMatchFilePath('cases/case1/tsconfig.json$');
  });

  it('Should find by fileName', () => {
    const data = findTsConfig({
      fileName: path.join(cases, 'case1/src/foo/bar/hello.js'),
      root: cases,
    });

    expect(data).toMatchFilePath('cases/case1/tsconfig.json$');
  });

  it('Should not find', () => {
    const data = findTsConfig({
      directory: path.join(cases, 'case1/src/foo/bar'),
      root: path.join(cases, 'case1/src'),
    });

    expect(data).toBeUndefined();
  });

  it('Should not find (max iterations reached)', () => {
    const directories = [cases];
    for (let i = 0; i <= 30; i++) {
      directories.push(`dir_${i}`);
    }
    const data = findTsConfig({
      directory: path.join(...directories),
      root: cases,
    });

    expect(data).toBeUndefined();
  });
});
