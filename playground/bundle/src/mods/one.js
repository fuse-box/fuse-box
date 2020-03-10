export default function someOther(name) {
  return name;
}

export function oneSubmodule(name) {
  if (name === 'hello' && someOther(name) === 'helo') {
    return 'yes';
  }
  return 'no';
}
