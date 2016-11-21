import { Foo } from "./Foo";

import * as babelCore from "babel-core";
console.log(babelCore);
/**
 * Hello
 */
class Hello {
    public getName(): string {
        return "hello";
    }

    public getFoo(): Foo {
        return new Foo();
    }
}
let hello = new Hello();
console.log(hello.getFoo());