import { compileModule } from '../compileModule';

describe('JSX', () => {
  it('should parse simple jsx', () => {
    const result = compileModule({
      code: `
        function test(){
            return <div></div>
        }
          `,
    });
    expect(result.code).toMatchInlineSnapshot(`
                        "function test() {
                          return React.createElement(\\"div\\", null);
                        }
                        "
                `);
  });

  it('should add text', () => {
    const result = compileModule({
      code: `
        function test(){
            return <div>1</div>
        }
          `,
    });
    expect(result.code).toMatchInlineSnapshot(`
                        "function test() {
                          return React.createElement(\\"div\\", null, \\"1\\");
                        }
                        "
                `);
  });

  it('should add just attributes', () => {
    const result = compileModule({
      code: `
        import oi from "./oi";
        function test(){
          return (<i id="1" f={oi} ></i>)
        }
          `,
    });
    expect(result.code).toMatchInlineSnapshot(`
            "var oi_1 = require(\\"./oi\\");
            function test() {
              return React.createElement(\\"i\\", {
                id: \\"1\\",
                f: oi_1.default
              });
            }
            "
        `);
  });

  it('should add just attributes and spread', () => {
    const result = compileModule({
      code: `
        import oi from "./oi";
        function test(){
          return (<i id="1" f={oi} {...props} ></i>)
        }
          `,
    });

    expect(result.code).toMatchInlineSnapshot(`
                  "var oi_1 = require(\\"./oi\\");
                  function test() {
                    return React.createElement(\\"i\\", Object.assign({
                      id: \\"1\\",
                      f: oi_1.default
                    }, props));
                  }
                  "
            `);
  });

  it('should keep the order', () => {
    const result = compileModule({
      code: `
        import oi from "./oi";
        function test(){
          return (<i id={1} f={oi} {...props} s={2} {...rest}></i>)
        }
          `,
    });

    expect(result.code).toMatchInlineSnapshot(`
      "var oi_1 = require(\\"./oi\\");
      function test() {
        return React.createElement(\\"i\\", Object.assign({
          id: 1,
          f: oi_1.default
        }, props, {
          s: 2
        }, rest));
      }
      "
    `);
  });

  // it.only('should work with JSXSpreadChild', () => {
  //   const result = compileModule({
  //     code: `

  //       function test(){
  //         return (<i>{...children}</i>)
  //       }
  //         `,
  //   });

  //   console.log(result.code);
  // });
});
