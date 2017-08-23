// import { createEnv } from "../stubs/TestEnvironment";
// import { should } from "fuse-test-runner";
// //import { should } from "fuse-test-runner";

// export class RollupIntergationTest {
//     "Should bundle correctly with typescript"() {
//         return createEnv({
//             server: true,
//             project: {
//                 rollup: {
//                     bundle: {
//                         moduleName: "Test",
//                         format: "cjs"
//                     },
//                     entry: `main.js`,
//                 },
//                 log: false,
//                 files: {
//                     "main.ts": `
//                         import {foo} from './foo';
//                         export default function () {
//                             return foo();
//                         }
//                     `,
//                     "foo.ts": `
//                         export function foo() {
//                             return "hello world"
//                         };
//                     `,
//                 },
//                 instructions: "> main.ts",
//             },
//         }).then((result) => {
//             should(result.project()).equal("hello world");
//         });
//     }
// }
