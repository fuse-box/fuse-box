import { VirtualFile } from "./VirtualFile";
import { MissingImportsRemoval } from "./MissingExportsRemoval";
import { should } from "fuse-test-runner";

export class MissingExportsRemoveTest {

    "Should remove one import"() {
        let map = new Map<string, VirtualFile>();
        map.set("test/foo.js", new VirtualFile(`import {hello, a} from "./bar"`));
        map.set("test/bar.js", new VirtualFile(`export function hello(){}`));
        let moduleFixer = new MissingImportsRemoval(map);
        moduleFixer.ensureAll();

        should(map)
            .mutate(x => x.get("test/foo.js"))
            .mutate(x => x.generate())
            .equal(`import { hello } from './bar';`);
    }

    "Should leave untouched"() {
        let map = new Map<string, VirtualFile>();
        map.set("test/foo.js", new VirtualFile(`import {hello, a} from "./bar"`));

        let moduleFixer = new MissingImportsRemoval(map);
        moduleFixer.ensureAll();

        should(map)
            .mutate(x => x.get("test/foo.js"))
            .mutate(x => x.generate())
            .findString("hello,").findString(" a");
    }

    "Should remove default import"() {
        let map = new Map<string, VirtualFile>();
        map.set("test/foo.js", new VirtualFile(`
            import coo, {hello} from "./bar"
        `));
        map.set("test/bar.js", new VirtualFile(`export function hello(){}`));
        let moduleFixer = new MissingImportsRemoval(map);
        moduleFixer.ensureAll();
        should(map)
            .mutate(x => x.get("test/foo.js"))
            .mutate(x => x.generate())
            .equal(`import { hello } from './bar';`);
    }
}
