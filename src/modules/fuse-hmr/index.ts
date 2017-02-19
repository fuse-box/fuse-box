import { Loader } from '../fuse-loader';

const customizedHMRPlugin = {
    hmrUpdate: ({ type, path, content }) => {
        if (type === "js") {
            const isModuleStateful = (path) => statefulModuleCheck(path);

            /** If a stateful module has changed reload the window */
            if (isModuleStateful(path)) {
                window.location.reload();
            }

            /** Otherwise flush the other modules */
            Loader.flush(function(fileName) {
                return !isModuleStateful(fileName);
            });
            
            /** Patch the module at give path */
            Loader.dynamic(path, content);

            /** Re-import / run the mainFile */
            if (Loader.mainFile) {
                Loader.import(Loader.mainFile)
            }

            /** We don't want the default behavior */
            return true;
        }
    }
}

/** Only register the plugin once */
let alreadyRegistered = false;

/** Current names of stateful modules */
let statefulModuleCheck: (moduleName: string) => boolean = () => false;

/**
 * Registers given module names as being stateful
 * @param check for a given moduleName returns true if the module is stateful
 */
export const setStatefulModules = (check: (moduleName: string) => boolean) => {
    if (!alreadyRegistered) {
        alreadyRegistered = true;
        Loader.addPlugin(customizedHMRPlugin);
    }
    statefulModuleCheck = check;
}
