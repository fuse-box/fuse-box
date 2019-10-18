import { Component } from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Other } from './Other';
import './index.scss';
import * as shit from 'formik-wizard';
console.log(shit);
class App extends Component {
  render() {
    const snapshot = { isDraggingOver: false };
    function getSourceStyle(opts) {
      return {};
    }

    return (
      <div>
        22222
        <Other></Other>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
