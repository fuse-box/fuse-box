# TreeShaking logic:

Check every exported function being traced:

```
entry.ts:
  import { foo } from "./foo"

  foo.ts:
   export function foo(){}
   export function bar(){}

```

1. Traced to Main entry point -> used
2. Traced to Dynamic Import entry -> used

If not traced to any of the above:

1. Check if not referenced locally (within the module)
2. Check other modules referencing that function
3. Check if any of the tracable dependants is having IMPORT_SIDE_EFFECT (if there is something this export cannot be
   removed)

If the reference counter is ZERO and module.isTreeshakable (not containing IMPORT_SIDE_EFFECT in its trace) the object
can be safely removed

Example local reference

hello() export function hello() {}

Example local export reference

export function bar(){} export function foo(){ bar() }

Reducing the reference:

If say, bar() function is a candidate for removal, but it is being referenced in foo() -> we cannot remove it. However,
if foo() CAN be safely removed, we should reduce the reference counter of the function foo(){} and rinse and repeat,
trying to remove it again

### Scenario 1 - Clean reference

`Clean reference.`

```
entry.ts:
  import { foo } from "./foo"

foo.ts:
  export function foo(){}
  export function bar(){}

```

`function bar()` has no local references, and is not traced down to `entry.ts`

Result: **removing function bar()**

### Scenario 2 - Local reference

`Clean reference.`

```
entry.ts:
  import { foo } from "./foo"

foo.ts:
  export function foo(){
    bar();
  }
  export function bar(){}

```

`function bar()` has is referencing function `bar()` within its body

No actions applied

### Scenario 3 - Local reference in an unused function

`Clean reference.`

```
entry.ts:
  import { foo, baz } from "./foo"

foo.ts:
  export function baz(){

  }
  export function foo(){
    bar();
  }
  export function bar(){}

```

Since `foo` isn't being used we remove it, and release the reference to function `bar` and remove it too

Result: **removing function foo() and bar()**

### Scenario 4 - Deep reference with re-export

`Clean reference.`

```
entry.ts:
  import { foo } from "./index"

index.ts
  export { foo, bar } from "./foo"


foo.ts:
  export function bar(){}
  export function foo(){}
```

Function `foo` is being traced down to entry.ts via `index.ts`, since `bar` in index.ts with it re-exported has not
traced to index, it can be removed, releasing the reference to function `bar()` in `bar.ts`

result:

- Removing { bar} from `export { foo, bar } from "./foo"`
- Removing `export function foo` from foo.ts
