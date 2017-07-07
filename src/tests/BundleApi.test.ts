import { BundleProducer } from "../core/BundleProducer";
import { FuseBox } from "../index";
import { should } from "fuse-test-runner";
import { Bundle } from "../core/Bundle";



const createFuse = (): FuseBox => {
    return FuseBox.init({
        output: ".fusebox/test-bundle/$name.js"
    });
}

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
    }

    "Should set globals"() {
        const fuse = createFuse();
        fuse.bundle("app").globals({ a: 1 })
        const bundle = fuse.producer.bundles.get("app");
        should(bundle.fuse.context.globals).deepEqual({ a: 1 })
    }

    "Should inject HMR"() {
        const fuse = createFuse();
        fuse.bundle("app").hmr();

        const bundle = fuse.producer.bundles.get("app");
        should(bundle.fuse.context.plugins).beArray()
            .haveLength(1).mutate(els => els[0])
            .mutate(plugin => plugin.port)
            .equal(4444);
    }

    "Should inject HMR only to the first plugin"() {
        const fuse = createFuse();
        fuse.bundle("app").hmr();
        fuse.bundle("app2").hmr();

        const bundle = fuse.producer.bundles.get("app");
        should(bundle.fuse.context.plugins).beArray()
            .haveLength(1).mutate(els => els[0])
            .mutate(plugin => plugin.port)
            .equal(4444);

        const bundle2 = fuse.producer.bundles.get("app2");
        should(bundle2.fuse.context.plugins).beArray()
            .haveLength(0)
    }

    "Should set cache true"() {
        const fuse = createFuse();
        fuse.bundle("app").cache(true);
        const bundle = fuse.producer.bundles.get("app");
        should(bundle.context.useCache).beTrue()
    }

    "Should set cache false"() {
        const fuse = createFuse();
        fuse.bundle("app").cache(false);
        const bundle = fuse.producer.bundles.get("app");
        should(bundle.context.useCache).beFalse()
    }

    "Should set log true"() {
        const fuse = createFuse();
        fuse.bundle("app").log(true);
        const bundle = fuse.producer.bundles.get("app");
        should(bundle.context.doLog).beTrue()
    }

    "Should set log false"() {
        const fuse = createFuse();
        fuse.bundle("app").log(false);
        const bundle = fuse.producer.bundles.get("app");
        should(bundle.context.doLog).beFalse()
    }

    "Should setup devServer with default params"() {
        const fuse = createFuse();
        fuse.dev();
        should(fuse.producer.devServerOptions).deepEqual({ port: 4444 })
    }

    "Should setup devServer with custom params"() {
        const fuse = createFuse();
        fuse.dev({ port: 7777 });
        should(fuse.producer.devServerOptions).deepEqual({ port: 7777 })
    }

    "Should inject 1 plugin"() {
        const fuse = createFuse();
        const bundle = fuse.bundle("app").plugin("first");
        should(bundle.context.plugins).deepEqual(["first"])
    }

    "Should inject a plugin chain"() {
        const fuse = createFuse();
        const bundle = fuse.bundle("app").plugin("first", "second");
        should(bundle.context.plugins).deepEqual([["first", "second"]]);
    }

    "Should combine plugins"() {
        const fuse = createFuse();
        const bundle = fuse.bundle("app")
            .plugin("hello")
            .plugin("first", "second");
        should(bundle.context.plugins).deepEqual(["hello", ["first", "second"]]);
    }

    "Should not share plugins across bundles"() {
        const fuse = createFuse();
        const bundle1 = fuse.bundle("app")
            .plugin("foo");
        const bundle2 = fuse.bundle("app")
            .plugin("bar");
        should(bundle1.context.plugins).deepEqual(["foo"]);
        should(bundle2.context.plugins).deepEqual(["bar"]);
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
        const bundle = fuse.bundle("app").completed(() => "done")
        should(bundle.onDoneCallback()).equal("done");
    }


}