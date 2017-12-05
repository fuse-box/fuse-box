import { spawn } from "child_process";
import * as fs from "fs";
import { ensureAbsolutePath } from '../Utils';
export interface TscOptions {
    allowJs ?: string;
    allowSyntheticDefaultImports ?: string;
    allowUnreachableCode ?: string;
    allowUnusedLabels ?: string;
    alwaysStrict ?: string;
    baseUrl ?: string;
    charset ?: string;
    checkJs ?: string;
    declarationDir ?: string;
    diagnostics ?: string;
    disableSizeLimit ?: string;
    downlevelIteration ?: string;
    emitBOM ?: string;
    emitDecoratorMetadata ?: string;
    forceConsistentCasingInFileNames ?: string;
    importHelpers ?: string;
    inlineSourceMap ?: string;
    inlineSources ?: string;
    isolatedModules ?: string;
    init ?: string;
    jsx ?: string;
    jsxFactory ?: string;
    lib ?: string[];
    listEmittedFiles ?: string;
    listFiles ?: string;
    locale ?: string;
    mapRoot ?: string;
    maxNodeModuleJsDepth ?: string;
    module ?: string;
    moduleResolution ?: string;
    newLine ?: string;
    noEmit ?: string;
    noEmitHelpers ?: string;
    noEmitOnError ?: string;
    noFallthroughCasesInSwitch ?: string;
    noImplicitAny ?: string;
    noImplicitReturns ?: string;
    noImplicitThis ?: string;
    noImplicitUseStrict ?: string;
    noLib ?: string;
    noResolve ?: string;
    noStrictGenericChecks ?: string;
    noUnusedLocals ?: string;
    noUnusedParameters ?: string;
    outDir ?: string;
    outFile ?: string;
    paths ?: string;
    preserveConstEnums ?: string;
    preserveSymlinks ?: string;
    pretty ?: string;
    project ?: string;
    reactNamespace ?: string;
    removeComments ?: string;
    rootDir ?: string;
    skipDefaultLibCheck ?: string;
    skipLibCheck ?: string;
    sourceMap ?: string;
    sourceRoot ?: string;
    strict ?: string;
    strictFunctionTypes ?: string;
    strictNullChecks ?: string;
    stripInternal ?: string;
    suppressExcessPropertyErrors ?: string;
    suppressImplicitAnyIndexErrors ?: string;
    target ?: string;
    traceResolution ?: string;
    types ?: string[];
    typeRoots ?: string[];
}

export async function tsc(root: string, opts?: TscOptions) {
    let tscOptions: any = [];
    root = ensureAbsolutePath(root);
    opts.project = root;
    for (const key in opts) {
        if( opts[key] !== undefined){
            tscOptions.push(`--${key}`, opts[key])
        }
    }

    return new Promise((resolve, reject) => {
        const proc = spawn("tsc", tscOptions, {
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