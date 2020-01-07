import foo from 'oi';
function one(props) {
  const { foo, ...rest } = props;
  console.log(foo);
}
console.log(foo);
