import { codeLog } from './colors';
import { wrapCodeString } from '../logging/codeLog';

function parseArguments(args: Array<any>) {
  let group;
  let message;
  let vars;
  if (args.length === 1) message = args[0];
  if (args.length === 2) {
    if (typeof args[1] === 'object') {
      message = args[0];
      vars = args[1];
    }
    if (typeof args[1] === 'string') {
      group = args[0];
      message = args[1];
    }
  }
  if (args.length === 3) {
    group = args[0];
    message = args[1];
    vars = args[2];
  }
  return { group, message, vars };
}
export class FuseLog {
  indent = '  ';
  log(type: string, result: string) {
    console.log(result);
  }

  getString(message: string, vars?) {
    return codeLog(message, vars);
  }

  echo(message: string, vars?) {
    this.log('echo', this.getString(message, vars));
  }

  info(...args: any) {
    const { group, message, vars } = parseArguments(args);
    let str = this.indent;
    if (group) {
      str += `<bold><cyan>${group}</cyan></bold> `;
    }
    str += `${message}`;
    this.log('info', codeLog(str, vars));
  }

  warn(...args: any) {
    const { group, message, vars } = parseArguments(args);
    let str = this.indent;
    if (group) {
      str += `<bold>@warning <yellow>${group}</yellow></bold> `;
      str += `<yellow>${message}</yellow>`;
    } else {
      str += `<bold>@warning <yellow>${message}</yellow></bold> `;
    }
    this.log('warn', codeLog(str, vars));
  }

  success(...args: any) {
    const { group, message, vars } = parseArguments(args);
    let str = this.indent;
    if (group) {
      str += `<bold>@success <green>${group}</green></bold> `;
      str += `<green>${message}</green>`;
    } else {
      str += `<bold>@success <green>${message}</green></bold> `;
    }
    this.log('success', codeLog(str, vars));
  }

  meta(group: string, message: string, vars?) {
    this.log(
      'meta',
      codeLog(`${this.indent}<bold><dim><yellow>${group}</yellow> <cyan>${message}</cyan></dim></bold>`, vars),
    );
  }

  error(...args: any) {
    const { group, message, vars } = parseArguments(args);
    let str = this.indent;
    if (group) {
      str += `<bold>@error <white><bgRed>${group}</bgRed></white></bold> `;
      str += `<red><bold>${message}</bold></red>`;
    } else {
      str += `<bold>@error <red>${message}</red></bold> `;
    }

    this.log('error', codeLog(str, vars));
  }
}

export function createLog<L>(CustomLogger?: L) {
  return new FuseLog();
}
