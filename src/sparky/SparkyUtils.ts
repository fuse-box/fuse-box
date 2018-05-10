import { spawn } from "child_process";
import * as fs from "fs";
import { ensureAbsolutePath } from '../Utils';
export type Libs = "ES5" | "ES6" | "ES2015" | "ES7" | "ES2016" | "ES2017" | "ESNext" | "DOM" | "DOM.Iterable"
  | "WebWorker" | "ScriptHost" | "ES2015.Core" | "ES2015.Collection" | "ES2015.Generator" | "ES2015.Iterable"
  | "ES2015.Promise" | "ES2015.Proxy" | "ES2015.Reflect" | "ES2015.Symbol" | "ES2015.Symbol.WellKnown"
  | "ES2016.Array.Include" | "ES2017.object" | "ES2017.SharedMemory" | "ES2017.TypedArrays" | "esnext.asynciterable"

export interface TscOptions {
    allowJs ?: boolean;
    allowSyntheticDefaultImports ?: boolean;
    allowUnreachableCode ?: boolean;
    allowUnusedLabels ?: boolean;
    alwaysStrict ?: boolean;
    baseUrl ?: string;
    charset ?: string;
    checkJs ?: boolean;
    declaration ?: boolean;
    declarationDir ?: string;
    diagnostics ?: boolean;
    disableSizeLimit ?: boolean;
    downlevelIteration ?: boolean;
    emitBOM ?: boolean;
    emitDecoratorMetadata ?: boolean;
    experimentalDecorators ?: boolean;
    forceConsistentCasingInFileNames ?: boolean;
    importHelpers ?: boolean;
    inlineSourceMap ?: boolean;
    inlineSources ?: boolean;
    init ?: boolean;
    isolatedModules ?: boolean;
    jsx ?: "Preserve" | "React";
    jsxFactory ?: string;
    lib ?: Array<Libs>;
    listEmittedFiles ?: boolean;
    listFiles ?: boolean;
    locale ?: "en" | "cs" | "de" | "es" | "fr" | "it" | "ja" | "ko" | "pl" | "pt-BR" | "ru" | "tr" | "zh-CN" | "zh-TW";
    mapRoot ?: string;
    maxNodeModuleJsDepth ?: number;
    module ?: "None" | "CommonJS" | "AMD" | "System" | "UMD" | "ES6" | "ES2015" | "ESNext";
    moduleResolution ?: "Node" | "Classic";
    newLine ?: "crlf" | "lf";
    noEmit ?: boolean;
    noEmitHelpers ?: boolean;
    noEmitOnError ?: boolean;
    noFallthroughCasesInSwitch ?: boolean;
    noImplicitAny ?: boolean;
    noImplicitReturns ?: boolean;
    noImplicitThis ?: boolean;
    noImplicitUseStrict ?: boolean;
    noLib ?: boolean;
    noResolve ?: boolean;
    noStrictGenericChecks ?: boolean;
    noUnusedLocals ?: boolean;
    noUnusedParameters ?: boolean;
    outDir ?: string;
    outFile ?: string;
    preserveConstEnums ?: boolean;
    preserveSymlinks ?: boolean;
    pretty ?: boolean;
    project ?: string;
    reactNamespace ?: string;
    removeComments ?: boolean;
    rootDir ?: string;
    skipDefaultLibCheck ?: boolean;
    skipLibCheck ?: boolean;
    sourceMap ?: boolean;
    sourceRoot ?: boolean;
    strict ?: boolean;
    strictFunctionTypes ?: boolean;
    strictNullChecks ?: boolean;
    stripInternal ?: boolean;
    suppressExcessPropertyErrors ?: boolean;
    suppressImplicitAnyIndexErrors ?: boolean;
    target ?: "ES3" | "ES5" | "ES6" | "ES2015" | "ES2016" | "ES2017" | "ESNext";
    traceResolution ?: boolean;
    types ?: string[];
    typeRoots ?: string[];
    watch ?: boolean;
}

export async function tsc(root: string, opts?: TscOptions) {
    let tscOptions: any = [];
    root = ensureAbsolutePath(root);
    opts.project = root;
    for (const key in opts) {
        if( opts[key] !== undefined){
            if(key === 'watch') {
                tscOptions.push(`--${key}`);
            }
            else {
                tscOptions.push(`--${key}`, String(opts[key]));
            }
        }
    }

    return new Promise((resolve, reject) => {
        const proc = spawn("tsc"  + (/^win/.test(process.platform) ? ".cmd" : ""), tscOptions, {
            stdio: "inherit"
        });
        proc.on("close", function (code) {
            if (code === 8) {
                return reject("Error detected");
            }
            return resolve();
        });
    });
}




export async function npmPublish(opts: { path: string, tag?: string }) {
    opts.tag = opts.tag || "latest";

    return new Promise((resolve, reject) => {
        const publish = spawn("npm", ["publish", "--tag", opts.tag], {
            stdio: "inherit",
            cwd: ensureAbsolutePath(opts.path)
        });
        publish.on("close", function (code) {
            if (code === 8) {
                return reject("Error detected, waiting for changes...");
            }
            return resolve()
        });
    });
}

export function bumpVersion(packageJSONPath: string, opts: {
    userJson?: { version: string },
    type: "minor" | "major" | "patch" | "next" | "alpha" | "beta" | "rc" | "dev"
}) {
    let filePath, json;
    if (!opts.userJson) {
        filePath = ensureAbsolutePath(packageJSONPath);
        if (!fs.existsSync(filePath)) {
            throw new Error(`${filePath} was not found`);
        }
        json = JSON.parse(fs.readFileSync(filePath).toString());
    } else {
        json = opts.userJson;
    }

    let version = json.version || "1.0.0";
    const type = opts.type;

    let matched = version.match(/(\d{1,}).(\d{1,})\.(\d{1,})(-(\w{1,})\.(\d{1,}))?/i);
    let major = matched[1] * 1;
    let minor = matched[2] * 1;
    let patch = matched[3] * 1;
    let addonName = matched[5];
    let addonNumber = matched[6];

    const resetAddon = () => {
        addonName = undefined;
        addonNumber = undefined;
    }
    if (type === "patch") {
        resetAddon();
        patch++
    } else if (type === "minor") {
        minor++
        patch = 0;
        resetAddon();
    } else if (type === "major") {
        patch = 0;
        minor = 0;
        resetAddon();
        major++
    } else {
        if (addonName === type && addonNumber > -1) {
            addonNumber++;
        } else {
            addonName = type;
            addonNumber = 1;
        }
    }
    const base = [`${major}.${minor}.${patch}`];
    if (addonName) {
        base.push(`-${addonName}.${addonNumber}`);
    }
    const finalVersion = base.join('');
    json.version = finalVersion;
    if (opts.userJson) {
        return json
    } else {
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
    }
    return json;
}
