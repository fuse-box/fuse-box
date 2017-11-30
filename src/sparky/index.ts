import { Sparky } from './Sparky';
import { SparkyContext } from './SparkyContext';

export const src = Sparky.src.bind(Sparky);
export const watch = Sparky.watch.bind(Sparky);
export const task = Sparky.task.bind(Sparky);
export const context = SparkyContext.bind(Sparky);