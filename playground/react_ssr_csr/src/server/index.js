import * as bodyParser from 'body-parser';
import * as chalk from 'chalk';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';

import { api } from './api';
import { errorHandler, sendResponse } from './middleware';
import { renderApp, renderHtml } from './render';

const port = process.env.PORT || process.env.APP_PORT || 80;
const serverSockets = new Set();
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());
app.use('/assets/', express.static('dist/client'));
app.get('/robots.txt', function(_, res) {
  res.header('Content-Type', 'text/plain');
  res.send('User-agent: *\nAllow: /');
});

app.use('/api', cors(), api);
app.use((req, _, next) => {
  process.stdout.write(chalk`{bold.green [HTTP]} [${req.method}] ${req.url}\n`);
  next();
});
app.get('*', renderApp(), renderHtml(), sendResponse());
app.use(errorHandler());

const server = http.createServer(app);

server.listen(port, () => {
  process.stdout.write(
    chalk`{bold.green [HTTP]} Server running on ${port}...\n`
  );
});
server.on('error', err => {
  console.error(err); // eslint-disable-line no-console
});
server.on('connection', socket => {
  serverSockets.add(socket);
  socket.on('close', () => {
    serverSockets.delete(socket);
  });
});

const shutdownHttpServer = () =>
  new Promise(resolve => {
    for (const socket of serverSockets.values()) {
      socket.destroy();
    }
    server.close(() => {
      process.stdout.write(chalk`\n{bold.green [HTTP]} Server closed...\n`);
      resolve();
    });
  });

process.on('SIGINT', () => {
  Promise.all([shutdownHttpServer()]);
});
process.on('SIGTERM', async () => {
  Promise.all([shutdownHttpServer()]);
});
