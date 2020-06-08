import * as React from 'react';
import * as ReactDOM from 'react-dom';
const App = () => {
  return (
    <div>
      <span>&copy; foo.</span>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
console.log('here');
