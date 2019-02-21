import { FuseBox, BundleProducer, Bundle } from "../src";

const createFuse = (): FuseBox => {
	return FuseBox.init({
		output: ".fusebox/test-bundle/$name.js",
	});
};

describe("BundleApiTest", () => {
	it("Should producer be in place", () => {
		const fuse = createFuse();
		fuse.bundle("app");
		expect(fuse.producer).toBeInstanceOf(BundleProducer);
	});

	it("Should add a bundle", () => {
		const fuse = createFuse();
		fuse.bundle("app");
		expect(fuse.producer.bundles.get("app")).toBeInstanceOf(Bundle);
	});

	it("Should add add a watch rule", () => {
		const fuse = createFuse();
		fuse.bundle("app").watch("hello/*");
		const bundle = fuse.producer.bundles.get("app");
		expect(bundle.watchRule).toEqual("hello/*");
		expect(bundle.watchFilterFn).toBeUndefined();
	});

	it("Should add add a watch filter", () => {
		const fuse = createFuse();
		const watchFilter = path => false;
		fuse.bundle("app").watch(watchFilter);
		const bundle = fuse.producer.bundles.get("app");
		expect(bundle.watchRule).toEqual("**");
		expect(bundle.watchFilterFn).toEqual(watchFilter);
	});

	it("Should add add a watch rule and filter", () => {
		const fuse = createFuse();
		const watchFilter = path => false;
		fuse.bundle("app").watch("hello/*", watchFilter);
		const bundle = fuse.producer.bundles.get("app");
		expect(bundle.watchRule).toEqual("hello/*");
		expect(bundle.watchFilterFn).toEqual(watchFilter);
	});

	it("Should set globals", () => {
		const fuse = createFuse();
		fuse.bundle("app").globals({ a: 1 });
		const bundle = fuse.producer.bundles.get("app");
		expect(bundle.fuse.context.globals).toEqual({ a: 1 });
	});

	it("Should inject HMR", () => {
		const fuse = createFuse();
		fuse.bundle("app").hmr();

		const bundle = fuse.producer.bundles.get("app");
		expect(bundle.fuse.context.plugins).toBeInstanceOf(Array);
	});

	it("Should inject HMR only to the first plugin", () => {
		const fuse = createFuse();
		fuse.bundle("app").hmr();
		fuse.bundle("app2").hmr();

		const bundle = fuse.producer.bundles.get("app");
		expect(bundle.fuse.context.plugins).toBeInstanceOf(Array);

		const bundle2 = fuse.producer.bundles.get("app2");
		expect(bundle2.fuse.context.plugins).toBeInstanceOf(Array);
		expect(bundle2.fuse.context.plugins).toHaveLength(0);
	});

	it("Should set cache true", () => {
		const fuse = createFuse();
		fuse.bundle("app").cache(true);
		const bundle = fuse.producer.bundles.get("app");
		expect(bundle.context.useCache).toBeTruthy();
	});

	it("Should set cache false", () => {
		const fuse = createFuse();
		fuse.bundle("app").cache(false);
		const bundle = fuse.producer.bundles.get("app");
		expect(bundle.context.useCache).toEqual(false);
	});

	it("Should set log true", () => {
		const fuse = createFuse();
		fuse.bundle("app").log(true);
		const bundle = fuse.producer.bundles.get("app");
		expect(bundle.context.doLog).toBeTruthy();
	});

	it("Should set log false", () => {
		const fuse = createFuse();
		fuse.bundle("app").log(false);
		const bundle = fuse.producer.bundles.get("app");
		expect(bundle.context.doLog).toEqual(false);
	});

	it("Should setup devServer with default params", () => {
		const fuse = createFuse();
		fuse.dev();
		expect(fuse.producer.devServerOptions).toEqual({ port: 4444 });
	});

	it("Should setup devServer with custom params", () => {
		const fuse = createFuse();
		fuse.dev({ port: 7777 });
		expect(fuse.producer.devServerOptions).toEqual({ port: 7777 });
	});

	it("Should setup devServer with https param", () => {
		const fuse = createFuse();
		fuse.dev({ https: { cert: "cert", key: "key" } });
		expect(fuse.producer.devServerOptions).toEqual({ port: 4444, https: { cert: "cert", key: "key" } });
	});

	it("Should setup devServer with fallback param", () => {
		const fuse = createFuse();
		fuse.dev({ fallback: "index.html" });
		expect(fuse.producer.devServerOptions).toEqual({ port: 4444, fallback: "index.html" });
	});

	it("Should inject 1 plugin", () => {
		const fuse = createFuse();
		const bundle = fuse.bundle("app").plugin("first");
		expect(bundle.context.plugins).toEqual(["first"]);
	});

	it("Should inject a plugin chain", () => {
		const fuse = createFuse();
		const bundle = fuse.bundle("app").plugin("first", "second");
		expect(bundle.context.plugins).toEqual([["first", "second"]]);
	});

	it("Should combine plugins", () => {
		const fuse = createFuse();
		const bundle = fuse
			.bundle("app")
			.plugin("hello")
			.plugin("first", "second");
		expect(bundle.context.plugins).toEqual(["hello", ["first", "second"]]);
	});

	it("Should not share plugins across bundles", () => {
		const fuse = createFuse();
		const bundle1 = fuse.bundle("app").plugin("foo");
		const bundle2 = fuse.bundle("app").plugin("bar");
		expect(bundle1.context.plugins).toEqual(["foo"]);
		expect(bundle2.context.plugins).toEqual(["bar"]);
	});

	it("Should set extension overrides", () => {
		const fuse = createFuse();
		const bundle = fuse
			.bundle("app")
			.extensionOverrides(".foo.js", ".foo.json")
			.extensionOverrides(".foo.css", ".foo.less");

		expect(bundle.context.extensionOverrides.overrides).toEqual([".foo.js", ".foo.json", ".foo.css", ".foo.less"]);
	});

	it("Should not add an extension override if it is invalid", () => {
		const fuse = createFuse();
		const bundle = fuse.bundle("app").extensionOverrides("foo.js", ".foo.json");

		expect(bundle.context.extensionOverrides.overrides).toEqual([".foo.json"]);
	});

	it("Should not share extension overrides across bundles", () => {
		const fuse = createFuse();
		const bundle1 = fuse.bundle("app").extensionOverrides(".foo.js", ".foo.json");
		const bundle2 = fuse.bundle("app").extensionOverrides(".bar.js", ".bar.json");

		expect(bundle1.context.extensionOverrides.overrides).toEqual([".foo.js", ".foo.json"]);
		expect(bundle2.context.extensionOverrides.overrides).toEqual([".bar.js", ".bar.json"]);
	});

	it("Should setup arithmetics", () => {
		const fuse = createFuse();
		const bundle = fuse.bundle("app").instructions("hello");
		expect(bundle.arithmetics).toEqual("hello");
	});

	it("Should setup completed callbacked", () => {
		const fuse = createFuse();
		const bundle = fuse.bundle("app").completed(() => "done");
		expect(bundle.onDoneCallback()).toEqual("done");
	});
});
