import * as ts from 'typescript';
import { initTypescriptConfig } from '../../tsconfig/configParser';
import { tsTransformModule } from '../tsTransformModule';

describe('tsTransformModule test', () => {
  let compilerOptions: ts.CompilerOptions;

  const testTransformer = context => {
    const visit: ts.Visitor = node => {
      return ts.visitEachChild(node, child => visit(child), context);
    };
    return node => ts.visitNode(node, visit);
  };

  beforeAll(() => {
    const anyConf: any = {};
    const config = initTypescriptConfig(anyConf);
    compilerOptions = config.compilerOptions;
  });

  it('should transform module without any custom transformers', () => {
    const transformedModule = tsTransformModule(
      'const x = 123; export default x;',
      'foo.ts',
      compilerOptions,
      [],
      [],
      {},
    );

    expect(transformedModule).toBeDefined();
    expect(transformedModule.outputText).toBeDefined();
    expect(transformedModule.outputText.length).toBeGreaterThan(0);
  });

  it('should transform module and run "before" transformer', () => {
    const beforeSpy = jest.fn(testTransformer);

    const transformedModule = tsTransformModule(
      'const x = 123; export default x;',
      'foo.ts',
      compilerOptions,
      [beforeSpy],
      [],
      {},
    );

    expect(transformedModule).toBeDefined();
    expect(transformedModule.outputText).toBeDefined();
    expect(transformedModule.outputText.length).toBeGreaterThan(0);
    expect(beforeSpy).toBeCalled();
  });

  it('should transform module and run "after" transformer', () => {
    const afterSpy = jest.fn(testTransformer);

    const transformedModule = tsTransformModule(
      'const x = 123; export default x;',
      'foo.ts',
      compilerOptions,
      [],
      [afterSpy],
      {},
    );

    expect(transformedModule).toBeDefined();
    expect(transformedModule.outputText).toBeDefined();
    expect(transformedModule.outputText.length).toBeGreaterThan(0);
    expect(afterSpy).toBeCalled();
  });

  it('should transform module and run "after" and "before" transformer', () => {
    const afterSpy = jest.fn(testTransformer);
    const beforeSpy = jest.fn(testTransformer);

    const transformedModule = tsTransformModule(
      'const x = 123; export default x;',
      'foo.ts',
      compilerOptions,
      [beforeSpy],
      [afterSpy],
      {},
    );

    expect(transformedModule).toBeDefined();
    expect(transformedModule.outputText).toBeDefined();
    expect(transformedModule.outputText.length).toBeGreaterThan(0);
    expect(afterSpy).toBeCalled();
    expect(beforeSpy).toBeCalled();
  });

  it('should transform module and run "after" and "before" transformers with custom transformers', () => {
    const afterSpy = jest.fn(testTransformer);
    const beforeSpy = jest.fn(testTransformer);
    const customBeforeSpy = jest.fn(testTransformer);
    const customAfterSpy = jest.fn(testTransformer);

    const transformedModule = tsTransformModule(
      'const x = 123; export default x;',
      'foo.ts',
      compilerOptions,
      [beforeSpy],
      [afterSpy],
      {
        before: [customBeforeSpy],
        after: [customAfterSpy],
      },
    );

    expect(transformedModule).toBeDefined();
    expect(transformedModule.outputText).toBeDefined();
    expect(transformedModule.outputText.length).toBeGreaterThan(0);
    expect(afterSpy).toBeCalled();
    expect(beforeSpy).toBeCalled();
    expect(customBeforeSpy).toBeCalled();
    expect(customAfterSpy).toBeCalled();
  });

  it('should transform module and run "after" and "before" transformers with custom transformers', () => {
    const afterSpy = jest.fn(testTransformer);
    const beforeSpy = jest.fn(testTransformer);
    const customBeforeSpy = jest.fn(testTransformer);
    const customBeforeSpy2 = jest.fn(testTransformer);
    const customAfterSpy = jest.fn(testTransformer);
    const customAfterSpy2 = jest.fn(testTransformer);

    const transformedModule = tsTransformModule(
      'const x = 123; export default x;',
      'foo.ts',
      compilerOptions,
      [beforeSpy],
      [afterSpy],
      {
        before: [customBeforeSpy, customBeforeSpy2],
        after: [customAfterSpy, customAfterSpy2],
      },
    );

    expect(transformedModule).toBeDefined();
    expect(transformedModule.outputText).toBeDefined();
    expect(transformedModule.outputText.length).toBeGreaterThan(0);
    expect(afterSpy).toBeCalled();
    expect(beforeSpy).toBeCalled();
    expect(customBeforeSpy).toBeCalled();
    expect(customAfterSpy).toBeCalled();
    expect(customBeforeSpy2).toBeCalled();
    expect(customAfterSpy2).toBeCalled();
  });
});
