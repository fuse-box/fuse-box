const someNumber = 1;
var FileAccess;
(function (FileAccess) {
    // constant members
    FileAccess[FileAccess["None"] = 0] = "None";
    FileAccess[FileAccess["Read"] = 2] = "Read";
    FileAccess[FileAccess["Write"] = 4] = "Write";
    FileAccess[FileAccess["ReadWrite"] = 6] = "ReadWrite";
    // computed member
    FileAccess[FileAccess["G"] = '123'.length] = "G";
    FileAccess[FileAccess["Eh"] = 1 + someNumber] = "Eh";
})(FileAccess || (FileAccess = {}));
// 6 * (3 * 2)
const a = {
    type: 'BinaryExpression',
    left: {
        type: 'Literal',
        value: 6,
    },
    right: {
        type: 'BinaryExpression',
        left: {
            type: 'Literal',
            value: 3,
        },
        right: {
            type: 'Literal',
            value: 2,
        },
        operator: '*',
    },
    operator: '*',
};
// 1 * (6 * 3) * 2;
const b = {
    type: 'BinaryExpression',
    left: {
        type: 'BinaryExpression',
        left: {
            type: 'Literal',
            value: 6,
        },
        right: {
            type: 'Literal',
            value: 3,
        },
        operator: '*',
    },
    right: {
        type: 'Literal',
        value: 2,
    },
    operator: '*',
};
// enum FileAccess {
//   // constant members
//   None,
//   Read = 1 << 1,
//   Write = 1 << 2,
//   ReadWrite = Read | Write,
//   // computed member
//   G = '123'.length,
// }
// import React from 'react';
// export class Hello extends React.Component<{ children: Array<JSX.Element> }, any> {
//   render() {
//     return (
//       <div>
//         <>
//           <div>1</div>
//         </>
//       </div>
//     );
//   }
// }
// import { Type } from './types';
// export function hey(t: Type) {
//   return 1;
// function f() {
//   console.log('f(): evaluated');
//   return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
//     console.log('f(): called');
//   };
// }
// function g() {
//   console.log('g(): evaluated');
//   return function(target, propertyKey: string, descriptor: PropertyDescriptor) {
//     console.log('g(): called');
//   };
// }
// class C {
//   @f()
//   @g()
//   method() {
//     const list = [];
//     class A {
//       @f()
//       foo() {}
//     }
//   }
// }
