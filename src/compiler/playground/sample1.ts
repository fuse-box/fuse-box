import { foo, bar } from 'fop';

function hey(props) {
  const { foo } = props;
  const [bar] = props;
  console.log(bar, foo);
}
