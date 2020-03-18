import { blueberry } from '@myorg/bar/dist/blue';
import { strawberry } from './red';
export function foo() {
  return `Foo ${strawberry} ${blueberry}`;
}
