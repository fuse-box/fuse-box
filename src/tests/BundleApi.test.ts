import { BundleProducer } from "../core/BundleProducer";
import { FuseBox } from "../index";
import { should } from "fuse-test-runner";
import { Bundle } from "../core/Bundle";

const createFuse = (): FuseBox => {
	return FuseBox.init({
		output: ".fusebox/test-bundle/$name.js",
	});
};

export class BundleApiTest {
	"Should producer be in place"() {
		const fuse = createFuse();
		fuse.bundle("app");
		should(fuse.producer).beInstanceOf(BundleProducer);
	}

	"Should add a bundle"() {
		const fuse = createFuse();
		fuse.bundle("app");
		should(fuse.producer.bundles.get("app")).beInstanceOf(Bundle);
	}

	"Should add add a watch rule"() {
		const fuse = createFuse();
		fuse.bundle("app").watch("hello/*");
		const bundle = fuse.producer.bundles.get("app");
		should(bundle.watchRule).equal("hello/*");
		should(bundle.watchFilterFn).beUndefined();
	}

	"Should add add a watch filter"() {
		const fuse = createFuse();
		const watchFilter = path => false;
		fuse.bundle("app").watch(watchFilter);
		const bundle = fuse.producer.bundles.get("app");
		should(bundle.watchRule).equal("**");
		should(bundle.watchFilterFn).equal(watchFilter);
	}

	"Should add add a watch rule and filter"() {
		const fuse = createFuse();
		const watchFilter = path => false;
		fuse.bundle("app").watch("hello/*", watchFilter);
		const bundle = fuse.producer.bundles.get("app");
		should(bundle.watchRule).equal("hello/*");
		should(bundle.watchFilterFn).equal(watchFilter);
	}

	"Should set globals"() {
		const fuse = createFuse();
		fuse.bundle("app").globals({ a: 1 });
		const bundle = fuse.producer.bundles.get("app");
		should(bundle.fuse.context.globals).deepEqual({ a: 1 });
	}

	"Should inject HMR"() {
		const fuse = createFuse();
		fuse.bundle("app").hmr();

		const bundle = fuse.producer.bundles.get("app");
		should(bundle.fuse.context.plugins)
			.beArray()
			.haveLength(1)
			.mutate(els => els[0])
			.mutate(plugin => plugin.port)
			.equal(4444);
	}

	"Should inject HMR only to the first plugin"() {
		const fuse = createFuse();
		fuse.bundle("app").hmr();
		fuse.bundle("app2").hmr();

		const bundle = fuse.producer.bundles.get("app");
		should(bundle.fuse.context.plugins)
			.beArray()
			.haveLength(1)
			.mutate(els => els[0])
			.mutate(plugin => plugin.port)
			.equal(4444);

		const bundle2 = fuse.producer.bundles.get("app2");
		should(bundle2.fuse.context.plugins)
			.beArray()
			.haveLength(0);
	}

	"Should set cache true"() {
		const fuse = createFuse();
		fuse.bundle("app").cache(true);
		const bundle = fuse.producer.bundles.get("app");
		should(bundle.context.useCache).beTrue();
	}

	"Should set cache false"() {
		const fuse = createFuse();
		fuse.bundle("app").cache(false);
		const bundle = fuse.producer.bundles.get("app");
		should(bundle.context.useCache).beFalse();
	}

	"Should set log true"() {
		const fuse = createFuse();
		fuse.bundle("app").log(true);
		const bundle = fuse.producer.bundles.get("app");
		should(bundle.context.doLog).beTrue();
	}

	"Should set log false"() {
		const fuse = createFuse();
		fuse.bundle("app").log(false);
		const bundle = fuse.producer.bundles.get("app");
		should(bundle.context.doLog).beFalse();
	}

	"Should setup devServer with default params"() {
		const fuse = createFuse();
		fuse.dev();
		should(fuse.producer.devServerOptions).deepEqual({ port: 4444 });
	}

	"Should setup devServer with custom params"() {
		const fuse = createFuse();
		fuse.dev({ port: 7777 });
		should(fuse.producer.devServerOptions).deepEqual({ port: 7777 });
	}

