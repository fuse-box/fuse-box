import * as ts from 'typescript';
import { fusebox, pluginCustomTransform } from '../../src';

const isProd = process.argv.indexOf('--prod') > -1;

function someCustomTransformer<T extends ts.Node>(): ts.TransformerFactory<T> {
  return context => {
    console.log();
    console.log('===> someCustomTransformer called');
    console.log();

    const visit: ts.Visitor = node => {
      return ts.visitEachChild(node, child => visit(child), context);
    };
    return node => ts.visitNode(node, visit);
  };
}

const fuse = fusebox({
  target: 'browser',
  entry: 'src/index.ts',
  modules: ['modules'],
  logging: {
    level: 'succinct',
  },
  webIndex: {
    template: 'src/index.html',
  },
  sourceMap: true,
  devServer: true,
  watch: true,
  cache: false,
  plugins: [
    pluginCustomTransform({
      before: [someCustomTransformer()],
      after: [someCustomTransformer()],
      afterDeclarations: [someCustomTransformer()],
    }),
  ],
});

if (isProd) {
  fuse.runProd({
    screwIE: true,
  });
} else {
  fuse.runDev();
}
