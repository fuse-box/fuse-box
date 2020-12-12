---
id: version-4.0.0-full-config
title: Full config
original_id: full-config
---

The following is a full list of all the configurations, including any defaults.

## Key

- `?` - The property is optional
- `=` - A sub config item is expanded

```ts
export interface IPublicConfig {
	alias?: { [key: string]: string };

	cache?: boolean | ICacheProps = {
		enabled?: boolean;  // default: true
		root?: string;
		strategy?: 'fs' | 'memory';
	};

	compilerOptions?:  ICompilerOptions = {
		baseUrl?: string;
		buildEnv?: Record<string, any>;
		buildTarget?: ITarget;
		emitDecoratorMetadata?: boolean;
		esModuleInterop?: boolean;
		esModuleStatement?: boolean;
		experimentalDecorators?: boolean;
		jsxFactory?: string;
		paths?: ITypeScriptPaths;
		processEnv?: Record<string, string>;
		transformers?: Array<ICompilerOptionTransformer>;
		tsConfig?: string;
		jsParser?: { nodeModules?: ICompilerParserType; project?: ICompilerParserType };
	}

	dependencies?: {
		ignore?: Array<string | RegExp>;
		importRefs?: Array<IImportRef> = [{
			bundle?: boolean;
			matching: RegExp | string;
			replacement: string;
		}];
		include?: Array<string>;
		serverIgnoreExternals?: boolean;
	};

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

	electron?: IElectronOptions = {
		nodeIntegration?: boolean;
	};

	entry?: Array<string> | string;

	env?: { [key: string]: string };

	hmr?: boolean | IHMRProps {
		enabled?: boolean;
		plugin?: string;
	}

	json?: IJSONPluginProps = {
		useDefault?: boolean;
		path?: string;
	};

	link?: IPluginLinkOptions = {
		useDefault?: boolean;
		resourcePublicRoot?: string;
	};

	logging?: IFuseLoggerProps = {
		level?: 'succinct' | 'verbose' | 'disabled';
		ignoreStatementErrors?: Array<string>;
	};

	modules?: Array<string>;

	plugins?: Array<(ctx: Context) => void>;

	resources?: IResourceConfig = {
		resourcePublicRoot?: string; //default: "/resources"
		resourceFolder?: string; //default: "{YOUR_DIST_FOLDER}/resources"
	};

	sourceMap?: boolean | ISourceMap = {
		sourceRoot?: string;
		vendor?: boolean;
		project?: boolean;
		css?: boolean;
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

	target?: ITarget = 'browser' | 'server' | 'electron' | 'web-worker'; //default: 'server'

	threading?: IThreadingConfig = {
		enabled?: boolean;
		minFileSize?: number;
		threadAmount?: number;
	}

	watcher?: boolean | IWatcherExternalProps = {
		chokidarOptions?: WatchOptions;
		enabled?: boolean;
		ignore?: Array<string | RegExp>;
		include?: Array<string | RegExp>;
	};

	webIndex?: boolean | IWebIndexConfig = {
		distFileName?: string;
		embedIndexedBundles?: boolean;
		enabled?: boolean;
		publicPath?: string;
		target?: string;
		template?: string;
	};

	webWorkers?: IWebWorkerConfig = {
		enabled?: boolean;
		config?: IPublicConfig = { recursive include tree };
	};

}
```

---

## Relevant Doc Links

### [**devServer**](./devServer) - How the product bundle is hosted locally

```ts
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

### [**logging**](./logging) - What's written to console

```ts
logging?: IFuseLoggerProps = {
	level?: 'succinct' | 'verbose' | 'disabled';
	ignoreStatementErrors?: Array<string>;
};
```

<br>

### [**cache**](./cache) - How much work is reused, where it's stored

```ts
cache?: boolean | ICacheProps = {
	enabled?: boolean;  // default: true
	root?: string;
	strategy?: 'fs' | 'memory';
};
```

<br>

### [**resources**](./resource_links) - How assets (png, ttf, etc) are copied to dist

```ts
resources?: IResourceConfig = {
	resourcePublicRoot?: string; //default: "/resources"
	resourceFolder?: string; //default: "{YOUR_DIST_FOLDER}/resources"
}
```

<br>

### [**hmr**](./hmr) - Hot module reloading options

```ts
hmr?: boolean | IHMRExternalProps = {
	reloadEntryOnStylesheet?: boolean;
	hardReloadScripts?: boolean;
};
```

<br>

### [**stylesheet**](./stylesheet) - How stylesheet files (css, sass, etc) are imported and processed

```ts
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

### [**watch**](./watcher) - How updates to project files are responded to

```ts
watcher?: boolean | IWatcherExternalProps = {
	chokidarOptions?: WatchOptions;
	enabled?: boolean;
	ignore?: Array<string | RegExp>;
	include?: Array<string | RegExp>;
};
```

<br>

### [**webIndex**](./webIndex) - How the final html file is generated

```ts
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

### [**webWorkers**](./webworkers) - How WebWorker code is bundled

```ts
webWorkers?: IWebWorkerConfig = {
	enabled?: boolean;
	config?: IPublicConfig;
};
```
