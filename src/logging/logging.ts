import { getSpinner, ISpinnerInterface } from './Spinner';
import { colors, codes } from './chroma';
import * as prettyTime from 'pretty-time';
import { codeLog, wrapCodeString } from './codeLog';
import { env } from '../env';
const readline = require('readline');
type ILoggerType = 'verbose' | 'succinct' | 'disabled';
export interface ILogger {
  level: ILoggerType;
  group: (name: string | boolean) => void;
  info: (msg: string, variables?: { [key: string]: any }) => void;
  warn: (msg: string, variables?: { [key: string]: any }) => void;
  printWarnings: () => void;
  printErrors: () => void;
  error: (msg: string, variables?: { [key: string]: any }) => void;
  deprecated: (msg: string, variables?: { [key: string]: any }) => void;
  withSpinner: () => ISpinnerInterface;
  stopSpinner: () => void;
  print: (msg: string, variables?: { [key: string]: any }) => void;
  progressFormat: (name: string, file: string, vars?) => void;
  progress: (msg: string, variables?: { [key: string]: any }) => void;
  progressEnd: (msg?: string, vars?: { [key: string]: any }) => void;
  verbose: (msg: string, variables?: { [key: string]: any }) => void;
  hasErrors: () => boolean;
  hasWarnings: () => boolean;
  getErrors: () => Array<{ str: string; vars: any }>;
  getWarnings: () => Array<{ str: string; vars: any }>;
  printNewLine: () => void;
  measureTimeStart: (group: string) => void;
  measureTimeEnd: (group: string) => string;
}

export interface ILoggerProps {
  level: ILoggerType;
}

export const EMOJIS = {
  warning: '⚠️ ',
};

const signs = {
  warning: '⚠️ ',
  checkmark: `✔`,
  clock: `⏲`,
  success: `${wrapCodeString('✔', codes.green)} `,
};

function replaceVars(str, vars) {
  vars = vars || {};
  vars = { ...vars, ...signs };

  if (vars) {
    for (const key in vars) {
      str = str.replace(`$${key}`, vars[key]);
    }
  }
  return str;
}
export function getLogger(props?: ILoggerProps): ILogger {
  let level: ILoggerType = props && props.level ? props.level : 'succinct';

  if (process.argv.includes('--verbose')) {
    level = 'verbose';
  }

  const scope: {
    group?: string;
    warnings: Array<{ str: string; vars: any }>;
    errors: Array<{ str: string; vars: any }>;
    spinner?: ISpinnerInterface;
  } = {
    warnings: [],
    errors: [],
  };
  if (env.isTest) {
    level = 'disabled';
  }

  function log(color: string, text: string, variables: { [key: string]: any }) {
    if (level === 'disabled') {
      return;
    }
    if (variables) {
      for (const key in variables) {
        text = text.replace(`$${key}`, variables[key]);
      }
    }

    let colouredText = colors[color](text);

    const output = scope.group ? ` ${colors.bold(colors[color](scope.group))}  ${colouredText}` : ` ${colouredText}`;

    if (level === 'succinct') {
      if (scope.spinner) {
        scope.spinner.setText(output);
      } else {
        console.log(output);
      }
    }
    if (level === 'verbose') {
      console.log(output);
    }
  }

  const measures: any = {};

  const methods = {
    group: (name: string | boolean) => {
      if (typeof name == 'boolean') {
        if (name === false) {
          delete scope.group;
        }
      } else {
        scope.group = name;
      }
    },
    progressFormat: (name: string, contents: string, vars?) => {
      methods.progress('<bold><dim> <yellow>  $name</yellow> <cyan>$contents</cyan></dim></bold>', {
        name: name,
        contents: replaceVars(contents, vars),
      });
    },
    progress: (msg?: string, vars?: { [key: string]: any }) => {
      if (level === 'disabled' || !msg) {
        return;
      }
      if (level === 'verbose') {
        methods.print(msg, vars);
      } else {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(codeLog(` ${replaceVars(msg, vars)}`));
      }
    },
    progressEnd(msg?: string, vars?: { [key: string]: any }) {
      readline.cursorTo(process.stdout, 0);
      readline.clearLine(process.stdout, 0);
      if (msg) {
        methods.print(msg, vars);
      }
    },

    printNewLine() {
      if (level === 'disabled') {
        return;
      }
      console.log('');
    },

    info: (msg: string, variables?: { [key: string]: any }) => {
      log('cyan', msg, variables);
    },
    verbose: (msg: string, vars?: { [key: string]: any }) => {
      if (level === 'verbose') {
        methods.print(msg, vars);
      }
    },
    print: (msg: string, vars?: { [key: string]: any }) => {
      if (level === 'disabled') {
        return;
      }
      console.log(codeLog(` ${replaceVars(msg, vars)}`));
    },
    warn: (msg: string, vars?: { [key: string]: any }) => {
      if (level === 'disabled') {
        return;
      }
      scope.warnings.push({ str: msg, vars: vars });
    },
    error: (msg: string, vars?: { [key: string]: any }) => {
      if (level === 'disabled') {
        return;
      }
      scope.errors.push({ str: msg, vars: vars });
    },
    hasWarnings: () => {
      return scope.warnings.length > 0;
    },
    getErrors: () => {
      return scope.errors;
    },
    getWarnings: () => {
      return scope.warnings;
    },
    hasErrors: () => {
      return scope.errors.length > 0;
    },
    printWarnings: () => {
      scope.warnings.forEach(item => {
        console.log(codeLog(` ⚠️  <yellow>${replaceVars(item.str, item.vars)}</yellow>`));
      });
      scope.warnings = [];
    },
    printErrors: () => {
      scope.errors.forEach(item => {
        console.log(codeLog(` ❌ <bold><red>${replaceVars(item.str, item.vars)}</red></bold>`));
      });
      scope.errors = [];
    },

    deprecated: (msg: string, variables?: { [key: string]: any }) => {
      log('red', msg, variables);
    },
    withSpinner: () => {
      const spinner = getSpinner({
        onStop: () => {
          delete scope.spinner;
        },
      });

      scope.spinner = spinner;
      return spinner;
    },
    measureTimeEnd: group => {
      return level === 'verbose' ? prettyTime(process.hrtime(measures[group])) : undefined;
    },
    measureTimeStart: group => {
      if (level === 'verbose') {
        measures[group] = process.hrtime();
      }
    },
    stopSpinner: () => {
      if (scope.spinner) {
        scope.spinner.stop();
        delete scope.spinner;
      }
    },
    level: level,
  };

  return methods;
}
