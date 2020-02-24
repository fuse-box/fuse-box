console.log('foo');
import './main.scss';
console.log('bar');
//import './oi';
//import './oi2';

async function loadStuff() {
  const { Foo } = await import('./foo/Foo');
  Foo();
  const { Bar } = await import('./bar/Bar');
  Bar();

  const { Baz } = await import('./baz/baz');
  Baz();
}

loadStuff();
console.log('INDEX', __build_env.entries);
