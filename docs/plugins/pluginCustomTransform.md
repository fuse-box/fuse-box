---
id: plugin-customtransform
title: pluginCustomTransform
---

## Usage

The custom transform plugin enables you to change the way, code is transformed in any arbitrary form using custom AST
transformers. Custom transformers are a standard feature of the TypeScript Compiler API since version 2.3. A good
writeup on how custom AST transformation works can be found
[here](https://dev.doctorevidence.com/how-to-write-a-typescript-transform-plugin-fc5308fdd943).

This plugin exposes the public API for providing custom transformers so that you can safely add your own transformers on
top of the transformers used by fuse-box internally:

```ts
import * as ts from 'typescript';
import { fusebox, pluginJSON } from 'fuse-box';
fusebox({
  plugins: [
    pluginCustomTransform({
      before: [someCustomBeforeTransformer()],
      after: [someCustomAfterTransformer()],
      afterDeclarations: [someCustomAfterDeclarationTransformer()],
    }),
  ],
});
```

Each transformer must fulfill the `TransformerFactory<T>` interface:

```ts
import * as ts from 'typescript';

export function someCustomTransformer<T extends ts.Node>(): ts.TransformerFactory<T> {
  return context => {
    console.log();
    console.log('===> do some custom AST node transformation here');
    console.log();

    const visit: ts.Visitor = node => {
      return ts.visitEachChild(node, child => visit(child), context);
    };
    return node => ts.visitNode(node, visit);
  };
}
```
