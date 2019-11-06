import { foo, bar, rest } from 'fop';

function hey(props) {
  const [a, b, ...rest] = props;
  console.log(rest);
}
