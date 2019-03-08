export enum LogLevel {
  LOG_ALL,
  LOG_ERRORS,
  LOG_WARNINGS,
}
export interface ILoggerProps {
  logLevel: LogLevel;
}

function Spinner() {
  return {
    setColor: () => {},
    setText: () => {},
    start: () => {},
    stop: () => {},
  };
}

export function getLogger(props: ILoggerProps) {
  return {
    info: message => {},
    warning: message => {},
    deprecated: message => {},
    createSpinner: () => {
      return Spinner();
    },
  };
}
