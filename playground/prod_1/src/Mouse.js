import * as path from 'path';
export function Mouse() {}

export function SuperMouse() {
  console.log('hello', path.join('a', 'b'));
}

document.querySelector('#root').addEventListener('click', () => {
  SuperMouse();
});
