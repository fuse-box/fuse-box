import { Context } from '../../src/core/Context';
import { createWatcher } from '../../src/watcher/watcher';

const ctx = new Context({ homeDir: __dirname, logging: { level: 'disabled' } });

createWatcher({
  ctx: ctx,
  onEvent: (event, file) => {
    console.log(event, file);
  },
});
