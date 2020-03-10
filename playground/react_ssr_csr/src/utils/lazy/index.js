import React, { Component } from 'react';

export const lazy = someComponent => {
  class LazyComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        InnerComponent: null
      };
    }

    componentDidMount() {
      someComponent()
        .then(loadedModule =>
          this.setState({
            InnerComponent: loadedModule.default
          })
        )
        .catch(error => {
          console.error(error); // eslint-disable-line no-console
        });
    }

    render() {
      const { InnerComponent } = this.state;
      return !InnerComponent ? (
        <div>Loading</div>
      ) : (
        <InnerComponent {...this.props} />
      );
    }
  }

  return LazyComponent;
};

export default null;
