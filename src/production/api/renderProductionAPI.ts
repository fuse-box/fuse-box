import * as LegoAPI from 'lego-api';
import * as path from 'path';
import { readFile } from '../../utils/utils';

export interface IProductionAPIOptions {
  useSingleBundle?: boolean;
  browser?: boolean;
  universal?: boolean;
  isElectron?: boolean;
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
  splitConfig?: any;
  extendServerImport?: boolean;
  runtimeBundleMapping?: boolean;
}
const keys = [
  'browser',
  'universal',
  'useSingleBundle',
  'isElectron',
  'server',
  'allowSyntheticDefaultImports',
  'splitConfig',
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
  if (conditions.useSingleBundle) {
    data = `var $fsx = ${data}`;
  }
  return data;
}
