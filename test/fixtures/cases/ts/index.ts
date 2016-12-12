
import "reflect-metadata";

import { testDecorator, testDecorator2 } from './TestDecorator';

require("./foo.txt");

@testDecorator()
class MyClass {
    constructor(parameters) {

    }

    public hello() {

    }

    public a() {

    }
}