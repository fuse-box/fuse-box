import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { App } from './app/App';

const app = express();

const browserRoot = path.resolve(__dirname, '../browser');
app.use('/public', express.static(browserRoot));

const port = 3000;

app.get('/', (req, res) => {
  // read generated index file

  const indexFile = fs.readFileSync(path.resolve(browserRoot, 'index.html')).toString();
  const reactAppAsString = ReactDOMServer.renderToString(<App />);
  const app = indexFile.replace(/\{\{\s*ssr\s*\}\}/, reactAppAsString);
  res.send(app);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// https://github.com/inikulin/callsite-record
