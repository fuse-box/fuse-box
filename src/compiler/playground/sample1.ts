import { hey } from 'oi';
const hello = (hey, permissionKeys) => {
  return permissionKeys.some(v => {
    return hey.indexOf(v) >= 0;
  });
};

class hey {}

new hey();
