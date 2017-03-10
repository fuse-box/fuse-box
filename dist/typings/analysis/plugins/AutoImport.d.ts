import { File } from "../../core/File";
/**
 * Checks if a variable needs to magically imported
 * Yes, this is a black magic.
 * For example you reference
 *   process.env
 *
 * Browser does not have it globally, so instead of polluting the window
 * we inject
 *   var process = require("process")
 *
 * That's a very delicate subject as it's possible (yes) to break but only intentionally
 */
export declare class AutoImport {
    static onNode(file: File, node: any, parent: any): void;
    /**
     * Add found dependencies
     * Add require statement to the content
     */
    static onEnd(file: File): void;
}
