import { should } from "fuse-test-runner";
import { extractExtension } from "../Utils";

export class UtilsExtensionExtract {
    "Should extract extension without $"() {
        should(extractExtension(".css")).equal("css");
    }

    "Should extract extension with $"() {
        should(extractExtension(".css$")).equal("css");
    }

    "Should throw an error"() {
        should().throwException(() => {
            extractExtension("css$");
        });
    }
}
