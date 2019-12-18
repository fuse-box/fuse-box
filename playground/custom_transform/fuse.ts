import * as ts from 'typescript';
import { fusebox, pluginCustomTransform } from '../../src';

const isProd = process.argv.indexOf('--prod') > -1;

function customTransformer<T extends ts.Node>(type: string): ts.TransformerFactory<T> {
  return context => {
    const visit: ts.Visitor = node => {
      return ts.visitEachChild(node, child => visit(child), context);
    };
    return node => ts.visitNode(node, visit);
  };
}

const fuse = fusebox({
  cache: false,
  devServer: true,
  entry: 'src/index.ts',
  logging: {
    level: 'succinct',
  },
  modules: ['modules'],
  plugins: [
    pluginCustomTransform({
      after: [customTransformer('after')],
      before: [customTransformer('before')],
    }),
  ],
  sourceMap: true,
  target: 'browser',
  tsConfig: {
    allowJs: true,
  },
  watch: true,
  webIndex: {
    template: 'src/index.html',
  },
});

if (isProd) {
  fuse.runProd({
    screwIE: true,
  });
} else {
  fuse.runDev();
}
