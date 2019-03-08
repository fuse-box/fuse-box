import * as appRoot from "app-root-path";
import { ensureAbsolutePath } from "../utils/utils";
import { IConfig } from "./interfaces";

export function createConfig(props: IConfig): IConfig {
	const config: IConfig = {
		root: process.env.APP_ROOT || appRoot.path,
	};

	config.defaultCollectionName = "default";

	if (props.homeDir) {
		config.homeDir = ensureAbsolutePath(props.homeDir, config.root);
	}

	if (props.modules) {
		config.modules = props.modules;
	}

	if (props.output) {
		config.output = props.output;
	}

	if (props.target) {
		config.target = props.target;
	}

	if (props.fuseBoxPolyfillsFolder) {
		config.fuseBoxPolyfillsFolder = props.fuseBoxPolyfillsFolder;
	}
	return config;
}
