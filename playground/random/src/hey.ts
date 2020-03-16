export interface BInterface {}
export interface AInterface {
  b?: BInterface;
}

const AObject: AInterface = {
  b: {},
};
export { AObject };
