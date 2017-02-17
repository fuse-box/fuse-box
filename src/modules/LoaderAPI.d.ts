/**
 * @module Hand written definition for our API
 */

/** 
 * The Loader API
 **/
declare var FuseBox: {
    import(str: string, opts?: any)
    exists(path: string);
    remove(path: string);
    dynamic(...args);
    flush(name?: string);
    on: any;

    isBrowser: boolean;
    isServer: boolean;

    /** The main entry point */
    mainFile?: string;

    /**
     * Plugins support
     */
    plugins: LoaderPlugin[];
}

type SourceChangedEvent = {
    type: 'js' | 'css',
    content: string,
    path: string
}

interface LoaderPlugin {
    /** 
     * If true is returned by the plugin
     *  it means that module change has been handled
     *  by plugin and no special work is needed by FuseBox
     **/
    hmrUpdate?(evt: SourceChangedEvent): boolean;
}

/** Injected into the global namespace by the fsbx-default-css-plugin */
declare var __fsbx_css: { (__filename: string, contents?: string): void };