	"Should setup devServer with https param"() {
		const fuse = createFuse();
		fuse.dev({ https: { cert: "cert", key: "key" } });
		should(fuse.producer.devServerOptions).deepEqual({ port: 4444, https: { cert: "cert", key: "key" } });
	}

	"Should setup devServer with fallback param"() {
		const fuse = createFuse();
		fuse.dev({ fallback: "index.html" });
		should(fuse.producer.devServerOptions).deepEqual({ port: 4444, fallback: "index.html" });
	}

	"Should inject 1 plugin"() {
		const fuse = createFuse();
		const bundle = fuse.bundle("app").plugin("first");
		should(bundle.context.plugins).deepEqual(["first"]);
	}

	"Should inject a plugin chain"() {
		const fuse = createFuse();
		const bundle = fuse.bundle("app").plugin("first", "second");
		should(bundle.context.plugins).deepEqual([["first", "second"]]);
	}

	"Should combine plugins"() {
		const fuse = createFuse();
		const bundle = fuse
			.bundle("app")
			.plugin("hello")
			.plugin("first", "second");
		should(bundle.context.plugins).deepEqual(["hello", ["first", "second"]]);
	}

	"Should not share plugins across bundles"() {
		const fuse = createFuse();
		const bundle1 = fuse.bundle("app").plugin("foo");
		const bundle2 = fuse.bundle("app").plugin("bar");
		should(bundle1.context.plugins).deepEqual(["foo"]);
		should(bundle2.context.plugins).deepEqual(["bar"]);
	}

	"Should set extension overrides"() {
		const fuse = createFuse();
		const bundle = fuse
			.bundle("app")
			.extensionOverrides(".foo.js", ".foo.json")
			.extensionOverrides(".foo.css", ".foo.less");

		should(bundle.context.extensionOverrides.overrides).deepEqual([".foo.js", ".foo.json", ".foo.css", ".foo.less"]);
	}

	"Should not add an extension override if it is invalid"() {
		const fuse = createFuse();
		const bundle = fuse.bundle("app").extensionOverrides("foo.js", ".foo.json");

		should(bundle.context.extensionOverrides.overrides).deepEqual([".foo.json"]);
	}

	"Should not share extension overrides across bundles"() {
		const fuse = createFuse();
		const bundle1 = fuse.bundle("app").extensionOverrides(".foo.js", ".foo.json");
		const bundle2 = fuse.bundle("app").extensionOverrides(".bar.js", ".bar.json");

		should(bundle1.context.extensionOverrides.overrides).deepEqual([".foo.js", ".foo.json"]);
		should(bundle2.context.extensionOverrides.overrides).deepEqual([".bar.js", ".bar.json"]);
	}

	"Should setup arithmetics"() {
		const fuse = createFuse();
		const bundle = fuse.bundle("app").instructions("hello");
		should(bundle.arithmetics).equal("hello");
	}

	"Should set sourcemaps without vendor"() {
		const fuse = createFuse();
		const bundle = fuse.bundle("app").sourceMaps(true);
		should(bundle.context.sourceMapsProject).beTrue();
		should(bundle.context.sourceMapsVendor).beFalse();
	}

	// "Should set sourcemaps for vendor only"() {
	//     const fuse = createFuse();
	//     const bundle = fuse.bundle("app").sourceMaps({ vendor: true });
	//     should(bundle.context.sourceMapsProject).beFalse();
	//     should(bundle.context.sourceMapsVendor).beTrue();
	// }

	"Should set sourcemaps for both vendor and app"() {
		const fuse = createFuse();
		const bundle = fuse.bundle("app").sourceMaps({ vendor: true, project: true });
		should(bundle.context.sourceMapsProject).beTrue();
		should(bundle.context.sourceMapsVendor).beTrue();
	}

	"Should setup completed callbacked"() {
		const fuse = createFuse();
		const bundle = fuse.bundle("app").completed(() => "done");
		should(bundle.onDoneCallback()).equal("done");
	}
}
