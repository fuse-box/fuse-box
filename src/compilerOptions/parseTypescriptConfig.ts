import { parse } from 'comment-json';
import { readFile } from '../utils/utils';
import { IRawTypescriptConfig } from './interfaces';

export function parseTypescriptConfig(target: string): IRawTypescriptConfig {
  let contents, json;
  try {
    contents = readFile(target);
    json = parse(contents);
  } catch (e) {
    return {
      error: {
        message: e.message,
      },
    };
  }
  return { config: json };
}
