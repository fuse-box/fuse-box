import { assemble } from '../assemble';
import { createContext } from '../Context';
import * as path from 'path';
const ctx = createContext({
  homeDir: path.resolve(__dirname, 'src'),
});

assemble(ctx, 'index.ts');
