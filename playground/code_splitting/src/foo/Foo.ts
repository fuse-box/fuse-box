import './Foo.scss';

export function Foo() {
  if (typeof document === 'undefined') return;
  const root = document.querySelector('#root');
  let fooEl = root.querySelector('.Foo');
  console.log('entreis!!!!', __build_env.entries);
  if (!fooEl) {
    fooEl = document.createElement('div');
    fooEl.className = 'Foo';
    root.appendChild(fooEl);
  }
}
