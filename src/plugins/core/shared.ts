import { Context } from '../../core/Context';
import { IStyleSheetProcessor } from '../../stylesheet/interfaces';
import { IStyleSheetProps } from '../../config/IStylesheetProps';
import { Module } from '../../core/Module';
import { cssAsTextRender } from '../../stylesheet/cssAsTextRender';
import { cssDevModuleRender } from '../../stylesheet/cssDevModuleRender';

export interface ICSSContextHandlerExtraProps {
  asText?: boolean;
}
export interface ICSSContextHandler {
  ctx: Context;
  processor: IStyleSheetProcessor;
  options: IStyleSheetProps;
  module: Module;
  shared: ICSSContextHandlerExtraProps;
}
export function cssContextHandler(props: ICSSContextHandler) {
  const { ctx, processor, shared } = props;

  ctx.ict.promise(async () => {
    try {
      const data = await processor.render();
      const rendererProps = { data, ctx, options: props.options, module: props.module };
      if (shared.asText) {
        props.module.notStylesheet();
        return cssAsTextRender({ ...rendererProps });
      }
      if (ctx.config.production) {
        props.module.css = data;
      } else {
        cssDevModuleRender({ ...rendererProps });
      }
    } catch (e) {
      ctx.log.error('$error in $file', {
        error: e.message,
        file: props.module.props.absPath,
      });
    }
  });
}
