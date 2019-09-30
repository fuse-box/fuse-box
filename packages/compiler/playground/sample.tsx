// import * as React from "react";

// export function hello() {
//   const props = { a: 1 };
//   const other = { b: 2 };
//   const aa = "dd";
//   const rest = {};
//   const arr = [];
//   //const a = {...rest ...props}
//   return (<div>1<span  id="1" f={3}  {...rest} b="1"  ></span></div>)
//   // return (
//   //   // <div>
//   //   //   1
//   //   //   <span {...props} {...other} className={<div></div>}>
//   //   //     {some}
//   //   //   </span>
//   //   // </div>
//   // );
// }

import { Type } from './types';

export function hey(t: Type) {
  return 1;
}
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
