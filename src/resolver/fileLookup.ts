import * as fs from 'fs';
import * as path from 'path';
import { IRawCompilerOptions } from '../compilerOptions/interfaces';
import { parseTypescriptConfig } from '../compilerOptions/parseTypescriptConfig';
import { fileExists, readFile } from '../utils/utils';

export interface ILookupProps {
  fileDir?: string;
  filePath?: string;
  isDev?: boolean;
  javascriptFirst?: boolean;
  target: string;
  typescriptFirst?: boolean;
  isBrowserBuild?: boolean;
}

export interface TsConfigAtPath {
  absPath: string;
  compilerOptions: IRawCompilerOptions;
  tsconfigPath: string;
}

export interface ILookupResult {
  absPath: string;
  customIndex?: boolean;
  extension?: string;
  fileExists: boolean;
  isDirectoryIndex?: boolean;
  // TODO: not used?
  monorepoModulesPaths?: string;
  tsConfigAtPath?: TsConfigAtPath;
}

const JS_EXTENSIONS = ['.js', '.jsx', '.mjs'];
const TS_EXTENSIONS = ['.ts', '.tsx'];

const TS_EXTENSIONS_FIRST = [...TS_EXTENSIONS, ...JS_EXTENSIONS];
const JS_EXTENSIONS_FIRST = [...JS_EXTENSIONS, ...TS_EXTENSIONS];

function isFileSync(path: string): boolean {
  return fileExists(path) && fs.lstatSync(path).isFile();
}

export function fileLookup(props: ILookupProps): ILookupResult {
  if (!props.fileDir && !props.filePath) {
    throw new Error('Failed to lookup. Provide either fileDir or filePath');
  }
  const jsFirst = (props.javascriptFirst && !props.typescriptFirst);
  return resolveSubmodule(props.filePath ? path.dirname(props.filePath) : props.fileDir, props.target, true, jsFirst, props.isBrowserBuild);
}

function resolveSubmodule(base: string, target: string, checkPackage: boolean, jsFirst: boolean, isBrowserBuild: boolean) {
  const exact = path.join(base, target);

  // If an exact file exists, return it
  if (isFileSync(exact)) {
    return {
      absPath: exact,
      extension: path.extname(exact),
      fileExists: true,
    }
  }

  // If a file exists after adding an extension, return it
  const extensions = jsFirst ? JS_EXTENSIONS_FIRST : TS_EXTENSIONS_FIRST;
  for (const extension of extensions) {
    const withExtension = `${exact}${extension}`;
    if (isFileSync(withExtension)) {
      return {
        absPath: withExtension,
        extension: extension,
        fileExists: true,
      }
    }
  }

  // If we should check for a package.json, do that
  // We don't always check because we might be here by following the "main" field from a previous package.json
  // and no further package.json files should be followed after that
  if (checkPackage) {
    const packageJSONPath = path.join(exact, 'package.json');
    if (isFileSync(packageJSONPath)) {
      const packageJSON = JSON.parse(readFile(packageJSONPath));

      if (isBrowserBuild && packageJSON['browser'] && typeof packageJSON['browser'] === "string") {
        const browser = packageJSON['browser'];
        const subresolution = resolveSubmodule(exact, browser, false, jsFirst, isBrowserBuild);
        return subresolution;
      }

      // NOTE: the implementation of "local:main" has a couple of flaws
      //         1. the isLocal test is fragile and won't work in Yarn 2
      //         2. it is incorrect to simply assume that the tsconfig at the root of the package is the right one
      //       a more robust solution would be to use tsconfig references which can map outputs to inputs
      //       and then you can just "main" instead of "local:main" and the output will be mapped to the input
      //       and tsconfig references also solve the "which tsconfig to use?" problem
      const isLocal = !/node_modules/.test(packageJSONPath);
      if (isLocal && packageJSON['local:main']) {
        const localMain = packageJSON['local:main'];
        const subresolution = resolveSubmodule(exact, localMain, false, jsFirst, isBrowserBuild);

        // TODO: not used?
        const submodules = path.resolve(exact, 'node_modules');
        const monorepoModulesPaths = fileExists(submodules) ? submodules : undefined;

        return {
          ...subresolution,
          customIndex: true,
          isDirectoryIndex: true,
          tsConfigAtPath: loadTsConfig(exact),
          // TODO: not used?
          monorepoModulesPaths,
        }
      }

      if (packageJSON['ts:main']) {
        const tsMain = packageJSON['ts:main'];
        const subresolution = resolveSubmodule(exact, tsMain, false, jsFirst, isBrowserBuild);
        if (subresolution.fileExists) {
          return {
            ...subresolution,
            customIndex: true,
            isDirectoryIndex: true,
          }
        }
      }

      if (packageJSON['module']) {
        const mod = packageJSON['module'];
        const subresolution = resolveSubmodule(exact, mod, false, jsFirst, isBrowserBuild);
        if (subresolution.fileExists) {
          return {
            ...subresolution,
            customIndex: true,
            isDirectoryIndex: true,
          }
        }
      }

      if (packageJSON['main']) {
        const main = packageJSON['main'];
        const subresolution = resolveSubmodule(exact, main, false, jsFirst, isBrowserBuild);
        if (subresolution.fileExists) {
          return {
            ...subresolution,
            isDirectoryIndex: true,
            customIndex: true,
          };
        }
      }

      // We do not look for index.js (etc.) here
      // Because we always look for those whether we are checking package.json or not
      // So that's done outside the if.
    }
  }

  // If an index file exists return it
  for (const extension of extensions) {
    const asIndex = path.join(exact, `index${extension}`);
    if (isFileSync(asIndex)) {
      return {
        absPath: asIndex,
        extension: extension,
        fileExists: true,
        isDirectoryIndex: true,
      }
    }
  }

  const asJson = `${exact}.json`;
  if (isFileSync(asJson)) {
    return {
      absPath: asJson,
      customIndex: true,
      extension: ".json",
      fileExists: true,
    }
  }

  return {
    absPath: exact,
    fileExists: false,
  };
}


function loadTsConfig(packageDir: string) {
  const tsConfig = path.resolve(packageDir, 'tsconfig.json');
  if (isFileSync(tsConfig)) {
    const tsConfigParsed = parseTypescriptConfig(tsConfig);
    if (!tsConfigParsed.error) {
      return {
        absPath: packageDir,
        compilerOptions: tsConfigParsed.config.compilerOptions,
        tsconfigPath: tsConfig,
      };
    }
  }
}