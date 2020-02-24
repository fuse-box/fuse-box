import { fusebox, pluginCSSInJSX, sparky } from "../../src";

class Context {
  isProduction;
  runServer;

  getClient() {
    return fusebox({
      cache: {
        FTL: false,
        enabled: false,
        root: ".cache/client"
      },
      devServer: {
        hmrServer: { port: 7878 },
        httpServer: true,
        open: false
      },
      entry: "index.js",
      homeDir: "src/",
      link: { useDefault: true },
      modules: ["./node_modules"],
      output: `dist/$name_$hash`,
      plugins: [
        pluginCSSInJSX({
          autoInject: true,
          autoLabel: true,
          cssPropOptimization: true,
          emotionCoreAlias: '@emotion/core',
          jsxFactory: 'jsx',
          labelFormat: '[dirname]--[local]',
          sourceMap: true,
          test: /src\/(.*?)\.(js|jsx|ts|tsx)$/
        })
      ],
      sourceMap: !this.isProduction,
      target: "browser",
      tsConfig: "src/tsconfig.json",
      webIndex: {
        publicPath: "/",
        template: "src/index.html"
      }
    });
  }
}

const { rm, task } = sparky<Context>(Context);

task("default", async ctx => {
  await rm("./dist");

  ctx.runServer = true;
  ctx.isProduction = false;

  const client = ctx.getClient();
  await client.runDev();
});

task("dist", async ctx => {
  await rm("./dist");

  ctx.runServer = false;
  ctx.isProduction = true;

  const client = ctx.getClient();
  await client.runProd({ uglify: true, manifest: true });
});
