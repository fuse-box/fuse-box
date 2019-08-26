async function loadStuff() {
  const foo = await import('./foo/Foo');
  const bar = await import('./bar/Bar');
  console.log(foo, bar);
}

loadStuff();
