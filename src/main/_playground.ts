import { bundleDev } from './bundle_dev';
import { createContext } from '../core/Context';
import * as path from 'path';

const ctx = createContext({
  target: 'browser',
  logging: {
    level: 'succinct',
  },
  webIndex: {
    publicPath: '.',
  },
  //production: {},
  homeDir: path.join(__dirname, '__tests__/cases/projects/playground_case'),
  entry: 'index.ts',
});
bundleDev(ctx);
