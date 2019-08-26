import * as React from 'react';
import './App.scss';
import { Route, Link } from 'react-router-dom';
import grumpy from './grumpy.png';
import oi from './oi.json';
console.log(grumpy);
console.log(oi);
// component={LazyLoad(() => import('./routes/MainRoute'))}

export class App extends React.Component<{ routes: any }, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <div className="main">
        <nav>
          <ul>
            <li>
              <Link to="/">Main Route</Link>
            </li>
            <li>
              <Link to="/second/">Second route!11</Link>
            </li>
          </ul>
        </nav>

        <div className="routes">
          {this.props.routes.map((props, i) => (
            <Route key={i} {...props} />
          ))}
        </div>
      </div>
    );
  }
}
