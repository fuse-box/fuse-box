import { foo, bar, rest } from 'fop';

function hey(props) {
  const [, b, ...rest] = props;
  console.log(rest);
}
