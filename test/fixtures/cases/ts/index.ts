
import "reflect-metadata";

import { testDecorator, testDecorator2 } from './TestDecorator';

require("./foo.css");

@testDecorator()
class MyClass {
    constructor(parameters) {

    }

    public hello() {

    }

    public a() {

    }
}