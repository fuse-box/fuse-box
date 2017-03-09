import { UserOutput } from "../core/UserOutput";
import { should } from "fuse-test-runner";
import { WorkFlowContext } from "../core/WorkflowContext";
import * as fs from "fs";

const testDir = ".fusebox/test-dir/$name";

export class UserOutputTest {
    "Should construct an output"() {
        let output = new UserOutput(new WorkFlowContext(), testDir);
        should(output.original).equal(testDir);
    }

    "Should not construct $name is missing"() {
        should().throwException(() => {
            new UserOutput(new WorkFlowContext(), "dist");
        });
    }

    "Folder should be created"() {
        let output = new UserOutput(new WorkFlowContext(), testDir);
        should(fs.existsSync(output.dir)).beTrue();
    }

}