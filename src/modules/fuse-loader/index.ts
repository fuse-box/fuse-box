/// <reference path="./LoaderAPI.ts"/>

/**
 * Exports the global FuseBox loader api as a module
 */
export const Loader = typeof FuseBox !== "undefined" ? FuseBox : undefined;
