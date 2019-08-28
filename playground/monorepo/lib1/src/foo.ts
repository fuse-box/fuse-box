import customModule from 'custom_module';
console.log(customModule);

export function lib1foo() {
  console.log('shit', customModule());
}
