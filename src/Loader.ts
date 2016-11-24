// Variable aviable the entire scope
const $isBrowser: boolean = typeof window !== "undefined";

interface INodeModuleInformation {
    name: string;
    explicit: string;
}

// Fusebox API
const API = () => {
    let $utils = {
        /**
         * getNodeModuleInfo
         * Checks if a string referers to a node module
         * Returns expolicit path if required
         */
        getNodeModuleInfo: (input: string): INodeModuleInformation => {
            if (!input) { return; }
            let matched = input.match(/^([a-z].*)$/);
            if (matched) {
                let [moduleName, moduleExplicitPath] = input.split(/\/(.+)?/);
                return {
                    name: moduleName,
                    explicit: moduleExplicitPath
                };
            }
        },
        /**
         * join
         * Joins a path (the same as path.join in nodejs)
         */
        join: () => {
            let parts = [];
            for (let i = 0, l = arguments.length; i < l; i++) {
                parts = parts.concat(arguments[i].split("/"));
            }
            let newParts = [];
            for (let i = 0, l = parts.length; i < l; i++) {
                let part = parts[i];
                if (!part || part === ".") { continue; }
                if (part === "..") { newParts.pop(); }
                else { newParts.push(part); }

            }
            if (parts[0] === "") { newParts.unshift(""); }
            return newParts.join("/") || (newParts.length ? "/" : ".");
        },
        /**
         * Ensures file has an extension
         */
        ensureExtension: (name) => {
            let matched = name.match(/\.(\w{1,})$/);
            if (matched) {
                let ext = matched[1];
                // Adding extension if none was found
                // Might ignore the case of weird convention like this:
                // modules/core.object.define (core-js)
                // Will be handled differently afterwards
                if (!ext) {
                    return name + ".js";
                }
                return name;
            }
            return name + ".js";
        }
    };
    return {

    }
}

