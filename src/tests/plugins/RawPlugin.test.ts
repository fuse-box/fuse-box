import { createEnv } from "./../stubs/TestEnvironment";
import { should } from "fuse-test-runner";
import { RawPlugin } from "../../plugins/RawPlugin";

const rawFile = `
this is
	raw
		content
`;

export class RawPluginTest {
    "Should return wrapped file content"() {
        return createEnv({
            project: {
                log: false,
                files: {
                    "index.js": `
				require('./file1.raw');
				require('./file2.onemoreraw');
			`,
                    "file1.raw": rawFile,
                    "file2.onemoreraw": rawFile,
                },
                plugins: [
                    [/raw$/, RawPlugin({ extensions: [".raw", ".onemoreraw"] })],
                ],
                instructions: ">index.js",
            },
        }).then((result) => {
            const fileRaw1 = result.project.FuseBox.import("./file1.raw");
            const fileRaw2 = result.project.FuseBox.import("./file2.onemoreraw");

            should(fileRaw1).equal("\nthis is\n\traw\n\t\tcontent\n");
            should(fileRaw2).equal("\nthis is\n\traw\n\t\tcontent\n");
        });
    }
}
