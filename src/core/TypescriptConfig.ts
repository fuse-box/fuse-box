import { WorkFlowContext } from "./WorkflowContext";
import * as path from "path";
import { ensureUserPath, findFileBackwards } from "../Utils";
import { ScriptTarget } from "./File";
import * as fs from "fs";
import { Config } from "../Config";
import * as ts from "typescript";

const CACHED: { [path: string]: any } = {};


export class TypescriptConfig {
    // the actual typescript config
    private config: any;
    private customTsConfig: string;

    constructor(public context: WorkFlowContext) { }

    public getConfig() {
        this.read();
        return this.config;
    }

    private defaultSetup() {
        const compilerOptions = this.config.compilerOptions = this.config.compilerOptions || {};
        if (this.context.useSourceMaps) {
            compilerOptions.sourceMap = true;
            compilerOptions.inlineSources = true;
        }
        if (this.context.forcedLanguageLevel) {
            this.forceCompilerTarget(this.context.forcedLanguageLevel);
        }
    }

    public forceCompilerTarget(level: ScriptTarget) {
        this.context.log.echoInfo(`Typescript forced script target: ${ScriptTarget[level]}`)
        const compilerOptions = this.config.compilerOptions = this.config.compilerOptions || {};
        compilerOptions.target = ScriptTarget[level];
    }

    public setConfigFile(customTsConfig: string) {
        this.customTsConfig = customTsConfig;
    }

    private initializeConfig() {
        const compilerOptions = this.config.compilerOptions;
        compilerOptions.jsx = "react";
        compilerOptions.importHelpers = true;
        compilerOptions.emitDecoratorMetadata = true;
        compilerOptions.experimentalDecorators = true;
        const targetFile = path.join(this.context.homeDir, "tsconfig.json");
        this.context.log.echoInfo(`Generating recommended tsconfig.json:  ${targetFile}`);
        fs.writeFileSync(targetFile, JSON.stringify(this.config, null, 2));
    }


    private verifyTsLib() {
        if (this.config.compilerOptions.importHelpers === true) {
            const tslibPath = path.join(Config.NODE_MODULES_DIR, "tslib");
            if (!fs.existsSync(tslibPath)) {
                this.context.log.echoWarning(`You have enabled importHelpers. Please install tslib - https://github.com/Microsoft/tslib`)
            }
        }
    }
    public read() {
        const cacheKey = (typeof this.customTsConfig === "string" ? this.customTsConfig : this.context.homeDir)
            + this.context.target + this.context.languageLevel;
        if (CACHED[cacheKey]) {
            this.config = CACHED[cacheKey];
        } else {
            let url, configFile;
            let config: any = {
                compilerOptions: {},
            };;
            let configFileFound = false;
            let tsConfigOverride: any;
            if (typeof this.customTsConfig === "string") {
                configFile = ensureUserPath(this.customTsConfig);
            } else {
                url = path.join(this.context.homeDir, "tsconfig.json");
                let tsconfig = findFileBackwards(url, this.context.appRoot);
                if (tsconfig) {
                    configFileFound = true;
                    configFile = tsconfig;
                }
            }
            if (configFile) {
                const configFileRelPath = configFile.replace(this.context.appRoot, "");
                this.context.log.echoInfo(`Typescript config file:  ${configFileRelPath}`);
                configFileFound = true;
                const res = ts.readConfigFile(configFile, (p) => fs.readFileSync(p).toString());
                config = res.config;
                if (res.error) {
                    this.context.log.echoError(`Errors in ${configFileRelPath}`);
                }
            }


            if (Array.isArray(this.customTsConfig)) {
                tsConfigOverride = this.customTsConfig[0];
            }

            config.compilerOptions.module = "commonjs";
            if (!('target' in config.compilerOptions)) {
                config.compilerOptions.target = ScriptTarget[this.context.languageLevel];
            }
            if (tsConfigOverride) {
                config.compilerOptions = Object.assign(config.compilerOptions, tsConfigOverride);
            }
            // allowSyntheticDefaultImports
            if( config.compilerOptions.allowSyntheticDefaultImports !== undefined ){
                if( this.context.fuse && this.context.fuse.producer ) {
                    this.context.fuse.producer.allowSyntheticDefaultImports = config.compilerOptions.allowSyntheticDefaultImports;;
                }
            }
            this.config = config;

            this.defaultSetup();
            if (!configFileFound && this.context.ensureTsConfig === true) {
                this.initializeConfig();
            }
            if (this.context.ensureTsConfig === true) {
                this.verifyTsLib();
            }
            this.context.log.echoInfo(`Typescript script target: ${config.compilerOptions.target}`)
            CACHED[cacheKey] = this.config;
        }
    }
}