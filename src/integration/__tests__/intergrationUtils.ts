import * as path from 'path';
import { Context } from '../../core/context';
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
