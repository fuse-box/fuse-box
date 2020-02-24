import * as fs from 'fs';
import { ICompilerOptions } from '../../compilerOptions/interfaces';
import { EnvironmentType } from '../../config/EnvironmentType';
import { ITarget } from '../../config/ITarget';
import { createContext } from '../../core/context';
import { createModule } from '../../moduleResolver/module';
import { createPackage } from '../../moduleResolver/package';
import { moduleCompiler } from '../../threading/compile/moduleCompiler';
export interface ICompileModuleProps {
  code?: string;

  compilerOptions: ICompilerOptions;
  fileName?: string;
  target?: ITarget;
  useMeriyah?: boolean;
}

export function testTranspile(props: ICompileModuleProps) {
  return new Promise((resolve, reject) => {
    let contents = props.code;

    if (!contents) {
      contents = fs.readFileSync(props.fileName).toString();
    }

    const ctx = createContext({
      envType: EnvironmentType.DEVELOPMENT,

      publicConfig: { cache: false, devServer: false, entry: __filename },
      runProps: {},
    });

    const pkg = createPackage({ meta: {} as any });
    const module = createModule({
      absPath: __filename,
      ctx,
      pkg,
    });

    module.init();

    moduleCompiler({
      contents: contents,
      context: module.getTransformationContext(),
      generateCode: true,
      onError: message => {
        module.errored = true;
        ctx.log.warn(message);
      },
      onReady: response => {
        return resolve(response.contents);
      },
      onResolve: async data => {
        return {};
      },
    });
  });
}
