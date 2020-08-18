import { initCommonTransform } from '../testUtils';
import { ImportTransformer } from '../transformers/shared/ImportTransformer';
import { JSXTransformer } from '../transformers/shared/JSXTransformer';

const testTranspile = (props: { code: string; jsx?: boolean }) => {
  return initCommonTransform({
    code: props.code,
    compilerOptions: {
      jsxFactory: 'React.createElement',
    },
    jsx: true,
    props: { module: { props: { extension: '.tsx' } } },
    transformers: [JSXTransformer(), ImportTransformer()],
  });
};

describe('JSX', () => {
  it('should parse simple jsx', () => {
    const result = testTranspile({
      code: `
        function test(){
            return <div></div>
        }
          `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should add text', () => {
    const result = testTranspile({
      code: `
        function test(){
            return <div>1</div>
        }
          `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should add just attributes', () => {
    const result = testTranspile({
      code: `
        import oi from "./oi";
        function test(){
          return (<i id="1" f={oi} ></i>)
        }
          `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should add key literal attributes', () => {
    const result = testTranspile({
      code: `
      function hey() {
        return <div data-automation="df"></div>;
      }`,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should convert attributes without vales to boolean', () => {
    const result = testTranspile({
      code: `
      function hey() {
        return <div some></div>;
      }`,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should add just attributes and spread', () => {
    const result = testTranspile({
      code: `
        import oi from "./oi";
        function test(){
          return (<i id="1" f={oi} {...props} ></i>)
        }
      `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should spread correctly', () => {
    const result = testTranspile({
      code: `
        function EventList () {
          const cameraIDs = ['a'];
          return <Foo jo='test' {...entry} cameraIDs={cameraIDs} key='123' />;
        }
      `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should have only one spread props', () => {
    const result = testTranspile({
      code: `
        import oi from "./oi";
        function test(){
          return (<i {...props} ></i>)
        }
      `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should keep the order', () => {
    const result = testTranspile({
      code: `
        import oi from "./oi";
        function test(){
          return (<i id={1} f={oi} {...props} s={2} {...rest}></i>)
        }
          `,
    });
    expect(result.code).toMatchSnapshot();
  });

  it('should remove empty expressions', () => {
    const result = testTranspile({
      code: `
        import oi from "./oi";
        function test(){
          return (<i> {/* <i></i> */} </i>)
        }
          `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should handle JSX fragment', () => {
    const result = testTranspile({
      code: `
        import React from "react";
        function test(){
          return (
            <div>
              <>
                <div>1</div>
              </>
            </div>
          )
        }
          `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should handle dotted JSX elements', () => {
    const result = testTranspile({
      code: `
        import React from "react";
        function test(){
          return <animated.div>1</animated.div>
        }
          `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should handle dotted JSX elements deep', () => {
    const result = testTranspile({
      code: `
        import React from "react";
        function test(){
          return <this.state.foo.bar.animated.div/>
        }
          `,
    });

    expect(result.code).toMatchSnapshot();
  });

  it('should work with JSXSpreadChild', () => {
    const result = testTranspile({
      code: `

        function test(){
          return (<i>{...children}</i>)
        }
          `,
    });
    expect(result.code).toMatchSnapshot();
  });
});
