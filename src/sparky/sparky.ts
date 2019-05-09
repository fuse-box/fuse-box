import { sparkyChain } from './sparky_chain';

export function sparky<T>(Ctx: new () => T) {
  const ctx = new Ctx();

  const scope = {
    activities: [],
    src: (glob: string) => sparkyChain().src(glob),
  };
  return scope;
}
