import { codeLog } from './colors';

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

  info(group: string, message: string, vars?: any) {
    let str = this.indent;
    if (group) {
      str += `<bold><cyan>${group}</cyan></bold> `;
    }
    str += `${message}`;
    this.log('info', codeLog(str, vars));
  }

  warn(message: string, vars?: any) {
    this.log('warn', codeLog(`${this.indent}<bold>@warning <yellow>${message}</yellow></bold> `, vars));
  }

  success(message: string, vars?: any) {
    this.log('success', codeLog(`${this.indent}<bold>@success <green>${message}</green></bold> `, vars));
  }

  meta(group: string, message: string, vars?: any) {
    this.log(
      'meta',
      codeLog(`${this.indent}<bold><dim><yellow>${group}</yellow> <cyan>${message}</cyan></dim></bold>`, vars),
    );
  }

  error(message: string, vars?: any) {
    this.log('error', codeLog(`${this.indent}<bold>@error <red>${message}</red></bold> `, vars));
  }
}
