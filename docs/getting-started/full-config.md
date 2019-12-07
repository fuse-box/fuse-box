# Full Configuration with Defaults

The following is a full list of all the configurations, including any defaults.

## Key

* `?` - The property is optional
* `=` - A sub config item is expanded


```ts
export interface IPublicConfig {
	root?: string;
	target?: ITarget = 'browser' | 'server' | 'electron' | 'universal' | 'web-worker'; //default: 'browser'
	useSingleBundle?: boolean;
	dependencies?: {
		include?: Array<string>;
		ignorePackages?: Array<string>;
		ignoreAllExternal?: boolean;
	};
	homeDir?: string; //default: fuse.ts directory
	output?: string;
	modules?: Array<string>;
	logging?: IFuseLoggerProps = {
		level?: 'succinct' | 'verbose' | 'disabled';
		ignoreStatementErrors?: Array<string>;
	};
	webWorkers?: IWebWorkerConfig = {
		enabled?: boolean;
		config?: IPublicConfig;
	};

	codeSplitting?: ICodeSplittingConfig = {
		scriptRoot?: string;
		maxPathLength?: number;
		useHash?: boolean;
	};

	watch?: boolean | IWatcherExternalProps = {
		paths?: any;
		skipRecommendedIgnoredPaths?: boolean;
		ignored?: Array<string | RegExp>;
		banned?: Array<string>;
		chokidar?: WatchOptions;
	};

	resources?: IResourceConfig = {
		resourcePublicRoot?: string; //default: "/resources"
		resourceFolder?: string; //default: "{YOUR_DIST_FOLDER}/resources"
	};

	json?: IJSONPluginProps = {
		useDefault?: boolean;
		path?: string;
	};
	link?: IPluginLinkOptions = {
		useDefault?: boolean;
		resourcePublicRoot?: string;
	};

	env?: { [key: string]: string };

	hmr?: boolean | IHMRExternalProps = {
		reloadEntryOnStylesheet?: boolean;
	};
	stylesheet?: IStyleSheetProps = {
		ignoreChecksForCopiedResources?: boolean;
		breakDependantsCache?: boolean;
		groupResourcesFilesByType?: boolean;  //default: true
		paths?: Array<string>;
		autoImport?: Array<IStyleSheetAutoImportCapture>;
		macros?: { [key: string]: string };
		sass?: ISassProps;
		postCSS?: IPostCSSProps;
		less?: ILessProps;
	};
	cache?: boolean | ICacheProps = {
		enabled?: boolean;  // default: true
		root?: string;
		FTL?: boolean;
	};
	tsConfig?: string | IRawCompilerOptions = { very large. check out tsconfig };
	entry?: string | Array<string>;
	allowSyntheticDefaultImports?: boolean;
	webIndex?: boolean | IWebIndexConfig = {
		enabled?: boolean;
		target?: string;
		template?: string;
		distFileName?: string;
		publicPath?: string;
		embedIndexedBundles?: boolean;
	};
	turboMode?:
		| {
				maxWorkers?: number;
				workerPortsRange?: { start: number; end: number };
				workerPorts?: Array<number>;
			}
		| boolean;
	sourceMap?:
		| {
				sourceRoot?: string;
				vendor?: boolean;
				project?: boolean;
				css?: boolean;
			}
		| boolean;
	plugins?: Array<(ctx: Context) => void>;
	alias?: { [key: string]: string };

	// read only
	defaultCollectionName?: string;

	devServer?: boolean | undefined | IDevServerProps = {
		enabled?: boolean;
		open?: boolean | IOpenProps = {
			background?: boolean; // mac os only
			wait?: boolean;
			target?: string;
			app?: string | Array<string>;
		};
		proxy?: Array<IProxyCollection> = [{
			path: string;
			options: any;
		}];
		httpServer?: boolean | IHTTPServerProps = {
			enabled?: boolean;
			port?: number;
			fallback?: string;
			root?: string;
			express?: (app: any, express: any) => void;
		};
		hmrServer?: boolean | IHMRServerProps = {
			enabled?: boolean;
			useCurrentURL?: boolean;
			port?: number;
			connectionURL?: string;
		};
	};

	cacheObject?: Cache;
}
```

-------

## Relevant Doc Links

### [**devServer**](../devServer.md) - How the product bundle is hosted locally

```
devServer?: boolean | undefined | IDevServerProps = {
	enabled?: boolean;
	open?: boolean | IOpenProps = {
		background?: boolean; // mac os only
		wait?: boolean;
		target?: string;
		app?: string | Array<string>;
	};
	proxy?: Array<IProxyCollection> = [{
		path: string;
		options: any;
	}];
	httpServer?: boolean | IHTTPServerProps = {
		enabled?: boolean;
		port?: number;
		fallback?: string;
		root?: string;
		express?: (app: any, express: any) => void;
	};
	hmrServer?: boolean | IHMRServerProps = {
		enabled?: boolean;
		useCurrentURL?: boolean;
		port?: number;
		connectionURL?: string;
	};
};
```



### [**logging**](../logging.md) - What's written to console

```
logging?: IFuseLoggerProps = {
	level?: 'succinct' | 'verbose' | 'disabled';
	ignoreStatementErrors?: Array<string>;
};
```

### [**cache**](../cache.md) - How much work is reused, where it's stored

```
cache?: boolean | ICacheProps = {
	enabled?: boolean;
	root?: string;
	FTL?: boolean;
};
```



### [**tsconfig**](../monorepo.md) - How paths are resolved
```
tsConfig?: string | IRawCompilerOptions = { very large. check out tsconfig };
```
