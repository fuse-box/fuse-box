import * as React from 'react';
import { Route } from 'react-router-dom';
import { config } from './config';

export function Router(routes) {
  return props => {
    return (
      <div className="router">
        {routes.map(config => (
          <Route {...config} />
        ))}
      </div>
    );
  };
}

export async function createServerRoutes() {
  const routes = [];
  for (const route of config.routes) {
    const response = await route.render();
    const DefaultComponent = response.default;
    const newConfig = { ...route, component: DefaultComponent };
    delete newConfig.render;
    routes.push(newConfig);
  }
  return routes;
}

export function createBrowserRoutes() {
  const routes = [];
  for (const route of config.routes) {
    const newConfig = {
      ...route,
      render: () => {
        const Component = LazyLoad(route.render);
        return <Component />;
      },
    };
    routes.push(newConfig);
  }

  return routes;
}

export function LazyLoad(lazyFunction) {
  return class extends React.Component<any, any> {
    constructor(props) {
      super(props);
      this.state = {
        component: null,
      };
      lazyFunction().then(_module => {
        this.setState({ Component: _module.default });
      });
    }

    render() {
      const Component = this.state.Component;
      if (!Component) {
        return <div>Loading...</div>;
      }
      return <Component></Component>;
    }
  };
}
