import { assemble } from '../../main/assemble';
import { createContext } from '../__Context';
import * as path from 'path';
const ctx = createContext({
  homeDir: path.resolve(__dirname, 'src'),
});

assemble(ctx, 'index.ts');
