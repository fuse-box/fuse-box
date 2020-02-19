console.log('foo');
import './main.scss';
console.log('bar');

async function loadStuff() {
  const { Foo } = await import('./foo/Foo');
  Foo();
  const { Bar } = await import('./bar/Bar');
  Bar();
}

loadStuff();
