import { IPublicConfig } from '../../config/IPublicConfig';

import * as fs from 'fs';
import * as path from 'path';
import { Context } from '../../core/Context';
import { env } from '../../env';
import { mockWriteFile, testUtils } from '../../utils/test_utils';
import { matchAll } from '../../utils/utils';

export function createFileSet(directory, files: { [key: string]: string }) {
  const newSet = {};
  for (const key in files) {
    newSet[path.join(directory, key)] = files[key];
  }

  return newSet;
}

export class IntegrationHelper {
  public ctx: Context;
  constructor(public mock) {}

  public getOutputDirectory() {
    return this.ctx.writer.outputDirectory;
  }

  public findInDist(target: string) {
    return this.mock.findFile(path.join(this.getOutputDirectory(), target));
  }

  public findFile(target: string) {
    return this.mock.findFile(target);
  }

  public listDistFiles() {
    return this.mock.findFiles(this.getOutputDirectory());
  }

  public extractScripts(contents: string) {
    const data: { cssPaths: Array<string>; cssRaw: Array<string>; jsPaths: Array<string>; jsRaw: Array<string> } = {
      cssPaths: [],
      cssRaw: [],
      jsPaths: [],
      jsRaw: [],
    };
    matchAll(/<script.*src=\"(.*?)\"/gim, contents, matches => {
      data.jsPaths.push(matches[1]);
    });

    matchAll(/<link.*href=\"(.*?)\"/gim, contents, matches => {
      data.cssPaths.push(matches[1]);
    });

    matchAll(/script>(.*?)<\/script>"/gim, contents, matches => {
      data.jsRaw.push(matches[1]);
    });

    matchAll(/style>(.*?)<\/style>"/gim, contents, matches => {
      data.cssRaw.push(matches[1]);
    });
    return data;
  }
}
export function createTestBundle(config: IPublicConfig, files: { [key: string]: string }) {
  testUtils();

  const mock = mockWriteFile();

  // adding development api to the mock
  const devApiPath = path.join(env.FUSE_MODULES, 'fuse-loader/index.js');
  const devApiContents = fs.readFileSync(devApiPath).toString();
  mock.addFile(devApiPath, devApiContents);

  for (const key in files) mock.addFile(key, files[key]);

  config.logging = { level: 'disabled' };
  config.watch = false;
  config.cache = false;
  config.devServer = false;
  if (!config.plugins) {
    config.plugins = [];
  }
  let helper = new IntegrationHelper(mock);
  config.plugins.push(ctx => {
    helper.ctx = ctx;
  });

  const { fusebox } = require('../../core/fusebox');
  const fuse = fusebox(config);
  return { fuse, helper: helper, mock };
}
