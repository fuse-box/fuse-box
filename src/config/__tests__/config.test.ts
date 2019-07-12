import { createConfig } from '../config';

describe('config test', () => {
  it('should give default homeDir', () => {
    const conf = createConfig({});
    expect(conf.homeDir).toEqual(__dirname);
  });
  // many more to come, please help....
});
