import { angularURLReplacer } from '../angularURLReplacer';
import '../../../utils/test_utils';

describe('AngularURL replacer', () => {
  it('should replace 1', () => {
    const cnt = `
@Component({
  selector: "app-root",
  templateUrl: "./hello.html",
  styleUrls: ['./foo.css', "bar.scss"],
})
`;
    const output = angularURLReplacer({ content: cnt });
    expect(output).toMatchJSONSnapshot();
  });

  it('should replace 2', () => {
    const cnt = `
@Component({
  selector: "app-root",
  templateUrl: "./hello.html",
  styleUrls: ["bar.scss"],
})
`;
    const output = angularURLReplacer({ content: cnt });
    console.log(output);
    expect(output).toMatchJSONSnapshot();
  });
});
