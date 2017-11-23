import { WorkFlowContext } from "./WorkflowContext";
import * as path from "path";
import { ensureUserPath, findFileBackwards } from "../Utils";
import { ScriptTarget } from "./File";

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
        if ( this.context.forcedLanguageLevel ){
            this.forceCompilerTarget(this.context.forcedLanguageLevel);
        }
    }

    public forceCompilerTarget(level : ScriptTarget){
        this.context.log.echoInfo(`Typescript forced script target: ${ScriptTarget[level]}`)
        const compilerOptions = this.config.compilerOptions = this.config.compilerOptions || {};
        compilerOptions.target = ScriptTarget[level];
    }

    public setConfigFile(customTsConfig: string) {
        this.customTsConfig = customTsConfig;

    }
    public read() {

        const cacheKey = (this.customTsConfig || this.context.homeDir) + this.context.languageLevel;
        if (CACHED[cacheKey]) {
            this.config = CACHED[cacheKey];
        } else {
            let url, configFile;
            let config: any = {
                compilerOptions: {},
            };;
            let tsConfigOverride: any;
            if (typeof this.customTsConfig === "string") {
                configFile = ensureUserPath(this.customTsConfig);
            } else {
                url = path.join(this.context.homeDir, "tsconfig.json");
                let tsconfig = findFileBackwards(url, this.context.appRoot);
                if (tsconfig) {
                    configFile = tsconfig;
                }
            }

            if (configFile) {
                this.context.log.echoInfo(`Typescript config file:  ${configFile.replace(this.context.appRoot, "")}`);
                config = require(configFile);
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

            this.config = config;


            this.defaultSetup();
            this.context.log.echoInfo(`Typescript script target: ${config.compilerOptions.target}`)
            CACHED[cacheKey] = this.config;
        }
    }
}