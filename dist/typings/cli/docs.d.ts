declare const plugins: string[];
declare function findDocsFor(name: any): string;
declare function githubSrcFor(name: any): string;
declare function docsLinkFor(name: any): string;
declare function codeFor(file: any): any;
declare var _default: {
    findDocsFor: (name: any) => string;
    githubSrcFor: (name: any) => string;
    docsLinkFor: (name: any) => string;
    codeFor: (file: any) => any;
    plugins: string[];
};
export default _default;
export { findDocsFor, githubSrcFor, docsLinkFor, codeFor, plugins };
