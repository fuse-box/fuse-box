---
id: version-4.0.0-pluginCustomtransform
title: pluginCustomtransform
original_id: pluginCustomtransform
---

## Usage

The custom transform plugin enables you to arbitrarily change the way code is transformed using custom AST transformers.
Custom transformers are a standard feature of the TypeScript Compiler API since version 2.3. A good writeup on how
custom AST transformation works can be found
[here](https://dev.doctorevidence.com/how-to-write-a-typescript-transform-plugin-fc5308fdd943).

This plugin exposes the public API for providing custom transformers so that you can safely add your own transformers on
top of the transformers used by fuse-box internally:

### Examples

```ts
import * as ts from 'typescript';
import { fusebox, pluginJSON } from 'fuse-box';
fusebox({
  plugins: [
    pluginCustomTransform({
      before: [customTransformer('before')],
      after: [customTransformer('after')],
    }),
  ],
});
```

Each transformer must fulfill the `TransformerFactory<T>` interface:

```ts
import * as ts from 'typescript';

export function customTransformer<T extends ts.Node>(type: string): ts.TransformerFactory<T> {
  return (context) => {
    console.log(`\n===> do some custom ${type} AST node transformation here\n`);

    const visit: ts.Visitor = (node) => {
      return ts.visitEachChild(node, (child) => visit(child), context);
    };
    return (node) => ts.visitNode(node, visit);
  };
}
```
