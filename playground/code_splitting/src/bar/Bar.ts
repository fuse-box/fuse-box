import './Bar.scss';
export function Bar() {
  const root = document.querySelector('#root');
  let fooEl = root.querySelector('.Bar');
  if (!fooEl) {
    fooEl = document.createElement('div');
    fooEl.className = 'Bar';
    root.appendChild(fooEl);
  }
}
