import { FuseTestEnv, createRealNodeModule } from "../stubs/FuseTestEnv";
import { QuantumPlugin } from "../../index";

const HOME_COMPONENT_SCRIPT = "92380585.js";
const ABOUT_COMPONENT_SCRIPT = "167ae727.js";
const LIB_A_SCRIPT = "9ed3c4d9.js";

createRealNodeModule("lib_a", {
    "index.js" : `module.exports = function(){ 
            return "from lib a (" + require("./a_mod") + ")";
    }`,
    "a_mod.js" : `module.exports = function(){ return "a_mob_func" }`
});
createRealNodeModule("lib_b", {
    "index.js" : `
        const lib_a = require("lib_a");
        module.exports = function(){
            return "from lib b (" + require("./b_mod") + ")";
        }
    `,
    "b_mod.js" : `
        module.exports = function(){
            return "b_mob_func"
        }
    `
});


export class CodeSplittingFileIntegrityTest {
    "Should create 1 split bundle with 1 file"() {
        return FuseTestEnv.create(
            {
                project: {
                    files: {
                        "index.ts": `
                            export async function test() {
                                await import("./components/HomeComponent")
                            }
                        `,
                        "components/HomeComponent.ts": `
                            export function home(){ return "home" }
                        `,
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "browser"
                        })
                    ]
                }
            }
        )
        .simple().then(test => test.browser((window, env) => {
            window.$fsx.r(0);

            env.scriptShouldExist(HOME_COMPONENT_SCRIPT);

            const appScript = env.getScript("app.js");
            appScript.shouldNotFindString('// default/components/HomeComponent.js');


            const homeScript = env.getScript(HOME_COMPONENT_SCRIPT)
            homeScript.shouldFindString('// default/components/HomeComponent.js');
        }));
    }

    "Should create 1 split bundle with 2 files"() {
        return FuseTestEnv.create(
            {
                //testFolder : "_current_test",
                project: {
                    files: {
                        "index.ts": `
                            export async function test() {
                                await import("./components/HomeComponent")
                            }
                        `,
                        "components/HomeComponent.ts": `
                            import {homeHelper} from "./HomeHelper";
                            export function home(){ return homeHelper()  }
                        `,
                        "components/HomeHelper.ts": `
                            export function homeHelper(){ return "home" }
                        `,
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "browser"
                        })
                    ]
                }
            }
        )
        .simple().then(test => test.browser((window, env) => {
            window.$fsx.r(0);

            env.scriptShouldExist(HOME_COMPONENT_SCRIPT);

            const appScript = env.getScript("app.js");
            appScript.shouldNotFindString('// default/components/HomeComponent.js');
            appScript.shouldNotFindString('// default/components/HomeHelper.js');


            const homeScript = env.getScript(HOME_COMPONENT_SCRIPT)
            homeScript.shouldFindString('// default/components/HomeComponent.js');
            homeScript.shouldFindString('// default/components/HomeHelper.js');
        }));
    }


    "Should create 2 split bundles with 2 files"() {
        return FuseTestEnv.create(
            {
                //testFolder : "_current_test",
                project: {
                    files: {
                        "index.ts": `
                            export async function test() {
                                await import("./components/HomeComponent")
                                await import("./components/AboutComponent")
                            }
                        `,
                        "components/HomeComponent.ts": `
                            import {homeHelper} from "./HomeHelper";
                            export function home(){ return homeHelper()  }
                        `,
                        "components/HomeHelper.ts": `
                            export function homeHelper(){ return "home" }
                        `,
                        "components/AboutComponent.ts": `
                            import {aboutHelper} from "./AboutHelper";
                            export function home(){ return aboutHelper()  }
                    `,
                        "components/AboutHelper.ts": `
                            export function aboutHelper(){ return "home" }
                        `,
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "browser"
                        })
                    ]
                }
            }
        )
        .simple().then(test => test.browser((window, env) => {
            window.$fsx.r(0);

            env.scriptShouldExist(HOME_COMPONENT_SCRIPT);

            const appScript = env.getScript("app.js");
            appScript.shouldNotFindString('// default/components/HomeComponent.js');
            appScript.shouldNotFindString('// default/components/HomeHelper.js');
            appScript.shouldNotFindString('// default/components/AboutComponent.js');
            appScript.shouldNotFindString('// default/components/AboutHelper.js');


            const homeScript = env.getScript(HOME_COMPONENT_SCRIPT)
            homeScript.shouldFindString('// default/components/HomeComponent.js');
            homeScript.shouldFindString('// default/components/HomeHelper.js');
            homeScript.shouldNotFindString('// default/components/AboutComponent.js');
            homeScript.shouldNotFindString('// default/components/AboutHelper.js');

            const aboutScript = env.getScript(ABOUT_COMPONENT_SCRIPT);
            aboutScript.shouldFindString('// default/components/AboutComponent.js');
            aboutScript.shouldFindString('// default/components/AboutHelper.js');
            aboutScript.shouldNotFindString('// default/components/HomeComponent.js');
            aboutScript.shouldNotFindString('// default/components/HomeHelper.js');

        }));
    }

    "Should create 2 split bundles with 2 files and 1 shared in app"() {
        return FuseTestEnv.create(
            {
                //testFolder : "_current_test",
                project: {
                    files: {
                        "index.ts": `
                            export async function test() {
                                await import("./components/HomeComponent")
                                await import("./components/AboutComponent")
                            }
                        `,
                        "components/HomeComponent.ts": `
                            import {sharedFunc} from "../shared";

                            import {homeHelper} from "./HomeHelper";
                            export function home(){ return homeHelper() + sharedFunc() }
                        `,
                        "components/HomeHelper.ts": `
                            export function homeHelper(){ return "home" }
                        `,
                        "components/AboutComponent.ts": `
                            import {sharedFunc} from "../shared";
                            import {aboutHelper} from "./AboutHelper";
                            export function home(){ return aboutHelper() + sharedFunc()  }
                    `,
                        "components/AboutHelper.ts": `
                            export function aboutHelper(){ return "home" }
                        `,
                        "shared.ts" : `
                            export function sharedFunc(){
                                return "shared";
                            }
                        `
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "browser"
                        })
                    ]
                }
            }
        )
        .simple().then(test => test.browser((window, env) => {
            window.$fsx.r(0);

            env.scriptShouldExist(HOME_COMPONENT_SCRIPT);

            const appScript = env.getScript("app.js");
            appScript.shouldFindString('// default/shared.js')
            appScript.shouldNotFindString('// default/components/HomeComponent.js');
            appScript.shouldNotFindString('// default/components/HomeHelper.js');
            appScript.shouldNotFindString('// default/components/AboutComponent.js');
            appScript.shouldNotFindString('// default/components/AboutHelper.js');


            const homeScript = env.getScript(HOME_COMPONENT_SCRIPT)
            homeScript.shouldFindString('// default/components/HomeComponent.js');
            homeScript.shouldFindString('// default/components/HomeHelper.js');
            homeScript.shouldNotFindString('// default/components/AboutComponent.js');
            homeScript.shouldNotFindString('// default/components/AboutHelper.js');
            homeScript.shouldNotFindString('// default/shared.js');

            const aboutScript = env.getScript(ABOUT_COMPONENT_SCRIPT);
            aboutScript.shouldFindString('// default/components/AboutComponent.js');
            aboutScript.shouldFindString('// default/components/AboutHelper.js');
            aboutScript.shouldNotFindString('// default/components/HomeComponent.js');
            aboutScript.shouldNotFindString('// default/components/HomeHelper.js');
            aboutScript.shouldNotFindString('// default/shared.js');

        }));
    }


    "Should create 2 split bundles with 2 files and 1 shared is moved from app"() {
        return FuseTestEnv.create(
            {
                //testFolder : "_current_test",
                project: {
                    files: {
                        "index.ts": `
                            export async function test() {
                                await import("./components/HomeComponent")
                                await import("./components/AboutComponent")
                            }
                        `,
                        "components/HomeComponent.ts": `
                            import {sharedFunc} from "../shared";

                            import {homeHelper} from "./HomeHelper";
                            export function home(){ return homeHelper() + sharedFunc() }
                        `,
                        "components/HomeHelper.ts": `
                            export function homeHelper(){ return "home" }
                        `,
                        "components/AboutComponent.ts": `
                            import {aboutHelper} from "./AboutHelper";
                            export function home(){ return aboutHelper()  }
                    `,
                        "components/AboutHelper.ts": `
                            export function aboutHelper(){ return "home" }
                        `,
                        "shared.ts" : `
                            export function sharedFunc(){
                                return "shared";
                            }
                        `
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "browser"
                        })
                    ]
                }
            }
        )
        .simple().then(test => test.browser((window, env) => {
            window.$fsx.r(0);

            env.scriptShouldExist(HOME_COMPONENT_SCRIPT);

            const appScript = env.getScript("app.js");
            appScript.shouldNotFindString('// default/shared.js')
            appScript.shouldNotFindString('// default/components/HomeComponent.js');
            appScript.shouldNotFindString('// default/components/HomeHelper.js');
            appScript.shouldNotFindString('// default/components/AboutComponent.js');
            appScript.shouldNotFindString('// default/components/AboutHelper.js');


            const homeScript = env.getScript(HOME_COMPONENT_SCRIPT)
            homeScript.shouldFindString('// default/components/HomeComponent.js');
            homeScript.shouldFindString('// default/components/HomeHelper.js');
            homeScript.shouldFindString('// default/shared.js');
            homeScript.shouldNotFindString('// default/components/AboutComponent.js');
            homeScript.shouldNotFindString('// default/components/AboutHelper.js');
            

            const aboutScript = env.getScript(ABOUT_COMPONENT_SCRIPT);
            aboutScript.shouldFindString('// default/components/AboutComponent.js');
            aboutScript.shouldFindString('// default/components/AboutHelper.js');
            aboutScript.shouldNotFindString('// default/components/HomeComponent.js');
            aboutScript.shouldNotFindString('// default/components/HomeHelper.js');
            aboutScript.shouldNotFindString('// default/shared.js');
        }));
    }

    "Should move node_module 'lib_a' and 'lib_b' into home"() {
        return FuseTestEnv.create(
            {
                //testFolder : "_current_test",
                project: {
                    files: {
                        "index.ts": `
                            export async function test() {
                                await import("./components/HomeComponent")
                                await import("./components/AboutComponent")
                            }
                        `,
                        "components/HomeComponent.ts": `
                            import {sharedFunc} from "../shared";
                            import * as lib_b from "lib_b"
                            lib_b();
                            import {homeHelper} from "./HomeHelper";
                            export function home(){ return homeHelper() + sharedFunc() }
                        `,
                        "components/HomeHelper.ts": `
                            export function homeHelper(){ return "home" }
                        `,
                        "components/AboutComponent.ts": `
                            import {sharedFunc} from "../shared";
                            import {aboutHelper} from "./AboutHelper";
                            sharedFunc()
                            export function home(){ return aboutHelper()  }
                    `,
                        "components/AboutHelper.ts": `
                            export function aboutHelper(){ return "home" }
                        `,
                        "shared.ts" : `
                            export function sharedFunc(){
                                return "shared";
                            }
                        `
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "browser"
                        })
                    ]
                }
            }
        )
        .simple().then(test => test.browser((window, env) => {
            window.$fsx.r(0);

            env.scriptShouldExist(HOME_COMPONENT_SCRIPT);

            const appScript = env.getScript("app.js");
            appScript.shouldFindString('// default/shared.js')
            appScript.shouldNotFindString('// default/components/HomeComponent.js');
            appScript.shouldNotFindString('// default/components/HomeHelper.js');
            appScript.shouldNotFindString('// default/components/AboutComponent.js');
            appScript.shouldNotFindString('// default/components/AboutHelper.js');
            // libs
            appScript.shouldNotFindString('// lib_a/index.js');
            appScript.shouldNotFindString('// lib_a/a_mod.js');
            appScript.shouldNotFindString('// lib_b/index.js');
            appScript.shouldNotFindString('// lib_b/b_mod.js');


            const homeScript = env.getScript(HOME_COMPONENT_SCRIPT)
            homeScript.shouldFindString('// default/components/HomeComponent.js');
            homeScript.shouldFindString('// default/components/HomeHelper.js');
            homeScript.shouldNotFindString('// default/shared.js');
            homeScript.shouldNotFindString('// default/components/AboutComponent.js');
            homeScript.shouldNotFindString('// default/components/AboutHelper.js');
            
            // libs
            homeScript.shouldFindString('// lib_a/index.js');
            homeScript.shouldFindString('// lib_a/a_mod.js');
            homeScript.shouldFindString('// lib_b/index.js');
            homeScript.shouldFindString('// lib_b/b_mod.js');
            

            const aboutScript = env.getScript(ABOUT_COMPONENT_SCRIPT);
            aboutScript.shouldFindString('// default/components/AboutComponent.js');
            aboutScript.shouldFindString('// default/components/AboutHelper.js');
            aboutScript.shouldNotFindString('// default/components/HomeComponent.js');
            aboutScript.shouldNotFindString('// default/components/HomeHelper.js');
            aboutScript.shouldNotFindString('// default/shared.js');


        }));
    }

    "Should leave node_module 'lib_a' and 'lib_b' move into home"() {
        return FuseTestEnv.create(
            {
                //testFolder : "_current_test",
                project: {
                    files: {
                        "index.ts": `
                            import * as lib_a from "lib_a"
                            lib_a();
                            export async function test() {
                                await import("./components/HomeComponent")
                                await import("./components/AboutComponent")
                            }
                        `,
                        "components/HomeComponent.ts": `
                            import {sharedFunc} from "../shared";
                            import * as lib_b from "lib_b"
                            lib_b();
                            import {homeHelper} from "./HomeHelper";
                            export function home(){ return homeHelper() + sharedFunc() }
                        `,
                        "components/HomeHelper.ts": `
                            export function homeHelper(){ return "home" }
                        `,
                        "components/AboutComponent.ts": `
                            import {sharedFunc} from "../shared";
                            import {aboutHelper} from "./AboutHelper";
                            sharedFunc()
                            export function home(){ return aboutHelper()  }
                    `,
                        "components/AboutHelper.ts": `
                            export function aboutHelper(){ return "home" }
                        `,
                        "shared.ts" : `
                            export function sharedFunc(){
                                return "shared";
                            }
                        `
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "browser"
                        })
                    ]
                }
            }
        )
        .simple().then(test => test.browser((window, env) => {
            window.$fsx.r(0);

            env.scriptShouldExist(HOME_COMPONENT_SCRIPT);

            const appScript = env.getScript("app.js");
            appScript.shouldFindString('// default/shared.js')
            appScript.shouldNotFindString('// default/components/HomeComponent.js');
            appScript.shouldNotFindString('// default/components/HomeHelper.js');
            appScript.shouldNotFindString('// default/components/AboutComponent.js');
            appScript.shouldNotFindString('// default/components/AboutHelper.js');
            // libs
            appScript.shouldFindString('// lib_a/index.js');
            appScript.shouldFindString('// lib_a/a_mod.js');
            appScript.shouldNotFindString('// lib_b/index.js');
            appScript.shouldNotFindString('// lib_b/b_mod.js');


            const homeScript = env.getScript(HOME_COMPONENT_SCRIPT)
            homeScript.shouldFindString('// default/components/HomeComponent.js');
            homeScript.shouldFindString('// default/components/HomeHelper.js');
            homeScript.shouldNotFindString('// default/shared.js');
            homeScript.shouldNotFindString('// default/components/AboutComponent.js');
            homeScript.shouldNotFindString('// default/components/AboutHelper.js');
            
            // libs
            homeScript.shouldNotFindString('// lib_a/index.js');
            homeScript.shouldNotFindString('// lib_a/a_mod.js');
            homeScript.shouldFindString('// lib_b/index.js');
            homeScript.shouldFindString('// lib_b/b_mod.js');
            

            const aboutScript = env.getScript(ABOUT_COMPONENT_SCRIPT);
            aboutScript.shouldFindString('// default/components/AboutComponent.js');
            aboutScript.shouldFindString('// default/components/AboutHelper.js');
            aboutScript.shouldNotFindString('// default/components/HomeComponent.js');
            aboutScript.shouldNotFindString('// default/components/HomeHelper.js');
            aboutScript.shouldNotFindString('// default/shared.js');


        }));
    }

    "Should lazy load node_module 'lib_b'"() {
        return FuseTestEnv.create(
            {
                //testFolder : "_current_test",
                project: {
                    files: {
                        "index.ts": `
                            
                            export async function test() {
                                await import("./components/HomeComponent")
                                const lib_b = await import('lib_b');
                            }
                        `,
                        "components/HomeComponent.ts": `
                            export function home(){ return homeHelper()  }
                        `,
                        
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "browser"
                        })
                    ]
                }
            }
        )
        .simple().then(test => test.browser((window, env) => {
            window.$fsx.r(0);

            env.scriptShouldExist(HOME_COMPONENT_SCRIPT);
            env.scriptShouldExist(LIB_A_SCRIPT);

            const appScript = env.getScript("app.js");
            appScript.shouldNotFindString('// default/components/HomeComponent.js');
            // libs
            appScript.shouldNotFindString('// lib_a/index.js');
            appScript.shouldNotFindString('// lib_a/a_mod.js');
            appScript.shouldNotFindString('// lib_b/index.js');
            appScript.shouldNotFindString('// lib_b/b_mod.js');


            const homeScript = env.getScript(HOME_COMPONENT_SCRIPT)
            homeScript.shouldFindString('// default/components/HomeComponent.js');

            const libAScript = env.getScript(LIB_A_SCRIPT);
            libAScript.shouldFindString('// lib_a/index.js');
            libAScript.shouldFindString('// lib_a/a_mod.js');
            libAScript.shouldFindString('// lib_b/index.js');
            libAScript.shouldFindString('// lib_b/b_mod.js');
        }));
    }


    "Should lazy load node_module 'lib_b' 2 times"() {
        return FuseTestEnv.create(
            {
                //testFolder : "_current_test",
                project: {
                    files: {
                        "index.ts": `
                            
                            export async function test() {
                                await import("./components/HomeComponent")
                                const lib_b_1 = await import('lib_b');
                                const lib_b_2 = await import('lib_b');
                            }
                        `,
                        "components/HomeComponent.ts": `
                            export function home(){ return homeHelper()  }
                        `,
                        
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "browser"
                        })
                    ]
                }
            }
        )
        .simple().then(test => test.browser((window, env) => {
            window.$fsx.r(0);

            env.scriptShouldExist(HOME_COMPONENT_SCRIPT);
            env.scriptShouldExist(LIB_A_SCRIPT);

            const appScript = env.getScript("app.js");
            appScript.shouldNotFindString('// default/components/HomeComponent.js');
            // libs
            appScript.shouldNotFindString('// lib_a/index.js');
            appScript.shouldNotFindString('// lib_a/a_mod.js');
            appScript.shouldNotFindString('// lib_b/index.js');
            appScript.shouldNotFindString('// lib_b/b_mod.js');


            const homeScript = env.getScript(HOME_COMPONENT_SCRIPT)
            homeScript.shouldFindString('// default/components/HomeComponent.js');

            const libAScript = env.getScript(LIB_A_SCRIPT);
            libAScript.shouldFindString('// lib_a/index.js');
            libAScript.shouldFindString('// lib_a/a_mod.js');
            libAScript.shouldFindString('// lib_b/index.js');
            libAScript.shouldFindString('// lib_b/b_mod.js');
        }));
    }


    "Should lazy load node_module 'lib_b' second time in a split bundle"() {
        return FuseTestEnv.create(
            {
                //testFolder : "_current_test",
                project: {
                    files: {
                        "index.ts": `
                            
                            export async function test() {
                                await import("./components/HomeComponent")
                                const lib_b_2 = await import('lib_b');
                            }
                        `,
                        "components/HomeComponent.ts": `
                            const lib_b_1 = import('lib_b');
                            export function home(){ return homeHelper()  }
                        `,
                        
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "browser"
                        })
                    ]
                }
            }
        )
        .simple().then(test => test.browser((window, env) => {
            window.$fsx.r(0);

            env.scriptShouldExist(HOME_COMPONENT_SCRIPT);
            env.scriptShouldExist(LIB_A_SCRIPT);

            const appScript = env.getScript("app.js");
            appScript.shouldNotFindString('// default/components/HomeComponent.js');
            // libs
            appScript.shouldNotFindString('// lib_a/index.js');
            appScript.shouldNotFindString('// lib_a/a_mod.js');
            appScript.shouldNotFindString('// lib_b/index.js');
            appScript.shouldNotFindString('// lib_b/b_mod.js');


            const homeScript = env.getScript(HOME_COMPONENT_SCRIPT)
            homeScript.shouldFindString('// default/components/HomeComponent.js');

            const libAScript = env.getScript(LIB_A_SCRIPT);
            libAScript.shouldFindString('// lib_a/index.js');
            libAScript.shouldFindString('// lib_a/a_mod.js');
            libAScript.shouldFindString('// lib_b/index.js');
            libAScript.shouldFindString('// lib_b/b_mod.js');
        }));
    }

    "Should not load node_module 'lib_b' because it was imported"() {
        return FuseTestEnv.create(
            {
                //testFolder : "_current_test",
                project: {
                    files: {
                        "index.ts": `
                            import * as lib_b from "lib_b"
                            lib_b();
                            export async function test() {
                                await import("./components/HomeComponent")
                            }
                        `,
                        "components/HomeComponent.ts": `
                            const lib_b_1 = import('lib_b');
                            export function home(){ return homeHelper()  }
                        `,
                        
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "browser"
                        })
                    ]
                }
            }
        )
        .simple().then(test => test.browser((window, env) => {
            window.$fsx.r(0);

            env.scriptShouldExist(HOME_COMPONENT_SCRIPT);
            env.scriptShouldExist(LIB_A_SCRIPT);

            const appScript = env.getScript("app.js");
            appScript.shouldNotFindString('// default/components/HomeComponent.js');
            // libs
            appScript.shouldFindString('// lib_a/index.js');
            appScript.shouldFindString('// lib_a/a_mod.js');
            appScript.shouldFindString('// lib_b/index.js');
            appScript.shouldFindString('// lib_b/b_mod.js');


            const homeScript = env.getScript(HOME_COMPONENT_SCRIPT)
            homeScript.shouldFindString('// default/components/HomeComponent.js');

            const libAScript = env.getScript(LIB_A_SCRIPT);
            libAScript.shouldNotFindString('// lib_a/index.js');
            libAScript.shouldNotFindString('// lib_a/a_mod.js');
            libAScript.shouldNotFindString('// lib_b/index.js');
            libAScript.shouldNotFindString('// lib_b/b_mod.js');
        }));
    }


}