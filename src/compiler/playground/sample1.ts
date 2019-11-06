import { foo, bar } from 'fop';

function hey(props) {
  const {
    options,
    foo,
    input: { bar, onBlur, value, name },
    ...rest
  } = props;
}
