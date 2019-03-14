export async function test() {
  await import('./test');
}

export async function test2() {
  return { a:import('./test') };
}
