import { sparky } from '../sparky';
import '../../utils/test_utils';
import * as path from 'path';

function mockSparkySrc(glob: string) {
  class SparkyContext {}
  const { src } = sparky<SparkyContext>(SparkyContext);
  return src(glob);
}
describe('Sparky test', () => {
  it('should give a list', async () => {
    const chain = mockSparkySrc(`${__dirname}/stubs/case-a/**/**.*`);

    const list = await chain.exec();

    expect(list).toHaveLength(3);
  });
  it('should filter with function true', async () => {
    const chain = mockSparkySrc(`${__dirname}/stubs/case-a/**/**.*`);

    const list = await chain.filter(() => true).exec();

    expect(list).toHaveLength(3);
  });

  it('should filter with function false', async () => {
    const chain = mockSparkySrc(`${__dirname}/stubs/case-a/**/**.*`);

    const list = await chain.filter(() => false).exec();

    expect(list).toHaveLength(0);
  });

  it('should filter with function false 2', async () => {
    const chain = mockSparkySrc(`${__dirname}/stubs/case-a/**/**.*`);

    const list = await chain.filter(file => file.includes('a.txt')).exec();

    expect(list).toHaveLength(1);
  });

  it('should filter with regex', async () => {
    const chain = mockSparkySrc(`${__dirname}/stubs/case-a/**/**.*`);

    const list = await chain.filter(/a\.txt$/).exec();

    expect(list).toHaveLength(1);
  });

  it('should call 2 filters', async () => {
    const chain = mockSparkySrc(`${__dirname}/stubs/case-a/**/**.*`);
    const list = await chain
      .filter(/.*\.(txt|md)$/)
      .filter(/foo\.md$/)
      .exec();

    expect(list).toHaveLength(1);
  });

  it('should replace contents (with string 2 regex)', async () => {
    const chain = mockSparkySrc(`${__dirname}/stubs/case-a/**/**.*`);
    const list = await chain
      .contentsOf('a.txt', str => {
        return 'some text';
      })
      .exec();
    const readFiles = chain['__scope']().readFiles;
    expect(readFiles[Object.keys(readFiles)[0]]).toEqual('some text');
  });

  it('should replace contents (with regex)', async () => {
    const chain = mockSparkySrc(`${__dirname}/stubs/case-a/**/**.*`);
    const list = await chain
      .contentsOf(/a\.txt/, str => {
        return 'some text';
      })
      .exec();
    const readFiles = chain['__scope']().readFiles;
    expect(readFiles[Object.keys(readFiles)[0]]).toEqual('some text');
  });

  // it('should filter with function false', async () => {
  //   const { src } = mockSparky();
  //   const list = await src(`${__dirname}/../**/**.*`)
  //     .filter(file => {
  //       if (file.includes('sparky.ts')) {
  //         return true;
  //       }
  //     })
  //     .exec();

  //   expect(list).toHaveLength(1);
  //   expect(list[0]).toMatchFilePath('sparky/sparky.ts');
  // });
});
