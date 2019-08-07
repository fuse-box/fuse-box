import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Component } from 'react';
import './index.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Hello world</h1>
        <p>
          To get started, edit
          <code>src/App.js</code>
          and save to reload.
        </p>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
