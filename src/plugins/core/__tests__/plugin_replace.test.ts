import { mockModule, mockWriteFile } from '../../../utils/test_utils';
import { pluginReplace } from '../plugin_replace';
const fileMock = mockWriteFile();
describe('Plugin replace test', () => {
  beforeEach(async () => await fileMock.flush());
  afterAll(() => {
    fileMock.unmock();
  });
  it('should match a file', () => {
    const mock = mockModule({});

    fileMock.addFile(__filename, '$version');
    mock.module.absPath = __filename;

    const data = pluginReplace('plugin_replace.test.ts', { $version: '1.0.0' });

    data(mock.ctx);
    mock.ctx.ict.sync('module_init', { module: mock.module });
    expect(mock.module.contents).toEqual('1.0.0');
  });

  it('should match all files', () => {
    const mock = mockModule({});

    fileMock.addFile(__filename, '$version');
    mock.module.absPath = __filename;

    const data = pluginReplace({ $version: '1.0.0' });

    data(mock.ctx);
    mock.ctx.ict.sync('module_init', { module: mock.module });

    expect(mock.module.contents).toEqual('1.0.0');
  });
});
