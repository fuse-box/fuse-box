import { Layout, Button } from 'antd';
import * as React from 'react';
import { Component } from 'react';
import 'antd/dist/antd.css';
import * as ReactDOM from 'react-dom';
//import './index.scss';
class App extends Component {
  render() {
    const snapshot = { isDraggingOver: false };
    function getSourceStyle(opts) {
      return {};
    }
    console.log('render');
    return (
      <Layout>
        <Button type="primary">Primary</Button>
      </Layout>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
