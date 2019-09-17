import { Context } from '../../src/core/Context';

export interface IPluginProps {
  useDefault?: boolean;
}

export function pluginCustomLang() {
  return (ctx: Context) => {
    ctx.ict.on('assemble_module_init', props => {
      if (props.module.props.extension === '.foo') {
        // making module executable so fusebox will take it and parse all dependencies later on
        props.module.makeExecutable();
      }
      return props;
    });
    ctx.ict.on('assemble_before_analysis', props => {
      const module = props.module;
      if (props.module.props.extension === '.foo') {
        module.contents = `
        const data = require("./some").some();
        console.log("some dep", data)
        console.log(${JSON.stringify(module.contents)});
      `;
      }
      return props;
    });
  };
}
