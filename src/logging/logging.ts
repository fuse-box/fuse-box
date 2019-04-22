import { getSpinner, ISpinnerInterface } from './Spinner';
import { colors } from './chroma';
import { codeLog } from './codeLog';
export interface ILogger {
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
  verbose: (msg: string, variables?: { [key: string]: any }) => void;
  hasErrors: () => boolean;
  hasWarnings: () => boolean;
  getErrors: () => Array<{ str: string; vars: any }>;
  getWarnings: () => Array<{ str: string; vars: any }>;
  printNewLine: () => void;
}

type ILoggerType = 'verbose' | 'succinct' | 'disabled';
export interface ILoggerProps {
  level: ILoggerType;
}

export const EMOJIS = {
  warning: '⚠️ ',
};

function replaceVars(str, vars) {
  if (vars) {
    for (const key in vars) {
      str = str.replace(`$${key}`, vars[key]);
    }
  }
  return str;
}
export function getLogger(props?: ILoggerProps): ILogger {
  let level: ILoggerType = props && props.level ? props.level : 'succinct';
  if (process.env.JEST_TEST) {
    level = 'disabled';
  }

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
        console.log(codeLog(` ⚠️  <yellow>${replaceVars(item.str, item.vars)}<yellow>`));
      });
      scope.warnings = [];
    },
    printErrors: () => {
      scope.errors.forEach(item => {
        console.log(codeLog(` ❌ <bold><red>${replaceVars(item.str, item.vars)}<red></bold>`));
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
    stopSpinner: () => {
      if (scope.spinner) {
        scope.spinner.stop();
        delete scope.spinner;
      }
    },
  };
  if (level === 'succinct') {
    const spinner = methods.withSpinner();
    spinner.start();
    scope.spinner = spinner;
  }
  return methods;
}
