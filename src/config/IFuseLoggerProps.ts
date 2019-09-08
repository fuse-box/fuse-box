export interface IFuseLoggerProps {
  level?: 'succinct' | 'verbose' | 'disabled';
  ignoreStatementErrors?: Array<string>;
}
