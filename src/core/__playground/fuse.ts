import * as path from 'path';
import { createContext } from '../Context';
const ctx = createContext({
  homeDir: path.resolve(__dirname, 'src'),
});
