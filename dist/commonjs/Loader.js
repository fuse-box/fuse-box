const $isBrowser = typeof window !== "undefined";
const API = () => {
    let $utils = {
        getNodeModuleInfo: (input) => {
            if (!input) {
                return;
            }
            let matched = input.match(/^([a-z].*)$/);
            if (matched) {
                let [moduleName, moduleExplicitPath] = input.split(/\/(.+)?/);
                return {
                    name: moduleName,
                    explicit: moduleExplicitPath
                };
            }
        },
        join: () => {
            let parts = [];
            for (let i = 0, l = arguments.length; i < l; i++) {
                parts = parts.concat(arguments[i].split("/"));
            }
            let newParts = [];
            for (let i = 0, l = parts.length; i < l; i++) {
                let part = parts[i];
                if (!part || part === ".") {
                    continue;
                }
                if (part === "..") {
                    newParts.pop();
                }
                else {
                    newParts.push(part);
                }
            }
            if (parts[0] === "") {
                newParts.unshift("");
            }
            return newParts.join("/") || (newParts.length ? "/" : ".");
        },
        ensureExtension: (name) => {
            let matched = name.match(/\.(\w{1,})$/);
            if (matched) {
                let ext = matched[1];
                if (!ext) {
                    return name + ".js";
                }
                return name;
            }
            return name + ".js";
        }
    };
    return {};
};
