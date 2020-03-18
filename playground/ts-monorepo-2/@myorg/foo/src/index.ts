import {strawberry} from "./red";
import {blueberry} from "@myorg/bar/dist/blue";
export function foo() {
    return `Foo ${strawberry} ${blueberry}`
}