import { fusebox } from '../../src/core/fusebox';
import * as ts from 'typescript';

const isProd = process.argv.indexOf('--prod') > -1;

function transformNode(node) {

  // @ts-ignore
  if (ts.isPropertyAccessExpression(node) && node.expression) {
    // @ts-ignore
    if (node.expression.expression && node.expression.expression.getText() && node.expression.expression.getText() === 'process' &&
      // @ts-ignore
      node.expression.name && node.expression.name.getText() && node.expression.name.getText() === 'env') {

      // @ts-ignore
      const envVarName = node.name.getText();
      const envVarValue = process.env[envVarName];

      return ts.createStringLiteral(envVarValue || '');
    }
  }
}

function exampleProdBeforeTransformer<T extends ts.Node>(): ts.TransformerFactory<T> {
  return (context) => {

    console.log();
    console.log('===> custom prod mode, before stage transformer called');
    console.log();

    const visit: ts.Visitor = (node) => {

      const transformedNode = transformNode(node);

      if (transformedNode) {
        return transformedNode;
      }
      return ts.visitEachChild(node, (child) => visit(child), context);
    };
    return (node) => ts.visitNode(node, visit);
  }
}

function exampleDevAfterTransformer<T extends ts.Node>(): ts.TransformerFactory<T> {
  return (context) => {

    console.log();
    console.log('===> custom dev mode, after stage transformer called');
    console.log();

    const visit: ts.Visitor = (node) => {

      const transformedNode = transformNode(node);

      if (transformedNode) {
        return transformedNode;
      }
      return ts.visitEachChild(node, (child) => visit(child), context);
    };
    return (node) => ts.visitNode(node, visit);
  }
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
  customTransformers: isProd ? {
    before: [
      exampleProdBeforeTransformer()
    ]
  } : {
    after: [
      exampleDevAfterTransformer()
    ]
  },
  devServer: true,
  watch: true,
  cache: false,
});

if (isProd) {
  fuse.runProd({
    screwIE: true,
  });
} else {
  fuse.runDev();
}
// if (process.argv[2] === 'dev') {
// } else {
