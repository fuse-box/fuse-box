import * as React from 'react';
import { Component } from 'react';

import * as ReactDOM from 'react-dom';
import { Other } from './Other';
import './index.scss';

class App extends Component {
  render() {
    const snapshot = { isDraggingOver: false };
    function getSourceStyle(opts) {
      return {};
    }
    console.log('render');
    return (
      <div>
        oioooo
        <Other></Other>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
