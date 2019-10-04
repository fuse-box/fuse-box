import { compileModule } from '../program/compileModule';
describe('Process transform test', () => {
  it('should transform process env', () => {
    const result = compileModule({
      code: `
        console.log(process.env.NODE_ENV);
    `,
    });
  });
});
