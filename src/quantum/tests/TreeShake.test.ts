import { should } from "fuse-test-runner";
import { createOptimisedBundleEnv } from "../../tests/stubs/TestEnvironment";

export class TreeShakeTest {
    "Should not tree shake Foo2"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: false
            },
            project: {
                files: {
                    "index.ts": `
                        import { Foo1 } from "./foo";
                        console.log(Foo1);
                    `,
                    "foo.ts": `
                        class Foo1 {}
                        class Foo2 {}
                        exports.Foo1 = Foo1;
                        exports.Foo2 = Foo2;

                    `
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString(`exports.Foo2`);

        });
    }

    "Should tree shake Foo2"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: true
            },
            project: {
                files: {
                    "index.ts": `
                        import { Foo1 } from "./foo";
                        console.log(Foo1);
                    `,
                    "foo.ts": `
                        class Foo1 {}
                        class Foo2 {}
                        exports.Foo1 = Foo1;
                        exports.Foo2 = Foo2;

                    `
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).notFindString(`exports.Foo2`);
        });
    }

    "Should not shake an imidiate require"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: true
            },
            project: {
                files: {
                    "index.js": `
                        require('./bar');
                    `,
                    "foo.ts": `
                        class Foo1 {}
                        class Foo2 {}
                        exports.Foo1 = Foo1;
                        exports.Foo2 = Foo2;

                    `
                },
                instructions: "index.js",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            //console.log(contents);
            //should(contents).notFindString(`exports.Foo2`);

        });
    }


    "Should not tree shake local usage"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: true
            },
            project: {
                files: {
                    "index.ts": `
                        var Reflux = require("./reflux")

                        Reflux.createAction();
                    `,
                    "reflux.ts": `
                        exports.createAction = () => {
                            return exports.createSomething();
                        }
                        exports.createSomething = () => {}

                    `
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString(`exports.createSomething`);
        });
    }

    "Should not tree shake local usage if not used"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: true
            },
            project: {
                files: {
                    "index.ts": `
                        var Reflux = require("./reflux")

                        Reflux.createAction();
                    `,
                    "reflux.ts": `
                        exports.createAction = () => {
                            //return exports.createSomething();
                        }
                        exports.createSomething = () => {}

                    `
                },
                instructions: "**/**.ts > index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).notFindString(`exports.createSomething`);
        });
    }

    "Should remove unaffected files ( foo should be removed )"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: true
            },
            project: {
                files: {
                    "index.ts": `
                        require("./bar")
                    `,
                    "bar.ts": `
                        exports.bar = 1;

                    `,
                    "foo.ts": `
                        exports.foo = 1;

                    `
                },
                instructions: "**/**.ts > index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).notFindString('exports.foo')
        });
    }

    "Should not remove foo ( was referenced by bar )"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: true
            },
            project: {
                files: {
                    "index.ts": `
                        require("./bar")
                    `,
                    "bar.ts": `
                        exports.bar = require("./foo");

                    `,
                    "foo.ts": `
                        exports.foo = 1;

                    `
                },
                instructions: "**/**.ts > index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString('exports.foo');
        });
    }


    "Should NOT remove unaffecte file (restricted by user)"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: {
                    shouldRemove: file => {

                        if (file.fuseBoxPath === "foo.js") {
                            return false;
                        }
                    }
                }
            },
            project: {
                files: {
                    "index.ts": `
                        require("./bar")
                    `,
                    "bar.ts": `
                        exports.bar = 1;

                    `,
                    "foo.ts": `
                        exports.foo = 1;

                    `
                },
                instructions: "**/**.ts > index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString('exports.foo')
        });
    }

    "Should remove unaffecte file (allowed by user)"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: {
                    shouldRemove: file => {

                        if (file.fuseBoxPath === "foo.js") {
                            return true;
                        }
                    }
                }
            },
            project: {
                files: {
                    "index.ts": `
                        require("./bar")
                    `,
                    "bar.ts": `
                        exports.bar = 1;

                    `,
                    "foo.ts": `
                        exports.foo = 1;

                    `
                },
                instructions: "**/**.ts > index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).notFindString('exports.foo')
        });
    }


    "Should remove deeply"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: true
            },

            project: {
                natives: {
                    process: false
                },
                files: {
                    "index.ts": `
                        if ( process.env.NODE_ENV !== "production"){
                            require("./bar")
                        } else {
                            console.log("Production")
                        }
                    `,
                    "bar.ts": `
                        console.log('i am bar');
                        exports.bar = require("./foo");

                    `,
                    "foo.ts": `
                        console.log('i am foo');
                        exports.foo = 1;

                    `
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).notFindString('i am bar')
            should(contents).notFindString('i am foo')
        });
    }

    "Should not remove a module that is cross referenced"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: true
            },

            project: {
                natives: {
                    process: false
                },
                files: {
                    "index.ts": `
                        if ( process.env.NODE_ENV !== "production"){
                            require("./bar")
                        } else {
                            require("./foo")
                            console.log("Production")
                        }
                    `,
                    "bar.ts": `
                        console.log('i am bar');
                        exports.bar = require("./foo");

                    `,
                    "foo.ts": `
                        console.log('i am foo');
                        exports.foo = 1;

                    `
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).notFindString('i am bar')
            should(contents).findString('i am foo')
        });
    }

    "Should exports from a module that is double exported"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: true
            },

            project: {
                natives: {
                    process: false
                },
                files: {
                    "index.ts": `
                        import {hello} from "./bar";
                        console.log(hello);
                    `,
                    "bar.ts": `
                        export {hello, hello2} from "./utils"
                        

                    `,
                    "utils.ts": `
                        export function hello(){}
                        export function hello2(){}

                    `
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            //   console.log(contents);

        });
    }
}
