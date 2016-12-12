import "reflect-metadata";

import { testDecorator, testDecorator2 } from './TestDecorator';


require("./styles.css");
@testDecorator()
class MyClass {
    constructor(parameters) {

    }

    public hello() {

    }

    public a() {

    }
}