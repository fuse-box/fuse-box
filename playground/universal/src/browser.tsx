import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import { createBrowserRoutes } from './app/Router';
import React = require('react');

ReactDOM.render(
  <BrowserRouter>
    <App routes={createBrowserRoutes()} />
  </BrowserRouter>,
  document.getElementById('root'),
);
