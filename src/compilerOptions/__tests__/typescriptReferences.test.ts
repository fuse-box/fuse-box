import * as path from 'path';
import { env } from '../../env';
import { testUtils } from '../../utils/test_utils';
import { buildMappings, groupByPackage, mappingsToResolver } from '../typescriptReferences';
const P = path.join; // use P for joining and normalizing paths
const fuseRoot = env.APP_ROOT;
const cases = path.relative(fuseRoot, P(__dirname, 'cases'));
const case3 = P(cases, 'case3');
testUtils();

/*
function toPortablePath(p) {
    if (process.platform !== 'win32') return p;
    return (p.match(/^[a-zA-Z]:.*$/) ? `/${p}` : p).replace(/\\/g, `/`);
}
*/

describe('test case 3', () => {
  const references = [{ path: P('pkgA', 'tsconfig.json') }];

  const expectedMappings = new Map<string, string>([
    [P(fuseRoot, case3, `/pkgA/dist/alpha.js`), P(fuseRoot, case3, `/pkgA/src/alpha.ts`)],
    [P(fuseRoot, case3, `/pkgB/dist/beta.js`), P(fuseRoot, case3, `/pkgB/src/beta.ts`)],
    [P(fuseRoot, case3, `/pkgC/output/charlie.js`), P(fuseRoot, case3, `/pkgC/input/charlie.ts`)],
    [P(fuseRoot, case3, `/pkgC/output/main.js`), P(fuseRoot, case3, `/pkgC/input/main.ts`)],
  ]);

  const expectedGrouped = new Map<string, Map<string, string>>([
    // has paths that are relative to the immediate parent packages
    [P(fuseRoot, case3, `/pkgA`), new Map<string, string>([[P(`dist/alpha.js`), P(`src/alpha.ts`)]])],
    [P(fuseRoot, case3, `/pkgB`), new Map<string, string>([[P(`dist/beta.js`), P(`src/beta.ts`)]])],
    [
      P(fuseRoot, case3, `/pkgC`),
      new Map<string, string>([
        [P(`output/charlie.js`), P(`input/charlie.ts`)],
        [P(`output/main.js`), P(`input/main.ts`)],
      ]),
    ],
    // and also has paths that are relative to the common ancestor package
    // the fuse-box root is one because it has a package.json
    [
      P(fuseRoot),
      new Map<string, string>([
        [P(case3, `pkgA/dist/alpha.js`), P(case3, `pkgA/src/alpha.ts`)],
        [P(case3, `pkgB/dist/beta.js`), P(case3, `pkgB/src/beta.ts`)],
        [P(case3, `pkgC/output/charlie.js`), P(case3, `pkgC/input/charlie.ts`)],
        [P(case3, `pkgC/output/main.js`), P(case3, `pkgC/input/main.ts`)],
      ]),
    ],
  ]);

  it('throws meaningful error on bad reference path', () => {
    expect(() => {
      buildMappings(references, P(`/i/dont/exist`));
    }).toThrow();
  });

  it('builds the expected out->in mappings from test case 3', () => {
    const mappings = buildMappings(references, path.resolve(fuseRoot, case3));
    expect(mappings).toEqual(expectedMappings);
  });

  it('groups the set of mappings by package', () => {
    const grouped = groupByPackage(expectedMappings);
    // in case the tester happens to have any packge.json above the fuse-box root,
    // tsreference will have added groups for those as it should
    // so we'll just ignore those here
    for (const dir of ancestorsOf(fuseRoot)) grouped.delete(dir);
    const expected = expectedGrouped;
    expect(grouped).toEqual(expected);
  });

  it('creates a working resolver from grouped mappings', () => {
    const resolver = mappingsToResolver(expectedGrouped);
    expect(resolver).toBeTruthy();

    // an import of 'pkg-c/output/charlie'
    // will already have the 'pkg-c' part resolved to the 'pkgC' folder's path
    // so all that is left is to resolve from that folder to 'output/charlie'
    // and if everything works, we should get back 'input/charlie.ts'
    // which is the input corresponding to that output
    expect(resolver({ fileDir: P(fuseRoot, case3, `pkgC`), target: P(`output/charlie`) })).toEqual({
      absPath: P(fuseRoot, case3, `pkgC/input/charlie.ts`),
      extension: '.ts',
      fileExists: true,
    });

    // this should work even if we include the output's extension
    expect(resolver({ fileDir: P(fuseRoot, case3, `pkgC`), target: P(`output/charlie.js`) })).toEqual({
      absPath: P(fuseRoot, case3, `pkgC/input/charlie.ts`),
      extension: '.ts',
      fileExists: true,
    });

    // this should also be able to resolve the package "main"
    // since pkg-c's "main" is "output/index.js" we should get back "input/index.ts"
    expect(resolver({ fileDir: P(fuseRoot, case3, `pkgC`), target: `` })).toEqual({
      absPath: P(fuseRoot, case3, `pkgC/input/main.ts`),
      customIndex: true,
      extension: '.ts',
      fileExists: true,
      isDirectoryIndex: true,
    });
  });
});

function* ancestorsOf(absPath: string) {
  const start = path.normalize(absPath);
  for (let dir = parentDir(start); dir !== undefined; dir = parentDir(dir)) {
    yield dir;
  }
}

function parentDir(normalizedPath: string): undefined | string {
  const parent = path.dirname(normalizedPath);
  if (parent === normalizedPath) return undefined;
  return parent;
}
