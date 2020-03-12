import { pathJoin, fileExists, ensureAbsolutePath } from '../utils/utils';
import { normalize, dirname, basename, relative } from 'path';
import { realpathSync } from 'fs';
import { parseJsonSourceFileConfigFileContent, parseJsonText, ParseConfigHost, ProjectReference, sys } from 'typescript';
import { ITsConfigReference } from './interfaces';
import { resolveIfExists, fileLookup, ILookupProps, TargetResolver, SubPathResolver } from '../resolver/fileLookup';

type OutToInRecord = { base: string, input: string, output: string }
type ByOutputMap = Map<string, string>
type ByPackageMap = Map<string, ByOutputMap>

interface TsConfigReferences {
    path: string,
    files: OutToInRecord[],
    references: readonly ProjectReference[],
}

export function createTsParseConfigHost(): ParseConfigHost {
    return {
        useCaseSensitiveFileNames: true,
        readDirectory: sys.readDirectory,
        readFile: sys.readFile,
        fileExists: sys.fileExists,
    }
}

const resolveVirtual = (process.versions as any).pnp && require("pnpapi").resolveVirtual;

// recurse through the references to build a mapping of outputs to inputs
export function buildMappings(references: ITsConfigReference[], tsConfigDir: string): ByOutputMap {
    // build the mappings
    const tsHost = createTsParseConfigHost();
    const inputsByOutput = new Map<string, string>();
    const anticycle = new Set<string>();
    const rawReferences = references || [];
    for (const rawRef of rawReferences) {
        const { path: rawPath } = rawRef;
        if (!rawPath)
            continue;
        const absPath = ensureAbsolutePath(rawPath, tsConfigDir)
        recurseTsReference(tsHost, absPath, inputsByOutput, anticycle);
    }
    return inputsByOutput;
}

// group an out-to-in mapping by package (accounting for nested pacakges)
export function groupByPackage(mappings: ByOutputMap): ByPackageMap {
    // find all the relevant package roots (bases)
    // we need to know what node packages the typescript out/in files are in
    // so that when we get an output, even if it is a PnP virtual path, we find the right out/in pair
    const byPackage = new Map<string, ByOutputMap>();
    for (const [output, input] of mappings) {
        for (const { base, rel: outputRel } of packageAncestorsOf(output)) {
            const map = byPackage.get(base) || new Map<string, string>();
            if (map.size == 0) {
                byPackage.set(base, map);
            }
            const inputRel = relative(base, input);
            map.set(outputRel, inputRel);
        }
    }
    return byPackage;
}

// Create a resolver that can resolve project subpaths
// mapping from outputs (e.g. dist/file.js) to their inputs (e.g. src/file.ts)
export function createTsTargetResolver(references: ITsConfigReference[], tsConfigDir: string): TargetResolver | undefined {
    const mappings = groupByPackage(buildMappings(references, tsConfigDir));
    if (mappings.size === 0)
        return undefined;
    return mappingsToResolver(mappings);
}

export function mappingsToResolver(mappings: ByPackageMap) {
    // take a base and a relative target and return the input, if any, that generates it
    function tsMapToInput(pkgRoot, subPath) {
        const inByOutRel = mappings.get(pkgRoot);
        if (inByOutRel) {
            const input = inByOutRel.get(subPath);
            if (input) {
                return input
            }
        }
        return subPath;
    }

    // create a SubPathResolver that checks the Out->In maps
    const tsResolver: SubPathResolver = (base, target, type, props) => {
        const basicResult = resolveIfExists(base, tsMapToInput(base, target), type, props);
        if (basicResult) {
            return basicResult;
        }
        // Handle PnP virtual paths
        if (resolveVirtual) {
            const realBase = resolveVirtual(base);
            if (realBase && realBase !== base) {
                // if we are dealing with virtual paths
                // we need to send the "real" base path to the ts mapper
                // but send the original virtual base path as our result
                var result = resolveIfExists(base, tsMapToInput(realBase, target), type, props);
                if (result) {
                    return result;
                }
            }
        }
        return undefined;
    }

    // Construct a TargetResolver but inject our own TypeScript sub-path resolver
    return (lookupArgs: ILookupProps) => {
        // same as fileLookup but with our own subpath resolver
        // also, search .js first, because that's what our resolver is looking for
        return fileLookup({ ...lookupArgs, javascriptFirst: true, subPathResolver: tsResolver });
    };
}

