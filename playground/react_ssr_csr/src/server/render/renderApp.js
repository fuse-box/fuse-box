import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom';

import { App } from '../../client/app';

export const renderApp = () => (req, res, next) => {
  const routerContext = {};
  const helmetContext = {};

  const Router = ({ children }) => (
    <StaticRouter context={routerContext} location={req.url}>
      {children}
    </StaticRouter>
  );

  res.component = renderToString(
    <Router>
      <HelmetProvider context={helmetContext}>
        <App />
      </HelmetProvider>
    </Router>
  );

  res.helmet = helmetContext.helmet;

  if (routerContext.statusCode) {
    res.status(routerContext.statusCode);
  }

  if (routerContext.url) {
    res.redirect(routerContext.status || 301, routerContext.url);
  } else {
    next();
  }
};

export default null;
