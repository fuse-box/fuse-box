
import { should } from "fuse-test-runner";
import { VirtualFile, ImportDeclaration } from "../../rollup/VirtualFile";

export class VirtualFileTest {
    "Should extract exports"() {
        let file = new VirtualFile(`
                export function hello(){}
                export class Data {}
            `);
        should(file.exports).deepEqual(["hello", "Data"]);
        should(file.defaultExports).beFalse();
    }

    "Should understand default exports"() {
        let file = new VirtualFile(`
                export default function foo(){}
            `);
        should(file.exports).deepEqual([]);
        should(file.defaultExports).beTrue();
    }

    "Should get import statement"() {
        let file = new VirtualFile(`
                import {foo as coo, bar} from "./something";
            `);

        should(file.localImports)
            .beMap()
            .mutate(x => x.get("./something"))
            .beMap()
            .mutate(x => x.get("foo"))
            .beInstanceOf(ImportDeclaration)
            .mutate(x => x.name)
            .equal("foo");
    }

    "Should get default import statement"() {
        let file = new VirtualFile(`
                import stuff from "./hello"
            `);
        should(file.localImports)
            .beMap()
            .mutate(x => x.get("./hello"))
            .beMap()
            .mutate(x => x.get("@default"))
            .beInstanceOf(ImportDeclaration)
            .mutate(x => x.name);
    }

    "Should remove an import b"() {
        let file = new VirtualFile(`
                import {a, b} from "./hello"
            `);
        let hello = file.localImports.get("./hello"); ;
        let declarationA = hello.get("b");
        declarationA.remove();

        const code = file.generate();
        should(code).deepEqual(`import { a } from './hello';`);
    }

    "Should remove an import d"() {
        let file = new VirtualFile(`
                import {a, b, c, d} from "./hello"
            `);
        let hello = file.localImports.get("./hello"); ;
        let declarationA = hello.get("c");
        declarationA.remove();

        const code = file.generate();
        should(code).notFindString("c,");

    }

    "Should remove default declaration"() {
        let file = new VirtualFile(`
            import foo from "./hello"
            let a = 1;
        `);
        let hello = file.localImports.get("./hello"); ;
        let declarationA = hello.get("@default");

        declarationA.remove();
        const code = file.generate();
        should(code).equal(`let a = 1;`);
    }

    "Should remove declaration with default mix"() {
        let file = new VirtualFile(`
            import foo, {bar} from "./hello"

        `);
        let hello = file.localImports.get("./hello"); ;
        hello.get("bar").remove();
        should(file.generate()).equal(`import foo from './hello';`);

    }

    "Should remove default declaration with other mix"() {
        let file = new VirtualFile(`
            import foo, {bar} from "./hello"

        `);
        let hello = file.localImports.get("./hello"); ;
        hello.get("@default").remove();
        should(file.generate()).equal(`import { bar } from './hello';`);
    }

    "Should remove it all"() {
        let file = new VirtualFile(`
            import poo, {bar} from "./hello"
            
        `);
        let hello = file.localImports.get("./hello"); ;
        hello.get("@default").remove();
        hello.get("bar").remove();
        should(file.generate()).equal(``);
    }

    "Should merge statements"() {
        let file = new VirtualFile(`
            import {bar} from "./hello"
            import {foo} from "./hello"
            
        `);
        let hello = file.localImports.get("./hello");
        hello.get("bar").remove();
        should(file.generate()).equal(`import { foo } from './hello';`);

        hello.get("bar").remove();
        should(file.generate()).equal(``);
    }
}
