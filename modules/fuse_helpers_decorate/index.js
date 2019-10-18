// __decorato
export function d(decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
    d;
  if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
// __param
export function p(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
// __metadata
export function m(metadataKey, metadataValue) {
  if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
    return Reflect.metadata(metadataKey, metadataValue);
}
