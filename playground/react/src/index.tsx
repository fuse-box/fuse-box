import * as React from 'react';
import { Component } from 'react';
import * as ReactDOM from 'react-dom';
import './index.scss';
import { Other } from './Other';

class App extends Component {
  private click() {
    const data = 1;
    console.log('hello world', data);
  }
  render() {
    return (
      <div onClick={() => this.click()}>
        22222222
        <Other></Other>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
