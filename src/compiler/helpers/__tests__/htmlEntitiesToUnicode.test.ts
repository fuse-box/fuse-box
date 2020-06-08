import { htmlEntitiesToUnicode } from '../entities';

describe('Html entities', () => {
  it('should repalce', () => {
    const data = htmlEntitiesToUnicode('hello &copy; that &atilde; and &copy; && &nbsp;');
    expect(data).toEqual(`hello \\u00A9 that \\u00E3 and \\u00A9 && \\u00A0`);
  });
});
