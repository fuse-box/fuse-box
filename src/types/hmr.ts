export interface IHMRModuleUpdate {
  content: string;
  id: number;
  path: string;
}
export type IHMRModulesUpdate = Array<IHMRModuleUpdate>;

export interface HMRPayload {
  appModule: Record<string, { deps: Array<number>; path: string }>;
  updates: IHMRModulesUpdate;
}

export interface HMRHelper {
  isStylesheeetUpdate?: boolean;
  callEntries: () => void;
  callModules: (modules: IHMRModulesUpdate) => void;
  flushAll: () => void;
  flushModules: (modules: IHMRModulesUpdate) => void;
  updateModules: () => void;
}
