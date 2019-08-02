function decToHex(dec) {
  var hex = [],
    HEX = '0123456789ABCDEF';
  do {
    hex.unshift(HEX[dec & 0xf]);
  } while ((dec = dec >> 4) !== 0);
  return hex.join('');
}
