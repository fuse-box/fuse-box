import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Component } from 'react';
import './index.scss';
import * as stuff from './some';
console.log(stuff);
class App extends Component {
  render() {
    const snapshot = { isDraggingOver: false };
    function getSourceStyle(opts) {
      return {};
    }
    console.log('render');
    return (
      <div className="App">
        <div></div>
        <p style={getSourceStyle(snapshot.isDraggingOver)}>
          To get started, edit
          <code>src/App.js</code>
          and save to reload.11
        </p>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
