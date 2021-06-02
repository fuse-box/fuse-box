import { parsePluginOptions } from '../../plugins/pluginUtils';
import { Context } from '../../core/context';
import { IModule } from '../../moduleResolver/module';
import { createGlobalModuleCall } from '../../bundleRuntime/bundleRuntimeCore';
export interface IPluginProps {
}
export function pluginReactRefresh(a: string | RegExp | IPluginProps, b?: IPluginProps) {
    let [matcher] = parsePluginOptions<IPluginProps>(a, b, {});
    return (ctx: Context) => {

        function findReactRefreshModule(modules: Record<string, IModule>) {
            let reactRefresh: IModule;
            for (const absPath in modules) {
                if (absPath.includes('react-refresh')) {
                    reactRefresh = modules[absPath];
                    break;
                }
            }
            return reactRefresh;
        }

        ctx.ict.on('before_bundle_write', async props => {
            const { bundle } = props;
            const bundleContext = ctx.bundleContext;
            let reactRefresh = findReactRefreshModule(bundleContext.modules);
            if (reactRefresh) {
                bundle.source.injectionBeforeBundleExec.push(`if (typeof window !== 'undefined' && typeof window.$RefreshReg$ === 'undefined') {\n
    const rr = ${createGlobalModuleCall(reactRefresh.id)}\n
    rr.injectIntoGlobalHook(window);\n
    window.$RefreshReg$ = () => {};\n
    window.$RefreshSig$ = () => type => type;\n
}\n`);
            }
        });

        ctx.ict.on('bundle_resolve_module', (props) => {
            if (!props.module.captured) {
                const module = props.module;
                matcher; // make tests pass
                // if (!matcher.test(module.props.fuseBoxPath)) {
                //     return;
                // }
                const { modules } = ctx.bundleContext;
                let reactRefresh = findReactRefreshModule(modules);
                if (reactRefresh) {
                    // read the contents
                    module.read();
                    module.contents = `// BEFORE EVERY MODULE EXECUTES\n
\n
var prevRefreshReg = window.$RefreshReg$;\n
var prevRefreshSig = window.$RefreshSig$;\n
var RefreshRuntime = ${createGlobalModuleCall(reactRefresh.id)}\n
\n
window.$RefreshReg$ = (type, id) => {\n
    // Note module.id is webpack-specific, this may vary in other bundlers\n
    const fullId = '${module.id} ' + id;\n
    RefreshRuntime.register(type, fullId);\n
}\n
window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;\n
\n
try {\n
    ${module.contents}\n
    if(!exports.default) {
        console.log("not registered", ${module.id});
    }
    $RefreshReg$(exports.default, exports.default.name);\n                        
} finally {\n
    window.$RefreshReg$ = prevRefreshReg;\n
    window.$RefreshSig$ = prevRefreshSig;\n
}\n`;
                }
            }
            return props;
        });
    }
};