# Test Runner

FuseBox provides a very convenient and a blazy fast test runner based on TypeScript.

The concept is simple:

```js
fuse.bundle("app")
    .test("[**/**.test.ts]")
```

Just remove instructions, create an isolated task, and `test()`.  The entire FuseBox is powered by FuseBox tests. Check them out [here](https://github.com/fuse-box/fuse-box/tree/master/src/tests):


github_example: test-runner

## Default pattern

FuseBox will take this pattern `[**/**.test.ts]` which can be overriden.
warning: Don't change the ending - `test.ts`. The test runner is at its very early stage

## Test file

You FuseBox `should` assertion library to chain and validate your objects.

```js
import { should } from "fuse-test-runner";
import { Bar } from "../Bar";

export class BarTest {
    "Should be okay"() {
        should(Bar).beOkay().beObject()
    }

    "Should construct Bar Object"() {
        should(new Bar())
            .beObject()
            .mutate((bar: Bar) => bar.name)
            .equal("I am bar")
    }
}
```

Methods can be written as strings to improve the readability.

steps:
 * Test runner respects returns promises as well as done callbacks
 * All tests are execute in order they were defined

## Before and After

Like in mocha, you can do the following:

```js
export class BarTest {
    before(){}
    beforeEach(){}
    afterEach(){}
    after(){}
}
```

## Assertion API

Install first:

```bash
npm install fuse-test-runner
```

Assertion API is a chain, you can apply multiple validations for one object.
for example:

```js
should(file.localImports)
    .beMap()
    .mutate(x => x.get("./something"))
    .beMap()
    .mutate(x => x.get("foo"))
    .beInstanceOf(ImportDeclaration)
    .mutate(x => x.name)
    .equal("foo");
```

| name | Meaning |
| ------------- | ------------- |
| ` equal() `   | Equals stricty  |
| ` deepEqual() `   | Equals deeply  |
| ` notEqual() `   | Not equals stricty  |
| ` match(/foo/) `   | Matches  using regexp |
| ` notMatch(/foo/) `   | Should not match |
| ` notMatch(/foo/) `   | Should not match |
| ` findString("foo") `   | Should find a string |
| ` notFindString("foo") `   | Should not find a string |
| ` beOkay() `   | Should be not undefined or null |
| ` haveLength(2) `   | Object should have length |
| ` haveLengthGreater(2) `   |  |
| ` haveLengthLess(2) `   |  |
| ` haveLengthLessEqual(2) `   |  |
| ` throwException(() => { your code }) `   | A callback should throw an exception |
| ` haveLengthGreaterEqual(2) `   |  |
| ` haveLengthGreaterEqual(2) `   |  |
| ` beTrue() `   | Should be true |
| ` beFalse() `   | Should be false |
| ` beArray() `   | Should be an array |
| ` beObject() `   | Should be an object |
| ` bePlainObject() `   | Should be a plain objec |
| ` bePromise() `   | Should be a promise |
| ` beFunction() `   | Should be a function |
| ` beNumber() `   | Should be a number |
| ` beBoolean() `   | Should be boolean |
| ` beUndefined() `   | Should be undefined |
| ` beMap() `   | Should be a map |
| ` beSet() `   | Should be a set |
| ` beInstanceOf() `   | Should be instance of |
| ` beFalse() `   | Should be false |
| ` mutate(x => x.hello) `   | Changes the chains' pointer |



