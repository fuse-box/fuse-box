import { Plugin } from "../core/WorkflowContext";
import { File } from "../core/File";

export type DepsBasket = {[bundle: string]: {[dependency: string]: string[]} }
export type DepsAnalyser = (requirement: string, file: File) => void;

/**
 * @export
 * @class DepsGrabberPluginClass
 * @implements {Plugin}
 */
export class DepsGrabberPluginClass implements Plugin {
    /**
     * @type {RegExp}
     * @memberOf DepsGrabberPluginClass
     */
    public test: RegExp = /\.(js|ts)x?$/;
    public grabber : DepsAnalyser;

    constructor(grabber?: DepsBasket|DepsAnalyser) {
			this.grabber = 'function'=== typeof grabber ? grabber :
				(requirement, file) => {
					var bundleName = file.context.bundle.name,
						bundleDep = grabber[bundleName] || (grabber[bundleName] = {});
					if('.'!== requirement[0])
						(bundleDep[requirement] || (bundleDep[requirement] = [])).push(file.relativePath);
				};
    }
		transform(file: File, ast) {
			for(let dep of file.analysis.dependencies)
				this.grabber(dep, file);
		}
}

export const DepsGrabberPlugin = (grabber: DepsBasket|DepsAnalyser) => {
    return new DepsGrabberPluginClass(grabber);
};
