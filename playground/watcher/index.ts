import { createContext } from '../../src/core/Context';
import { createWatcher } from '../../src/watcher/watcher';

const ctx = createContext({ homeDir: __dirname, logging: { level: 'disabled' } });

createWatcher({
  ctx: ctx,
  onEvent: (event, file) => {
    console.log(event, file);
  },
});
