import * as sourceMapModule from 'source-map';
import { BUNDLE_RUNTIME_NAMES } from '../../bundleRuntime/bundleRuntimeCore';
import { generate } from '../../compiler/generator/generator';
import { ASTNode } from '../../compiler/interfaces/AST';
import { ITransformerRequireStatement } from '../../compiler/interfaces/ITransformerRequireStatements';
import { ImportType } from '../../compiler/interfaces/ImportType';
import { parseJavascript, parseTypeScript, ICodeParser } from '../../compiler/parser';
import { transformCommonVisitors, ISerializableTransformationContext } from '../../compiler/transformer';
import { TS_EXTENSIONS } from '../../config/extensions';
import { PackageType } from '../../moduleResolver/package';
import { readFile } from '../../utils/utils';

interface IResolutionResponse {
  error?: boolean;
  id?: number;
  ignore?: boolean;
}
export interface IOnReadyResponse {
  contents?: string;
  sourceMap?: string;
}
export interface IModuleCompilerProps {
  absPath?: string;
  ast?: ASTNode;
  contents?: string;
  context?: ISerializableTransformationContext;
  generateCode?: boolean;
  onError: (message: string) => void;
  onFatal?: (message) => void;
  onReady: (reponse: IOnReadyResponse) => void;
  onResolve: (props: { importType: ImportType; source: string }) => Promise<{ id?: number }>;
}

export async function moduleCompiler(props: IModuleCompilerProps) {
  try {
    const {
      context: { compilerOptions, config, module },
    } = props;

    const ast = props.ast || getAST(props);
    //console.log(JSON.stringify(ast, null, 2));

    const result = transformCommonVisitors(props.context, ast);
    const tasks: Array<{
      promise: Promise<IResolutionResponse>;
      response?: IResolutionResponse;
      source: string;
      item: ITransformerRequireStatement;
    }> = [];

    const target = compilerOptions.buildTarget;

    for (const item of result.requireStatementCollection) {
      if (!item.statement.arguments[0]) {
        props.onError(`Empty require detected ${item.statement}`);
      } else if (item.statement.arguments.length === 1) {
        if (typeof item.statement.arguments[0].value === 'string') {
          const source = item.statement.arguments[0].value;
          tasks.push({ item: item, promise: props.onResolve({ importType: item.importType, source }), source });
        } else {
          if (compilerOptions.buildTarget === 'browser') {
            props.onError(`Invalid import. Should recieve a string. ${props.absPath}`);
          }
        }
      }
    }
    const promises = [];
    for (const x of tasks) promises.push(x.promise);
    const results: Array<IResolutionResponse> = await Promise.all(promises);

    let index = 0;

    const canIgnoreModules = (target === 'electron' && config.electron.nodeIntegration) || target === 'server';

    while (index < tasks.length) {
      const task = tasks[index];
      const item = task.item;

      const response = results[index];

      if (response.id) {
        item.statement.callee.name = BUNDLE_RUNTIME_NAMES.ARG_REQUIRE_FUNCTION;
        item.statement.arguments = [
          {
            type: 'Literal',
            value: response.id,
          },
        ];
      } else if (!canIgnoreModules) {
        item.statement.callee.name = BUNDLE_RUNTIME_NAMES.ARG_REQUIRE_FUNCTION;
      }

      index++;
    }

    const response: IOnReadyResponse = {};
    if (props.generateCode) {
      const genOptions: any = {
        ecmaVersion: 7,
      };

      if (module.isSourceMapRequired) {
        const sourceMap = new sourceMapModule.SourceMapGenerator({
          file: module.publicPath,
        });
        genOptions.sourceMap = sourceMap;
      }
      // if (self.ctx.config.isProduction) {
      //   genOptions.indent = '';
      //   genOptions.lineEnd = '';
      // }
      response.contents = generate(ast, genOptions);
      if (module.isSourceMapRequired) {
        const jsonSourceMaps = genOptions.sourceMap.toJSON();
        if (!jsonSourceMaps.sourcesContent) {
          delete jsonSourceMaps.file;
          jsonSourceMaps.sources = [target === 'server' ? module.absPath : module.publicPath];
          if (target !== 'server') jsonSourceMaps.sourcesContent = [props.contents];
        }
        response.sourceMap = JSON.stringify(jsonSourceMaps);
      }
    }

    props.onReady(response);
  } catch (e) {
    props.onFatal(e);
  }
}

function getAST(props: IModuleCompilerProps): ASTNode {
  let parser: ICodeParser;

  let contents = props.contents;
  if (!contents && props.absPath) {
    contents = readFile(props.absPath);
  }
  const {
    context: { compilerOptions, module, pkg },
  } = props;

  if (TS_EXTENSIONS.includes(module.extension)) parser = parseTypeScript;
  else {
    parser = parseJavascript;
    const parserOptions = compilerOptions.jsParser;
    const isExternal = pkg.type === PackageType.EXTERNAL_PACKAGE;
    if (isExternal) {
      if (parserOptions.nodeModules === 'ts') parser = parseTypeScript;
    } else if (parserOptions.project === 'ts') parser = parseTypeScript;
  }
  const jsxRequired = module.extension !== '.ts';

  let ast: ASTNode;

  try {
    ast = parser(contents, {
      jsx: jsxRequired,
      locations: module.isSourceMapRequired,
    });
  } catch (e) {
    let line = '';
    if (e.lineNumber && e.column) {
      line = `:${e.lineNumber}:${e.column}`;
    }
    props.onError(`Error while parsing module ${props.absPath}${line}\n\t' ${e.stack || e.message}`);
    ast = parseJavascript(``);
  }
  return ast;
}
