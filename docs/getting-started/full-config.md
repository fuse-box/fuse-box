# Full Configuration with Defaults

The following is a full list of all the configurations, including any defaults.

## Key

- `?` - The property is optional
- `=` - A sub config item is expanded

```ts
export interface IPublicConfig {
	root?: string;
	target?: ITarget = 'browser' | 'server' | 'electron' | 'universal' | 'web-worker'; //default: 'browser'
	dependencies?: {
		include?: Array<string>;
		ignorePackages?: Array<string>;
		ignoreAllExternal?: boolean;
	};
	homeDir?: string; //default: fuse.ts directory
  modules?: Array<string>;
  compilerOptions?:  ICompilerOptions = {
    baseUrl?: string;
    buildTarget?: ITarget;
    emitDecoratorMetadata?: boolean;
    esModuleInterop?: boolean;
    esModuleStatement?: boolean;
    experimentalDecorators?: boolean;
    jsxFactory?: string;
    paths?: ITypeScriptPaths;
    processEnv?: Record<string, string>;
    tsConfig?: string;
  }

	logging?: IFuseLoggerProps = {
		level?: 'succinct' | 'verbose' | 'disabled';
		ignoreStatementErrors?: Array<string>;
	};
	webWorkers?: IWebWorkerConfig = {
		enabled?: boolean;
		config?: IPublicConfig = { recursive include tree };
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
		hardReloadScripts?: boolean;
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
	webIndex?: boolean | IWebIndexConfig = {
		enabled?: boolean;
		target?: string;
		template?: string;
		distFileName?: string;
		publicPath?: string;
		embedIndexedBundles?: boolean;
	};
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
}
```

---

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

<br>

### [**logging**](../logging.md) - What's written to console

```
logging?: IFuseLoggerProps = {
	level?: 'succinct' | 'verbose' | 'disabled';
	ignoreStatementErrors?: Array<string>;
};
```

<br>

### [**cache**](../cache.md) - How much work is reused, where it's stored

```
cache?: boolean | ICacheProps = {
	enabled?: boolean;
	root?: string;
	FTL?: boolean;
};
```

<br>

### [**tsconfig**](../monorepo.md) - How paths are resolved

```
tsConfig?: string | IRawCompilerOptions = { very large. check out tsconfig };
```

<br>

### [**resources**](../resource_links.md) - How assets (png, ttf, etc) are copied to dist

```
resources?: IResourceConfig = {
	resourcePublicRoot?: string; //default: "/resources"
	resourceFolder?: string; //default: "{YOUR_DIST_FOLDER}/resources"
}
```

<br>

### [**hmr**](../hmr.md) - Hot module reloading options

```
hmr?: boolean | IHMRExternalProps = {
	reloadEntryOnStylesheet?: boolean;
	hardReloadScripts?: boolean;
};
```

<br>

### [**stylesheet**](../stylesheet.md) - How stylesheet files (css, sass, etc) are imported and processed

```
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
```

<br>

### [**watch**](../watcher.md) - How updates to project files are responded to

```
watch?: boolean | IWatcherExternalProps = {
	paths?: any;
	skipRecommendedIgnoredPaths?: boolean;
	ignored?: Array<string | RegExp>;
	banned?: Array<string>;
	chokidar?: WatchOptions;
};
```

<br>

### [**webIndex**](../webIndex.md) - How the final html file is generated

```
webIndex?: boolean | IWebIndexConfig = {
	enabled?: boolean;
	target?: string;
	template?: string;
	distFileName?: string;
	publicPath?: string;
	embedIndexedBundles?: boolean;
};
```

<br>

### [**webWorkers**](../webworkers.md) - How WebWorker code is bundled

```
webWorkers?: IWebWorkerConfig = {
	enabled?: boolean;
	config?: IPublicConfig;
};
```
