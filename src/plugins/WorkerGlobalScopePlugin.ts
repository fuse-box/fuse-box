import { BannerPluginClass } from "./BannerPlugin";

export const WorkerGlobalScopePlugin = () => {
	return new BannerPluginClass("typeof self !== 'undefined' ? self : this");
};
