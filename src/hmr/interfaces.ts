export interface ISourceChangedHMR {
	type: string;
	dependencies: Array<{ src: string }>;
	dependants: Array<any>;
	content: string;
	path: string;
}

export interface IDependencyRequestHMR {
	original: any;
	loadedPackages: Array<string>;
	files: Array<{ path: string; module: string }>;
}
