import { World } from './lib/World';
import { Foo } from "./Foo";

//import "babel-core";

let world = new World();

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