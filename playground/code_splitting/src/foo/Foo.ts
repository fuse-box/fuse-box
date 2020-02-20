import './Foo.scss';

export function Foo() {
  if (typeof document === 'undefined') return;
  const root = document.querySelector('#root');
  let fooEl = root.querySelector('.Foo');

  if (!fooEl) {
    fooEl = document.createElement('div');
    fooEl.className = 'Foo';
    root.appendChild(fooEl);
  }
}
