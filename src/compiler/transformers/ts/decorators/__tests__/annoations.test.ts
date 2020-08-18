import * as parser from '@typescript-eslint/typescript-estree';
import '../../../../../utils/test_utils';
import { convertTypeAnnotation, KNOWN_IDENTIFIERS } from '../Annotations';

function conv(typeAnnotation?: string) {
  const ast = parser.parse(`function a(${typeAnnotation ? 'c : ' + typeAnnotation : 'c'}){}`, {}) as any;
  //console.log(JSON.stringify(ast, null, 2));
  return convertTypeAnnotation(ast.body[0].params[0].typeAnnotation);
}

const generics = ['string', 'number', 'Number', 'String'];
const voidZero = ['undefined', 'never', 'void', 'null'];
const other = ['any', '{}', '[]', "'a'", '1', '() => {}', 'true', 'false', '0x22', 'keyof S'];

const KNOWN = Object.keys(KNOWN_IDENTIFIERS);

describe('Annotation test', () => {
  // it('should give an object without annotation', () => {
  //   const res = conv();
  //   expect(res).toMatchSnapshot();
  // });

  describe('other', () => {
    for (const name of other) {
      it(`should detect "${name}"`, () => {
        const res = conv(name);

        expect(JSON.stringify(res)).toMatchSnapshot();
      });
    }
  });

  describe('Void Zero', () => {
    for (const name of voidZero) {
      it(`should detect "${name}"`, () => {
        const res = conv(name);
        //console.log(name, '=>', res);

        expect(JSON.stringify(res)).toMatchSnapshot();
      });
    }
  });

  describe('Known identifiers', () => {
    for (const name of KNOWN) {
      it(`should detect "${name}"`, () => {
        const res = conv(name);
        expect(JSON.stringify(res)).toMatchSnapshot();
      });
    }
  });

  describe('Generics', () => {
    for (const name of generics) {
      it(`should detect "${name}"`, () => {
        const res = conv(name);
        //console.log(name, '=>', res);
        expect(JSON.stringify(res)).toMatchSnapshot();
      });
    }
  });

  describe('Maybe objects', () => {
    it(`should detect SomeObject as maybe 1`, () => {
      const res = conv('SomeStuff');

      expect(JSON.stringify(res)).toMatchSnapshot();
    });
  });
});
