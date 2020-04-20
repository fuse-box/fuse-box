import { IStylesheetModuleResponse } from '../interfaces';

export interface IStylusRenderer {
  contents: string;
  filePath: string;
  paths?: Array<string>;
  sourceRoot?: string;
  withSourceMaps?: boolean;
  onImportString?: (str: string) => string | void;
  onImportFile?: (props: { value: string; isExternal?: boolean }) => void;
  onStyle?: (handler?: any) => void;
  onURL?: (filePath: string, value: string) => string | void;
}
export function stylusRender(props: IStylusRenderer): Promise<IStylesheetModuleResponse> {
  const Evaluator = require('stylus/lib/visitor/evaluator');
  const Literal = require('stylus/lib/nodes/literal');
  const stylus = require('stylus');

  const stylusImport = Evaluator.prototype.visitImport;
  Evaluator.prototype.visitImport = function(imported) {
    imported.path.nodes.map(item => {
      if (item.val && item.string) {
        if (props.onImportString) {
          const newValue = props.onImportString(item.val);
          if (newValue !== undefined) {
            item.val = item.string = newValue;
          }
        }
      }
    });
    const data = stylusImport.bind(this)(imported);

    data.nodes.forEach(node => {
      if (props.onImportFile && props.filePath !== node.filename) {
        props.onImportFile({ value: node.filename, isExternal: /node_modules/.test(node.filename) });
      }
    });
    return data;
  };

  return new Promise((resolve, reject) => {
    const style = stylus(props.contents)
      .define('url', item => {
        const filePath = item.filename;
        const value = item.val;
        if (props.onURL) {
          const newValue = props.onURL(filePath, value);
          if (newValue) {
            return new Literal(`url(${JSON.stringify(newValue)})`);
          }
        }
        return new Literal(`url(${JSON.stringify(item)})`);
      })
      .set('paths', props.paths || [])
      .set('filename', props.filePath)
      .set('sourcemap', props.withSourceMaps && { inline: true, sourceRoot: props.sourceRoot });
    if (props.onStyle) props.onStyle(style);

    style.render(function(err, css) {
      if (err) {
        return reject(err);
      }
      return resolve({ css, map: style.sourcemap });
    });
  });
}
