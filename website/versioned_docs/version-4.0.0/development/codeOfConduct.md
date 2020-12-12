---
id: version-4.0.0-codeOfConduct
title: Code Of Conduct
original_id: codeOfConduct
---

### If statements

One line conditions that do not exceed 180 characters should not contain curly brackets

```ts
if (checked) action();
```

### Interfaces

Interfaces that represent properties or immutable objects should start with `I`

for example

```ts
function myHandler(props: IMyHandleProps) {}
```

Arguments within functions should end with `Props` e.g `IMyStuffProps`

Interfaces that represent mutable object must not have an `I` preffix

for example:

```ts
export interface Module {}
export function createModule(): Module {}
```

### Defining objects

The use of classes is strictly prohibited and will be not tolerated in a any case. If you object requires a constant
access from the outside use the following pattern

```ts
export interface IAwesomenessProps {}
export interface Awesomeness {}
export function createAwesomeness(props: IAwesomenessProps): Awesomeness {
  const self: Awesomeness = {};
  return self;
}
```

It's also possible to use `ReturnType` instead

```ts
export interface IAwesomenessProps {}
export type Awesomeness = ReturnType<typeof createAwesomeness>;
export function createAwesomeness(props: IAwesomenessProps) {
  const self = {};
  return self;
}
```
