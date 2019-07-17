import * as React from 'react';
import './App.scss';

const SplitComponent = React.lazy(() => import('./SplitComponent'));

export class App extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }
  public action() {
    this.setState({
      target: (
        <React.Suspense fallback={<div>Loading...</div>}>
          <SplitComponent />
        </React.Suspense>
      ),
    });
  }
  public render() {
    return (
      <div className="hello">
        Hello world
        <input onClick={() => this.action()} value="Load lazy component" type="button"></input>
        <div className="area">{this.state.target}</div>
      </div>
    );
  }
}
