import * as React from "react";
import kakka from "./pukka"
export function hello() {
  const props = { a: 1 };
  const other = { b: 2 };
  const aa = "dd";
  const rest = {};
  const arr = [];
  //const a = {...rest ...props}
  return (<div>1<span  id="1" f={3}  {...rest} b="1"  ></span></div>)
  // return (
  //   // <div>
  //   //   1
  //   //   <span {...props} {...other} className={<div></div>}>
  //   //     {some}
  //   //   </span>
  //   // </div>
  // );
}
