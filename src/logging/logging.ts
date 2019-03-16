import { getSpinner, ISpinnerInterface } from './Spinner';
import { colors } from './chroma';
export interface ILogger {}

type ILoggerType = 'verbose' | 'succinct' | 'disabled';
export interface ILoggerProps {
  level: ILoggerType;
}

export function getLogger(props?: ILoggerProps) {
  const level: ILoggerType = props.level ? props.level : 'succinct';

  const scope: {
    group?: string;
    spinner?: ISpinnerInterface;
  } = {};

  function log(color: string, text: string, variables: { [key: string]: any }) {
    if (level === 'disabled') {
      return;
    }
    if (variables) {
      for (const key in variables) {
        text = text.replace(`$${key}`, variables[key]);
      }
    }
    const output = scope.group
      ? ` ${colors.bold(colors[color](scope.group))} → ${colors[color](text)}`
      : ` ${colors[color](text)}`;

    if (level === 'succinct' && scope.spinner) {
      scope.spinner.setText(output);
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
    info: (msg: string, variables?: { [key: string]: any }) => {
      log('cyan', msg, variables);
    },
    warn: (msg: string, variables?: { [key: string]: any }) => {
      log('yellow', msg, variables);
    },
    error: (msg: string, variables?: { [key: string]: any }) => {
      log('red', msg, variables);
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

// const log = getLogger({ level: 'verbose' });

// log.info('Do some thing');
// log.info('Do it again');
// log.warn('Should not happen tho');

// setInterval(() => {
//   i++;
//   if (i < 10) {
//     log.info('Info something here $number', { number: i });
//     return;
//   }

//   if (i < 20) {
//     log.warn('warning something here $number', { number: i });
//     return;
//   }

//   if (i < 30) {
//     log.error('Error here $number', { number: i });
//     return;
//   }

//   if (i < 40) {
//     log.error('Deprecated here $number', { number: i });
//     return;
//   }
// }, 100);

//log.stopSpinner();
