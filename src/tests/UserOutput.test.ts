import { UserOutput } from "../core/UserOutput";
import { should } from "fuse-test-runner";
import { WorkFlowContext } from "../core/WorkflowContext";
import * as fs from "fs";
import { ensureFuseBoxPath } from "../Utils";

const testDir = ".fusebox/test-dir/$name.js";
const foobarHash = "f0290b6d";
export class UserOutputTest {
    "Should construct an output"() {
        let output = new UserOutput(new WorkFlowContext(), testDir);
        should(output.original).equal(testDir);
    }

    "Should replace with $name if not set"() {
        let output = new UserOutput(new WorkFlowContext(), ".fusebox/test-dir/hello.js");
        should(output.original).equal(".fusebox/test-dir/$name");
        should(output.filename).equal("hello.js")

    }

    "Folder should be created"() {
        let output = new UserOutput(new WorkFlowContext(), testDir);
        should(fs.existsSync(output.dir)).beTrue();
    }

    "Check template"() {
        let output = new UserOutput(new WorkFlowContext(), testDir);
        should(output.template).equal("$name.js")
    }


    "Should generate hash"() {
        let output = new UserOutput(new WorkFlowContext(), testDir);
        should(output.generateHash("foobar")).equal(foobarHash)
    }

    "Should pass with hash true"() {
        let context = new WorkFlowContext();
        context.hash = true;
        new UserOutput(new WorkFlowContext(), testDir);
    }

    "Should pass with hash option md5"() {
        let context = new WorkFlowContext();
        context.hash = "md5";
        new UserOutput(new WorkFlowContext(), testDir);
    }

    "Should not pass with other hash option"() {
        let context = new WorkFlowContext();
        context.hash = "md4";
        should().throwException(() => {
            new UserOutput(context, testDir);
        });
    }

    "Should give a simple path"() {
        let output = new UserOutput(new WorkFlowContext(), testDir);
        let result = output.getPath("bundle");
        should(
            ensureFuseBoxPath(result) // fixing slashes for windows
        ).findString("/.fusebox/test-dir/bundle.js");
    }

    "Should give a simple path without ext"() {
        let output = new UserOutput(new WorkFlowContext(), ".fusebox/test-dir/$name");
        let result = output.getPath("bundle");
        should(
            ensureFuseBoxPath(result) // fixing slashes for windows
        ).match(/\/\.fusebox\/test-dir\/bundle$/);
    }

    "Should omit extension if given by user"() {
        let output = new UserOutput(new WorkFlowContext(), testDir);
        let result = output.getPath("bundle.html");
        should(
            ensureFuseBoxPath(result) // fixing slashes for windows
        ).match(/\/\.fusebox\/test-dir\/bundle\.html$/);
    }


    "Should give a simple path + hash defined"() {
        let output = new UserOutput(new WorkFlowContext(), testDir);
        let result = output.getPath("bundle", "123");
        should(
            ensureFuseBoxPath(result) // fixing slashes for windows
        ).findString("/.fusebox/test-dir/123-bundle.js");
    }

    "Should give a simple path + hash defined in template"() {
        let output = new UserOutput(new WorkFlowContext(), ".fusebox/test-dir/$name__$hash.js");
        let result = output.getPath("bundle", "123");
        should(
            ensureFuseBoxPath(result) // fixing slashes for windows
        ).findString("/.fusebox/test-dir/bundle__123.js");
    }

    "Should give a simple path + hash defined in template but not given"() {
        let output = new UserOutput(new WorkFlowContext(), ".fusebox/test-dir/$name__$hash.js");
        let result = output.getPath("bundle");
        should(
            ensureFuseBoxPath(result) // fixing slashes for windows
        ).findString("/.fusebox/test-dir/bundle.js");
    }

    "Should give a path with directory"() {
        let output = new UserOutput(new WorkFlowContext(), testDir);
        let result = output.getPath("hello/bundle");
        should(
            ensureFuseBoxPath(result) // fixing slashes for windows
        ).findString("/.fusebox/test-dir/hello/bundle.js");
    }

    "Should give a path with directory + hash"() {
        let output = new UserOutput(new WorkFlowContext(), testDir);
        let result = output.getPath("hello/bundle", "456");
        should(
            ensureFuseBoxPath(result) // fixing slashes for windows
        ).findString("/.fusebox/test-dir/hello/456-bundle.js");
    }


    "Should give a path with directory with a different template"() {
        let output = new UserOutput(new WorkFlowContext(), ".fusebox/test-dir/foo-$name.js");
        let result = output.getPath("hello/bundle");
        should(
            ensureFuseBoxPath(result) // fixing slashes for windows
        ).findString("/.fusebox/test-dir/hello/foo-bundle.js");
    }

    "Should write a file without hash"() {
        let output = new UserOutput(new WorkFlowContext(), testDir);
        const testContents = `hello-${new Date().getTime()}`;

        let file = output.write("foo", testContents);
        return file.then(result => {
            let name = ensureFuseBoxPath(result.path) // fixing slashes for windows
            should(name).findString(".fusebox/test-dir/foo.js");
            should(fs.readFileSync(name).toString()).equal(testContents)
        })

    }

    "Should write a file with hash"() {
        const context = new WorkFlowContext();
        context.hash = true;
        let output = new UserOutput(context, testDir);
        const testContents = `foobar`;
        return output.write("myFile", testContents).then(result => {
            let file = ensureFuseBoxPath(result.path) // fixing slashes for windows
            should(file).findString(`.fusebox/test-dir/${foobarHash}-myFile.js`);
            should(fs.readFileSync(file).toString()).equal(testContents)
        });
    }

    "Should write a file with hash and custom template"() {
        const context = new WorkFlowContext();
        context.hash = true;
        let output = new UserOutput(context, ".fusebox/test-dir/$name_____$hash___.js");
        const testContents = `foobar`;
        return output.write("myFile", testContents).then(result => {
            let file = ensureFuseBoxPath(result.path) // fixing slashes for windows
            should(file).findString(`.fusebox/test-dir/myFile_____${foobarHash}___.js`);
            should(fs.readFileSync(file).toString()).equal(testContents)
        });
    }

}