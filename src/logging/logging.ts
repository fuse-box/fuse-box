import console = require('console');
import { yellow, cyan, red, green, magenta } from './chroma';

export enum LogPriority {
  INFO = 'info',
  DEBUG = 'debug',
  ERROR = 'error',
  WARNING = 'warning',
}

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  VERBOSE = 3,
  DEBUG = 4,
}

const logPermissions = new Map<LogLevel, LogPriority[]>();
logPermissions.set(LogLevel.VERBOSE, [LogPriority.DEBUG, LogPriority.INFO, LogPriority.WARNING, LogPriority.ERROR]);
logPermissions.set(LogLevel.DEBUG, [LogPriority.DEBUG, LogPriority.INFO, LogPriority.WARNING, LogPriority.ERROR]);
logPermissions.set(LogLevel.INFO, [LogPriority.INFO, LogPriority.WARNING, LogPriority.ERROR]);
logPermissions.set(LogLevel.WARN, [LogPriority.WARNING, LogPriority.ERROR]);
logPermissions.set(LogLevel.ERROR, [LogPriority.ERROR]);

export interface ILoggerProps {
  logLevel: LogLevel;
  withTimestamp: boolean;
}

function Spinner() {
  return {
    setColor: () => {},
    setText: () => {},
    start: () => {},
    stop: () => {},
  };
}

function log({ props, logPriority, msg }: { props: ILoggerProps; logPriority: LogPriority; msg: String }): void {
  if (props.logLevel === LogLevel.VERBOSE || logPermissions.get(props.logLevel).includes(logPriority)) {
    const logDate = new Date();
    console.log(
      `${
        props.withTimestamp
          ? `${logDate.getFullYear()}-${logDate.getMonth()}-${logDate.getDay()}
          ${logDate.getHours()}:${logDate.getMinutes()}:${logDate.getSeconds()} - `
          : ''
      }${logPriority}: ${msg}`,
    );
  }
}

export function getLogger(props: ILoggerProps) {
  return {
    debug: msg => {
      return log({ props, msg: green(msg), logPriority: LogPriority.DEBUG });
    },
    info: msg => {
      return log({ props, msg: cyan(msg), logPriority: LogPriority.INFO });
    },
    warning: msg => {
      return log({ props, msg: yellow(msg), logPriority: LogPriority.WARNING });
    },
    error: msg => {
      return log({ props, msg: red(msg), logPriority: LogPriority.ERROR });
    },
    deprecated: msg => {
      return log({ props, msg: magenta(msg), logPriority: LogPriority.WARNING });
    },
    createSpinner: () => {
      return Spinner();
    },
  };
}
