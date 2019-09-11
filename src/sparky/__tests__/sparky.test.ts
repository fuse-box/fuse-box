import '../../utils/test_utils';
import { sparky } from '../sparky';
import { env } from '../../env';
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
    await chain
      .contentsOf('a.txt', str => {
        return 'some text';
      })
      .exec();
    const readFiles = chain['__scope']().readFiles;
    expect(readFiles[Object.keys(readFiles)[0]]).toEqual('some text');
  });

  it('should replace contents (with regex)', async () => {
    const chain = mockSparkySrc(`${__dirname}/stubs/case-a/**/**.*`);
    await chain
      .contentsOf(/a\.txt/, str => {
        return 'some text';
      })
      .exec();
    const readFiles = chain['__scope']().readFiles;
    expect(readFiles[Object.keys(readFiles)[0]]).toEqual('some text');
  });

  it('sparky script path check 1 - base:"__test__/case1/"', async () => {
    //
    // override ENV so we simulate script staretd somewhere else
    // set to subfolder './case1
    env.SCRIPT_PATH = path.normalize(`${__dirname}/case1/`);

    class SparkyContext {}
    const { src, rm } = sparky<SparkyContext>(SparkyContext);

    // remove old if any
    rm('./dist');
    await src(`../stubs/**/**.*`)
      .dest('dist', 'stubs')
      .exec();

    // check if it have file
    const chain = mockSparkySrc(`dist/case-a/**/**.*`);
    const list = await chain
      .filter(/.*\.(txt|md)$/) // check if filter works
      .filter(/foo\.md$/)
      .exec();
    expect(list).toHaveLength(1);

    // cleanup and test
    rm('dist');
    const chain2 = mockSparkySrc(`dist/case-a/**/**.*`);
    const list2 = await chain2
      .filter(/.*\.(txt|md)$/)
      .filter(/foo\.md$/)
      .exec();
    expect(list2).toHaveLength(0);
  });

  it('sparky script path check 2 - base:"__test__/"', async () => {
    // override ENV so we simulate script staretd somewhere else
    // use current script path
    env.SCRIPT_PATH = path.normalize(`${__dirname}`);

    class SparkyContext {}
    const { src, rm } = sparky<SparkyContext>(SparkyContext);

    // remove old if any
    rm('./case1/dist');
    await src(`./stubs/**/**.*`) // check if filter works
      .dest('case1/dist', 'stubs')
      .exec();

    const chain = mockSparkySrc(`./case1/dist/case-a/**/**.*`);
    const list = await chain
      .filter(/.*\.(txt|md)$/)
      .filter(/foo\.md$/)
      .exec();
    expect(list).toHaveLength(1);

    // cleanup and test
    rm('./case1/dist');
    const chain2 = mockSparkySrc(`./case1/dist/case-a/**/**.*`);
    const list2 = await chain2
      .filter(/.*\.(txt|md)$/)
      .filter(/foo\.md$/)
      .exec();
    expect(list2).toHaveLength(0);
  });

  it('sparky script path check 3 - base:"__test__/" with parent path on checks', async () => {
    // override ENV so we simulate script staretd somewhere else
    // use current script file path
    env.SCRIPT_PATH = path.normalize(`${__dirname}`);

    class SparkyContext {}
    const { src, rm } = sparky<SparkyContext>(SparkyContext);

    // remove old if any
    rm('./case1/dist');
    await src(`./stubs/**/**.*`) // check if filter works
      .dest('case1/dist', 'stubs')
      .exec();

    // go crazy and change paths of script again tp parent folder
    // can user also do this ?
    env.SCRIPT_PATH = path.normalize(path.resolve(__dirname, '../'));

    const chain = mockSparkySrc(`__tests__/case1/dist/case-a/**/**.*`);
    const list = await chain
      .filter(/.*\.(txt|md)$/)
      .filter(/foo\.md$/)
      .exec();
    expect(list).toHaveLength(1);

    // cleanup and test
    rm('__tests__/case1/dist');
    const chain2 = mockSparkySrc(`__tests__/case1/dist/case-a/**/**.*`);
    const list2 = await chain2
      .filter(/.*\.(txt|md)$/)
      .filter(/foo\.md$/)
      .exec();
    expect(list2).toHaveLength(0);
  });

  it('sparky script path check 3 - bump check', async () => {
    // override ENV so we simulate script staretd somewhere else
    // use ./case1
    env.SCRIPT_PATH = path.normalize(`${__dirname}/case1`);

    class SparkyContext {}
    const { src, rm } = sparky<SparkyContext>(SparkyContext);

    // remove old if any
    rm('dist');

    // make copy, so we dont modify original
    await src('pack.json')
      .dest('dist/', env.SCRIPT_PATH)
      .exec();

    // bump and make copy like build does
    await src('dist/pack.json')
      .bumpVersion('dist/pack.json', { type: 'next' })
      .write()
      .dest('dist/modified', 'dist')
      .exec();

    // get both files and check version
    const chain = mockSparkySrc(`dist/**/**.*`);
    const list = await chain
      .contentsOf(/pack\.json$/, str => {
        const json = JSON.parse(str);
        expect(json.version).toEqual('4.0.0-next.137');
        return json;
      })
      .exec();
    expect(list).toHaveLength(2);

    // cleanup and test
    rm('dist');
    const chain2 = mockSparkySrc(`dist/**/**.*`);
    const list2 = await chain2.filter(/pack\.json$/).exec();
    expect(list2).toHaveLength(0);
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