function parentDir(normalizedPath: string): string | undefined {
    const parent = dirname(normalizedPath);
    return parent !== normalizedPath ? parent : undefined;
}

// find all package.json files in the folder ancestry
function packageAncestorsOf(path: string): { base: string, rel: string }[] {
    const result: { base: string, rel: string }[] = [];
    const start = normalize(path);
    let rel = basename(start);
    for (let dir = parentDir(start); dir !== undefined; rel = pathJoin(basename(dir), rel), dir = parentDir(dir)) {
        const packageJsonPath = pathJoin(dir, "package.json");
        if (fileExists(packageJsonPath)) {
            result.push({ base: dir, rel })
        }
    }
    return result;
}

// Follow a single TypeScript reference recursively through its references
// adding output->input mappings along the way
function recurseTsReference(tsHost: ParseConfigHost, reference: string, map: ByOutputMap, anticycle: Set<string>) {
    if (!fileExists(reference)) {
        throw new Error(`Unable to find tsconfig reference ${reference}`);
    }
    const realPath = realpathSync(reference);
    const result = loadTsConfig(realPath, tsHost);
    if (!result)
        return;
    const { path, files, references } = result;
    if (anticycle.has(path))
        throw new Error(`Project references may not form a circular graph. Cycle detected: ${path}`)
    anticycle.add(path); // guard against cyclical references
    for (const file of files) {
        if (map.has(file.output)) {
            const existing = map.get(file.output);
            throw new Error(`Multiple input files map to same output file (1. "${existing}", 2. "${file.input}") => ("${file.output}")`);
        }
        map.set(file.output, file.input);
    }
    for (const subref of (references || [])) {
        recurseTsReference(tsHost, subref.path, map, anticycle);
    }
}

// Read a tsconfig file from disk and parse out the relevant parts
// and scan input files
function loadTsConfig(path: string, host: ParseConfigHost): TsConfigReferences | undefined {
    const byFolder = (!/tsconfig.json$/.test(path)) && loadTsConfig(pathJoin(path, "tsconfig.json"), host);
    if (byFolder)
        return byFolder;
    const normalized = normalize(path);
    const raw = host.readFile(normalized);
    if (!raw) {
        throw new Error(`Unable to read tsconfig file at ${normalized}`);
    }
    const tsconfig = parseJsonText(normalized, raw);
    // use typescript's own config file logic to get the list of input files
    const files = parseJsonSourceFileConfigFileContent(tsconfig, host, dirname(normalized));
    if (!files.options.composite) {
        throw new Error(`Referenced project '${path}' must have settings "composite": true.`);
    }
    // since composite === true, we can determine each output from our list of inputs
    // so now we know which outputs a build would create, and what they are, and what their inputs are
    return {
        path: normalized,
        files: files.fileNames
            .map(input => calculateInOutMap(files.options.rootDir, files.options.outDir, input)),
        references: files.projectReferences,
    }
}


// The extensions that Typescript will process to the output directory
const tsOutExts = {
    ".jsx": ".js",
    ".json": ".json",
    ".js": ".js",
    ".tsx": ".jsx",
    ".ts": ".js",
}
// e.g.: (.*)((\.jsx$)|(\.json$)|(\.js$)|(\.tsx$)|(\.ts$))
const tsOutPattern = new RegExp(`(.*)(${Object.keys(tsOutExts).map(ext => `(\\${ext})`).join('|')})`);
function parseTsExtension(file: string): { stem: string, ext: string } {
    const match = tsOutPattern.exec(file);
    return match ? { stem: match[1], ext: match[2] } : { stem: file, ext: "" };
}

// Calculate the output -> input map given the rootDir, outDir, and input
function calculateInOutMap(rootDir: string, outDir: string, input: string): OutToInRecord | undefined {
    const nroot = normalize(rootDir);
    const nout = normalize(outDir);
    const ninput = normalize(input);
    if (!ninput.startsWith(nroot)) {
        throw new Error(`File '${ninput}' is not under 'rootDir' '${rootDir}'. 'rootDir' is expected to contain all source files`);
    }
    // strip the root part to get the relative part
    const relInput = ninput.substr(nroot.length);
    const { stem, ext } = parseTsExtension(relInput);
    const outExt = tsOutExts[ext] || ext;
    return outExt && {
        base: rootDir,
        input: ninput,
        output: pathJoin(nout, `${stem}${outExt}`),
    }
}
