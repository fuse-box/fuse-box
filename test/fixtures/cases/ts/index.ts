import { World } from './lib/World';
import { Foo } from "./Foo";

import { Watch } from "wires-reactive";

console.log(Watch);

let world = new World();

/**
 * Hello
 */
class Hello {
    public getFoo(): Foo {
        return new Foo();
    }
    public getName(): string {
        return "hello";
    }

}
let hello = new Hello();
console.log(hello.getName());
console.log(hello.getFoo());