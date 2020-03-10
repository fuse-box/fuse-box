import * as React from 'react';
import { hydrate, render, unmountComponentAtNode } from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import { App } from './app';

const appNode = document.getElementById('app');

if (!appNode) {
  throw new Error("Can't find the `app` element in the document");
}

const AppComponent = () => (
  <BrowserRouter>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </BrowserRouter>
);

if (process.env.NODE_ENV === 'development') {
  unmountComponentAtNode(appNode);
  render(<AppComponent />, appNode);
}

hydrate(<AppComponent />, appNode);
