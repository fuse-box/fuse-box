import * as React from 'react';
import { useState } from 'react';

import { Button } from '../components/button';

export const App = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(currentCount => currentCount - 1);

  return (
    <div>
      <h1>🚀 Jättesnabb 🚀</h1>
      <h2>🚀 Jättesnabb 🚀</h2>
      <h3>🚀 Jättesnabb 🚀</h3>
      <h4>🚀 Jättesnabb 🚀</h4>
      <p>Count: {count}</p>
      <Button onClick={increment}>Increment</Button>
      <Button onClick={decrement}>Decrement</Button>
    </div>
  );
};

export default null;
