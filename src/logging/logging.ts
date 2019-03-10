import console = require('console');
import { yellow, cyan, red, green, magenta } from './chroma';

export interface ILogger {
  debug(msg: String);
  info(msg: String);
  warn(msg: String);
  error(msg: String);
  deprecated(msg: String);
  loading();
}

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

export function getLogger(
  props: ILoggerProps = {
    logLevel: LogLevel.INFO,
    withTimestamp: true,
  },
): ILogger {
  return {
    debug: msg => {
      log({ props, msg: green(msg), logPriority: LogPriority.DEBUG });
    },
    info: msg => {
      log({ props, msg: cyan(msg), logPriority: LogPriority.INFO });
    },
    warn: msg => {
      log({ props, msg: yellow(msg), logPriority: LogPriority.WARNING });
    },
    error: msg => {
      log({ props, msg: red(msg), logPriority: LogPriority.ERROR });
    },
    deprecated: msg => {
      log({ props, msg: magenta(msg), logPriority: LogPriority.WARNING });
    },
    loading: () => {
      Spinner();
    },
  };
}
