export interface IWatcherProps {
  enabled?: boolean;
  ignore?: Array<RegExp | string>;
  paths?: Array<string>;
}
