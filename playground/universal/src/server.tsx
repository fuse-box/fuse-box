import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { App } from './app/App';
import { createServerRoutes } from './app/Router';

async function launch() {
  const serverRoutes = await createServerRoutes();

  const app = express();

  const browserRoot = path.resolve(__dirname, '../browser');
  app.use('/public', express.static(browserRoot));

  const port = 3000;

  app.get('*', (req, res) => {
    const indexFile = fs.readFileSync(path.resolve(browserRoot, 'index.html')).toString();
    const context: any = {};

    const reactAppAsString = ReactDOMServer.renderToString(
      <StaticRouter location={req.url} context={context}>
        <App routes={serverRoutes} />
      </StaticRouter>,
    );
    const app = indexFile.replace(/\{\{\s*ssr\s*\}\}/, reactAppAsString);
    if (context.url) {
      res.writeHead(301, {
        Location: context.url,
      });
      res.end();
    } else {
      res.send(app);
    }
  });

  const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

launch();

// https://github.com/inikulin/callsite-record
