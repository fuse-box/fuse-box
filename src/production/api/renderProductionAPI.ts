import * as LegoAPI from 'lego-api';
import * as path from 'path';
import { readFile, createConcat, Concat } from '../../utils/utils';
import { ProductionModule } from '../ProductionModule';

export interface IProductionAPIOptions {
  webworker?: boolean;
  browser?: boolean;
  universal?: boolean;
  server?: boolean;
  globalRequire?: boolean;
  isServerFunction?: boolean;
  isBrowserFunction?: boolean;
  computedStatements?: boolean;
  allowSyntheticDefaultImports?: boolean;
  hashes?: boolean;
  serverRequire?: boolean;
  customStatementResolve?: boolean;
  lazyLoading?: boolean;
  codeSplitting?: boolean;
  ajaxRequired?: boolean;
  jsonLoader?: boolean;
  cssLoader?: boolean;
  promisePolyfill?: boolean;
  loadRemoteScript?: boolean;
  isContained?: boolean;
  extendServerImport?: boolean;
  runtimeBundleMapping?: boolean;
}
const keys = [
  'browser',
  'universal',
  'webworker',
  'server',
  'globalRequire',
  'isServerFunction',
  'isBrowserFunction',
  'computedStatements',
  'allowSyntheticDefaultImports',
  'hashes',
  'serverRequire',
  'customStatementResolve',
  'lazyLoading',
  'codeSplitting',
  'ajaxRequired',
  'jsonLoader',
  'cssLoader',
  'promisePolyfill',
  'loadRemoteScript',
  'isContained',
  'extendServerImport',
  'runtimeBundleMapping',
];
const defaultOptions: IProductionAPIOptions = {};
for (const key in keys) {
  defaultOptions[keys[key]] = false;
}
export function renderProductionAPI(conditions?: IProductionAPIOptions, variables?: { [key: string]: any }) {
  const contents = readFile(path.join(__dirname, 'production.api.js'));
  const opts = { ...defaultOptions, ...conditions };
  let data = LegoAPI.parse(contents).render(opts);
  if (variables) {
    for (let varName in variables) {
      data = data.replace(`$${varName}$`, variables[varName]);
    }
  }
  if (conditions.webworker) {
    data = `var $fsx = ${data}`;
  }
  return data;
}
