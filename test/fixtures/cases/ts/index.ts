import { Foo } from "./Foo";


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