import { WorkFlowContext } from "./WorkflowContext";
import * as path from "path";
import { ensureUserPath, findFileBackwards } from "../Utils";

const CACHED: { [path: string]: any } = {};


export class TypescriptConfig {
    // the actual typescript config
    private config: any;
    private customTsConfig: string;

    constructor(public context: WorkFlowContext) { }

    public getConfig() {
        return this.config;
    }

    private defaultSetup() {
        const compilerOptions = this.config.compilerOptions = this.config.compilerOptions || {};
        if (this.context.useSourceMaps) {
            compilerOptions.sourceMap = true;
            compilerOptions.inlineSources = true;
        }
    }

    public setConfigFile(customTsConfig: string) {
        this.customTsConfig = customTsConfig;

    }
    public read() {

        const cacheKey = this.customTsConfig || this.context.homeDir;
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
                this.context.log.echoStatus(`Typescript config:  ${configFile.replace(this.context.appRoot, "")}`);
                config = require(configFile);
            }

            if (Array.isArray(this.customTsConfig)) {
                tsConfigOverride = this.customTsConfig[0];
            }

            config.compilerOptions.module = "commonjs";
            if (!('target' in config.compilerOptions)) {
                config.compilerOptions.target = this.context.languageLevel
            }
            if (tsConfigOverride) {
                config.compilerOptions = Object.assign(config.compilerOptions, tsConfigOverride);
            }

            this.config = config;


            this.defaultSetup();
            CACHED[cacheKey] = this.config;
        }
    }
}