const someNumber = 1;
export const enum Stuff {
  First = 1 << 1,
  Second = First + 2,
}

console.log(Stuff.First);

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
