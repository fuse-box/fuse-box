import { codeLog } from './colors';

function parseArguments(args: Array<any>) {
  let message: any;
  let vars: any;
  if (args.length === 1) message = args[0];
  if (args.length === 2) {
    if (typeof args[1] === 'object') {
      message = args[0];
      vars = args[1];
    }
    if (typeof args[1] === 'string') {
      message = args[1];
    }
  }
  if (args.length === 3) {
    message = args[1];
    vars = args[2];
  }
  return { message, vars };
}
export class FuseLog {
  indent = '  ';
  log(type: string, result: string) {
    console.log(result);
  }

  getString(message: string, vars?: any) {
    return codeLog(message, vars);
  }

  echo(message: string, vars?) {
    this.log('echo', this.getString(message, vars));
  }

  info(group: string, ...args: any) {
    const { message, vars } = parseArguments(args);
    let str = this.indent;
    if (group) {
      str += `<bold><cyan>${group}</cyan></bold> `;
    }
    str += `${message}`;
    this.log('info', codeLog(str, vars));
  }

  warn(...args: any) {
    const { message, vars } = parseArguments(args);
    const str = `${this.indent}<bold>@warning <yellow>${message}</yellow></bold> `;
    this.log('warn', codeLog(str, vars));
  }

  success(...args: any) {
    const { message, vars } = parseArguments(args);
    const str = `${this.indent}<bold>@success <green>${message}</green></bold> `;
    this.log('success', codeLog(str, vars));
  }

  meta(group: string, message: string, vars?: any) {
    this.log(
      'meta',
      codeLog(`${this.indent}<bold><dim><yellow>${group}</yellow> <cyan>${message}</cyan></dim></bold>`, vars),
    );
  }

  error(...args: any) {
    const { message, vars } = parseArguments(args);
    const str = `${this.indent}<bold>@error <red>${message}</red></bold> `;
    this.log('error', codeLog(str, vars));
  }
}
